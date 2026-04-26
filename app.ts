import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import morgan from "morgan";
import cookieParser from "cookie-parser";

dotenv.config();

import { connectDb } from "./app/config/dbConfig";
import { defineAssociations } from "./app/models/associations";
import { seedSuperUser } from "./app/utils/seed";
import seedQuestions from "./app/utils/seedQuestions";
import mainRoute from "./app/routes";
import path from "path";

const app = express();
const port = process.env.PORT || 3000;
const CLIENT_URL = process.env.CLIENT_URL || "http://localhost:8080";

/* ─── CORS ───────────────────────────────────────────── */
const corsOptions = {
   origin: [CLIENT_URL, "http://localhost:5173", "http://localhost:8080"],
   credentials: true,
   optionsSuccessStatus: 200,
};

/* ─── Middleware ─────────────────────────────────────── */
app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(morgan("dev"));
app.use("/uploads", express.static(path.join(process.cwd(), "uploads")));

/* ─── Health Check ───────────────────────────────────── */
app.get("/", (_req, res) => {
   res.json({
      success: true,
      message: "MockSprint API server is running 🚀",
      version: "1.0.0",
   });
});

/* ─── API Routes ─────────────────────────────────────── */
app.use("/api/v1", mainRoute);

/* ─── 404 Handler ────────────────────────────────────── */
app.use((_req, res) => {
   res.status(404).json({
      success: false,
      message: "Route not found.",
      httpStatusCode: 404,
   });
});

/* ─── Start Server ───────────────────────────────────── */
connectDb().then(async () => {
   // Register all model associations before any queries run
   defineAssociations();

   // Seed super user if admin not found
   await seedSuperUser();

   // Seed initial professional questions
   await seedQuestions();

   app.listen(port, () => {
      console.log(`🚀 Server running on http://localhost:${port}`);
   });
});

export default app;
