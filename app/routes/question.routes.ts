import { Router } from "express";
import QuestionController from "../controllers/question.controller";
import { authMiddleware, adminMiddleware } from "../middleware/authMiddleware";

const router = Router();

// Public/Authenticated access for fetching questions
router.get("/", authMiddleware, QuestionController.getQuestions);
router.get("/:id", authMiddleware, QuestionController.getQuestion);

// Admin-only management
router.post("/", authMiddleware, adminMiddleware, QuestionController.createQuestion);
router.put("/:id", authMiddleware, adminMiddleware, QuestionController.updateQuestion);
router.delete("/:id", authMiddleware, adminMiddleware, QuestionController.deleteQuestion);

export default router;
