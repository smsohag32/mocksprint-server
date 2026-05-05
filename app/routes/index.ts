import express from "express";
import authRoute from "./auth.routes";
import adminRoutes from "./admin.routes";
import questionRoutes from "./question.routes";
import interviewRoutes from "./interview.routes";
import dashboardRoutes from "./dashboard.routes";
import blogRoutes from "./blog.routes";

const mainRoute = express.Router();

// Auth endpoints
mainRoute.use("/", authRoute);

// Admin endpoints
mainRoute.use("/admin", adminRoutes);

// Question endpoints
mainRoute.use("/questions", questionRoutes);

// Interview endpoints
mainRoute.use("/interviews", interviewRoutes);

// Dashboard endpoints
mainRoute.use("/dashboard", dashboardRoutes);

// Blog endpoints
mainRoute.use("/blogs", blogRoutes);

export default mainRoute;
