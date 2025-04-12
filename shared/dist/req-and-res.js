"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isGetUserRes = exports.isGetUsersRes = exports.isGetTransactionRes = exports.isGetTransactionsRes = exports.isGetPackagesRes = exports.isGetPackageRes = exports.ModelEnum = void 0;
var ModelEnum;
(function (ModelEnum) {
    ModelEnum["user"] = "user";
    ModelEnum["package"] = "package";
    ModelEnum["transaction"] = "transaction";
    ModelEnum["address"] = "address";
})(ModelEnum = exports.ModelEnum || (exports.ModelEnum = {}));
;
var isGetPackageRes = function (res) {
    return res.package !== undefined;
};
exports.isGetPackageRes = isGetPackageRes;
var isGetPackagesRes = function (res) {
    return res.packages !== undefined;
};
exports.isGetPackagesRes = isGetPackagesRes;
var isGetTransactionsRes = function (res) {
    return res.transactions !== undefined;
};
exports.isGetTransactionsRes = isGetTransactionsRes;
var isGetTransactionRes = function (res) {
    return res.transaction !== undefined;
};
exports.isGetTransactionRes = isGetTransactionRes;
var isGetUsersRes = function (res) {
    return res.users !== undefined;
};
exports.isGetUsersRes = isGetUsersRes;
var isGetUserRes = function (res) {
    return res.user !== undefined;
};
exports.isGetUserRes = isGetUserRes;
