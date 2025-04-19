// backend/src/controllers/packageBatchFuntions.ts
import { ResponseAdv, PackageSource, AddressEnum, SimpleRes } from '@ddlabel/shared';
import logger from '../config/logger';
import { AuthRequest, BatchDataType, CsvData } from '../types';
import { setPkgErrors } from '../utils/errors';
import { generateTrackingNo } from '../utils/generateTrackingNo';
import reportIoSocket from '../utils/reportIo';
import { getPreparedData, processBatch } from './packageBatchFuntions';
import fs from 'fs';
import { aggregateError, getErrorRes } from '../utils/getErrorRes';
import { TrackingnoMustBeUniqueError } from '../utils/errorClasses';

type OnDataParams = {
	req: AuthRequest,
	csvData: CsvData,
	pkgGlobal: BatchDataType,
}

type OnEndParams = {
	req: AuthRequest,
} & FinishEndParams;

type FinishEndParams = {
	res: ResponseAdv<SimpleRes>,
	pkgGlobal: BatchDataType,
	file: Express.Multer.File,
}

const BATCH_SIZE = 100;

const pkgGlobalPush = (req: AuthRequest, pkgGlobal: BatchDataType, prepared: any) => {
	const { user: { id: userId } } = req;
	const { mappedData, fromZipInfo, toZipInfo } = prepared;
	pkgGlobal.pkgArr.push({
		userId,
		length: mappedData['length'] || 0,
		width: mappedData['width'] || 0,
		height: mappedData['height'] || 0,
		weight: mappedData['weight'] || 0,
		trackingNo: mappedData['trackingNo'] || generateTrackingNo(),
		referenceNo: mappedData['referenceNo'] || '',
		source: PackageSource.api,
	});
	pkgGlobal.shipFromArr.push({
		...fromZipInfo,
		name: mappedData['fromAddressName'],
		userId,
		address1: mappedData['fromAddress1'],
		address2: mappedData['fromAddress2'],
		addressType: AddressEnum.fromPackage,
	});
	pkgGlobal.shipToArr.push({
		...toZipInfo,
		name: mappedData['toAddressName'],
		userId,
		address1: mappedData['toAddress1'],
		address2: mappedData['toAddress2'],
		addressType: AddressEnum.toPackage,
	})
	return;
}

export const onError = (error: any, pkgGlobal: BatchDataType) => {
	logger.error(`Error in importPackages onError: ${aggregateError(error)}`);
	pkgGlobal.errorMap.push(getErrorRes({ fnName: 'importPackages', error }));
}

export const onData = async ({ req, csvData, pkgGlobal }: OnDataParams) => {
	const { packageCsvMap, packageCsvLength } = req.body;
	pkgGlobal.processed ++;
	const prepared = await getPreparedData(packageCsvMap, csvData);
	if ( prepared.csvUploadErrors.length > 0 ) {
		console.log(`csvUploadErrors`, prepared.csvUploadErrors);
		prepared.csvUploadErrors.forEach(error => {
			setPkgErrors(error, pkgGlobal);
		})
	}
	pkgGlobalPush(req, pkgGlobal, prepared);
	reportIoSocket({ eventName: 'generate', req, processed: pkgGlobal.processed + 1, total: packageCsvLength });
};

const TranslatedError = {
	TrackingnoMustBeUniqueError: 'must has an unique trackingNo',
	MissingToZipError: 'missing receiver address zip',
	MissingFromZipError: 'missing sender address zip',
	UniqueConstraintError: 'Unique constraint error: Duplicate value detected.',
	ValidationError: 'Validation error: Invalid input data.',
	ForeignKeyConstraintError: 'Foreign key constraint error: Invalid reference.',
	DatabaseError: 'Database error: A general database error occurred.',
	TimeoutError: 'Database timeout error: Query execution exceeded the time limit.',
	ConnectionError: 'Database connection error: Unable to connect to the database.',
	OptimisticLockError: 'Optimistic lock error: Concurrent update conflict.',
	NotFoundError: 'error.message',
	InvalidCredentialsError: 'Invalid credentials provided',
	UnknownError: 'An unexpected error occurred.'
};

const formatErrorForFe = (key: string, count: number) => 
	`${count} resource(s) ${TranslatedError[key as keyof typeof TranslatedError]}`;

const finishProcessing = (params: FinishEndParams) => {
	const { res, pkgGlobal, file } = params;
	deleteUploadedFile(file);
	if (pkgGlobal.errorMap.length > 0 || Object.values(pkgGlobal.errorCount).some(x => x > 0)) {
		// const errorMapsMsg = pkgGlobal.errorMap.map(e => e.message).join(',\n ');
		const errorCountMsg = Object.entries(pkgGlobal.errorCount).map(([key, count]) => formatErrorForFe(key, count)).join('\n ');
		return res.status(400).json({ 
			errors: pkgGlobal.errorMap, 
			message: `Importing Done with error: \n ${errorCountMsg}` });
	}
	res.json({ message: `Importing Done!` });
	// resHeaderError('getUsers', error, req.query, res, next);
}

export const onEnd = async (params: OnEndParams) => {
	const { req, res, pkgGlobal, file } = params;
	const { pkgArr, shipFromArr, shipToArr } = pkgGlobal;
	const totalBatches = Math.ceil(pkgArr.length / BATCH_SIZE);

	for (let i = 0; i < totalBatches; i++) {
		const start = i * BATCH_SIZE;
		const end = start + BATCH_SIZE;
		const batchData: BatchDataType = {
			processed: Math.min(end, pkgArr.length),
			errorMap: [],
			errorCount: {},
			pkgArr: pkgArr.slice(start, end),
			shipFromArr: shipFromArr.slice(start, end),
			shipToArr: shipToArr.slice(start, end),
		};
		try {
			await processBatch(batchData);
		} catch (error: any) {
			const trackError = new TrackingnoMustBeUniqueError(error)
			const errorRes = getErrorRes({ fnName: 'onEnd', error: trackError });
			logger.error(`Error in onEnd: ${errorRes.message}`);
			setPkgErrors(errorRes, pkgGlobal);
		} finally {
			reportIoSocket({ eventName: 'insert', req, processed: batchData.processed, total: pkgArr.length });
		}
	}
	finishProcessing({ res, pkgGlobal, file });
};

const deleteUploadedFile = (file: Express.Multer.File) => {
	fs.unlink(file.path, (unlinkError) => {
		if (unlinkError) {
			logger.error(`Failed to delete file after process: ${unlinkError}`);
		}
	});
}
