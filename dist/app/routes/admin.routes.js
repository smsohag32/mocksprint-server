"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const admin_controller_1 = __importDefault(require("../controllers/admin.controller"));
const questionCategory_controller_1 = __importDefault(require("../controllers/questionCategory.controller"));
const authMiddleware_1 = require("../middleware/authMiddleware");
const router = (0, express_1.Router)();
/**
 * Admin User Management Routes
 * All routes require authentication and admin-level permissions.
 */
// Get paginated users with search/filter
router.get("/users", authMiddleware_1.authMiddleware, authMiddleware_1.adminMiddleware, admin_controller_1.default.getUsers);
// Get specific user details
router.get("/users/:id", authMiddleware_1.authMiddleware, authMiddleware_1.adminMiddleware, admin_controller_1.default.getUserDetails);
// Update user profile/role
router.put("/users/:id", authMiddleware_1.authMiddleware, authMiddleware_1.adminMiddleware, admin_controller_1.default.updateUser);
// Toggle user status (active/inactive)
router.patch("/users/:id/status", authMiddleware_1.authMiddleware, authMiddleware_1.adminMiddleware, admin_controller_1.default.toggleStatus);
// Delete user account
router.delete("/users/:id", authMiddleware_1.authMiddleware, authMiddleware_1.adminMiddleware, admin_controller_1.default.deleteUser);
/**
 * Admin Interview Management Routes
 */
// Get all interviews
router.get("/interviews", authMiddleware_1.authMiddleware, authMiddleware_1.adminMiddleware, admin_controller_1.default.getInterviews);
/**
 * Question Category Management Routes
 */
// Get all categories
router.get("/categories", authMiddleware_1.authMiddleware, authMiddleware_1.adminMiddleware, questionCategory_controller_1.default.getCategories);
// Create new category
router.post("/categories", authMiddleware_1.authMiddleware, authMiddleware_1.adminMiddleware, questionCategory_controller_1.default.createCategory);
// Update category
router.put("/categories/:id", authMiddleware_1.authMiddleware, authMiddleware_1.adminMiddleware, questionCategory_controller_1.default.updateCategory);
// Delete category
router.delete("/categories/:id", authMiddleware_1.authMiddleware, authMiddleware_1.adminMiddleware, questionCategory_controller_1.default.deleteCategory);
exports.default = router;
