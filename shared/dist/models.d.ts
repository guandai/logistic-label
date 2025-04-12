import { Optional } from 'sequelize';
export declare enum UserRolesEnum {
    worker = "worker",
    admin = "admin"
}
export declare enum PackageSource {
    manual = "manual",
    csv = "csv",
    api = "api"
}
export type PackageCreationAttributes = Optional<PackageAttributes, 'id'>;
export type UserCreationAttributes = Optional<UserAttributes, 'id'>;
export type AddressCreationAttributes = Optional<AddressAttributes, 'id'>;
export type TransactionCreationAttributes = Optional<TransactionAttributes, 'id'>;
export type PackageChange = PackageAttributes | PackageCreationAttributes;
export type AddressChange = AddressAttributes | AddressCreationAttributes;
export type UserChange = UserAttributes | UserCreationAttributes;
export type TransactionChange = TransactionAttributes | TransactionCreationAttributes;
export type PackageAttributes = {
    id: number;
    userId: number;
    length: number;
    width: number;
    height: number;
    weight: number;
    trackingNo: string;
    referenceNo: string;
    source: PackageSource;
};
export type UserModel = UserAttributes & {
    warehouseAddress: AddressAttributes;
    transactions: TransactionAttributes[];
    packages: PackageAttributes[];
    createdAt?: string;
};
export type PackageModel = PackageAttributes & {
    user: UserAttributes;
    fromAddress: AddressAttributes;
    toAddress: AddressAttributes;
    transaction: TransactionAttributes;
    createdAt?: string;
};
export type AddressModel = AddressAttributes & {
    user: UserAttributes;
    fromPackage: PackageAttributes;
    toPackage: PackageAttributes;
    createdAt?: string;
};
export type TransactionModel = TransactionAttributes & {
    package: PackageAttributes;
    user: UserAttributes;
    createdAt?: string;
};
export declare enum PortEnum {
    LAX = "LAX",
    JFK = "JFK",
    ORD = "ORD",
    SFO = "SFO",
    DFW = "DFW",
    MIA = "MIA",
    ATL = "ATL",
    BOS = "BOS",
    SEA = "SEA"
}
export declare enum AddressEnum {
    user = "user",
    toPackage = "toPackage",
    fromPackage = "fromPackage"
}
export type AddressAttributes = {
    id: number;
    name: string;
    address1: string;
    address2?: string;
    city: string;
    state: string;
    zip: string;
    proposal?: PortEnum;
    sortCode?: string;
    email?: string;
    phone?: string;
    addressType?: AddressEnum;
    userId?: number;
    fromPackageId?: number;
    toPackageId?: number;
};
export type UserAttributes = {
    id: number;
    name: string;
    email: string;
    password: string;
    role: UserRolesEnum;
};
export type UserType = UserAttributes & {
    warehouseAddress: AddressAttributes;
};
export type PostalZoneAttributes = {
    zip: string;
    new_sort_code: string;
    sort_code: string;
    state: string;
    city: string;
    remote_code: string;
    code: string;
    proposal: KeyZones;
    start_zip?: string;
    open_date: string;
    LAX?: string;
    SFO?: string;
    ORD?: string;
    JFK?: string;
    ATL?: string;
    DFW?: string;
    MIA?: string;
    SEA?: string;
    BOS?: string;
    PDX?: string;
};
export type Zones = Pick<PostalZoneAttributes, 'LAX' | 'SFO' | 'ORD' | 'JFK' | 'ATL' | 'DFW' | 'MIA' | 'SEA' | 'BOS' | 'PDX'>;
export type KeyZones = keyof Zones;
export type TransactionAttributes = {
    id: number;
    packageId: number;
    userId: number;
    dateAdded: Date;
    event: string;
    cost: number;
    tracking: string;
};
export type ZipCodeAttributes = {
    zip: string;
    lat: number;
    lng: number;
    city: string;
    state_id: string;
    state: string;
    zcta: string;
    parent_zcta: string;
    county_fips: string;
    county: string;
    timezone: string;
};
export type SortCodeAttributes = {
    id: number;
    proposal: string;
    zip: string;
    sortCode: string;
    createdAt: Date;
    updatedAt: Date;
};
