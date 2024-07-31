import { HeaderMapping } from "./types";
export declare const CSV_KEYS_OPTIONAL: (keyof {
    trackingNo?: string | undefined;
    length?: number | undefined;
    width?: number | undefined;
    height?: number | undefined;
    fromAddress2?: string | undefined;
    toAddress2?: string | undefined;
} | keyof {
    weight: number;
    referenceNo: string;
    fromName: string;
    fromAddressZip: string;
    fromAddress1: string;
    toName: string;
    toAddressZip: string;
    toAddress1: string;
})[];
export declare const CSV_KEYS_REQUIRED: (keyof {
    trackingNo?: string | undefined;
    length?: number | undefined;
    width?: number | undefined;
    height?: number | undefined;
    fromAddress2?: string | undefined;
    toAddress2?: string | undefined;
} | keyof {
    weight: number;
    referenceNo: string;
    fromName: string;
    fromAddressZip: string;
    fromAddress1: string;
    toName: string;
    toAddressZip: string;
    toAddress1: string;
})[];
export declare const CSV_KEYS: (keyof {
    trackingNo?: string | undefined;
    length?: number | undefined;
    width?: number | undefined;
    height?: number | undefined;
    fromAddress2?: string | undefined;
    toAddress2?: string | undefined;
} | keyof {
    weight: number;
    referenceNo: string;
    fromName: string;
    fromAddressZip: string;
    fromAddress1: string;
    toName: string;
    toAddressZip: string;
    toAddress1: string;
})[];
export declare const defaultMapping: HeaderMapping;
