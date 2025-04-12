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
exports.loadCsvData = exports.loadData = void 0;
const fs_1 = __importDefault(require("fs"));
const csv_parser_1 = __importDefault(require("csv-parser"));
const path_1 = __importDefault(require("path"));
const loadData = (fileName) => __awaiter(void 0, void 0, void 0, function* () {
    return (0, exports.loadCsvData)(`../data/${fileName}`)
        .then((data) => data).catch((error) => {
        console.error(`Error loading ${fileName} data:`, error);
        return null;
    });
});
exports.loadData = loadData;
// Load CSV data
const loadCsvData = (filePath) => {
    const fullPath = path_1.default.resolve(__dirname, filePath);
    return new Promise((resolve, reject) => {
        const data = [];
        fs_1.default.createReadStream(fullPath)
            .pipe((0, csv_parser_1.default)())
            .on('data', (row) => {
            data.push(row);
        })
            .on('end', () => {
            resolve(data);
        })
            .on('error', (err) => {
            reject(err);
        });
    });
};
exports.loadCsvData = loadCsvData;
