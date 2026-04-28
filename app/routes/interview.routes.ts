import express from "express";
import {
   getInterviews,
   getInterviewById,
   startInterview,
   submitInterview,
   abandonInterview,
   getHint,
} from "../controllers/interview.controller";
import { authMiddleware } from "../middleware/authMiddleware";

const router = express.Router();

// All interview routes require authentication
router.use(authMiddleware);

router.get("/", getInterviews as express.RequestHandler);
router.get("/:id", getInterviewById as express.RequestHandler);
router.post("/", startInterview as express.RequestHandler);
router.post("/:id/submit", submitInterview as express.RequestHandler);
router.post("/:id/abandon", abandonInterview as express.RequestHandler);
router.post("/:id/hint", getHint as express.RequestHandler);

export default router;
