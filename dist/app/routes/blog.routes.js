"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const blog_controller_1 = __importDefault(require("../controllers/blog.controller"));
const authMiddleware_1 = require("../middleware/authMiddleware");
const blogUpload_middleware_1 = require("../middleware/blogUpload.middleware");
const router = (0, express_1.Router)();
// ── Public Routes ──────────────────────────────────────────
router.get("/", blog_controller_1.default.getBlogs);
router.get("/admin/all", authMiddleware_1.authMiddleware, authMiddleware_1.adminMiddleware, blog_controller_1.default.getAdminBlogs);
// ── Admin Routes (require auth + admin) ───────────────────
router.post("/", authMiddleware_1.authMiddleware, authMiddleware_1.adminMiddleware, blogUpload_middleware_1.blogUpload.single("coverImage"), blog_controller_1.default.createBlog);
router.put("/:id", authMiddleware_1.authMiddleware, authMiddleware_1.adminMiddleware, blogUpload_middleware_1.blogUpload.single("coverImage"), blog_controller_1.default.updateBlog);
router.delete("/:id", authMiddleware_1.authMiddleware, authMiddleware_1.adminMiddleware, blog_controller_1.default.deleteBlog);
// ── Must be LAST — dynamic :slug route ────────────────────
router.get("/:slug", blog_controller_1.default.getBlogBySlug);
exports.default = router;
