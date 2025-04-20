// backend/src/controllers/packageBatchFuntions.ts
import { Package } from '../models/Package';
import { Address } from '../models/Address';
import getZipInfo, { getFromAddressZip, getToAddressZip } from '../utils/getInfo';
import { isValidJSON } from '../utils/errors';
import { CsvRecord, defaultMapping, CSV_KEYS, HeaderMapping, KeyCsvRecord } from '@ddlabel/shared';
import { CsvData, PreparedData, BatchDataType } from '../types';
import { getErrorRes } from '../utils/getErrorRes';
import { MissingFromZipError, MissingToZipError } from '../utils/errorClasses';

const getMappingData = (headers: CsvData, headerMapping: HeaderMapping): CsvRecord => {
	return CSV_KEYS.reduce((acc: CsvRecord, csvKey: KeyCsvRecord) => {
		const csvFileHeader = headerMapping[csvKey];
		return Object.assign(acc, { [csvKey]: !!csvFileHeader ? headers[csvFileHeader] : null });
	}, {} as CsvRecord);
}

export const flatCsvData = (csvData: CsvData): String => 
	Object.keys(csvData).reduce((acc: string, csvKey: string) => {
		const value = csvData[csvKey];
		const line = !!value ? `${csvKey}: ${value}` : '';
		return line ? `${acc} ${line}\n` : acc;
	}, '');

export const getPreparedData = async (packageCsvMap: string, data: CsvData): Promise<PreparedData> => {
	const headerMapping: HeaderMapping = isValidJSON(packageCsvMap) ? JSON.parse(packageCsvMap) : defaultMapping;
	const mappedData = getMappingData(data, headerMapping);
	const fromZipInfo = getZipInfo(getFromAddressZip(mappedData));
	const toZipInfo = getZipInfo(getToAddressZip(mappedData));
	const csvUploadErrors = [];

	if (!fromZipInfo) { 
		const error = new MissingFromZipError(`getPreparedData has no fromAddressZip: ${flatCsvData(data)}`);
		csvUploadErrors.push( getErrorRes({ fnName: 'getPreparedData', error, data, disableLog: true } ) );
	}
	if (!toZipInfo) { 
		const error = new MissingToZipError(`getPreparedData has no toAddressZip: ${flatCsvData(data)}`);
		csvUploadErrors.push ( getErrorRes( { fnName: 'getPreparedData', error, data, disableLog: true } ) );
	}
	return { mappedData, fromZipInfo, toZipInfo, csvUploadErrors };
}

export const processBatch = async (batchData: BatchDataType) => {
	const { pkgArr, shipFromArr, shipToArr } = batchData;
	try {
		const packages = await Package.bulkCreate(pkgArr);
		packages.map((pkg, idx: number) => {
			shipFromArr[idx].fromPackageId = pkg.id;
			shipToArr[idx].toPackageId = pkg.id;
		});
		await Address.bulkCreateWithInfo(shipFromArr);
		await Address.bulkCreateWithInfo(shipToArr);
	} catch (error: any) {
		throw error;
	}
};
