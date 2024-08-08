import { Optional } from 'sequelize';
import { AddressAttributes, AddressModel, PackageModel, PostalZoneAttributes, TransactionModel, UserAttributes, UserModel } from "./models";
import { SimpleRes } from './types';
import { BeansAI } from './beans';

// User
export type RegisterUserReq = Pick<UserAttributes, 'name' | 'email' | 'password' | 'role'> & { warehouseAddress: AddressAttributes };
export type RegisterUserRes = {
	success: boolean;
	userId: number;
};

export type UpdateCurrentUserReq = Pick<UserAttributes, 'name' | 'email' | 'role'> & {
	password?: string;
} & {
	warehouseAddress: AddressAttributes;
};
export type UpdateCurrentUserRes = {
	success: boolean;
};

export type GetUsersRes = {
	users: UserModel[]
};

export type GetCurrentUserRes = {
	user: UserModel;
};

export type LoginUserReq = Pick<UserAttributes, 'email' | 'password'>;
export type LoginUserRes = {
	token: string;
	userId: number;
};

export type UpdateUserReq = Pick<UserAttributes, 'name' | 'email' | 'role'> & { password?: string } & { warehouseAddress: AddressAttributes };
export type UpdateUserRes = {
	success: boolean;
};

export type Model = UserModel | PackageModel | TransactionModel | AddressModel;
export type Models = 'user' | 'package' | 'transaction' | 'address';

export enum ModelEnum {
	user = 'user',
	package = 'package',
	transaction = 'transaction',
	address = 'address',
}

// Package
export type WeightUnit = 'lbs' | 'oz';
export type VolumeUnit = 'inch' | 'mm';

export type GetRecordsRes = GetPackagesRes | GetTransactionsRes;
export type GetRecordRes = GetPackageRes | GetTransactionRes;

export type PaginationRecordReq = {
	limit: number;
	offset: number;
};

export type SearchRecordReq = {
	search?: string;
};

export type DateRecordReq = {
	startDate?: string;
    endDate?: string;
};

export type GetRecordsReq = PaginationRecordReq | SearchRecordReq | DateRecordReq;

export type GetPackagesReq = GetRecordsReq;
export type GetPackagesRes = {
	packages: PackageModel[];
	total: number;	
};
export type GetPackageRes = {
	package: PackageModel;
};

export type CreatePackageReq = Optional<PackageModel, 'length' | 'width' | 'height' | 'trackingNo'>;
export type CreatePackageRes = {
	success: boolean;
	packageId: number;
};

export type UpdatePackageReq = CreatePackageReq;
export type UpdatePackageRes = {
	success: boolean;
};

export type ImportPackageReq = FormData;

export type ImportPackageRes = SimpleRes;

// Transaction
export type GetTransactionsReq = GetRecordsReq;
export type GetTransactionsRes = {
	transactions: TransactionModel[];
	total: number;
};	

export type GetTransactionRes = {
	transaction: TransactionModel;
};


// Rate
export type GetRatesReq = {
	weight: number;
	weightUnit: WeightUnit;
	length: number;
	width: number;
	height: number;
	volumeUnit: VolumeUnit;
	zone: number;
};
export type GetRatesRes = {
	rates: number[];
};

export type FullRateReq = GetRatesReq;
export type FullRateRes = {
	totalCost: number;
}


// AuthRequest
export type AuthRequest = import("express-serve-static-core").Request & {
	user: UserAttributes;
};


// Postal zip
export type GetPostalZoneReq = { zip: string };
export type GetPostalZoneRes = { postalZone: PostalZoneAttributes };;

export type GetPostalZonesRes = { postalZones: PostalZoneAttributes[] };

export type GetZoneReq = { fromZip: string; toZip: string
 };
export type GetZoneRes = { zone: string }

// Beans
export type GetStatusLogReq = { trackingNo: string };
export type GetStatusLogRes = { listItemReadableStatusLogs: BeansAI.ListItemReadableStatusLogs };


export const isGetPackageRes = (res: GetRecordRes): res is GetPackageRes => {
	return (res as GetPackageRes).package !== undefined;
};
export const isGetPackagesRes = (res: GetRecordsRes): res is GetPackagesRes => {
	return (res as GetPackagesRes).packages !== undefined;
};

export const isGetTransactionsRes = (res: GetRecordsRes): res is GetTransactionsRes => {
	return (res as GetTransactionsRes).transactions !== undefined;
};
export const isGetTransactionRes = (res: GetRecordRes): res is GetTransactionRes => {
	return (res as GetTransactionRes).transaction !== undefined;
};
