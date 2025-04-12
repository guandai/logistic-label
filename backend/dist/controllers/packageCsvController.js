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
exports.getCsvPackages = void 0;
const Address_1 = require("../models/Address");
const Package_1 = require("../models/Package");
const packageControllerUtil_1 = require("./packageControllerUtil");
const uuid_1 = require("uuid");
const json2csv_1 = require("json2csv"); // Import parse from json2csv
const errors_1 = require("../utils/errors");
const csvFieldsMapping = [
    { label: 'id', value: 'id' },
    { label: 'weight', value: 'weight' },
    { label: 'height', value: 'height' },
    { label: 'length', value: 'length' },
    { label: 'width', value: 'width' },
    { label: 'referenceNo', value: 'referenceNo' },
    { label: 'trackingNo', value: 'trackingNo' },
    { label: 'createdAt', value: 'createdAt' },
    { label: 'updatedAt', value: 'updatedAt' },
    { label: 'toAddressName', value: 'toAddress.name' },
    { label: 'toAddressPhone', value: 'toAddress.phone' },
    { label: 'toAddressEmail', value: 'toAddress.email' },
    { label: 'toAddress1', value: 'toAddress.address1' },
    { label: 'toAddress2', value: 'toAddress.address2' },
    { label: 'toAddressCity', value: 'toAddress.city' },
    { label: 'toAddressState', value: 'toAddress.state' },
    { label: 'toAddressZip', value: 'toAddress.zip' },
    { label: 'fromAddressName', value: 'fromAddress.name' },
    { label: 'fromAddressPhone', value: 'fromAddress.phone' },
    { label: 'fromAddressEmail', value: 'fromAddress.email' },
    { label: 'fromAddress1', value: 'fromAddress.address1' },
    { label: 'fromAddress2', value: 'fromAddress.address2' },
    { label: 'fromAddressCity', value: 'fromAddress.city' },
    { label: 'fromAddressState', value: 'fromAddress.state' },
    { label: 'fromAddressZip', value: 'fromAddress.zip' },
];
const getCsvPackages = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const relationQuery = (0, packageControllerUtil_1.getRelationQuery)(req);
    try {
        const packages = yield Package_1.Package.findAll(Object.assign(Object.assign({}, relationQuery), { attributes: { exclude: ['userId'] }, include: [
                {
                    model: Address_1.Address, as: 'fromAddress',
                    attributes: ['address1', 'address2', 'city', 'state', 'zip', 'name', 'phone', 'email'],
                },
                {
                    model: Address_1.Address, as: 'toAddress',
                    attributes: ['address1', 'address2', 'city', 'state', 'zip', 'name', 'phone', 'email'],
                },
            ] }));
        // Convert the data to JSON
        const packagesData = packages.map(pkg => pkg.toJSON());
        // Convert JSON to CSV
        const csv = (0, json2csv_1.parse)(packagesData, { fields: csvFieldsMapping });
        res.header('Content-Type', 'text/csv');
        res.header('Content-Disposition', `attachment; filename="packages_${(0, uuid_1.v4)()}.csv"`);
        res.send(csv);
    }
    catch (error) {
        (0, errors_1.resHeaderError)('getCsvPackages', error, req.query, res, next);
    }
});
exports.getCsvPackages = getCsvPackages;
