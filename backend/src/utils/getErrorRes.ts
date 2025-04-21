import { UniqueConstraintError, ValidationError, ForeignKeyConstraintError, DatabaseError, TimeoutError, ConnectionError, OptimisticLockError, ValidationErrorItem } from "sequelize";
import logger from "../config/logger";
import { NotFoundError, InvalidCredentialsError, InvalidInputError, TrackingnoMustBeUniqueError, MissingFromZipError, MissingToZipError, UnknownError } from "./errorClasses";
import { toCamelCase } from "./errors";
import { ErrorRes } from "@ddlabel/shared";

const reducedError = (error: Error | ValidationErrorItem) => {
    const properties = {
        name: 'name' in error ? error.name : toCamelCase(error.message),
        message: error.message,
        value: (error as any).value, // Casting to 'any' to avoid TypeScript error for non-standard properties
        path: (error as any).path,
        type: (error as any).type,
    };

    return `\n${Object.entries(properties)
        .filter(([key, value]) => value !== undefined)
        .map(([key, value]) => `-> [${key}]: ${value}`).join('\n')}\n`;
};

export const aggregateError = (error: UniqueConstraintError | Error[] | Error): string => {
	if (!error) return '';
	const constructorName = error.constructor.name;
	const title = `\n[Error Instance] ${constructorName}: `;

	if (error instanceof UniqueConstraintError) {
		return `${title} ${error.errors.map(reducedError).join(', ')}`;
	}

	if (Array.isArray(error)) {
		return `${title} ${error.map(reducedError).join(', ')}`;
	}
	
	return `${title} ${[error].map(reducedError).join(', ')}`;
}


type SequelizeErrorParams = {
	fnName: string;
	name?: string;
	status?: number;
	error: any;
	data?: unknown;
	disableLog?: boolean;
}

export const getErrorRes = (params: SequelizeErrorParams): ErrorRes => {
	const { fnName, error, data, name, status, disableLog = false } = params;
	const errorInit = { 
		original: error,
		error_data: data,
		error_name: name || error.constructor.name,  
		status: status || 400,
		message: error.message || 'An error occurred.'
	};

	let errorRes: ErrorRes
	switch (true) {
		case error instanceof UniqueConstraintError:
			errorRes = { 
				...errorInit,
				status: 409,
				message: 'Unique constraint error: Duplicate value detected.',
				errors: error.errors,
			};
			break;

		case error instanceof ValidationError:
			errorRes = { 
				...errorInit,
				message: 'Validation error: Invalid input data.',
				errors: error.errors,
			};
			break;

		case error instanceof ForeignKeyConstraintError:
			errorRes = { 
				...errorInit,
				message: 'Foreign key constraint error: Invalid reference.',
				parent: error.parent,
			};
			break;

		case error instanceof DatabaseError:
			errorRes = { 
				...errorInit,
				status: 500,
				message: 'Database error: A general database error occurred.',
				sql: error.sql,
			};
			break;

		case error instanceof TimeoutError:
			errorRes = { 
				...errorInit,
				status: 504,
				message: 'Database timeout error: Query execution exceeded the time limit.',
				sql: error.sql,
			};
			break;

		case error instanceof ConnectionError:
			errorRes = { 
				...errorInit,
				status: 503,
				message: 'Database connection error: Unable to connect to the database.',
				parent: error.parent,
			};
			break;

		case error instanceof OptimisticLockError:
			errorRes = { 
				...errorInit,
				status: 409,
				message: 'Optimistic lock error: Concurrent update conflict.',
				where: error.where,
			};
			break;

		case error instanceof NotFoundError:
			errorRes = { 
				...errorInit,
				status: 404,
				message: error.message,
			};
			break;

		case error instanceof InvalidCredentialsError:
			errorRes = { 
				...errorInit,
				status: 401,
				message: error.message || 'Invalid credentials provided',
			};
			break;
		
		case error instanceof MissingFromZipError:
			errorRes = { 
				...errorInit,
				message: error.message || 'Sender Address Zip Code is required.',
			};
			break;

		case error instanceof MissingToZipError:
			errorRes = { 
				...errorInit,
				message: error.message || 'Receiver Address Zip Code is required.',
			};
			break;

		case error instanceof TrackingnoMustBeUniqueError:
			errorRes = { 
				...errorInit,
				message: error.message || 'Tracking number must be unique.',
			};
			break;

		case error instanceof InvalidInputError:
			errorRes = { 
				...errorInit,
				message: error.message || 'Invalid input provided',
			};
			break;
		
		case error instanceof UnknownError:
			errorRes = { 
				...errorInit,
			};
			break;

		default:
			errorRes = { 
				...errorInit,
				status: 500,
				error_name: error.name || 'Error',
				message: error.message || 'An unexpected error occurred.',
				stack: error.stack,
			};
			break;
	}

	if (!disableLog) {
		logger.error(`SequelizeError in ${fnName}: ${aggregateError(errorRes.original)}`);
	}

	return errorRes;
};
