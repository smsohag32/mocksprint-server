import { Request, Response } from "express";
import { InterviewService } from "../services/interview.service";

/**
 * Get all interviews for the current user
 */
export const getInterviews = async (req: Request, res: Response) => {
   try {
      const userId = req.user?.user_id;
      if (!userId) {
         return res.status(401).json({ message: "Unauthorized" });
      }

      const interviews = await InterviewService.getInterviewsByUser(userId);
      res.status(200).json(interviews);
   } catch (error: any) {
      console.error("Error fetching interviews:", error);
      res.status(500).json({ message: "Internal server error" });
   }
};

/**
 * Get a specific interview by ID
 */
export const getInterviewById = async (req: Request, res: Response) => {
   try {
      const { id } = req.params;
      const userId = req.user?.user_id;

      if (!userId) {
         return res.status(401).json({ message: "Unauthorized" });
      }

      const interview = await InterviewService.getInterviewById(id, userId);
      res.status(200).json(interview);
   } catch (error: any) {
      console.error("Error fetching interview:", error);
      if (error.message === "Interview not found") {
         return res.status(404).json({ message: error.message });
      }
      res.status(500).json({ message: "Internal server error" });
   }
};

/**
 * Start a new interview session
 */
export const startInterview = async (req: Request, res: Response) => {
   try {
      const { question_id } = req.body;
      const userId = req.user?.user_id;

      if (!userId) {
         return res.status(401).json({ message: "Unauthorized" });
      }

      if (!question_id) {
         return res.status(400).json({ message: "Question ID is required" });
      }

      const interview = await InterviewService.startInterview(userId, question_id);
      res.status(201).json(interview);
   } catch (error: any) {
      console.error("Error starting interview:", error);
      if (error.message === "Question not found") {
         return res.status(404).json({ message: error.message });
      }
      res.status(500).json({ message: "Internal server error" });
   }
};

/**
 * Submit an interview session
 */
export const submitInterview = async (req: Request, res: Response) => {
   try {
      const { id } = req.params;
      const { code } = req.body;
      const userId = req.user?.user_id;

      if (!userId) {
         return res.status(401).json({ message: "Unauthorized" });
      }

      const interview = await InterviewService.submitInterview(id, userId, code);
      res.status(200).json(interview);
   } catch (error: any) {
      console.error("Error submitting interview:", error);
      if (error.message === "Interview not found") {
         return res.status(404).json({ message: error.message });
      }
      if (error.message === "Interview is already completed or abandoned") {
         return res.status(400).json({ message: error.message });
      }
      res.status(500).json({ message: "Internal server error" });
   }
};

/**
 * Abandon an interview session
 */
export const abandonInterview = async (req: Request, res: Response) => {
   try {
      const { id } = req.params;
      const userId = req.user?.user_id;

      if (!userId) {
         return res.status(401).json({ message: "Unauthorized" });
      }

      const interview = await InterviewService.abandonInterview(id, userId);
      res.status(200).json({ message: "Interview abandoned", interview });
   } catch (error: any) {
      console.error("Error abandoning interview:", error);
      if (error.message === "Interview not found") {
         return res.status(404).json({ message: error.message });
      }
      if (error.message === "Interview is already completed or abandoned") {
         return res.status(400).json({ message: error.message });
      }
      res.status(500).json({ message: "Internal server error" });
   }
};
