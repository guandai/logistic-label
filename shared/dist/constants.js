"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.defaultMapping = exports.CSV_KEYS = exports.CSV_KEYS_REQUIRED = exports.CSV_KEYS_OPTIONAL = void 0;
var ADDRESS_FROM_KEYS = ['fromAddressName', 'fromAddress1'];
var ADDRESS_FROM_KEYS_OPTIONAL = ['fromAddress2', 'fromAddressZip'];
var ADDRESS_TO_KEYS = ['toAddressName', 'toAddress1'];
var ADDRESS_TO_KEYS_OPTIONAL = ['toAddress2', 'toAddressZip'];
var ROOT_KEYS = ['weight'];
var ROOT_KEYS_OPTIONAL = ['length', 'width', 'height', 'trackingNo', 'referenceNo'];
exports.CSV_KEYS_OPTIONAL = ROOT_KEYS_OPTIONAL.concat(ADDRESS_TO_KEYS_OPTIONAL, ADDRESS_FROM_KEYS_OPTIONAL);
exports.CSV_KEYS_REQUIRED = ROOT_KEYS.concat(ADDRESS_FROM_KEYS, ADDRESS_TO_KEYS);
exports.CSV_KEYS = exports.CSV_KEYS_REQUIRED.concat(exports.CSV_KEYS_OPTIONAL);
exports.defaultMapping = exports.CSV_KEYS.reduce(function (acc, key) {
    var _a;
    Object.assign(acc, (_a = {}, _a[key] = undefined, _a));
    return acc;
}, {});
