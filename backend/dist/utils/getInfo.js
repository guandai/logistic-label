"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getToAddressZip = exports.getFromAddressZip = exports.getPortInfo = exports.getZipInfo = exports.fixPort = exports.fixCityState = void 0;
const shared_1 = require("@ddlabel/shared");
const stateSmall_json_1 = __importDefault(require("../data/stateSmall.json"));
const portSmall_json_1 = __importDefault(require("../data/portSmall.json"));
const stateData = stateSmall_json_1.default;
const portData = portSmall_json_1.default;
const fixCityState = (attr) => {
    if (attr.city && attr.state) {
        return attr;
    }
    const info = (0, exports.getZipInfo)(attr.zip)
        || (0, exports.getZipInfo)((0, shared_1.extractAddressZip)(attr.address2))
        || (0, exports.getZipInfo)((0, shared_1.extractAddressZip)(attr.address1));
    if (!info) {
        throw new Error(`ZipInfo not found for ${attr.zip}`);
    }
    return Object.assign(Object.assign({}, attr), { city: info.city, state: info.state });
};
exports.fixCityState = fixCityState;
const fixPort = (attr) => {
    if (attr.proposal) {
        return attr;
    }
    const info = (0, exports.getPortInfo)(attr.zip);
    if (!info) {
        throw new Error(`Port not found for ${attr.zip}`);
    }
    return Object.assign(Object.assign({}, attr), { proposal: info.proposal, sortCode: info.sortCode });
};
exports.fixPort = fixPort;
const getInfo = (zip, data) => {
    if (!zip || !data || !data.length) {
        return;
    }
    return data.find(x => x.zip === zip);
};
const getZipInfo = (zip) => getInfo(zip, stateData);
exports.getZipInfo = getZipInfo;
const getPortInfo = (zip) => getInfo(zip, portData);
exports.getPortInfo = getPortInfo;
const getFromAddressZip = (mappedData) => mappedData['fromAddressZip'] && mappedData['fromAddressZip']
    || mappedData['fromAddress2'] && (0, shared_1.extractAddressZip)(mappedData['fromAddress2'])
    || (0, shared_1.extractAddressZip)(mappedData['fromAddress1'])
    || '';
exports.getFromAddressZip = getFromAddressZip;
const getToAddressZip = (mappedData) => mappedData['toAddressZip'] && mappedData['toAddressZip']
    || mappedData['toAddress2'] && (0, shared_1.extractAddressZip)(mappedData['toAddress2'])
    || (0, shared_1.extractAddressZip)(mappedData['toAddress1'])
    || '';
exports.getToAddressZip = getToAddressZip;
exports.default = exports.getZipInfo;
