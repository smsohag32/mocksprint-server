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
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const dotenv_1 = __importDefault(require("dotenv"));
const morgan_1 = __importDefault(require("morgan"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
dotenv_1.default.config();
const dbConfig_1 = require("./app/config/dbConfig");
const associations_1 = require("./app/models/associations");
const seed_1 = require("./app/utils/seed");
const seedQuestions_1 = __importDefault(require("./app/utils/seedQuestions"));
const routes_1 = __importDefault(require("./app/routes"));
const path_1 = __importDefault(require("path"));
const app = (0, express_1.default)();
const port = process.env.PORT || 3000;
const CLIENT_URL = process.env.CLIENT_URL || "http://localhost:8080";
/* ─── CORS ───────────────────────────────────────────── */
const corsOptions = {
    origin: [CLIENT_URL, "http://localhost:5173", "http://localhost:8080"],
    credentials: true,
    optionsSuccessStatus: 200,
};
/* ─── Middleware ─────────────────────────────────────── */
app.use((0, cors_1.default)(corsOptions));
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: true }));
app.use((0, cookie_parser_1.default)());
app.use((0, morgan_1.default)("dev"));
app.use("/uploads", express_1.default.static(path_1.default.join(process.cwd(), "uploads")));
/* ─── Health Check ───────────────────────────────────── */
app.get("/", (_req, res) => {
    res.json({
        success: true,
        message: "MockSprint API server is running 🚀",
        version: "1.0.0",
    });
});
/* ─── API Routes ─────────────────────────────────────── */
app.use("/api/v1", routes_1.default);
/* ─── 404 Handler ────────────────────────────────────── */
app.use((_req, res) => {
    res.status(404).json({
        success: false,
        message: "Route not found.",
        httpStatusCode: 404,
    });
});
/* ─── Start Server ───────────────────────────────────── */
(0, dbConfig_1.connectDb)().then(() => __awaiter(void 0, void 0, void 0, function* () {
    // Register all model associations before any queries run
    (0, associations_1.defineAssociations)();
    // Seed super user if admin not found
    yield (0, seed_1.seedSuperUser)();
    // Seed initial professional questions
    yield (0, seedQuestions_1.default)();
    app.listen(port, () => {
        console.log(`🚀 Server running on http://localhost:${port}`);
    });
}));
exports.default = app;
