import { Router } from "express";
import DashboardController from "../controllers/dashboard.controller";
import { authMiddleware, adminMiddleware } from "../middleware/authMiddleware";

const router = Router();

/**
 * Dashboard Statistics Routes
 */

// User stats
router.get("/user", authMiddleware, DashboardController.getUserStats);

// Admin stats
router.get("/admin", authMiddleware, adminMiddleware, DashboardController.getAdminStats);

export default router;
