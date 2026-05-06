"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const auth_controller_1 = __importDefault(require("../controllers/auth.controller"));
const profile_controller_1 = __importDefault(require("../controllers/profile.controller"));
const authMiddleware_1 = require("../middleware/authMiddleware");
const upload_1 = require("../utils/upload");
const authRoute = express_1.default.Router();
const upload = (0, upload_1.createMulterUpload)("profiles");
/* ─── Public Routes ──────────────────────────────────── */
// Registration & login
authRoute.post("/auth/sign-up", auth_controller_1.default.signUp);
authRoute.post("/auth/sign-in", auth_controller_1.default.signIn);
// Email verification (link from email)
authRoute.get("/auth/verify-email", auth_controller_1.default.verifyEmail);
// Token refresh
authRoute.post("/auth/refresh", auth_controller_1.default.refreshToken);
// OTP & password reset
authRoute.post("/auth/send-otp", auth_controller_1.default.sendOtp);
authRoute.post("/auth/reset-password", auth_controller_1.default.requestRestOtp);
authRoute.post("/auth/otp-verify", auth_controller_1.default.verifyOtpReq);
authRoute.post("/auth/new-password", auth_controller_1.default.setNewPassword);
/* ─── Protected Routes ───────────────────────────────── */
authRoute.post("/auth/logout", authMiddleware_1.authMiddleware, auth_controller_1.default.logout);
authRoute.get("/auth/me", authMiddleware_1.authMiddleware, auth_controller_1.default.getMe);
authRoute.put("/auth/profile", authMiddleware_1.authMiddleware, upload.single("profile_image"), profile_controller_1.default.updateProfile);
exports.default = authRoute;
