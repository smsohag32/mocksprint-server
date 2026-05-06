"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.adminMiddleware = exports.authMiddleware = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const JWT_ACCESS_SECRET = process.env.JWT_ACCESS_SECRET;
if (!JWT_ACCESS_SECRET) {
    throw new Error("JWT_ACCESS_SECRET is required.");
}
const authMiddleware = (req, res, next) => {
    const authHeader = req.headers["authorization"];
    const token = (authHeader === null || authHeader === void 0 ? void 0 : authHeader.startsWith("Bearer "))
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
        const decoded = jsonwebtoken_1.default.verify(token, JWT_ACCESS_SECRET);
        req.user = decoded;
        next();
    }
    catch (error) {
        res.status(401).json({
            success: false,
            message: "Invalid or expired token.",
            httpStatusCode: 401,
        });
    }
};
exports.authMiddleware = authMiddleware;
/**
 * Middleware to check if the user has an admin role.
 * Requires authMiddleware to be called first.
 */
const adminMiddleware = (req, res, next) => {
    if (req.user && req.user.role === "admin") {
        next();
    }
    else {
        res.status(403).json({
            success: false,
            message: "Forbidden. Admin access required.",
            httpStatusCode: 403,
        });
    }
};
exports.adminMiddleware = adminMiddleware;
