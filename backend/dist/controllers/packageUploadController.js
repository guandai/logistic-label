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
exports.uploadMiddleware = exports.importPackages = void 0;
// backend/src/controllers/packageUpload.ts
const multer_1 = __importDefault(require("multer"));
const csv_parser_1 = __importDefault(require("csv-parser"));
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const packageStreamFuntions_1 = require("./packageStreamFuntions");
const errors_1 = require("../utils/errors");
const errorClasses_1 = require("../utils/errorClasses");
const importPackages = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { file } = req;
    try {
        if (!file) {
            throw new errorClasses_1.InvalidInputError('No file uploaded');
        }
        const pkgGlobal = {
            processed: 0,
            errorMap: [],
            errorHash: { missingToZip: 0, missingFromZip: 0, trackingnoMustBeUnique: 0 },
            pkgArr: [],
            shipFromArr: [],
            shipToArr: [],
        };
        const readableStream = fs_1.default.createReadStream(file.path);
        // const writableStream = fs.createWriteStream('output.txt');
        readableStream.pipe((0, csv_parser_1.default)())
            .on('data', (csvData) => (0, packageStreamFuntions_1.onData)({ req, csvData, pkgGlobal }))
            .on('end', () => __awaiter(void 0, void 0, void 0, function* () { return (0, packageStreamFuntions_1.onEnd)({ req, res, pkgGlobal, file }); }))
            .on('error', (error) => (0, packageStreamFuntions_1.onError)(error, pkgGlobal));
    }
    catch (error) {
        (0, errors_1.resHeaderError)('importPackages', error, req.file, res, next);
    }
});
exports.importPackages = importPackages;
const storage = multer_1.default.diskStorage({
    destination: function (req, file, cb) {
        cb(null, './uploads/');
    },
    filename: function (req, file, cb) {
        cb(null, `${file.fieldname}-${Date.now()}${path_1.default.extname(file.originalname)}`);
    }
});
const upload = (0, multer_1.default)({ storage });
exports.uploadMiddleware = upload.single('packageCsvFile');
