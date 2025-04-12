import { HeaderMapping } from "./types";
export declare const CSV_KEYS_OPTIONAL: (keyof {
    referenceNo?: string | undefined;
    fromAddressZip?: string | undefined;
    toAddressZip?: string | undefined;
    trackingNo?: string | undefined;
    length?: number | undefined;
    width?: number | undefined;
    height?: number | undefined;
    fromAddress2?: string | undefined;
    toAddress2?: string | undefined;
} | keyof {
    weight: number;
    fromAddressName: string;
    fromAddress1: string;
    toAddressName: string;
    toAddress1: string;
})[];
export declare const CSV_KEYS_REQUIRED: (keyof {
    referenceNo?: string | undefined;
    fromAddressZip?: string | undefined;
    toAddressZip?: string | undefined;
    trackingNo?: string | undefined;
    length?: number | undefined;
    width?: number | undefined;
    height?: number | undefined;
    fromAddress2?: string | undefined;
    toAddress2?: string | undefined;
} | keyof {
    weight: number;
    fromAddressName: string;
    fromAddress1: string;
    toAddressName: string;
    toAddress1: string;
})[];
export declare const CSV_KEYS: (keyof {
    referenceNo?: string | undefined;
    fromAddressZip?: string | undefined;
    toAddressZip?: string | undefined;
    trackingNo?: string | undefined;
    length?: number | undefined;
    width?: number | undefined;
    height?: number | undefined;
    fromAddress2?: string | undefined;
    toAddress2?: string | undefined;
} | keyof {
    weight: number;
    fromAddressName: string;
    fromAddress1: string;
    toAddressName: string;
    toAddress1: string;
})[];
export declare const defaultMapping: HeaderMapping;
