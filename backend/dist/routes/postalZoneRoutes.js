"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// backend/src/routes/postalZoneRoutes.ts
const express_1 = require("express");
const postalZoneController_1 = require("../controllers/postalZoneController");
const auth_1 = require("../middleware/auth");
const router = (0, express_1.Router)();
router.get('/get_postal_zone', auth_1.authenticate, postalZoneController_1.getPostalZone);
router.get('/get_zone', auth_1.authenticate, postalZoneController_1.getZone);
exports.default = router;
