"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AddressEnum = exports.PortEnum = exports.PackageSource = exports.UserRolesEnum = void 0;
var UserRolesEnum;
(function (UserRolesEnum) {
    UserRolesEnum["worker"] = "worker";
    UserRolesEnum["admin"] = "admin";
})(UserRolesEnum = exports.UserRolesEnum || (exports.UserRolesEnum = {}));
// Packages
var PackageSource;
(function (PackageSource) {
    PackageSource["manual"] = "manual";
    PackageSource["csv"] = "csv";
    PackageSource["api"] = "api";
})(PackageSource = exports.PackageSource || (exports.PackageSource = {}));
// Address
var PortEnum;
(function (PortEnum) {
    PortEnum["LAX"] = "LAX";
    PortEnum["JFK"] = "JFK";
    PortEnum["ORD"] = "ORD";
    PortEnum["SFO"] = "SFO";
    PortEnum["DFW"] = "DFW";
    PortEnum["MIA"] = "MIA";
    PortEnum["ATL"] = "ATL";
    PortEnum["BOS"] = "BOS";
    PortEnum["SEA"] = "SEA";
})(PortEnum = exports.PortEnum || (exports.PortEnum = {}));
var AddressEnum;
(function (AddressEnum) {
    AddressEnum["user"] = "user";
    AddressEnum["toPackage"] = "toPackage";
    AddressEnum["fromPackage"] = "fromPackage";
})(AddressEnum = exports.AddressEnum || (exports.AddressEnum = {}));
