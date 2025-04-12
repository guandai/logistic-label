"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ShippingRate = void 0;
// backend/src/models/ShippingRate.ts
const sequelize_1 = require("sequelize");
const database_1 = require("../config/database");
class ShippingRate extends sequelize_1.Model {
}
exports.ShippingRate = ShippingRate;
ShippingRate.init({
    weightRange: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false,
    },
    unit: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false,
    },
    zone1: {
        type: sequelize_1.DataTypes.DECIMAL(5, 2),
        allowNull: false,
    },
    zone2: {
        type: sequelize_1.DataTypes.DECIMAL(5, 2),
        allowNull: false,
    },
    zone3: {
        type: sequelize_1.DataTypes.DECIMAL(5, 2),
        allowNull: false,
    },
    zone4: {
        type: sequelize_1.DataTypes.DECIMAL(5, 2),
        allowNull: false,
    },
    zone5: {
        type: sequelize_1.DataTypes.DECIMAL(5, 2),
        allowNull: false,
    },
    zone6: {
        type: sequelize_1.DataTypes.DECIMAL(5, 2),
        allowNull: false,
    },
    zone7: {
        type: sequelize_1.DataTypes.DECIMAL(5, 2),
        allowNull: false,
    },
    zone8: {
        type: sequelize_1.DataTypes.DECIMAL(5, 2),
        allowNull: false,
    },
}, {
    sequelize: database_1.sequelize,
    tableName: 'shipping_rates',
});
