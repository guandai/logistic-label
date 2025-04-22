import { ErrorRes, ResponseAdv } from "@ddlabel/shared";
import moment from "moment";
import { UniqueConstraintError } from "sequelize";
import { NextFunction, Response } from "express";
import logger from "../config/logger";
import { aggregateError, getErrorRes } from "./getErrorRes";
import { BatchCreationError } from "./errorClasses";
import { BatchDataType } from "../types";

export const isValidJSON = (str: string) => {
	try {
		JSON.parse(str);
		return true;
	} catch (e) {
		return false;
	}
}

export const setErrorCount = (
	error: ErrorRes,
	pkgGlobal: BatchDataType, 
) =>{
	 	const name = error.error_name
		pkgGlobal.errorCount[name] = (pkgGlobal.errorCount[name] ?? 0) + 1
	}

export const fillErrorMap = (
			error: ErrorRes,
			pkgGlobal: BatchDataType, 
		) =>
			pkgGlobal.errorMap.push(error)

export const setPkgErrors = (error: ErrorRes, pkgGlobal: BatchDataType) =>{
		setErrorCount(error, pkgGlobal);
		fillErrorMap(error, pkgGlobal);
}

export const toCamelCase = (str: string): string =>
	str.split(/[\s-_]+/)  // Split by spaces, dashes, or underscores
		.map((word, index) => {
			if (index === 0) {
				return word.toLowerCase();  // First word should be all lowercase
			}
			return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();  // Capitalize the first letter of the rest
		})
		.join('');  // Join all the words without spaces

// const reducedConstraintError = (error: UniqueConstraintError) => {
// 	const stacks = error.stack?.split('\n')
// 	const lastFn = stacks?.pop()?.split(' ')[5] || '';
// 	const batchError = new BatchCreationError({
// 		...error,
// 		message: error.errors?.[0]?.message || 'Unique constraint error: Duplicate value detected.',
// 		original: error,
// 		lastFn: lastFn,
// 	});

// 	return aggregateError(batchError);
// }

export const ReturnMsg = <T>(res: ResponseAdv<T>, message: string, code = 400) => res.status(code).json({ message });

export const isDateValid = (date: string) => moment(date, moment.ISO_8601, true).isValid();


export const resHeaderError = (fnName: string, error: any, data: unknown, res: Response, next: NextFunction) => {
	logger.error(`Error in ${fnName} -> ${error} .`);
	logger.error(`Data  in ${fnName} -> ${data} .`);
	const errorRes = getErrorRes({ fnName, error, data });
	const json = {
		message: errorRes.message,
		errors: errorRes.errors,
	}
	// next(json);
	res.status(500).json(json);
	// return void 0;
}
