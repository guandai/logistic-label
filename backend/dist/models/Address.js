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
exports.Address = void 0;
// backend/src/models/Address.ts
const sequelize_1 = require("sequelize");
const database_1 = require("../config/database");
const getInfo_1 = require("../utils/getInfo");
const User_1 = require("./User");
const Package_1 = require("./Package");
class Address extends sequelize_1.Model {
    static createWithInfo(attr) {
        return __awaiter(this, void 0, void 0, function* () {
            attr = yield (0, getInfo_1.fixCityState)(attr);
            attr = yield (0, getInfo_1.fixPort)(attr);
            return yield Address.create(attr);
        });
    }
    static updateWithInfo(attr) {
        return __awaiter(this, void 0, void 0, function* () {
            attr = yield (0, getInfo_1.fixCityState)(attr);
            attr = yield (0, getInfo_1.fixPort)(attr);
            yield Address.update(attr, { where: { id: attr.id } });
        });
    }
    static bulkCreateWithInfo(attrs) {
        return __awaiter(this, void 0, void 0, function* () {
            const fixedAttrs = yield Promise.all(attrs.map((attr) => __awaiter(this, void 0, void 0, function* () { return yield (0, getInfo_1.fixCityState)(attr); })));
            yield Address.bulkCreate(fixedAttrs);
        });
    }
}
exports.Address = Address;
Address.init({
    id: {
        type: sequelize_1.DataTypes.INTEGER.UNSIGNED,
        autoIncrement: true,
        primaryKey: true,
    },
    addressType: {
        type: sequelize_1.DataTypes.ENUM('user', 'package'),
        allowNull: false,
    },
    name: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false,
    },
    address1: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false,
    },
    address2: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: true,
    },
    city: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false,
    },
    state: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false,
    },
    zip: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false,
    },
    proposal: {
        type: sequelize_1.DataTypes.ENUM('LAX', 'JFK', 'ORD', 'SFO', 'DFW', 'MIA', 'ATL', 'BOS', 'SEA'),
        allowNull: true,
    },
    sortCode: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: true,
    },
    email: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: true,
    },
    phone: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: true,
    },
    userId: {
        type: sequelize_1.DataTypes.INTEGER.UNSIGNED,
        allowNull: false,
        references: {
            model: User_1.User,
            key: 'id',
        },
    },
    fromPackageId: {
        type: sequelize_1.DataTypes.INTEGER.UNSIGNED,
        allowNull: true,
        references: {
            model: Package_1.Package,
            key: 'id',
        },
    },
    toPackageId: {
        type: sequelize_1.DataTypes.INTEGER.UNSIGNED,
        allowNull: true,
        references: {
            model: Package_1.Package,
            key: 'id',
        },
    },
}, {
    sequelize: database_1.sequelize,
    tableName: 'addresses',
    timestamps: true,
});
