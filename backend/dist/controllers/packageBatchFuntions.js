"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.processBatch = exports.getPreparedData = void 0;
// backend/src/controllers/packageBatchFuntions.ts
const Package_1 = require("../models/Package");
const Address_1 = require("../models/Address");
const getInfo_1 = __importStar(require("../utils/getInfo"));
const errors_1 = require("../utils/errors");
const shared_1 = require("@ddlabel/shared");
const getErrorRes_1 = require("../utils/getErrorRes");
const errorClasses_1 = require("../utils/errorClasses");
const getMappingData = (headers, headerMapping) => {
    return shared_1.CSV_KEYS.reduce((acc, csvKey) => {
        const csvFileHeader = headerMapping[csvKey];
        return Object.assign(acc, { [csvKey]: !!csvFileHeader ? headers[csvFileHeader] : null });
    }, {});
};
const getPreparedData = (packageCsvMap, csvData) => __awaiter(void 0, void 0, void 0, function* () {
    const headerMapping = (0, errors_1.isValidJSON)(packageCsvMap) ? JSON.parse(packageCsvMap) : shared_1.defaultMapping;
    const mappedData = getMappingData(csvData, headerMapping);
    const fromZipInfo = (0, getInfo_1.default)((0, getInfo_1.getFromAddressZip)(mappedData));
    const toZipInfo = (0, getInfo_1.default)((0, getInfo_1.getToAddressZip)(mappedData));
    if (!fromZipInfo) {
        const error = new errorClasses_1.InvalidInputError(`getPreparedData has no fromAddressZip`, 'missingFromZip');
        return { csvUploadError: (0, getErrorRes_1.getErrorRes)({ fnName: 'getPreparedData:missingFromZip', error, data: csvData, disableLog: true }) };
    }
    if (!toZipInfo) {
        const error = new errorClasses_1.InvalidInputError(`getPreparedData has no toAddressZip`, "missingToZip");
        return { csvUploadError: (0, getErrorRes_1.getErrorRes)({ fnName: 'getPreparedData:missingToZip', error, data: mappedData['toAddress1'], disableLog: true }) };
    }
    return { mappedData, fromZipInfo, toZipInfo };
});
exports.getPreparedData = getPreparedData;
const processBatch = (batchData) => __awaiter(void 0, void 0, void 0, function* () {
    const { pkgArr, shipFromArr, shipToArr } = batchData;
    try {
        const packages = yield Package_1.Package.bulkCreate(pkgArr);
        packages.map((pkg, idx) => {
            shipFromArr[idx].fromPackageId = pkg.id;
            shipToArr[idx].toPackageId = pkg.id;
        });
        yield Address_1.Address.bulkCreateWithInfo(shipFromArr);
        yield Address_1.Address.bulkCreateWithInfo(shipToArr);
    }
    catch (error) {
        throw error;
    }
});
exports.processBatch = processBatch;
