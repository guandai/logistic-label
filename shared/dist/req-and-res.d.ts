import { Optional } from 'sequelize';
import { AddressAttributes, AddressEnum, AddressModel, PackageModel, PostalZoneAttributes, TransactionModel, UserAttributes, UserModel, UserRolesEnum } from "./models";
import { SimpleRes } from './types';
import { BeansAI } from './beans';
export type RegisterUserReq = Pick<UserAttributes, 'name' | 'email' | 'password' | 'role'> & {
    warehouseAddress: AddressAttributes;
};
export type RegisterUserRes = {
    success: boolean;
    userId: number;
};
export type UpdateUserReq = Omit<UserAttributes, 'password'> & {
    password?: string;
} & {
    warehouseAddress: AddressAttributes;
};
export type UpdateUserRes = {
    success: boolean;
};
export type GetUsersReq = GetRecordsReq;
export type GetUsersRes = {
    users: UserModel[];
    total: number;
};
export type GetUserRes = {
    user: UserModel;
};
export type LoginUserReq = Pick<UserAttributes, 'email' | 'password'>;
export type LoginUserRes = {
    token: string;
    userId: number;
    userRole: UserRolesEnum;
};
export type Models = UserAttributes | PackageModel | TransactionModel | AddressModel;
export type ModelNames = 'user' | 'package' | 'transaction' | 'address';
export declare enum ModelEnum {
    user = "user",
    package = "package",
    transaction = "transaction",
    address = "address"
}
export type WeightUnit = 'lbs' | 'oz';
export type VolumeUnit = 'inch' | 'mm';
export type GetRecordsRes = GetPackagesRes | GetTransactionsRes | GetUsersRes;
export type GetRecordRes = GetPackageRes | GetTransactionRes | GetUserRes;
export type PaginationRecordReq = {
    limit: number;
    offset: number;
};
export type SearchRecordReq = {
    trackingNo?: string;
    email?: string;
    role?: UserRolesEnum;
    name?: string;
    address?: string;
    addressType?: AddressEnum;
};
export type DateRecordReq = {
    startDate: string;
    endDate: string;
};
export type GetRecordsReq = PaginationRecordReq & SearchRecordReq & DateRecordReq;
export type GetPackagesReq = GetRecordsReq;
export type GetPackagesCsvReq = SearchRecordReq & DateRecordReq;
export type GetPackagesCsvRes = string;
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
export type GetTransactionsReq = GetRecordsReq;
export type GetTransactionsRes = {
    transactions: TransactionModel[];
    total: number;
};
export type GetTransactionRes = {
    transaction: TransactionModel;
};
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
};
export type GetPostalZoneReq = {
    zip: string;
};
export type GetPostalZoneRes = {
    postalZone: PostalZoneAttributes;
};
export type GetPostalZonesRes = {
    postalZones: PostalZoneAttributes[];
};
export type GetZoneReq = {
    fromZip: string;
    toZip: string;
};
export type GetZoneRes = {
    zone: string;
};
export type GetStatusLogReq = {
    trackingNo: string;
};
export type GetStatusLogRes = {
    listItemReadableStatusLogs: BeansAI.ListItemReadableStatusLogs;
};
export declare const isGetPackageRes: (res: GetRecordRes) => res is GetPackageRes;
export declare const isGetPackagesRes: (res: GetRecordsRes) => res is GetPackagesRes;
export declare const isGetTransactionsRes: (res: GetRecordsRes) => res is GetTransactionsRes;
export declare const isGetTransactionRes: (res: GetRecordRes) => res is GetTransactionRes;
export declare const isGetUsersRes: (res: GetRecordsRes) => res is GetUsersRes;
export declare const isGetUserRes: (res: GetRecordRes) => res is GetUserRes;
