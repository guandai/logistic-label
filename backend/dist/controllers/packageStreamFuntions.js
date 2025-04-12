"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.onEnd = exports.onData = exports.onError = void 0;
// backend/src/controllers/packageBatchFuntions.ts
const shared_1 = require("@ddlabel/shared");
const logger_1 = __importDefault(require("../config/logger"));
const errors_1 = require("../utils/errors");
const generateTrackingNo_1 = require("../utils/generateTrackingNo");
const reportIo_1 = __importDefault(require("../utils/reportIo"));
const packageBatchFuntions_1 = require("./packageBatchFuntions");
const fs_1 = __importDefault(require("fs"));
const getErrorRes_1 = require("../utils/getErrorRes");
const BATCH_SIZE = 100;
const pkgGlobalPush = (req, pkgGlobal, prepared) => {
    const { user: { id: userId } } = req;
    const { mappedData, fromZipInfo, toZipInfo } = prepared;
    pkgGlobal.pkgArr.push({
        userId,
        length: mappedData['length'] || 0,
        width: mappedData['width'] || 0,
        height: mappedData['height'] || 0,
        weight: mappedData['weight'] || 0,
        trackingNo: mappedData['trackingNo'] || (0, generateTrackingNo_1.generateTrackingNo)(),
        referenceNo: mappedData['referenceNo'] || '',
        source: shared_1.PackageSource.api,
    });
    pkgGlobal.shipFromArr.push(Object.assign(Object.assign({}, fromZipInfo), { name: mappedData['fromAddressName'], userId, address1: mappedData['fromAddress1'], address2: mappedData['fromAddress2'], addressType: shared_1.AddressEnum.fromPackage }));
    pkgGlobal.shipToArr.push(Object.assign(Object.assign({}, toZipInfo), { name: mappedData['toAddressName'], userId, address1: mappedData['toAddress1'], address2: mappedData['toAddress2'], addressType: shared_1.AddressEnum.toPackage }));
    return;
};
const onError = (error, pkgGlobal) => {
    logger_1.default.error(`Error in importPackages onError: ${(0, getErrorRes_1.aggregateError)(error)}`);
    pkgGlobal.errorMap.push((0, getErrorRes_1.getErrorRes)({ fnName: 'importPackages', error }));
};
exports.onError = onError;
const onData = (_a) => __awaiter(void 0, [_a], void 0, function* ({ req, csvData, pkgGlobal }) {
    const { packageCsvMap, packageCsvLength } = req.body;
    pkgGlobal.processed++;
    const prepared = yield (0, packageBatchFuntions_1.getPreparedData)(packageCsvMap, csvData);
    if ('csvUploadError' in prepared) {
        console.log(`prepared.csvUploadError.name`, prepared.csvUploadError.name);
        (0, errors_1.ternaryPutError)(prepared.csvUploadError.name, pkgGlobal, prepared.csvUploadError);
    }
    else {
        pkgGlobalPush(req, pkgGlobal, prepared);
    }
    (0, reportIo_1.default)({ eventName: 'generate', req, processed: pkgGlobal.processed + 1, total: packageCsvLength });
});
exports.onData = onData;
const TranslatedError = {
    trackingnoMustBeUnique: 'must has an unique trackingNo',
    missingToZip: 'missing receiver address zip',
    missingFromZip: 'missing sender address zip',
};
const formatErrorForFe = (key, count) => `${count} resource(s) ${TranslatedError[key]}`;
const finishProcessing = (params) => {
    const { res, pkgGlobal, file } = params;
    deleteUploadedFile(file);
    if (pkgGlobal.errorMap.length > 0 || Object.keys(pkgGlobal.errorHash).length > 0) {
        const messageMaps = pkgGlobal.errorMap.map(e => e.message).join(',\n ');
        const messagehash = Object.entries(pkgGlobal.errorHash).map(([key, count]) => formatErrorForFe(key, count)).join('\n ');
        return res.status(400).json({ errors: pkgGlobal.errorMap, message: `Importing Done with error: \n${messageMaps}${messagehash}` });
    }
    res.json({ message: `Importing Done!` });
    // resHeaderError('getUsers', error, req.query, res, next);
};
const onEnd = (params) => __awaiter(void 0, void 0, void 0, function* () {
    const { req, res, pkgGlobal, file } = params;
    const { pkgArr, shipFromArr, shipToArr } = pkgGlobal;
    const totalBatches = Math.ceil(pkgArr.length / BATCH_SIZE);
    for (let i = 0; i < totalBatches; i++) {
        const start = i * BATCH_SIZE;
        const end = start + BATCH_SIZE;
        const batchData = {
            processed: Math.min(end, pkgArr.length),
            errorMap: [],
            errorHash: {},
            pkgArr: pkgArr.slice(start, end),
            shipFromArr: shipFromArr.slice(start, end),
            shipToArr: shipToArr.slice(start, end),
        };
        try {
            yield (0, packageBatchFuntions_1.processBatch)(batchData);
        }
        catch (error) {
            const errorRes = (0, getErrorRes_1.getErrorRes)({ fnName: 'onEnd', error });
            logger_1.default.error(`Error in onEnd: ${errorRes.message}`);
            (0, errors_1.ternaryPutError)('trackingnoMustBeUnique', pkgGlobal, errorRes);
        }
        finally {
            (0, reportIo_1.default)({ eventName: 'insert', req, processed: batchData.processed, total: pkgArr.length });
        }
    }
    finishProcessing({ res, pkgGlobal, file });
});
exports.onEnd = onEnd;
const deleteUploadedFile = (file) => {
    fs_1.default.unlink(file.path, (unlinkError) => {
        if (unlinkError) {
            logger_1.default.error(`Failed to delete file after process: ${unlinkError}`);
        }
    });
};
