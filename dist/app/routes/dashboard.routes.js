"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const dashboard_controller_1 = __importDefault(require("../controllers/dashboard.controller"));
const authMiddleware_1 = require("../middleware/authMiddleware");
const router = (0, express_1.Router)();
/**
 * Dashboard Statistics Routes
 */
// User stats
router.get("/user", authMiddleware_1.authMiddleware, dashboard_controller_1.default.getUserStats);
// Admin stats
router.get("/admin", authMiddleware_1.authMiddleware, authMiddleware_1.adminMiddleware, dashboard_controller_1.default.getAdminStats);
exports.default = router;
