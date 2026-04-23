import jwt from "jsonwebtoken";
import crypto from "crypto";
import dotenv from "dotenv";
import { Op } from "sequelize";

import User from "../models/user.model";
import Profile from "../models/profile.model";
import { AuthResponse, SignUpResponse } from "../types/auth.type";
import { sendOtpEmail, sendVerificationEmail } from "../utils/emailSending";

dotenv.config();

/* ─── JWT Config ─────────────────────────────────────── */
const JWT_ACCESS_SECRET = process.env.JWT_ACCESS_SECRET!;
const JWT_REFRESH_SECRET = process.env.JWT_REFRESH_SECRET!;

if (!JWT_ACCESS_SECRET || !JWT_REFRESH_SECRET) {
   throw new Error("JWT secret environment variables are not defined.");
}

const generateAccessToken = (userId: string, email: string, role: string) =>
   jwt.sign({ user_id: userId, email, role }, JWT_ACCESS_SECRET, { expiresIn: "1h" });

const generateRefreshToken = (userId: string, email: string, role: string) =>
   jwt.sign({ user_id: userId, email, role }, JWT_REFRESH_SECRET, { expiresIn: "7d" });

/* ─── OTP Store (in-memory) ──────────────────────────── */
const OTP_EXPIRATION_MS = 10 * 60 * 1000; // 10 minutes
const otpStorage: Record<string, { otp: string; expiresAt: number }> = {};

/* ─── Interfaces ─────────────────────────────────────── */
interface SignUpData {
   name: string;
   email: string;
   password: string;
}

/* ═══════════════════════════════════════════════════════
   AUTH SERVICE
════════════════════════════════════════════════════════ */
export class AuthService {

   // ─── Register ──────────────────────────────────────
   public static async signUp(data: SignUpData): Promise<SignUpResponse> {
      const { name, email, password } = data;

      // Validate email format
      const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
      if (!emailRegex.test(email)) {
         throw new Error("Invalid email format.");
      }

      // Check duplicate email
      const existingUser = await User.findOne({ where: { email } });
      if (existingUser) {
         throw new Error("An account with this email already exists.");
      }

      // Generate verification token (UUID) valid for 24 hours
      const verificationToken = crypto.randomUUID();
      const verificationExpires = new Date(Date.now() + 24 * 60 * 60 * 1000);

      // Create user (password hashed via beforeCreate hook)
      const newUser = await User.create({
         name,
         email,
         password,
         email_verification_token: verificationToken,
         email_verification_expires: verificationExpires,
      });

      // Create blank profile
      await Profile.create({ userId: newUser.id });

      // Send verification email (non-blocking)
      sendVerificationEmail(email, verificationToken).catch((err) =>
         console.error("Verification email failed:", err.message)
      );

      return {
         message:
            "Registration successful! Please check your email to verify your account.",
         user: {
            id: newUser.id,
            name: newUser.name,
            email: newUser.email,
            is_active: newUser.is_active,
            is_verified: newUser.is_verified,
         },
      };
   }

