import { Router } from "express";
import AdminController from "../controllers/admin.controller";
import QuestionCategoryController from "../controllers/questionCategory.controller";
import { authMiddleware, adminMiddleware } from "../middleware/authMiddleware";

const router = Router();

/**
 * Admin User Management Routes
 * All routes require authentication and admin-level permissions.
 */

// Get paginated users with search/filter
router.get("/users", authMiddleware, adminMiddleware, AdminController.getUsers);

// Get specific user details
router.get("/users/:id", authMiddleware, adminMiddleware, AdminController.getUserDetails);

// Update user profile/role
router.put("/users/:id", authMiddleware, adminMiddleware, AdminController.updateUser);

// Toggle user status (active/inactive)
router.patch("/users/:id/status", authMiddleware, adminMiddleware, AdminController.toggleStatus);

// Delete user account
router.delete("/users/:id", authMiddleware, adminMiddleware, AdminController.deleteUser);

/**
 * Question Category Management Routes
 */

// Get all categories
router.get("/categories", authMiddleware, adminMiddleware, QuestionCategoryController.getCategories);

// Create new category
router.post("/categories", authMiddleware, adminMiddleware, QuestionCategoryController.createCategory);

// Update category
router.put("/categories/:id", authMiddleware, adminMiddleware, QuestionCategoryController.updateCategory);

// Delete category
router.delete("/categories/:id", authMiddleware, adminMiddleware, QuestionCategoryController.deleteCategory);

export default router;
