import multer from "multer";
import path from "path";
import fs from "fs";

// Ensure uploads/blogs directory exists
const uploadDir = path.join(process.cwd(), "uploads", "blogs");
if (!fs.existsSync(uploadDir)) {
   fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
   destination: (_req, _file, cb) => {
      cb(null, uploadDir);
   },
   filename: (_req, file, cb) => {
      const ext = path.extname(file.originalname);
      const uniqueName = `blog-${Date.now()}-${Math.round(Math.random() * 1e6)}${ext}`;
      cb(null, uniqueName);
   },
});

const fileFilter = (_req: any, file: Express.Multer.File, cb: multer.FileFilterCallback) => {
   const allowed = ["image/jpeg", "image/jpg", "image/png", "image/webp", "image/gif"];
   if (allowed.includes(file.mimetype)) {
      cb(null, true);
   } else {
      cb(new Error("Only image files (jpg, png, webp, gif) are allowed."));
   }
};

export const blogUpload = multer({
   storage,
   fileFilter,
   limits: { fileSize: 5 * 1024 * 1024 }, // 5MB max
});
