"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PostalZone = void 0;
// backend/src/models/PostalZone.ts
const sequelize_1 = require("sequelize");
const database_1 = require("../config/database");
class PostalZone extends sequelize_1.Model {
}
exports.PostalZone = PostalZone;
PostalZone.init({
    zip: {
        type: sequelize_1.DataTypes.STRING(5),
        primaryKey: true,
    },
    new_sort_code: {
        type: sequelize_1.DataTypes.STRING(10),
        allowNull: false,
        defaultValue: '',
    },
    sort_code: {
        type: sequelize_1.DataTypes.STRING(10),
        allowNull: false,
    },
    state: {
        type: sequelize_1.DataTypes.STRING(2),
        allowNull: false,
    },
    city: {
        type: sequelize_1.DataTypes.STRING(50),
        allowNull: false,
    },
    remote_code: {
        type: sequelize_1.DataTypes.STRING(10),
        allowNull: false,
    },
    code: {
        type: sequelize_1.DataTypes.STRING(10),
        allowNull: false,
    },
    proposal: {
        type: sequelize_1.DataTypes.STRING(20),
        allowNull: false,
    },
    start_zip: {
        type: sequelize_1.DataTypes.STRING(20),
        allowNull: true,
    },
    open_date: {
        type: sequelize_1.DataTypes.STRING(20),
        allowNull: false,
    },
    LAX: {
        type: sequelize_1.DataTypes.STRING(20),
        allowNull: true,
    },
    SFO: {
        type: sequelize_1.DataTypes.STRING(20),
        allowNull: true,
    },
    ORD: {
        type: sequelize_1.DataTypes.STRING(20),
        allowNull: true,
    },
    JFK: {
        type: sequelize_1.DataTypes.STRING(20),
        allowNull: true,
    },
    ATL: {
        type: sequelize_1.DataTypes.STRING(20),
        allowNull: true,
    },
    DFW: {
        type: sequelize_1.DataTypes.STRING(20),
        allowNull: true,
    },
    MIA: {
        type: sequelize_1.DataTypes.STRING(20),
        allowNull: true,
    },
    SEA: {
        type: sequelize_1.DataTypes.STRING(20),
        allowNull: true,
    },
    BOS: {
        type: sequelize_1.DataTypes.STRING(20),
        allowNull: true,
    },
    PDX: {
        type: sequelize_1.DataTypes.STRING(20),
        allowNull: true,
    },
}, {
    sequelize: database_1.sequelize,
    tableName: 'postal_zones',
});
