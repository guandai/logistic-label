"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const userController_1 = require("../controllers/userController");
const auth_1 = require("../middleware/auth");
const router = (0, express_1.Router)();
router.get('/', auth_1.authenticate, userController_1.getUsers);
router.post('/register', userController_1.registerUser);
router.post('/login', userController_1.loginUser);
router.put('/:id', auth_1.authenticate, userController_1.updateUserById);
router.get('/:id', auth_1.authenticate, userController_1.getUserById);
router.delete('/:id', auth_1.authenticate, userController_1.deleteUserById);
exports.default = router;
