"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BatchCreationError = exports.InvalidInputError = exports.InvalidCredentialsError = exports.NotFoundError = void 0;
const fixErrorClass = (scope, errorClass) => {
    Object.defineProperty(scope, 'message', { enumerable: true });
    Object.defineProperty(scope, 'name', { enumerable: true });
    if (Error.captureStackTrace) {
        Error.captureStackTrace(scope, errorClass);
    }
};
class NotFoundError extends Error {
    constructor(message = 'Resource not found', name = 'NotFoundError') {
        super(message);
        this.name = name;
        this.status = 404;
        fixErrorClass(this, NotFoundError);
    }
}
exports.NotFoundError = NotFoundError;
class InvalidCredentialsError extends Error {
    constructor(message = 'Invalid credentials provided', name = 'InvalidCredentialsError') {
        super(message);
        this.name = name;
        this.status = 401;
        fixErrorClass(this, InvalidCredentialsError);
    }
}
exports.InvalidCredentialsError = InvalidCredentialsError;
class InvalidInputError extends Error {
    constructor(message = 'Invalid input provided', name = 'InvalidInputError') {
        super(message);
        this.name = name;
        this.status = 400;
        fixErrorClass(this, InvalidInputError);
    }
}
exports.InvalidInputError = InvalidInputError;
class BatchCreationError extends Error {
    constructor(params) {
        const { name, message, original, errors, lastFn } = params;
        super(message);
        this.name = name;
        this.status = 422;
        this.original = original;
        this.lastFn = lastFn;
        this.errors = errors;
        fixErrorClass(this, BatchCreationError);
    }
}
exports.BatchCreationError = BatchCreationError;
