"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// backend/src/routes/zipCodeDataRoutes.ts
const express_1 = require("express");
const zipCodeController_1 = require("../controllers/zipCodeController");
const auth_1 = require("../middleware/auth");
const router = (0, express_1.Router)();
router.get('/datafile/:zip', auth_1.authenticate, zipCodeController_1.getZipCodeFromFile); // Get data for all zip codes
router.get('/:zip', auth_1.authenticate, zipCodeController_1.getZipCode); // Get data for a specific zip code
exports.default = router;
