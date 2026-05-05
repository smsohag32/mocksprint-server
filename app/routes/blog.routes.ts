import { Router } from "express";
import BlogController from "../controllers/blog.controller";
import { authMiddleware, adminMiddleware } from "../middleware/authMiddleware";
import { blogUpload } from "../middleware/blogUpload.middleware";

const router = Router();

// ── Public Routes ──────────────────────────────────────────
router.get("/", BlogController.getBlogs);
router.get("/admin/all", authMiddleware, adminMiddleware, BlogController.getAdminBlogs);

// ── Admin Routes (require auth + admin) ───────────────────
router.post(
   "/",
   authMiddleware,
   adminMiddleware,
   blogUpload.single("coverImage"),
   BlogController.createBlog
);

router.put(
   "/:id",
   authMiddleware,
   adminMiddleware,
   blogUpload.single("coverImage"),
   BlogController.updateBlog
);

router.delete("/:id", authMiddleware, adminMiddleware, BlogController.deleteBlog);

// ── Must be LAST — dynamic :slug route ────────────────────
router.get("/:slug", BlogController.getBlogBySlug);

export default router;
