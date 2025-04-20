type BatchCreationErrorParams = {
	name: string;
	message: string;
	original: any;
	lastFn: string;
	errors?: any[];
}

const fixErrorClass = (scope: any, errorClass: Function) => {
	Object.defineProperty(scope, 'message', { enumerable: true });
	Object.defineProperty(scope, 'name', { enumerable: true });
	if (Error.captureStackTrace) {
		Error.captureStackTrace(scope, errorClass);
	}
}

export class UnknownError extends Error {
	public status: number;

	constructor(message: string = 'No Message Unknown Error', name = 'UnknownError') {
		super(message);
		this.name = name;
		this.status = 500;
		fixErrorClass(this, NotFoundError);
	}
}

export class NotFoundError extends Error {
	public status: number;

	constructor(message: string = 'Resource not found', name = 'NotFoundError') {
		super(message);
		this.name = name;
		this.status = 404;
		fixErrorClass(this, NotFoundError);
	}
}

export class InvalidCredentialsError extends Error {
	public status: number;

	constructor(message: string = 'Invalid credentials provided', name = 'InvalidCredentialsError') {
		super(message);
		this.name = name;
		this.status = 401;
		fixErrorClass(this, InvalidCredentialsError);
	}
}

export class InvalidInputError extends Error {
	public status: number;

	constructor(
		message: string = 'Invalid input provided',
		name: string = 'InvalidInputError',
	) {
		super(message);
		this.name = name
		this.status = 400;
		fixErrorClass(this, InvalidInputError);
	}
}

export class BatchCreationError extends Error {
	public status: number;
	public original: any;
	public lastFn: string;
	public errors?: any[];

	constructor(params: BatchCreationErrorParams) {
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

export class TrackingnoMustBeUniqueError extends Error {
	public status: number;

	constructor(message: string = 'Invalid credentials provided', name = 'InvalidCredentialsError') {
		super(message);
		this.name = name;
		this.status = 401;
		fixErrorClass(this, InvalidCredentialsError);
	}
}

export class MissingFromZipError extends InvalidInputError {
	constructor(
		message: string = 'Data Row Missing From Zip',
		name: string = 'MissingFromZipError',
	) {
		super(message, name);
	}
}

export class MissingToZipError extends InvalidInputError {
	constructor(
		message: string = 'Data Row Missing To Zip',
		name: string = 'MissingToZipError',
	) {
		super(message, name);
	}
}