   // ─── Login ─────────────────────────────────────────
   public static async signIn(
      email: string,
      password: string
   ): Promise<AuthResponse> {
      const user = await User.findOne({ where: { email } });
      if (!user) {
         throw new Error("Invalid email or password.");
      }

      const isMatch = await user.comparePassword(password);
      if (!isMatch) {
         throw new Error("Invalid email or password.");
      }

      if (!user.is_verified) {
         throw new Error(
            "Your email is not verified. Please check your inbox and click the verification link."
         );
      }

      if (!user.is_active) {
         throw new Error("Your account has been deactivated. Please contact support.");
      }

      // Update last login
      await user.update({ last_login: new Date() });

      // Fetch profile
      const profile = await Profile.findOne({ where: { userId: user.id } });

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
            phone: profile?.phone ?? null,
            profile_image: profile?.profile_image ?? null,
         },
      };
   }

   // ─── Verify Email ───────────────────────────────────
   public static async verifyEmail(token: string): Promise<{ message: string }> {
      const user = await User.findOne({
         where: {
            email_verification_token: token,
            email_verification_expires: { [Op.gt]: new Date() },
         },
      });

      if (!user) {
         throw new Error(
            "Verification link is invalid or has expired. Please register again."
         );
      }

      if (user.is_verified) {
         return { message: "Email is already verified. You can log in." };
      }

      await user.update({
         is_verified: true,
         email_verification_token: null,
         email_verification_expires: null,
      });

      return { message: "Email verified successfully! You can now log in." };
   }

   // ─── Refresh Token ──────────────────────────────────
   public static async refreshToken(
      refreshToken: string
   ): Promise<{ token: string }> {
      try {
         const decoded = jwt.verify(refreshToken, JWT_REFRESH_SECRET) as {
            user_id: string;
            email: string;
         };

         const user = await User.findByPk(decoded.user_id);
         if (!user || !user.is_active) {
            throw new Error("User not found or inactive.");
         }

         const newAccessToken = generateAccessToken(user.id, user.email, user.role);
         return { token: newAccessToken };
      } catch {
         throw new Error("Invalid or expired refresh token.");
      }
   }

   // ─── Get Me (current user) ──────────────────────────
   public static async getMe(userId: string): Promise<object> {
      const user = await User.findByPk(userId, {
         attributes: { exclude: ["password", "email_verification_token", "email_verification_expires"] },
      });
      if (!user) throw new Error("User not found.");

      const profile = await Profile.findOne({ where: { userId } });

      return {
         id: user.id,
         name: user.name,
         email: user.email,
         role: user.role,
         is_active: user.is_active,
         is_verified: user.is_verified,
         last_login: user.last_login,
         phone: profile?.phone ?? null,
         profile_image: profile?.profile_image ?? null,
         first_name: profile?.first_name ?? null,
         last_name: profile?.last_name ?? null,
         address: profile?.address ?? null,
         bio: profile?.bio ?? null,
         github_url: profile?.github_url ?? null,
         linkedin_url: profile?.linkedin_url ?? null,
         portfolio_url: profile?.portfolio_url ?? null,
         skills: profile?.skills ?? null,
      };
   }

   // ─── Send OTP (email verification / password reset) ─
   public static async sendOtp(email: string): Promise<{ message: string }> {
      const user = await User.findOne({ where: { email } });
      if (!user) throw new Error("No account found with this email.");

      const otp = crypto.randomInt(100000, 999999).toString();
      otpStorage[email] = { otp, expiresAt: Date.now() + OTP_EXPIRATION_MS };

      await sendOtpEmail(email, otp);
      return { message: "OTP sent successfully. Please check your inbox." };
   }

   // ─── Request Password Reset OTP ────────────────────
   public static async requestPasswordReset(
      email: string
   ): Promise<{ message: string }> {
      const user = await User.findOne({ where: { email } });
      if (!user) throw new Error("No account found with this email.");

      const otp = crypto.randomInt(100000, 999999).toString();
      otpStorage[email] = { otp, expiresAt: Date.now() + OTP_EXPIRATION_MS };

      await sendOtpEmail(email, otp);
      return { message: "Password reset OTP sent to your email." };
   }

   // ─── Verify OTP ─────────────────────────────────────
   public static async verifyResetOtp(
      email: string,
      otp: string
   ): Promise<{ message: string }> {
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
   }

   // ─── Reset Password ─────────────────────────────────
   public static async resetPassword(
      email: string,
      new_password: string
   ): Promise<{ message: string }> {
      const user = await User.findOne({ where: { email } });
      if (!user) throw new Error("No account found with this email.");

      // beforeUpdate hook will hash the new password
      await user.update({ password: new_password });
      delete otpStorage[email];

      return { message: "Password reset successfully. You can now log in." };
   }
}

export default AuthService;
