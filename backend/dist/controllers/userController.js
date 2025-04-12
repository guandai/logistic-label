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
exports.deleteUserById = exports.getUserById = exports.getUsers = exports.updateUserById = exports.loginUser = exports.registerUser = void 0;
const User_1 = require("../models/User");
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const Address_1 = require("../models/Address");
const shared_1 = require("@ddlabel/shared");
const errors_1 = require("../utils/errors");
const Transaction_1 = require("../models/Transaction");
const Package_1 = require("../models/Package");
const packageControllerUtil_1 = require("./packageControllerUtil");
const errorClasses_1 = require("../utils/errorClasses");
const registerUser = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { name, email, password, role, warehouseAddress } = req.body;
    const hashedPassword = yield bcryptjs_1.default.hash(password, 10);
    try {
        const user = yield User_1.User.create({ name, email, password: hashedPassword, role });
        warehouseAddress.userId = user.id;
        yield Address_1.Address.createWithInfo(warehouseAddress);
        res.status(201).json({ success: true, userId: user.id });
    }
    catch (error) {
        (0, errors_1.resHeaderError)('registerUser', error, req.body, res, next);
    }
});
exports.registerUser = registerUser;
const loginUser = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, password } = req.body;
    try {
        const user = yield User_1.User.findOne({ where: { email } });
        if (!user) {
            throw new errorClasses_1.NotFoundError(`User not found - ${email}`);
        }
        if (!(yield bcryptjs_1.default.compare(password, user.password))) {
            throw new errorClasses_1.InvalidCredentialsError(`Invalid credentials - ${email}`);
        }
        const token = jsonwebtoken_1.default.sign({ userId: user.id }, process.env.JWT_SECRET, { expiresIn: '7d' });
        res.json({ token, userId: user.id, userRole: user.role });
    }
    catch (error) {
        (0, errors_1.resHeaderError)('loginUser', error, req.body, res, next);
    }
});
exports.loginUser = loginUser;
const updateUserById = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const user = req.body;
    try {
        if (user.password) {
            user.password = yield bcryptjs_1.default.hash(user.password, 10);
        }
        else {
            delete user.password;
        }
        yield Address_1.Address.updateWithInfo(user.warehouseAddress);
        const [affectedCount] = yield User_1.User.update(user, { where: { id: user.id } });
        const result = { success: affectedCount > 0 };
        res.json(result);
    }
    catch (error) {
        (0, errors_1.resHeaderError)('updateUserById', error, req.body, res, next);
    }
});
exports.updateUserById = updateUserById;
const getUsers = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const limit = parseInt(req.query.limit) || 100; // Default limit to 20 if not provided
    const offset = parseInt(req.query.offset) || 0; // 
    const where = (0, packageControllerUtil_1.getQueryWhere)(req);
    const whereAddress = (0, packageControllerUtil_1.getAddressesWhere)(req, shared_1.AddressEnum.user);
    try {
        const rows = yield User_1.User.findAndCountAll({
            where,
            attributes: ['id', 'name', 'email', 'role', 'createdAt'],
            limit,
            offset,
            include: [
                { model: Address_1.Address,
                    as: 'warehouseAddress',
                    attributes: ['id', 'name', 'address1', 'address2', 'zip', 'state', 'email', 'phone'],
                    where: Object.assign(Object.assign({}, whereAddress), { addressType: shared_1.AddressEnum.user }) },
            ],
        });
        const total = rows.count;
        const users = rows.rows;
        res.json({ users, total });
    }
    catch (error) {
        (0, errors_1.resHeaderError)('getUsers', error, req.query, res, next);
    }
});
exports.getUsers = getUsers;
const getUserById = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const user = yield User_1.User.findOne({
            attributes: ['id', 'name', 'email', 'role'],
            include: [
                { model: Address_1.Address,
                    as: 'warehouseAddress',
                    attributes: ['id', 'name', 'address1', 'address2', 'zip', 'state', 'email', 'phone'],
                    where: { addressType: shared_1.AddressEnum.user }
                },
            ],
            where: { id: req.params.id }
        });
        if (!user) {
            throw new errorClasses_1.NotFoundError(`User not found - ${req.params.id}`);
        }
        ;
        res.json({ user });
    }
    catch (error) {
        (0, errors_1.resHeaderError)('getUserById', error, req.params, res, next);
    }
});
exports.getUserById = getUserById;
const deleteUserById = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const user = yield User_1.User.findByPk(req.params.id);
        if (!user) {
            throw new errorClasses_1.NotFoundError(`User not found - ${req.params.id}`);
        }
        yield Address_1.Address.destroy({ where: { userId: user.id, addressType: shared_1.AddressEnum.user } });
        yield User_1.User.destroy({ where: { id: user.id } });
        yield Transaction_1.Transaction.destroy({ where: { userId: user.id } });
        yield Package_1.Package.destroy({ where: { userId: user.id } });
        res.json({ message: 'User deleted' });
    }
    catch (error) {
        (0, errors_1.resHeaderError)('deleteUserById', error, req.params, res, next);
    }
});
exports.deleteUserById = deleteUserById;
