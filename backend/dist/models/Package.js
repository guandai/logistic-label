"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Package = void 0;
const sequelize_1 = require("sequelize");
const database_1 = require("../config/database");
const User_1 = require("./User");
class Package extends sequelize_1.Model {
}
exports.Package = Package;
Package.init({
    id: {
        type: sequelize_1.DataTypes.INTEGER.UNSIGNED,
        autoIncrement: true,
        primaryKey: true,
    },
    userId: {
        type: sequelize_1.DataTypes.INTEGER.UNSIGNED,
        allowNull: false,
        references: {
            model: User_1.User,
            key: 'id',
        },
    },
    length: {
        type: sequelize_1.DataTypes.DECIMAL(10, 2),
        allowNull: false,
    },
    width: {
        type: sequelize_1.DataTypes.DECIMAL(10, 2),
        allowNull: false,
    },
    height: {
        type: sequelize_1.DataTypes.DECIMAL(10, 2),
        allowNull: false,
    },
    weight: {
        type: sequelize_1.DataTypes.DECIMAL(10, 2),
        allowNull: false,
    },
    trackingNo: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false,
        unique: true,
    },
    referenceNo: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false,
    },
    source: {
        type: sequelize_1.DataTypes.ENUM('manual', 'api'),
        allowNull: false,
    },
}, {
    sequelize: database_1.sequelize,
    tableName: 'packages',
});
