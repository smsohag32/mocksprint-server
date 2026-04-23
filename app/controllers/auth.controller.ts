import { Request, Response } from "express";
import AuthService from "../services/auth.service";

/* ═══════════════════════════════════════════════════════
   AUTH CONTROLLER
════════════════════════════════════════════════════════ */
export class AuthController {

   // ─── Register ──────────────────────────────────────
   public static async signUp(req: Request, res: Response): Promise<void> {
      try {
         const result = await AuthService.signUp(req.body);
         res.status(201).json({
            success: true,
            message: result.message,
            httpStatusCode: 201,
            user: result.user,
         });
      } catch (error: any) {
         res.status(400).json({
            success: false,
            message: error.message || "Registration failed.",
            httpStatusCode: 400,
         });
      }
   }

   // ─── Login ─────────────────────────────────────────
   public static async signIn(req: Request, res: Response): Promise<void> {
      const { email, password } = req.body;
      try {
         const { token, refresh_token, user } = await AuthService.signIn(email, password);

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
      } catch (error: any) {
         res.status(401).json({
            success: false,
            message: error.message || "Login failed.",
            httpStatusCode: 401,
         });
      }
   }

   // ─── Verify Email ───────────────────────────────────
   public static async verifyEmail(req: Request, res: Response): Promise<void> {
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
         const result = await AuthService.verifyEmail(token);
         res.status(200).json({
            success: true,
            message: result.message,
            httpStatusCode: 200,
         });
      } catch (error: any) {
         res.status(400).json({
            success: false,
            message: error.message || "Email verification failed.",
            httpStatusCode: 400,
         });
      }
   }

   // ─── Refresh Token ──────────────────────────────────
   public static async refreshToken(req: Request, res: Response): Promise<void> {
      // Accept from body OR httpOnly cookie
      const refreshToken =
         req.body?.refresh_token || req.cookies?.refresh_token;

      if (!refreshToken) {
         res.status(401).json({
            success: false,
            message: "Refresh token is required.",
            httpStatusCode: 401,
         });
         return;
      }

      try {
         const { token } = await AuthService.refreshToken(refreshToken);
         res.status(200).json({
            success: true,
            message: "Access token refreshed.",
            httpStatusCode: 200,
            token,
         });
      } catch (error: any) {
         res.status(401).json({
            success: false,
            message: error.message || "Token refresh failed.",
            httpStatusCode: 401,
         });
      }
   }

   // ─── Get Current User (Me) ──────────────────────────
   public static async getMe(req: Request, res: Response): Promise<void> {
      try {
         const userId = req.user?.user_id;
         if (!userId) {
            res.status(401).json({ success: false, message: "Unauthorized." });
            return;
         }
         const user = await AuthService.getMe(userId);
         res.status(200).json({
            success: true,
            httpStatusCode: 200,
            user,
         });
      } catch (error: any) {
         res.status(404).json({
            success: false,
            message: error.message || "User not found.",
            httpStatusCode: 404,
         });
      }
   }

   // ─── Logout ────────────────────────────────────────
   public static async logout(_req: Request, res: Response): Promise<void> {
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
   }

   // ─── Send OTP ──────────────────────────────────────
   public static async sendOtp(req: Request, res: Response): Promise<void> {
      const { email } = req.body;
      try {
         const result = await AuthService.sendOtp(email);
         res.status(200).json({ success: true, message: result.message, httpStatusCode: 200 });
      } catch (error: any) {
         res.status(400).json({ success: false, message: error.message || "Failed to send OTP.", httpStatusCode: 400 });
      }
   }

   // ─── Request Password Reset OTP ─────────────────────
   public static async requestRestOtp(req: Request, res: Response): Promise<void> {
      const { email } = req.body;
      try {
         const result = await AuthService.requestPasswordReset(email);
         res.status(200).json({ success: true, message: result.message, httpStatusCode: 200 });
      } catch (error: any) {
         res.status(400).json({ success: false, message: error.message || "Failed to send OTP.", httpStatusCode: 400 });
      }
   }

   // ─── Verify OTP ─────────────────────────────────────
   public static async verifyOtpReq(req: Request, res: Response): Promise<void> {
      const { email, otp } = req.body;
      try {
         const result = await AuthService.verifyResetOtp(email, otp);
         res.status(200).json({ success: true, message: result.message, httpStatusCode: 200 });
      } catch (error: any) {
         res.status(400).json({ success: false, message: error.message || "OTP verification failed.", httpStatusCode: 400 });
      }
   }

   // ─── Set New Password ───────────────────────────────
   public static async setNewPassword(req: Request, res: Response): Promise<void> {
      const { email, new_password } = req.body;
      try {
         const result = await AuthService.resetPassword(email, new_password);
         res.status(200).json({ success: true, message: result.message, httpStatusCode: 200 });
      } catch (error: any) {
         res.status(400).json({ success: false, message: error.message || "Password reset failed.", httpStatusCode: 400 });
      }
   }
}

export default AuthController;
