"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// backend/src/routes/transactionRoutes.ts
const express_1 = require("express");
const transactionController_1 = require("../controllers/transactionController");
const auth_1 = require("../middleware/auth");
const router = (0, express_1.Router)();
router.get('/', auth_1.authenticate, transactionController_1.getTransactions);
router.get('/:id', auth_1.authenticate, transactionController_1.getTransactionById);
exports.default = router;
