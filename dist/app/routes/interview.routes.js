"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const interview_controller_1 = require("../controllers/interview.controller");
const authMiddleware_1 = require("../middleware/authMiddleware");
const router = express_1.default.Router();
// All interview routes require authentication
router.use(authMiddleware_1.authMiddleware);
router.get("/", interview_controller_1.getInterviews);
router.get("/:id", interview_controller_1.getInterviewById);
router.post("/", interview_controller_1.startInterview);
router.post("/:id/submit", interview_controller_1.submitInterview);
router.post("/:id/abandon", interview_controller_1.abandonInterview);
router.post("/:id/hint", interview_controller_1.getHint);
exports.default = router;
