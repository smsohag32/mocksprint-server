import nodemailer from "nodemailer";
import dotenv from "dotenv";
dotenv.config();

const SMTP_USER = process.env.SMTP_USER;
const SMTP_PASS = process.env.SMTP_PASS;
const CLIENT_URL = process.env.CLIENT_URL || "http://localhost:5173";

/* ─── Transporter ────────────────────────────────────── */
export const createTransporter = () => {
   return nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 587,
      secure: false,
      auth: {
         user: SMTP_USER,
         pass: SMTP_PASS,
      },
   });
};

/* ─── Send OTP Email ─────────────────────────────────── */
export const sendOtpEmail = async (email: string, otp: string): Promise<void> => {
   const transporter = createTransporter();

   await transporter.sendMail({
      from: `"MockSprint" <${SMTP_USER}>`,
      to: email,
      subject: "Your OTP Code — MockSprint",
      html: `
      <div style="font-family: 'Segoe UI', Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #f8fafc; border-radius: 12px; overflow: hidden;">
        <div style="background: linear-gradient(135deg, #1a3aff 0%, #06b6d4 100%); padding: 32px 40px; text-align: center;">
          <h1 style="color: #ffffff; margin: 0; font-size: 26px; font-weight: 700; letter-spacing: -0.5px;">MockSprint</h1>
          <p style="color: rgba(255,255,255,0.8); margin: 8px 0 0; font-size: 14px;">Your One-Time Password</p>
        </div>
        <div style="padding: 40px; background: #ffffff;">
          <p style="font-size: 15px; color: #374151; margin: 0 0 24px;">Hi there,</p>
          <p style="font-size: 15px; color: #374151; margin: 0 0 24px;">Use the OTP below to proceed. It expires in <strong>10 minutes</strong>.</p>
          <div style="background: linear-gradient(135deg, #eff6ff, #ecfeff); border: 1px solid #bfdbfe; border-radius: 12px; padding: 20px; text-align: center; margin: 0 0 24px;">
            <span style="font-size: 36px; font-weight: 800; letter-spacing: 8px; color: #1d4ed8; font-family: monospace;">${otp}</span>
          </div>
          <p style="font-size: 13px; color: #9ca3af; margin: 0;">If you did not request this, please ignore this email. Do not share this code with anyone.</p>
        </div>
        <div style="padding: 20px 40px; background: #f8fafc; text-align: center; border-top: 1px solid #e5e7eb;">
          <p style="font-size: 12px; color: #9ca3af; margin: 0;">© ${new Date().getFullYear()} MockSprint. All rights reserved.</p>
        </div>
      </div>
      `,
   });
};

/* ─── Send Email Verification Link ───────────────────── */
export const sendVerificationEmail = async (
   email: string,
   token: string
): Promise<void> => {
   const transporter = createTransporter();
   const verificationUrl = `${CLIENT_URL}/verify-email?token=${token}`;

   await transporter.sendMail({
      from: `"MockSprint" <${SMTP_USER}>`,
      to: email,
      subject: "Verify your email — MockSprint",
      html: `
      <div style="font-family: 'Segoe UI', Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #f8fafc; border-radius: 12px; overflow: hidden;">
        <div style="background: linear-gradient(135deg, #1a3aff 0%, #06b6d4 100%); padding: 32px 40px; text-align: center;">
          <h1 style="color: #ffffff; margin: 0; font-size: 26px; font-weight: 700; letter-spacing: -0.5px;">MockSprint</h1>
          <p style="color: rgba(255,255,255,0.8); margin: 8px 0 0; font-size: 14px;">Practice interviews. Land your dream job.</p>
        </div>
        <div style="padding: 40px; background: #ffffff;">
          <h2 style="font-size: 20px; color: #111827; margin: 0 0 12px; font-weight: 700;">Welcome to MockSprint! 🎉</h2>
          <p style="font-size: 15px; color: #374151; margin: 0 0 24px;">
            You're almost ready to start crushing mock interviews. Please verify your email address to activate your account.
          </p>
          <div style="text-align: center; margin: 32px 0;">
            <a href="${verificationUrl}"
               style="display: inline-block; background: linear-gradient(135deg, #1a3aff, #06b6d4); color: #ffffff; text-decoration: none; font-size: 15px; font-weight: 600; padding: 14px 36px; border-radius: 8px; letter-spacing: 0.3px;">
              ✅ Verify My Email
            </a>
          </div>
          <p style="font-size: 13px; color: #6b7280; margin: 0 0 8px;">Or copy and paste this link into your browser:</p>
          <p style="font-size: 12px; color: #3b82f6; word-break: break-all; margin: 0 0 24px;">${verificationUrl}</p>
          <div style="border-top: 1px solid #e5e7eb; padding-top: 20px;">
            <p style="font-size: 13px; color: #9ca3af; margin: 0;">
              ⏰ This link expires in <strong>24 hours</strong>. If you did not create an account with MockSprint, you can safely ignore this email.
            </p>
          </div>
        </div>
        <div style="padding: 20px 40px; background: #f8fafc; text-align: center; border-top: 1px solid #e5e7eb;">
          <p style="font-size: 12px; color: #9ca3af; margin: 0;">© ${new Date().getFullYear()} MockSprint. All rights reserved.</p>
        </div>
      </div>
      `,
   });
};
