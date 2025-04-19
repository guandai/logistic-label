import { HeaderMapping, KeyCsvRecord } from "./types";

const ADDRESS_FROM_KEYS: KeyCsvRecord[] = ['fromAddressName', 'fromAddress1'];
const ADDRESS_FROM_KEYS_OPTIONAL: KeyCsvRecord[] = ['fromAddress2', 'fromAddressZip', 'fromAddressPhone'];

const ADDRESS_TO_KEYS: KeyCsvRecord[] = ['toAddressName', 'toAddress1'];
const ADDRESS_TO_KEYS_OPTIONAL: KeyCsvRecord[] = ['toAddress2', 'toAddressZip', 'toAddressPhone'];

const ROOT_KEYS: KeyCsvRecord[] = ['weight'];
const ROOT_KEYS_OPTIONAL: KeyCsvRecord[] = ['length', 'width', 'height', 'trackingNo', 'referenceNo'];

export const CSV_KEYS_OPTIONAL = ROOT_KEYS_OPTIONAL.concat(ADDRESS_TO_KEYS_OPTIONAL, ADDRESS_FROM_KEYS_OPTIONAL);
export const CSV_KEYS_REQUIRED = ROOT_KEYS.concat(ADDRESS_FROM_KEYS, ADDRESS_TO_KEYS);
export const CSV_KEYS = CSV_KEYS_REQUIRED.concat(CSV_KEYS_OPTIONAL);

export const defaultMapping = CSV_KEYS.reduce((acc, key: KeyCsvRecord): HeaderMapping => {
	Object.assign(acc, { [key]: undefined });
	return acc;
}, {} as HeaderMapping);
