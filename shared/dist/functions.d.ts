import { PackageModel } from "./models";
export declare const extractAddressZip: (address?: string) => string;
export declare const getStateId: (state: string) => string;
export declare const cleanAddress: (pkg: PackageModel, dest: 'to' | 'from', addressString?: string) => string | undefined;
