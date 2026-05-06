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
exports.AuthController = void 0;
const auth_service_1 = __importDefault(require("../services/auth.service"));
/* ═══════════════════════════════════════════════════════
   AUTH CONTROLLER
════════════════════════════════════════════════════════ */
class AuthController {
    // ─── Register ──────────────────────────────────────
    static signUp(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const result = yield auth_service_1.default.signUp(req.body);
                res.status(201).json({
                    success: true,
                    message: result.message,
                    httpStatusCode: 201,
                    user: result.user,
                });
            }
            catch (error) {
                res.status(400).json({
                    success: false,
                    message: error.message || "Registration failed.",
                    httpStatusCode: 400,
                });
            }
        });
    }
    // ─── Login ─────────────────────────────────────────
    static signIn(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { email, password } = req.body;
            try {
                const { token, refresh_token, user } = yield auth_service_1.default.signIn(email, password);
                // Set refresh token as httpOnly cookie (7 days)
                res.cookie("refresh_token", refresh_token, {
                    httpOnly: true,
                    secure: process.env.NODE_ENV === "production",
                    sameSite: "lax",
                    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
                });
                res.status(200).json({
                    success: true,
                    message: "Logged in successfully.",
                    httpStatusCode: 200,
                    token,
                    refresh_token,
                    user,
                });
            }
            catch (error) {
                res.status(401).json({
                    success: false,
                    message: error.message || "Login failed.",
                    httpStatusCode: 401,
                });
            }
        });
    }
    // ─── Verify Email ───────────────────────────────────
    static verifyEmail(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { token } = req.query;
            if (!token || typeof token !== "string") {
                res.status(400).json({
                    success: false,
                    message: "Verification token is required.",
                    httpStatusCode: 400,
                });
                return;
            }
            try {
                const result = yield auth_service_1.default.verifyEmail(token);
                res.status(200).json({
                    success: true,
                    message: result.message,
                    httpStatusCode: 200,
                });
            }
            catch (error) {
                res.status(400).json({
                    success: false,
                    message: error.message || "Email verification failed.",
                    httpStatusCode: 400,
                });
            }
        });
    }
    // ─── Refresh Token ──────────────────────────────────
    static refreshToken(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a, _b;
            // Accept from body OR httpOnly cookie
            const refreshToken = ((_a = req.body) === null || _a === void 0 ? void 0 : _a.refresh_token) || ((_b = req.cookies) === null || _b === void 0 ? void 0 : _b.refresh_token);
            if (!refreshToken) {
                res.status(401).json({
                    success: false,
                    message: "Refresh token is required.",
                    httpStatusCode: 401,
                });
                return;
            }
            try {
                const { token } = yield auth_service_1.default.refreshToken(refreshToken);
                res.status(200).json({
                    success: true,
                    message: "Access token refreshed.",
                    httpStatusCode: 200,
                    token,
                });
            }
            catch (error) {
                res.status(401).json({
                    success: false,
                    message: error.message || "Token refresh failed.",
                    httpStatusCode: 401,
                });
            }
        });
    }
    // ─── Get Current User (Me) ──────────────────────────
    static getMe(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            try {
                const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.user_id;
                if (!userId) {
                    res.status(401).json({ success: false, message: "Unauthorized." });
                    return;
                }
                const user = yield auth_service_1.default.getMe(userId);
                res.status(200).json({
                    success: true,
                    httpStatusCode: 200,
                    user,
                });
            }
            catch (error) {
                res.status(404).json({
                    success: false,
                    message: error.message || "User not found.",
                    httpStatusCode: 404,
                });
            }
        });
    }
    // ─── Logout ────────────────────────────────────────
    static logout(_req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            // Clear the httpOnly refresh token cookie
            res.clearCookie("refresh_token", {
                httpOnly: true,
                secure: process.env.NODE_ENV === "production",
                sameSite: "lax",
            });
            res.status(200).json({
                success: true,
                message: "Logged out successfully.",
                httpStatusCode: 200,
            });
        });
    }
    // ─── Send OTP ──────────────────────────────────────
    static sendOtp(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { email } = req.body;
            try {
                const result = yield auth_service_1.default.sendOtp(email);
                res.status(200).json({ success: true, message: result.message, httpStatusCode: 200 });
            }
            catch (error) {
                res.status(400).json({ success: false, message: error.message || "Failed to send OTP.", httpStatusCode: 400 });
            }
        });
    }
    // ─── Request Password Reset OTP ─────────────────────
    static requestRestOtp(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { email } = req.body;
            try {
                const result = yield auth_service_1.default.requestPasswordReset(email);
                res.status(200).json({ success: true, message: result.message, httpStatusCode: 200 });
            }
            catch (error) {
                res.status(400).json({ success: false, message: error.message || "Failed to send OTP.", httpStatusCode: 400 });
            }
        });
    }
    // ─── Verify OTP ─────────────────────────────────────
    static verifyOtpReq(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { email, otp } = req.body;
            try {
                const result = yield auth_service_1.default.verifyResetOtp(email, otp);
                res.status(200).json({ success: true, message: result.message, httpStatusCode: 200 });
            }
            catch (error) {
                res.status(400).json({ success: false, message: error.message || "OTP verification failed.", httpStatusCode: 400 });
            }
        });
    }
    // ─── Set New Password ───────────────────────────────
    static setNewPassword(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { email, new_password } = req.body;
            try {
                const result = yield auth_service_1.default.resetPassword(email, new_password);
                res.status(200).json({ success: true, message: result.message, httpStatusCode: 200 });
            }
            catch (error) {
                res.status(400).json({ success: false, message: error.message || "Password reset failed.", httpStatusCode: 400 });
            }
        });
    }
}
exports.AuthController = AuthController;
exports.default = AuthController;
