"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SortCode = void 0;
const sequelize_1 = require("sequelize");
const database_1 = require("../config/database"); // Import your database configuration
class SortCode extends sequelize_1.Model {
}
exports.SortCode = SortCode;
SortCode.init({
    id: {
        type: sequelize_1.DataTypes.INTEGER.UNSIGNED,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false
    },
    proposal: {
        type: sequelize_1.DataTypes.STRING(255),
        allowNull: false
    },
    zip: {
        type: sequelize_1.DataTypes.STRING(5),
        allowNull: false
    },
    sortCode: {
        type: sequelize_1.DataTypes.STRING(10),
        allowNull: false
    },
    createdAt: {
        type: sequelize_1.DataTypes.DATE,
        allowNull: false
    },
    updatedAt: {
        type: sequelize_1.DataTypes.DATE,
        allowNull: false
    }
}, {
    sequelize: database_1.sequelize,
    modelName: 'SortCode',
    tableName: 'sort_code'
});
module.exports = SortCode;
