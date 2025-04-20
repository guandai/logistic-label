import { Request } from 'express';
import { ErrorRes } from '@ddlabel/shared';

type PackageRoot = PackageCreationAttributes;
export interface AuthRequest extends Request {
	user?: UserAttributes;
}

export type ErrorCount = Record<ErrorInstanceName, number>

export type BatchDataType = {
	processed: number,
	errorMap: ErrorRes[],
	errorCount: Partial<ErrorCount>,
	pkgArr: PackageRoot[],
	shipFromArr: AddressCreationAttributes[],
	shipToArr: AddressCreationAttributes[],
}

export type CsvData = { [k: string]: string | number };

export type PreparedData = {
	mappedData: CsvRecord,
	fromZipInfo: any,
	toZipInfo: any,
	csvUploadErrors: ErrorRes[],
}
