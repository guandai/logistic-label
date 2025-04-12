"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.cleanAddress = exports.getStateId = exports.extractAddressZip = void 0;
var extractAddressZip = function (address) {
    var zip = address === null || address === void 0 ? void 0 : address.trim().match(/\b\d{5}\b/);
    return zip ? zip[0] : '';
};
exports.extractAddressZip = extractAddressZip;
var statesAbbreviations = {
    "alabama": "AL",
    "alaska": "AK",
    "arizona": "AZ",
    "arkansas": "AR",
    "california": "CA",
    "colorado": "CO",
    "connecticut": "CT",
    "delaware": "DE",
    "district of columbia": "DC",
    "florida": "FL",
    "georgia": "GA",
    "guam": "GU",
    "hawaii": "HI",
    "idaho": "ID",
    "illinois": "IL",
    "indiana": "IN",
    "iowa": "IA",
    "kansas": "KS",
    "kentucky": "KY",
    "louisiana": "LA",
    "maine": "ME",
    "maryland": "MD",
    "massachusetts": "MA",
    "michigan": "MI",
    "minnesota": "MN",
    "mississippi": "MS",
    "missouri": "MO",
    "montana": "MT",
    "nebraska": "NE",
    "nevada": "NV",
    "new hampshire": "NH",
    "new jersey": "NJ",
    "new mexico": "NM",
    "new york": "NY",
    "north carolina": "NC",
    "north dakota": "ND",
    "northern mariana islands": "MP",
    "ohio": "OH",
    "oklahoma": "OK",
    "oregon": "OR",
    "pennsylvania": "PA",
    "puerto rico": "PR",
    "rhode island": "RI",
    "south carolina": "SC",
    "south dakota": "SD",
    "tennessee": "TN",
    "texas": "TX",
    "trust territories": "TT",
    "utah": "UT",
    "vermont": "VT",
    "virginia": "VA",
    "virgin islands": "VI",
    "washington": "WA",
    "west virginia": "WV",
    "wisconsin": "WI",
    "wyoming": "WY"
};
var getStateId = function (state) {
    return statesAbbreviations[state.toLowerCase()];
};
exports.getStateId = getStateId;
var cleanAddress = function (pkg, dest, addressString) {
    var addressObj = dest === 'to' ? pkg.toAddress : pkg.fromAddress;
    if (!addressString) {
        return addressString;
    }
    ;
    [addressObj.city, addressObj.state, addressObj.zip, (0, exports.getStateId)(addressObj.state)]
        .forEach(function (str) {
        return addressString = addressString === null || addressString === void 0 ? void 0 : addressString.replace(new RegExp("\\b".concat(str, "\\b"), 'i'), '');
    });
    return addressString.trim().replace(/[,\s]+$/, '');
};
exports.cleanAddress = cleanAddress;
