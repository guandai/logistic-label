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
Object.defineProperty(exports, "__esModule", { value: true });
const SortCode_1 = require("../models/SortCode");
const errors_1 = require("../utils/errors");
const errorClasses_1 = require("../utils/errorClasses");
exports.getAllSortCodes = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const sortCodes = yield SortCode_1.SortCode.findAll();
        res.json(sortCodes);
    }
    catch (error) {
        (0, errors_1.resHeaderError)('getAllSortCodes', error, req.query, res, next);
    }
});
exports.createSortCode = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const newSortCode = yield SortCode_1.SortCode.create(req.body);
        return res.status(201).json(newSortCode);
    }
    catch (error) {
        (0, errors_1.resHeaderError)('createSortCode', error, req.body, res, next);
    }
});
exports.updateSortCode = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const updated = yield SortCode_1.SortCode.update(req.body, { where: { id: id } });
        if (!updated) {
            throw new errorClasses_1.NotFoundError(`Sort code not found - ${id}`);
        }
        const updatedSortCode = yield SortCode_1.SortCode.findByPk(id);
        res.json(updatedSortCode);
    }
    catch (error) {
        (0, errors_1.resHeaderError)('updateSortCode', error, req.params, res, next);
    }
});
exports.deleteSortCode = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        if (!(yield SortCode_1.SortCode.destroy({ where: { id: req.params } }))) {
            throw new errorClasses_1.NotFoundError('Sort code not found');
        }
        return res.status(200).send({ success: true });
    }
    catch (error) {
        (0, errors_1.resHeaderError)('deleteSortCode', error, req.params, res, next);
    }
});
