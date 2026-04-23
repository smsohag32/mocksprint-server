import multer, { StorageEngine } from "multer";
import { Request } from "express";
import fs from "fs";
import path from "path";

/**
 * Reusable upload functionality
 * Creates subfolders dynamically within the root uploads directory
 */
export const createMulterUpload = (subFolder: string = "") => {
   const uploadDir = path.resolve(process.cwd(), "uploads", subFolder);

   if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
   }

   const storage: StorageEngine = multer.diskStorage({
      destination: (req: Request, file: Express.Multer.File, cb: any) => {
         cb(null, uploadDir);
      },
      filename: (req: Request, file: Express.Multer.File, cb: any) => {
         const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
         const ext = path.extname(file.originalname);
         cb(null, `${file.fieldname}-${uniqueSuffix}${ext}`);
      },
   });

   return multer({
      storage,
      limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
      fileFilter: (req: Request, file: Express.Multer.File, cb: any) => {
         const filetypes = /jpeg|jpg|png|webp/;
         const mimetype = filetypes.test(file.mimetype);
         const extname = filetypes.test(path.extname(file.originalname).toLowerCase());

         if (mimetype && extname) {
            return cb(null, true);
         }
         cb(new Error("Error: File upload only supports images (jpeg, jpg, png, webp)"));
      },
   });
};

// Default upload instance
export const upload = createMulterUpload("");
