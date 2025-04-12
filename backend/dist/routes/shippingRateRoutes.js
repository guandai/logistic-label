"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// backend/src/routes/shippingRateRoutes.ts
const express_1 = require("express");
const shippingRateController_1 = require("../controllers/shippingRateController");
const auth_1 = require("../middleware/auth");
const router = (0, express_1.Router)();
// router.get('/', getShippingRates);
router.get('/full-rate', auth_1.authenticate, shippingRateController_1.getFullRate);
exports.default = router;
