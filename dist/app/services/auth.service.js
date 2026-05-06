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
exports.AuthService = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const crypto_1 = __importDefault(require("crypto"));
const dotenv_1 = __importDefault(require("dotenv"));
const sequelize_1 = require("sequelize");
const user_model_1 = __importDefault(require("../models/user.model"));
const profile_model_1 = __importDefault(require("../models/profile.model"));
const emailSending_1 = require("../utils/emailSending");
dotenv_1.default.config();
/* ─── JWT Config ─────────────────────────────────────── */
const JWT_ACCESS_SECRET = process.env.JWT_ACCESS_SECRET;
const JWT_REFRESH_SECRET = process.env.JWT_REFRESH_SECRET;
if (!JWT_ACCESS_SECRET || !JWT_REFRESH_SECRET) {
    throw new Error("JWT secret environment variables are not defined.");
}
const generateAccessToken = (userId, email, role) => jsonwebtoken_1.default.sign({ user_id: userId, email, role }, JWT_ACCESS_SECRET, { expiresIn: "1h" });
const generateRefreshToken = (userId, email, role) => jsonwebtoken_1.default.sign({ user_id: userId, email, role }, JWT_REFRESH_SECRET, { expiresIn: "7d" });
/* ─── OTP Store (in-memory) ──────────────────────────── */
const OTP_EXPIRATION_MS = 10 * 60 * 1000; // 10 minutes
const otpStorage = {};
/* ═══════════════════════════════════════════════════════
   AUTH SERVICE
════════════════════════════════════════════════════════ */
class AuthService {
    // ─── Register ──────────────────────────────────────
    static signUp(data) {
        return __awaiter(this, void 0, void 0, function* () {
            const { name, email, password } = data;
            // Validate email format
            const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
            if (!emailRegex.test(email)) {
                throw new Error("Invalid email format.");
            }
            // Check duplicate email
            const existingUser = yield user_model_1.default.findOne({ where: { email } });
            if (existingUser) {
                throw new Error("An account with this email already exists.");
            }
            // Generate verification token (UUID) valid for 24 hours
            const verificationToken = crypto_1.default.randomUUID();
            const verificationExpires = new Date(Date.now() + 24 * 60 * 60 * 1000);
            // Create user (password hashed via beforeCreate hook)
            const newUser = yield user_model_1.default.create({
                name,
                email,
                password,
                email_verification_token: verificationToken,
                email_verification_expires: verificationExpires,
            });
            // Create blank profile
            yield profile_model_1.default.create({ userId: newUser.id });
            // Send verification email (non-blocking)
            (0, emailSending_1.sendVerificationEmail)(email, verificationToken).catch((err) => console.error("Verification email failed:", err.message));
            return {
                message: "Registration successful! Please check your email to verify your account.",
                user: {
                    id: newUser.id,
                    name: newUser.name,
                    email: newUser.email,
                    is_active: newUser.is_active,
                    is_verified: newUser.is_verified,
                },
            };
        });
    }
    // ─── Login ─────────────────────────────────────────
    static signIn(email, password) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a, _b;
            const user = yield user_model_1.default.findOne({ where: { email } });
            if (!user) {
                throw new Error("Invalid email or password.");
            }
            const isMatch = yield user.comparePassword(password);
            if (!isMatch) {
                throw new Error("Invalid email or password.");
            }
            if (!user.is_verified) {
                throw new Error("Your email is not verified. Please check your inbox and click the verification link.");
            }
            if (!user.is_active) {
                throw new Error("Your account has been deactivated. Please contact support.");
            }
            // Update last login
            yield user.update({ last_login: new Date() });
            // Fetch profile
            const profile = yield profile_model_1.default.findOne({ where: { userId: user.id } });
            // Generate tokens
            const token = generateAccessToken(user.id, user.email, user.role);
            const refresh_token = generateRefreshToken(user.id, user.email, user.role);
            return {
                token,
                refresh_token,
                user: {
                    id: user.id,
                    name: user.name,
                    email: user.email,
                    role: user.role,
                    is_active: user.is_active,
                    is_verified: user.is_verified,
                    phone: (_a = profile === null || profile === void 0 ? void 0 : profile.phone) !== null && _a !== void 0 ? _a : null,
                    profile_image: (_b = profile === null || profile === void 0 ? void 0 : profile.profile_image) !== null && _b !== void 0 ? _b : null,
                },
            };
        });
    }
    // ─── Verify Email ───────────────────────────────────
    static verifyEmail(token) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = yield user_model_1.default.findOne({
                where: {
                    email_verification_token: token,
                    email_verification_expires: { [sequelize_1.Op.gt]: new Date() },
                },
            });
            if (!user) {
                throw new Error("Verification link is invalid or has expired. Please register again.");
            }
            if (user.is_verified) {
                return { message: "Email is already verified. You can log in." };
            }
            yield user.update({
                is_verified: true,
                email_verification_token: null,
                email_verification_expires: null,
            });
            return { message: "Email verified successfully! You can now log in." };
        });
    }
    // ─── Refresh Token ──────────────────────────────────
    static refreshToken(refreshToken) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const decoded = jsonwebtoken_1.default.verify(refreshToken, JWT_REFRESH_SECRET);
                const user = yield user_model_1.default.findByPk(decoded.user_id);
                if (!user || !user.is_active) {
                    throw new Error("User not found or inactive.");
                }
                const newAccessToken = generateAccessToken(user.id, user.email, user.role);
                return { token: newAccessToken };
            }
            catch (_a) {
                throw new Error("Invalid or expired refresh token.");
            }
        });
    }
    // ─── Get Me (current user) ──────────────────────────
    static getMe(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k;
            const user = yield user_model_1.default.findByPk(userId, {
                attributes: { exclude: ["password", "email_verification_token", "email_verification_expires"] },
            });
            if (!user)
                throw new Error("User not found.");
            const profile = yield profile_model_1.default.findOne({ where: { userId } });
            return {
                id: user.id,
                name: user.name,
                email: user.email,
                role: user.role,
                is_active: user.is_active,
                is_verified: user.is_verified,
                last_login: user.last_login,
                phone: (_a = profile === null || profile === void 0 ? void 0 : profile.phone) !== null && _a !== void 0 ? _a : null,
                profile_image: (_b = profile === null || profile === void 0 ? void 0 : profile.profile_image) !== null && _b !== void 0 ? _b : null,
                first_name: (_c = profile === null || profile === void 0 ? void 0 : profile.first_name) !== null && _c !== void 0 ? _c : null,
                last_name: (_d = profile === null || profile === void 0 ? void 0 : profile.last_name) !== null && _d !== void 0 ? _d : null,
                address: (_e = profile === null || profile === void 0 ? void 0 : profile.address) !== null && _e !== void 0 ? _e : null,
                bio: (_f = profile === null || profile === void 0 ? void 0 : profile.bio) !== null && _f !== void 0 ? _f : null,
                github_url: (_g = profile === null || profile === void 0 ? void 0 : profile.github_url) !== null && _g !== void 0 ? _g : null,
                linkedin_url: (_h = profile === null || profile === void 0 ? void 0 : profile.linkedin_url) !== null && _h !== void 0 ? _h : null,
                portfolio_url: (_j = profile === null || profile === void 0 ? void 0 : profile.portfolio_url) !== null && _j !== void 0 ? _j : null,
                skills: (_k = profile === null || profile === void 0 ? void 0 : profile.skills) !== null && _k !== void 0 ? _k : null,
            };
        });
    }
    // ─── Send OTP (email verification / password reset) ─
    static sendOtp(email) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = yield user_model_1.default.findOne({ where: { email } });
            if (!user)
                throw new Error("No account found with this email.");
            const otp = crypto_1.default.randomInt(100000, 999999).toString();
            otpStorage[email] = { otp, expiresAt: Date.now() + OTP_EXPIRATION_MS };
            yield (0, emailSending_1.sendOtpEmail)(email, otp);
            return { message: "OTP sent successfully. Please check your inbox." };
        });
    }
    // ─── Request Password Reset OTP ────────────────────
    static requestPasswordReset(email) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = yield user_model_1.default.findOne({ where: { email } });
            if (!user)
                throw new Error("No account found with this email.");
            const otp = crypto_1.default.randomInt(100000, 999999).toString();
            otpStorage[email] = { otp, expiresAt: Date.now() + OTP_EXPIRATION_MS };
            yield (0, emailSending_1.sendOtpEmail)(email, otp);
            return { message: "Password reset OTP sent to your email." };
        });
    }
    // ─── Verify OTP ─────────────────────────────────────
    static verifyResetOtp(email, otp) {
        return __awaiter(this, void 0, void 0, function* () {
            const record = otpStorage[email];
            if (!record) {
                throw new Error("No OTP found. Please request a new one.");
            }
            if (Date.now() > record.expiresAt) {
                delete otpStorage[email];
                throw new Error("OTP has expired. Please request a new one.");
            }
            if (record.otp !== otp) {
                throw new Error("Invalid OTP. Please try again.");
            }
            return { message: "OTP verified. You can now reset your password." };
        });
    }
    // ─── Reset Password ─────────────────────────────────
    static resetPassword(email, new_password) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = yield user_model_1.default.findOne({ where: { email } });
            if (!user)
                throw new Error("No account found with this email.");
            // beforeUpdate hook will hash the new password
            yield user.update({ password: new_password });
            delete otpStorage[email];
            return { message: "Password reset successfully. You can now log in." };
        });
    }
}
exports.AuthService = AuthService;
exports.default = AuthService;
