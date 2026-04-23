import express from "express";
import AuthController from "../controllers/auth.controller";
import ProfileController from "../controllers/profile.controller";
import { authMiddleware } from "../middleware/authMiddleware";
import { createMulterUpload } from "../utils/upload";

const authRoute = express.Router();
const upload = createMulterUpload("profiles");

/* ─── Public Routes ──────────────────────────────────── */
// Registration & login
authRoute.post("/auth/sign-up", AuthController.signUp);
authRoute.post("/auth/sign-in", AuthController.signIn);

// Email verification (link from email)
authRoute.get("/auth/verify-email", AuthController.verifyEmail);

// Token refresh
authRoute.post("/auth/refresh", AuthController.refreshToken);

// OTP & password reset
authRoute.post("/auth/send-otp", AuthController.sendOtp);
authRoute.post("/auth/reset-password", AuthController.requestRestOtp);
authRoute.post("/auth/otp-verify", AuthController.verifyOtpReq);
authRoute.post("/auth/new-password", AuthController.setNewPassword);

/* ─── Protected Routes ───────────────────────────────── */
authRoute.post("/auth/logout", authMiddleware, AuthController.logout);
authRoute.get("/auth/me", authMiddleware, AuthController.getMe);
authRoute.put("/auth/profile", authMiddleware, upload.single("profile_image"), ProfileController.updateProfile);

export default authRoute;
