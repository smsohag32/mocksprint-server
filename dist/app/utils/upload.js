"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.upload = exports.createMulterUpload = void 0;
const multer_1 = __importDefault(require("multer"));
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
/**
 * Reusable upload functionality
 * Creates subfolders dynamically within the root uploads directory
 */
const createMulterUpload = (subFolder = "") => {
    const uploadDir = path_1.default.resolve(process.cwd(), "uploads", subFolder);
    if (!fs_1.default.existsSync(uploadDir)) {
        fs_1.default.mkdirSync(uploadDir, { recursive: true });
    }
    const storage = multer_1.default.diskStorage({
        destination: (req, file, cb) => {
            cb(null, uploadDir);
        },
        filename: (req, file, cb) => {
            const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
            const ext = path_1.default.extname(file.originalname);
            cb(null, `${file.fieldname}-${uniqueSuffix}${ext}`);
        },
    });
    return (0, multer_1.default)({
        storage,
        limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
        fileFilter: (req, file, cb) => {
            const filetypes = /jpeg|jpg|png|webp/;
            const mimetype = filetypes.test(file.mimetype);
            const extname = filetypes.test(path_1.default.extname(file.originalname).toLowerCase());
            if (mimetype && extname) {
                return cb(null, true);
            }
            cb(new Error("Error: File upload only supports images (jpeg, jpg, png, webp)"));
        },
    });
};
exports.createMulterUpload = createMulterUpload;
// Default upload instance
exports.upload = (0, exports.createMulterUpload)("");
