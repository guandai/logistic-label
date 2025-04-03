// backend/src/controllers/packageUpload.ts
import multer from 'multer';
import csv from 'csv-parser';
import fs from 'fs';
import path from 'path';
import { ImportPackageRes, ResponseAdv } from '@ddlabel/shared';
import { AuthRequest, BatchDataType, CsvData } from '../types';
import { onData, onEnd, onError } from './packageStreamFuntions';
import { resHeaderError } from '../utils/errors';
import { InvalidInputError } from '../utils/errorClasses';
import { NextFunction } from 'express';

export const importPackages = async (req: AuthRequest, res: ResponseAdv<ImportPackageRes>, next: NextFunction) => {
	const { file } = req;
	try {
		if (!file) {
			throw new InvalidInputError('No file uploaded');
		}

		const pkgGlobal: BatchDataType = {
			processed: 0,
			errorMap: [],
			errorHash: { missingToZip:0 , missingFromZip: 0, trackingnoMustBeUnique: 0 },
			pkgArr: [],
			shipFromArr: [],
			shipToArr: [],
		}

		const readableStream = fs.createReadStream(file.path);
		// const writableStream = fs.createWriteStream('output.txt');

		readableStream.pipe(csv())
			.on('data', (csvData: CsvData) => onData({ req, csvData, pkgGlobal }))
			.on('end', async () => onEnd({ req, res, pkgGlobal, file }))
			.on('error', (error: any) => onError( error, pkgGlobal ));
	} catch (error: any) {
		resHeaderError('importPackages', error, req.file, res, next);
	}
};

const storage = multer.diskStorage({
	destination: function (req, file, cb) {
		cb(null, './uploads/');
	},
	filename: function (req, file, cb) {
		cb(null, `${file.fieldname}-${Date.now()}${path.extname(file.originalname)}`);
	}
});

const upload = multer({ storage });

export const uploadMiddleware = upload.single('packageCsvFile');
