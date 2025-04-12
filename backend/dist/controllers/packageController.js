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
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getPackage = exports.deletePackage = exports.updatePackage = exports.getPackages = exports.createPackage = void 0;
// backend/src/controllers/packageController.ts
const Package_1 = require("../models/Package");
const Address_1 = require("../models/Address");
const User_1 = require("../models/User");
const logger_1 = __importDefault(require("../config/logger"));
const shared_1 = require("@ddlabel/shared");
const generateTrackingNo_1 = require("../utils/generateTrackingNo");
const packageControllerUtil_1 = require("./packageControllerUtil");
const errors_1 = require("../utils/errors");
const errorClasses_1 = require("../utils/errorClasses");
const createPackage = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    if (!req.user) {
        throw new errorClasses_1.NotFoundError('User not found');
    }
    const { fromAddress, toAddress, length, width, height, weight, referenceNo, trackingNo } = req.body;
    const userId = req.user.id;
    try {
        const pkg = yield Package_1.Package.create({
            userId,
            length: length || 0,
            width: width || 0,
            height: height || 0,
            weight,
            trackingNo: trackingNo || (0, generateTrackingNo_1.generateTrackingNo)(),
            referenceNo,
            source: shared_1.PackageSource.manual,
        });
        toAddress.toPackageId = fromAddress.fromPackageId = pkg.id;
        toAddress.fromPackageId = fromAddress.toPackageId = undefined;
        toAddress.userId = fromAddress.userId = userId;
        toAddress.addressType = shared_1.AddressEnum.toPackage;
        fromAddress.addressType = shared_1.AddressEnum.fromPackage;
        const a = yield Address_1.Address.createWithInfo(fromAddress);
        yield Address_1.Address.createWithInfo(toAddress);
        res.status(201).json({ success: true, packageId: pkg.id });
        return void 0;
    }
    catch (error) {
        (0, errors_1.resHeaderError)('createPackage', error, Object.assign(Object.assign({}, req.body), { user: req.user }), res, next);
    }
});
exports.createPackage = createPackage;
const getPackages = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const limit = parseInt(req.query.limit) || 100; // Default limit to 20 if not provided
    const offset = parseInt(req.query.offset) || 0; // 
    const relationQuery = (0, packageControllerUtil_1.getRelationQuery)(req);
    try {
        const rows = yield Package_1.Package.findAndCountAll(Object.assign(Object.assign({}, relationQuery), { limit,
            offset }));
        res.json({ total: rows.count, packages: rows.rows });
    }
    catch (error) {
        logger_1.default.error(`Error in getPackages: ${error}`);
        (0, errors_1.resHeaderError)('getPackages', error, req.query, res, next);
    }
});
exports.getPackages = getPackages;
const updatePackage = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const _a = req.body, { fromAddress, toAddress } = _a, rest = __rest(_a, ["fromAddress", "toAddress"]);
    try {
        const pkg = yield Package_1.Package.findByPk(req.params.id);
        if (!pkg) {
            throw new errorClasses_1.NotFoundError('Package not found');
        }
        yield Address_1.Address.updateWithInfo(fromAddress);
        yield Address_1.Address.updateWithInfo(toAddress);
        yield pkg.update(rest);
        res.json(pkg);
    }
    catch (error) {
        (0, errors_1.resHeaderError)('updatePackage', error, req.body, res, next);
    }
});
exports.updatePackage = updatePackage;
const deletePackage = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const pkg = yield Package_1.Package.findByPk(req.params.id);
        if (!pkg) {
            throw new errorClasses_1.NotFoundError('Package not found');
        }
        yield Address_1.Address.destroy({ where: { fromPackageId: pkg.id, addressType: shared_1.AddressEnum.fromPackage } });
        yield Address_1.Address.destroy({ where: { toPackageId: pkg.id, addressType: shared_1.AddressEnum.toPackage } });
        yield Package_1.Package.destroy({ where: { id: pkg.id } });
        res.json({ message: 'Package deleted' });
    }
    catch (error) {
        (0, errors_1.resHeaderError)('deletePackage', error, req.params, res, next);
    }
});
exports.deletePackage = deletePackage;
const getPackage = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    try {
        const pkg = yield Package_1.Package.findOne({
            where: { id },
            include: [
                { model: Address_1.Address, as: 'fromAddress' },
                { model: Address_1.Address, as: 'toAddress' },
                { model: User_1.User, as: 'user' },
            ],
        });
        if (!pkg) {
            throw new errorClasses_1.NotFoundError(`Package not found - ${id}`);
        }
        res.json({ package: pkg });
    }
    catch (error) {
        (0, errors_1.resHeaderError)('getPackage', error, req.params, res, next);
    }
});
exports.getPackage = getPackage;
