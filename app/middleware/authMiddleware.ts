import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();

const JWT_ACCESS_SECRET = process.env.JWT_ACCESS_SECRET as string;

if (!JWT_ACCESS_SECRET) {
   throw new Error("JWT_ACCESS_SECRET is required.");
}

// Extend Express Request type to carry decoded user
declare module "express-serve-static-core" {
   interface Request {
      user?: {
         user_id: string;
         email: string;
         iat?: number;
         exp?: number;
      };
   }
}

export const authMiddleware = (
   req: Request,
   res: Response,
   next: NextFunction
): void => {
   const authHeader = req.headers["authorization"];
   const token = authHeader?.startsWith("Bearer ")
      ? authHeader.split(" ")[1]
      : null;

   if (!token) {
      res.status(401).json({
         success: false,
         message: "Access denied. No token provided.",
         httpStatusCode: 401,
      });
      return;
   }

   try {
      const decoded = jwt.verify(token, JWT_ACCESS_SECRET) as {
         user_id: string;
         email: string;
         role: string;
         iat: number;
         exp: number;
      };
      req.user = decoded as any;
      next();
   } catch (error) {
      res.status(401).json({
         success: false,
         message: "Invalid or expired token.",
         httpStatusCode: 401,
      });
   }
};

/**
 * Middleware to check if the user has an admin role.
 * Requires authMiddleware to be called first.
 */
export const adminMiddleware = (
   req: Request,
   res: Response,
   next: NextFunction
): void => {
   if (req.user && (req.user as any).role === "admin") {
      next();
   } else {
      res.status(403).json({
         success: false,
         message: "Forbidden. Admin access required.",
         httpStatusCode: 403,
      });
   }
};
