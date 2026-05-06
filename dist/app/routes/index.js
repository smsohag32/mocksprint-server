"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const auth_routes_1 = __importDefault(require("./auth.routes"));
const admin_routes_1 = __importDefault(require("./admin.routes"));
const question_routes_1 = __importDefault(require("./question.routes"));
const interview_routes_1 = __importDefault(require("./interview.routes"));
const dashboard_routes_1 = __importDefault(require("./dashboard.routes"));
const blog_routes_1 = __importDefault(require("./blog.routes"));
const mainRoute = express_1.default.Router();
// Auth endpoints
mainRoute.use("/", auth_routes_1.default);
// Admin endpoints
mainRoute.use("/admin", admin_routes_1.default);
// Question endpoints
mainRoute.use("/questions", question_routes_1.default);
// Interview endpoints
mainRoute.use("/interviews", interview_routes_1.default);
// Dashboard endpoints
mainRoute.use("/dashboard", dashboard_routes_1.default);
// Blog endpoints
mainRoute.use("/blogs", blog_routes_1.default);
exports.default = mainRoute;
