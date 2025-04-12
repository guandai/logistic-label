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
exports.getFullRate = exports.getShippingRates = exports.getShippingRatesForWeight = exports.fullShippingRate = void 0;
const ShippingRate_1 = require("../models/ShippingRate");
const sequelize_1 = require("sequelize");
const errors_1 = require("../utils/errors");
const errorClasses_1 = require("../utils/errorClasses");
// Function to calculate shipping rate
const fullShippingRate = (prop) => __awaiter(void 0, void 0, void 0, function* () {
    let { weight, weightUnit, length, width, height, volumeUnit, zone } = prop;
    if (width > 108 || height > 108 || length > 108) {
        return 1000;
    }
    if (weight <= 1) {
        weight /= 16; // Convert pounds to ounces
        weightUnit = "oz"; // Change unit to ounces
    }
    const volumetricWeight = volumeUnit === "inch"
        ? (length * width * height) / 250 // inch
        : (length * width * height) / 9000; // mm
    weight = Math.ceil(Math.max(volumetricWeight, weight));
    const shippingRates = yield (0, exports.getShippingRatesForWeight)(weight, weightUnit);
    if (!shippingRates) {
        return 'NO_RATE';
    }
    const rate = Number(shippingRates[`zone${zone}`]); // Convert rate to a number
    const pickupCharge = Math.max(125, 0.065 * weight);
    const fuelSurcharge = 0.10 * rate; // Use the converted rate
    const totalCost = rate + pickupCharge + fuelSurcharge;
    return totalCost;
});
exports.fullShippingRate = fullShippingRate;
// Function to get shipping rates for a specific weight and zone
const getShippingRatesForWeight = (weight, unit) => __awaiter(void 0, void 0, void 0, function* () {
    if (weight > 150) {
        return {
            weightRange: '150<n=999999',
            unit: 'lbs',
            zone1: 1000,
            zone2: 1000,
            zone3: 1000,
            zone4: 1000,
            zone5: 1000,
            zone6: 1000,
            zone7: 1000,
            zone8: 1000,
        };
    }
    const data = yield ShippingRate_1.ShippingRate.findOne({
        where: {
            unit,
            weightRange: { [sequelize_1.Op.eq]: `${weight - 1}<n<=${weight}` }
        }
    });
    return data;
});
exports.getShippingRatesForWeight = getShippingRatesForWeight;
const getShippingRates = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const rates = yield ShippingRate_1.ShippingRate.findAll();
        res.json(rates);
    }
    catch (error) {
        (0, errors_1.resHeaderError)('getShippingRates', error, req.params, res, next);
    }
});
exports.getShippingRates = getShippingRates;
const getFullRate = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    let { length, width, height, weight, zone, weightUnit, volumeUnit } = req.query;
    if (!length || !width || !height || !weight || !zone || !weightUnit || !volumeUnit) {
        throw new errorClasses_1.InvalidInputError('getFullRate: All parameters are required');
    }
    try {
        const param = {
            length: Math.ceil(parseFloat(length)),
            width: Math.ceil(parseFloat(width)),
            height: Math.ceil(parseFloat(height)),
            weight: Math.ceil(parseFloat(weight)),
            zone: parseInt(zone, 10),
            weightUnit: weightUnit,
            volumeUnit: volumeUnit,
        };
        const totalCost = yield (0, exports.fullShippingRate)(param);
        if (totalCost === 'NO_RATE') {
            throw new errorClasses_1.NotFoundError(`No shipping rate found for weight and zone ${weight} ${weightUnit}`);
        }
        ;
        res.json({ totalCost });
    }
    catch (error) {
        (0, errors_1.resHeaderError)('getFullRate', error, req.params, res, next);
    }
});
exports.getFullRate = getFullRate;
