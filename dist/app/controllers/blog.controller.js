"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.BlogController = void 0;
const blog_model_1 = require("../models/blog.model");
const user_model_1 = require("../models/user.model");
const sequelize_1 = require("sequelize");
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
/** Build a public URL for an uploaded file */
function getFileUrl(req, filename) {
    const protocol = req.protocol;
    const host = req.get("host");
    return `${protocol}://${host}/uploads/blogs/${filename}`;
}
/** Delete old cover image file if it's a local upload */
function deleteOldCoverImage(coverImage) {
    if (!coverImage)
        return;
    try {
        // Only delete local uploads, not external URLs
        if (!coverImage.startsWith("http://") && !coverImage.startsWith("https://")) {
            const filePath = path_1.default.join(process.cwd(), "uploads", "blogs", path_1.default.basename(coverImage));
            if (fs_1.default.existsSync(filePath))
                fs_1.default.unlinkSync(filePath);
        }
    }
    catch (_) { }
}
class BlogController {
    /**
     * GET /api/v1/blogs
     * Public: Get all published blogs
     */
    static getBlogs(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const page = Number(req.query.page) || 1;
                const limit = Number(req.query.limit) || 10;
                const offset = (page - 1) * limit;
                const { count, rows } = yield blog_model_1.Blog.findAndCountAll({
                    where: { status: "published" },
                    limit,
                    offset,
                    include: [{ model: user_model_1.User, as: "author", attributes: ["id", "name"] }],
                    order: [["createdAt", "DESC"]],
                });
                res.status(200).json({ success: true, blogs: rows, total: count });
            }
            catch (error) {
                res.status(500).json({ success: false, message: error.message });
            }
        });
    }
    /**
     * GET /api/v1/blogs/:slug
     * Public: Get a single published blog by slug
     */
    static getBlogBySlug(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { slug } = req.params;
                const blog = yield blog_model_1.Blog.findOne({
                    where: { slug, status: "published" },
                    include: [{ model: user_model_1.User, as: "author", attributes: ["id", "name"] }],
                });
                if (!blog) {
                    res.status(404).json({ success: false, message: "Blog not found" });
                    return;
                }
                res.status(200).json({ success: true, blog });
            }
            catch (error) {
                res.status(500).json({ success: false, message: error.message });
            }
        });
    }
    /**
     * GET /api/v1/blogs/admin/all
     * Admin: Get all blogs (drafts + published)
     */
    static getAdminBlogs(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const page = Number(req.query.page) || 1;
                const limit = Number(req.query.limit) || 10;
                const offset = (page - 1) * limit;
                const { count, rows } = yield blog_model_1.Blog.findAndCountAll({
                    limit,
                    offset,
                    include: [{ model: user_model_1.User, as: "author", attributes: ["id", "name"] }],
                    order: [["createdAt", "DESC"]],
                });
                res.status(200).json({ success: true, blogs: rows, total: count });
            }
            catch (error) {
                res.status(500).json({ success: false, message: error.message });
            }
        });
    }
    /**
     * POST /api/v1/blogs
     * Admin: Create a new blog (accepts multipart/form-data)
     */
    static createBlog(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            try {
                const { title, content, excerpt, status, tags } = req.body;
                const authorId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.user_id;
                if (!title || !content) {
                    res.status(400).json({ success: false, message: "Title and content are required." });
                    return;
                }
                // Resolve cover image — uploaded file takes priority
                let coverImage = null;
                if (req.file) {
                    coverImage = getFileUrl(req, req.file.filename);
                }
                else if (req.body.coverImage) {
                    coverImage = req.body.coverImage;
                }
                let slug = title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)+/g, "");
                const existing = yield blog_model_1.Blog.findOne({ where: { slug } });
                if (existing)
                    slug = `${slug}-${Date.now()}`;
                // Parse tags — may arrive as a JSON string or plain string
                let parsedTags = [];
                if (tags) {
                    try {
                        parsedTags = JSON.parse(tags);
                    }
                    catch (_b) {
                        parsedTags = tags.split(",").map((t) => t.trim()).filter(Boolean);
                    }
                }
                const blog = yield blog_model_1.Blog.create({
                    title,
                    slug,
                    content,
                    excerpt: excerpt || "",
                    authorId: authorId,
                    status: status || "draft",
                    tags: parsedTags,
                    coverImage,
                });
                res.status(201).json({ success: true, blog });
            }
            catch (error) {
                res.status(400).json({ success: false, message: error.message });
            }
        });
    }
    /**
     * PUT /api/v1/blogs/:id
     * Admin: Update an existing blog (accepts multipart/form-data)
     */
    static updateBlog(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { id } = req.params;
                const { title, content, excerpt, status, tags } = req.body;
                const blog = yield blog_model_1.Blog.findByPk(id);
                if (!blog) {
                    res.status(404).json({ success: false, message: "Blog not found" });
                    return;
                }
                // Resolve new cover image
                let coverImage = blog.coverImage;
                if (req.file) {
                    // Delete old file if it was a local upload
                    deleteOldCoverImage(blog.coverImage);
                    coverImage = getFileUrl(req, req.file.filename);
                }
                else if (req.body.coverImage !== undefined) {
                    coverImage = req.body.coverImage || null;
                }
                // Handle slug change
                let newSlug = blog.slug;
                if (title && title !== blog.title) {
                    newSlug = title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)+/g, "");
                    const existing = yield blog_model_1.Blog.findOne({ where: { slug: newSlug, id: { [sequelize_1.Op.ne]: id } } });
                    if (existing)
                        newSlug = `${newSlug}-${Date.now()}`;
                }
                // Parse tags
                let parsedTags = blog.tags;
                if (tags !== undefined) {
                    try {
                        parsedTags = JSON.parse(tags);
                    }
                    catch (_a) {
                        parsedTags = tags.split(",").map((t) => t.trim()).filter(Boolean);
                    }
                }
                yield blog.update({
                    title: title || blog.title,
                    slug: newSlug,
                    content: content || blog.content,
                    excerpt: excerpt !== undefined ? excerpt : blog.excerpt,
                    status: status || blog.status,
                    tags: parsedTags,
                    coverImage,
                });
                res.status(200).json({ success: true, blog });
            }
            catch (error) {
                res.status(400).json({ success: false, message: error.message });
            }
        });
    }
    /**
     * DELETE /api/v1/blogs/:id
     * Admin: Delete a blog (also removes uploaded cover image)
     */
    static deleteBlog(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { id } = req.params;
                const blog = yield blog_model_1.Blog.findByPk(id);
                if (!blog) {
                    res.status(404).json({ success: false, message: "Blog not found" });
                    return;
                }
                // Clean up uploaded file
                deleteOldCoverImage(blog.coverImage);
                yield blog.destroy();
                res.status(200).json({ success: true, message: "Blog deleted successfully" });
            }
            catch (error) {
                res.status(400).json({ success: false, message: error.message });
            }
        });
    }
}
exports.BlogController = BlogController;
exports.default = BlogController;
