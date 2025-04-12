"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.resHeaderError = exports.isDateValid = exports.ReturnMsg = exports.reducedConstraintError = exports.toCamelCase = exports.ternaryPutError = exports.isValidJSON = void 0;
const moment_1 = __importDefault(require("moment"));
const logger_1 = __importDefault(require("../config/logger"));
const getErrorRes_1 = require("./getErrorRes");
const errorClasses_1 = require("./errorClasses");
const isValidJSON = (str) => {
    try {
        JSON.parse(str);
        return true;
    }
    catch (e) {
        return false;
    }
};
exports.isValidJSON = isValidJSON;
const ternaryPutError = (name, pkgGlobal, error) => (name in pkgGlobal.errorHash) ? pkgGlobal.errorHash[name]++ : pkgGlobal.errorMap.push(error);
exports.ternaryPutError = ternaryPutError;
const toCamelCase = (str) => str.split(/[\s-_]+/) // Split by spaces, dashes, or underscores
    .map((word, index) => {
    if (index === 0) {
        return word.toLowerCase(); // First word should be all lowercase
    }
    return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase(); // Capitalize the first letter of the rest
})
    .join(''); // Join all the words without spaces
exports.toCamelCase = toCamelCase;
const reducedConstraintError = (error) => {
    var _a, _b, _c, _d;
    const stacks = (_a = error.stack) === null || _a === void 0 ? void 0 : _a.split('\n');
    const lastFn = ((_b = stacks === null || stacks === void 0 ? void 0 : stacks.pop()) === null || _b === void 0 ? void 0 : _b.split(' ')[5]) || '';
    const batchError = new errorClasses_1.BatchCreationError(Object.assign(Object.assign({}, error), { message: ((_d = (_c = error.errors) === null || _c === void 0 ? void 0 : _c[0]) === null || _d === void 0 ? void 0 : _d.message) || 'Unique constraint error: Duplicate value detected.', original: error, lastFn: lastFn }));
    return (0, getErrorRes_1.aggregateError)(batchError);
};
exports.reducedConstraintError = reducedConstraintError;
const ReturnMsg = (res, message, code = 400) => res.status(code).json({ message });
exports.ReturnMsg = ReturnMsg;
const isDateValid = (date) => (0, moment_1.default)(date, moment_1.default.ISO_8601, true).isValid();
exports.isDateValid = isDateValid;
const resHeaderError = (fnName, error, data, res, next) => {
    logger_1.default.error(`Error in ${fnName} -> ${error} .`);
    logger_1.default.error(`Data  in ${fnName} -> ${data} .`);
    const errorRes = (0, getErrorRes_1.getErrorRes)({ fnName, error, data });
    const json = {
        message: errorRes.message,
        errors: errorRes.errors,
    };
    // next(json);
    res.status(500).json(json);
    // return void 0;
};
exports.resHeaderError = resHeaderError;
