import { Response } from 'express';
import { ValidationErrorItem } from 'sequelize';
type CsvRecordRequired = {
	weight: number,
	fromAddressName: string,
	fromAddress1: string,
	toAddressName: string,
	toAddress1: string,
}

export type BeansStatus = 'FINISHED' | 'FAILED' | 'MISLOAD' | 'DELETED' | 'NEW' | 'IN_PROCESS' | 'NOLOCATION' | 'N/A';

type CsvRecordOptional = {
	referenceNo?: string,
	fromAddressZip?: string,
	toAddressZip?: string,
	trackingNo?: string,
	length?: number,
	width?: number,
	height?: number,
	fromAddress2?: string,
	toAddress2?: string,
	fromAddressPhone?: string,
	toAddressPhone?: string,
}

export type CsvRecord = CsvRecordOptional & CsvRecordRequired;
export type KeyCsvRecord = keyof CsvRecord;

export type HeaderMapping = { [k in keyof CsvRecord]: string | undefined };

export type PortInfo = {
	zip: string;
	proposal: string;
	sortCode: string;
	startZip: string;
	state: string;
	city: string;
};

export type ZipInfo = {
	zip: string;
	city: string;
	state: string;
	county?: string;
};

export type SimpleRes = {
	message: string;
	success?: false;
	error?: unknown;
	errors?: unknown[];
};

export type ResponseAdv<T> = Response<T | SimpleRes>;
export type ResponseSimple = Response<SimpleRes>;

export type ErrorInstanceName =
	"MissingToZipError" |
	"MissingFromZipError" |
	"TrackingnoMustBeUniqueError" |

	"UnknownError" |
	"UniqueConstraintError" |
	"ValidationError" |
	"ForeignKeyConstraintError" |
	"DatabaseError" |
	"TimeoutError" |
	"ConnectionError" |
	"OptimisticLockError" |
	"NotFoundError" |
	"InvalidCredentialsError" |
	"InvalidInputError"

export type ErrorRes = {
	error_name: ErrorInstanceName | string,
	original: any;
	error_data: unknown;
	status: number;
	message: string;
	errors?: ValidationErrorItem[];
	parent?: Error;
	sql?: string;
	where?: Record<string, unknown>;
	stack?: any;
	lastFn?: string;
}
