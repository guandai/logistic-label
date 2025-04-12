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
exports.getTransactionById = exports.getTransactions = void 0;
// backend/src/controllers/transactionController.ts
const Transaction_1 = require("../models/Transaction");
const sequelize_1 = require("sequelize");
const Package_1 = require("../models/Package");
const User_1 = require("../models/User");
const errors_1 = require("../utils/errors");
const errorClasses_1 = require("../utils/errorClasses");
const getTransactions = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const limit = parseInt(req.query.limit) || 100; // Default limit to 20 if not provided
    const offset = parseInt(req.query.offset) || 0; // 
    const userId = req.user.id;
    const search = req.query.search; // 
    try {
        const total = (yield Transaction_1.Transaction.count({ where: { userId } })) || 0;
        const whereCondition = search
            ? {
                userId,
                trackingNo: {
                    [sequelize_1.Op.like]: `%${search}%`,
                },
            }
            : { userId };
        const transactions = yield Transaction_1.Transaction.findAll({
            include: [
                { model: Package_1.Package, as: 'package' },
                { model: User_1.User, as: 'user' },
            ],
            where: whereCondition,
            limit,
            offset,
        });
        res.json({ total, transactions });
    }
    catch (error) {
        (0, errors_1.resHeaderError)('getTransactions', error, req.query, res, next);
    }
});
exports.getTransactions = getTransactions;
const getTransactionById = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const transaction = yield Transaction_1.Transaction.findByPk(req.params.id, {
            include: [
                { model: Package_1.Package, as: 'package' },
                { model: User_1.User, as: 'user' },
            ],
        });
        if (!transaction) {
            throw new errorClasses_1.NotFoundError(`Transaction not found - ${req.params.id}`);
        }
        res.json({ transaction });
    }
    catch (error) {
        (0, errors_1.resHeaderError)('getTransactionById', error, req.params, res, next);
    }
});
exports.getTransactionById = getTransactionById;
