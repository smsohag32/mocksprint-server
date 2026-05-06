"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const question_controller_1 = __importDefault(require("../controllers/question.controller"));
const authMiddleware_1 = require("../middleware/authMiddleware");
const router = (0, express_1.Router)();
// Public/Authenticated access for fetching questions
router.get("/", authMiddleware_1.authMiddleware, question_controller_1.default.getQuestions);
router.get("/:id", authMiddleware_1.authMiddleware, question_controller_1.default.getQuestion);
// Admin-only management
router.post("/", authMiddleware_1.authMiddleware, authMiddleware_1.adminMiddleware, question_controller_1.default.createQuestion);
router.put("/:id", authMiddleware_1.authMiddleware, authMiddleware_1.adminMiddleware, question_controller_1.default.updateQuestion);
router.delete("/:id", authMiddleware_1.authMiddleware, authMiddleware_1.adminMiddleware, question_controller_1.default.deleteQuestion);
exports.default = router;
