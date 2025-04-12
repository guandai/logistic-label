"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// backend/src/routes/packageRoutes.ts
const express_1 = require("express");
const packageController_1 = require("../controllers/packageController");
const auth_1 = require("../middleware/auth");
const packageUploadController_1 = require("../controllers/packageUploadController");
const packageCsvController_1 = require("../controllers/packageCsvController");
const router = (0, express_1.Router)();
router.get('/', auth_1.authenticate, packageController_1.getPackages);
router.get('/csv', auth_1.authenticate, packageCsvController_1.getCsvPackages);
router.get('/:id', auth_1.authenticate, packageController_1.getPackage);
router.post('/', auth_1.authenticate, packageController_1.createPackage);
router.post('/import', auth_1.authenticate, packageUploadController_1.uploadMiddleware, packageUploadController_1.importPackages);
router.put('/:id', auth_1.authenticate, packageController_1.updatePackage);
router.delete('/:id', auth_1.authenticate, packageController_1.deletePackage);
exports.default = router;
