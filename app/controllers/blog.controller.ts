import { Request, Response } from "express";
import { Blog } from "../models/blog.model";
import { User } from "../models/user.model";
import { Op } from "sequelize";
import fs from "fs";
import path from "path";

/** Build a public URL for an uploaded file */
function getFileUrl(req: Request, filename: string): string {
   const protocol = req.protocol;
   const host = req.get("host");
   return `${protocol}://${host}/uploads/blogs/${filename}`;
}

/** Delete old cover image file if it's a local upload */
function deleteOldCoverImage(coverImage: string | null) {
   if (!coverImage) return;
   try {
      // Only delete local uploads, not external URLs
      if (!coverImage.startsWith("http://") && !coverImage.startsWith("https://")) {
         const filePath = path.join(process.cwd(), "uploads", "blogs", path.basename(coverImage));
         if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
      }
   } catch (_) {}
}

export class BlogController {
   /**
    * GET /api/v1/blogs
    * Public: Get all published blogs
    */
   public static async getBlogs(req: Request, res: Response): Promise<void> {
      try {
         const page = Number(req.query.page) || 1;
         const limit = Number(req.query.limit) || 10;
         const offset = (page - 1) * limit;

         const { count, rows } = await Blog.findAndCountAll({
            where: { status: "published" },
            limit,
            offset,
            include: [{ model: User, as: "author", attributes: ["id", "name"] }],
            order: [["createdAt", "DESC"]],
         });

         res.status(200).json({ success: true, blogs: rows, total: count });
      } catch (error: any) {
         res.status(500).json({ success: false, message: error.message });
      }
   }

   /**
    * GET /api/v1/blogs/:slug
    * Public: Get a single published blog by slug
    */
   public static async getBlogBySlug(req: Request, res: Response): Promise<void> {
      try {
         const { slug } = req.params;
         const blog = await Blog.findOne({
            where: { slug, status: "published" },
            include: [{ model: User, as: "author", attributes: ["id", "name"] }],
         });

         if (!blog) {
            res.status(404).json({ success: false, message: "Blog not found" });
            return;
         }

         res.status(200).json({ success: true, blog });
      } catch (error: any) {
         res.status(500).json({ success: false, message: error.message });
      }
   }

   /**
    * GET /api/v1/blogs/admin/all
    * Admin: Get all blogs (drafts + published)
    */
   public static async getAdminBlogs(req: Request, res: Response): Promise<void> {
      try {
         const page = Number(req.query.page) || 1;
         const limit = Number(req.query.limit) || 10;
         const offset = (page - 1) * limit;

         const { count, rows } = await Blog.findAndCountAll({
            limit,
            offset,
            include: [{ model: User, as: "author", attributes: ["id", "name"] }],
            order: [["createdAt", "DESC"]],
         });

         res.status(200).json({ success: true, blogs: rows, total: count });
      } catch (error: any) {
         res.status(500).json({ success: false, message: error.message });
      }
   }

   /**
    * POST /api/v1/blogs
    * Admin: Create a new blog (accepts multipart/form-data)
    */
   public static async createBlog(req: Request, res: Response): Promise<void> {
      try {
         const { title, content, excerpt, status, tags } = req.body;
         const authorId = req.user?.user_id;

         if (!title || !content) {
            res.status(400).json({ success: false, message: "Title and content are required." });
            return;
         }

         // Resolve cover image — uploaded file takes priority
         let coverImage: string | null = null;
         if (req.file) {
            coverImage = getFileUrl(req, req.file.filename);
         } else if (req.body.coverImage) {
            coverImage = req.body.coverImage;
         }

         let slug = title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)+/g, "");
         const existing = await Blog.findOne({ where: { slug } });
         if (existing) slug = `${slug}-${Date.now()}`;

         // Parse tags — may arrive as a JSON string or plain string
         let parsedTags: string[] = [];
         if (tags) {
            try {
               parsedTags = JSON.parse(tags);
            } catch {
               parsedTags = tags.split(",").map((t: string) => t.trim()).filter(Boolean);
            }
         }

         const blog = await Blog.create({
            title,
            slug,
            content,
            excerpt: excerpt || "",
            authorId: authorId as string,
            status: status || "draft",
            tags: parsedTags,
            coverImage,
         });

         res.status(201).json({ success: true, blog });
      } catch (error: any) {
         res.status(400).json({ success: false, message: error.message });
      }
   }

   /**
    * PUT /api/v1/blogs/:id
    * Admin: Update an existing blog (accepts multipart/form-data)
    */
   public static async updateBlog(req: Request, res: Response): Promise<void> {
      try {
         const { id } = req.params;
         const { title, content, excerpt, status, tags } = req.body;

         const blog = await Blog.findByPk(id);
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
         } else if (req.body.coverImage !== undefined) {
            coverImage = req.body.coverImage || null;
         }

         // Handle slug change
         let newSlug = blog.slug;
         if (title && title !== blog.title) {
            newSlug = title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)+/g, "");
            const existing = await Blog.findOne({ where: { slug: newSlug, id: { [Op.ne]: id } } });
            if (existing) newSlug = `${newSlug}-${Date.now()}`;
         }

         // Parse tags
         let parsedTags = blog.tags;
         if (tags !== undefined) {
            try {
               parsedTags = JSON.parse(tags);
            } catch {
               parsedTags = tags.split(",").map((t: string) => t.trim()).filter(Boolean);
            }
         }

         await blog.update({
            title: title || blog.title,
            slug: newSlug,
            content: content || blog.content,
            excerpt: excerpt !== undefined ? excerpt : blog.excerpt,
            status: status || blog.status,
            tags: parsedTags,
            coverImage,
         });

         res.status(200).json({ success: true, blog });
      } catch (error: any) {
         res.status(400).json({ success: false, message: error.message });
      }
   }

   /**
    * DELETE /api/v1/blogs/:id
    * Admin: Delete a blog (also removes uploaded cover image)
    */
   public static async deleteBlog(req: Request, res: Response): Promise<void> {
      try {
         const { id } = req.params;
         const blog = await Blog.findByPk(id);

         if (!blog) {
            res.status(404).json({ success: false, message: "Blog not found" });
            return;
         }

         // Clean up uploaded file
         deleteOldCoverImage(blog.coverImage);

         await blog.destroy();
         res.status(200).json({ success: true, message: "Blog deleted successfully" });
      } catch (error: any) {
         res.status(400).json({ success: false, message: error.message });
      }
   }
}

export default BlogController;
