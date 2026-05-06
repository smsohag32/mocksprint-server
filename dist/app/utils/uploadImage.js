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
exports.deleteImageFromCloud = exports.uploadImageToCloud = void 0;
const cloudinary_1 = __importDefault(require("cloudinary"));
const fs_1 = __importDefault(require("fs"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
cloudinary_1.default.v2.config({
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.CLOUD_API_KEY,
    api_secret: process.env.CLOUD_API_SECRET,
});
const uploadImageToCloud = (files) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const uploadPromises = files.map((file) => cloudinary_1.default.v2.uploader.upload(file.path));
        const results = yield Promise.all(uploadPromises);
        files.forEach((file) => fs_1.default.unlinkSync(file.path));
        return results.map((result) => result.secure_url);
    }
    catch (error) {
        throw new Error("Image upload failed");
    }
});
exports.uploadImageToCloud = uploadImageToCloud;
const deleteImageFromCloud = (imageUrls) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const deletePromises = imageUrls.map((url) => {
            var _a;
            const publicId = (_a = url.split("/").pop()) === null || _a === void 0 ? void 0 : _a.split(".")[0];
            if (!publicId)
                return Promise.resolve();
            return cloudinary_1.default.v2.uploader.destroy(publicId);
        });
        yield Promise.all(deletePromises);
    }
    catch (error) {
        console.error("Failed to delete images from Cloudinary", error);
    }
});
exports.deleteImageFromCloud = deleteImageFromCloud;
