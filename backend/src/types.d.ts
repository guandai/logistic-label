import { Request } from 'express';

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
	name: ErrorInstanceName,
	original: any;
	data: unknown;
	status: number;
	message: string;
	errors?: ValidationErrorItem[];
	parent?: Error;
	sql?: string;
	where?: Record<string, unknown>;
	stack?: any;
	lastFn?: string;
}
