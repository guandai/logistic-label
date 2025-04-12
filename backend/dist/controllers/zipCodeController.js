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
exports.getZipCodeFromFile = exports.getZipCode = void 0;
const ZipCode_1 = require("../models/ZipCode");
const getInfo_1 = __importDefault(require("../utils/getInfo"));
const errors_1 = require("../utils/errors");
const errorClasses_1 = require("../utils/errorClasses");
const getZipCode = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { zip } = req.params;
    try {
        const zipCode = yield ZipCode_1.ZipCode.findOne({ where: { zip } });
        if (!zipCode) {
            throw new errorClasses_1.NotFoundError(`Zip code not found - ${zip}`);
        }
        res.json(zipCode);
    }
    catch (error) {
        (0, errors_1.resHeaderError)('getZipCode', error, req.params, res, next);
    }
});
exports.getZipCode = getZipCode;
const getZipCodeFromFile = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const info = (0, getInfo_1.default)(req.params.zip);
        if (!info) {
            res.status(404).json({ message: 'Zip code not found' });
            return void 0;
        }
        res.json({ zip: req.params.zip, city: info.city, state: info.state });
    }
    catch (error) {
        res.status(500).json({ message: 'Internal server error', error: error.message });
    }
});
exports.getZipCodeFromFile = getZipCodeFromFile;
