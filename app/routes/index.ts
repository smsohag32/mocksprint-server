import express from "express";
import authRoute from "./auth.routes";
import adminRoutes from "./admin.routes";
import questionRoutes from "./question.routes";

const mainRoute = express.Router();

// Auth endpoints
mainRoute.use("/", authRoute);

// Admin endpoints
mainRoute.use("/admin", adminRoutes);

// Question endpoints
mainRoute.use("/questions", questionRoutes);

export default mainRoute;
