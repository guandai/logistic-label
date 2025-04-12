"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getErrorRes = exports.aggregateError = void 0;
const sequelize_1 = require("sequelize");
const logger_1 = __importDefault(require("../config/logger"));
const errorClasses_1 = require("./errorClasses");
const errors_1 = require("./errors");
const reducedError = (error) => {
    const properties = {
        name: 'name' in error ? error.name : (0, errors_1.toCamelCase)(error.message),
        message: error.message,
        value: error.value, // Casting to 'any' to avoid TypeScript error for non-standard properties
        path: error.path,
        type: error.type,
    };
    return `\n${Object.entries(properties)
        .filter(([key, value]) => value !== undefined)
        .map(([key, value]) => `-> [${key}]: ${value}`).join('\n')}\n`;
};
const aggregateError = (error) => {
    if (!error)
        return '';
    const constructorName = error.constructor.name;
    const title = `\n[Error Instance] ${constructorName}: `;
    if (error instanceof sequelize_1.UniqueConstraintError) {
        return `${title} ${error.errors.map(reducedError).join(', ')}`;
    }
    if (Array.isArray(error)) {
        return `${title} ${error.map(reducedError).join(', ')}`;
    }
    return `${title} ${[error].map(reducedError).join(', ')}`;
};
exports.aggregateError = aggregateError;
const logSequelizeError = (fnName, errRes, disableLog = false) => {
    !disableLog && logger_1.default.error(`SequelizeError in ${fnName}: ${(0, exports.aggregateError)(errRes.original)}`);
    return errRes;
};
const getErrorRes = (params) => {
    const { fnName, error, data, disableLog = false } = params;
    let errorRes;
    switch (true) {
        case error instanceof sequelize_1.UniqueConstraintError:
            errorRes = { original: error, data, name: error.name,
                status: 409, message: 'Unique constraint error: Duplicate value detected.',
                errors: error.errors,
            };
            break;
        case error instanceof sequelize_1.ValidationError:
            errorRes = { original: error, data, name: error.name,
                status: 400, message: 'Validation error: Invalid input data.',
                errors: error.errors,
            };
            break;
        case error instanceof sequelize_1.ForeignKeyConstraintError:
            errorRes = { original: error, data, name: error.name,
                status: 400, message: 'Foreign key constraint error: Invalid reference.',
                parent: error.parent,
            };
            break;
        case error instanceof sequelize_1.DatabaseError:
            errorRes = { original: error, data, name: error.name,
                status: 500, message: 'Database error: A general database error occurred.',
                sql: error.sql,
            };
            break;
        case error instanceof sequelize_1.TimeoutError:
            errorRes = { original: error, data, name: error.name,
                status: 504, message: 'Database timeout error: Query execution exceeded the time limit.',
                sql: error.sql,
            };
            break;
        case error instanceof sequelize_1.ConnectionError:
            errorRes = { original: error, data, name: error.name,
                status: 503, message: 'Database connection error: Unable to connect to the database.',
                parent: error.parent,
            };
            break;
        case error instanceof sequelize_1.OptimisticLockError:
            errorRes = { original: error, data, name: error.name,
                status: 409, message: 'Optimistic lock error: Concurrent update conflict.',
                where: error.where,
            };
            break;
        case error instanceof errorClasses_1.NotFoundError:
            errorRes = { original: error, data, name: error.name,
                status: 404, message: error.message,
            };
            break;
        case error instanceof errorClasses_1.InvalidCredentialsError:
            errorRes = { original: error, data, name: error.name,
                status: 401, message: error.message || 'Invalid credentials provided',
            };
            break;
        case error instanceof errorClasses_1.InvalidInputError:
            errorRes = { original: error, data, name: error.name,
                status: 400, message: error.message || 'Invalid input provided',
            };
            break;
        default:
            errorRes = { original: error, data, name: error.name,
                status: 500, message: 'An unexpected error occurred.',
                stack: error.stack,
            };
            break;
    }
    return logSequelizeError(fnName, errorRes, disableLog);
};
exports.getErrorRes = getErrorRes;
