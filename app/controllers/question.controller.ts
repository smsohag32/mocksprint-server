import { Request, Response } from "express";
import QuestionService from "../services/question.service";

export class QuestionController {
   /**
    * GET /api/v1/questions
    */
   public static async getQuestions(req: Request, res: Response): Promise<void> {
      try {
         const { category, difficulty, search } = req.query;
         const questions = await QuestionService.getQuestions({
            category: category as string,
            difficulty: difficulty as string,
            search: search as string,
         });

         res.status(200).json({
            success: true,
            message: "Questions retrieved successfully.",
            questions,
            httpStatusCode: 200,
         });
      } catch (error: any) {
         res.status(500).json({
            success: false,
            message: error.message || "Failed to fetch questions.",
            httpStatusCode: 500,
         });
      }
   }

   /**
    * GET /api/v1/questions/:id
    */
   public static async getQuestion(req: Request, res: Response): Promise<void> {
      try {
         const { id } = req.params;
         const question = await QuestionService.getQuestionById(id);

         res.status(200).json({
            success: true,
            message: "Question retrieved successfully.",
            question,
            httpStatusCode: 200,
         });
      } catch (error: any) {
         res.status(404).json({
            success: false,
            message: error.message || "Question not found.",
            httpStatusCode: 404,
         });
      }
   }

   /**
    * POST /api/v1/questions
    * Supports single or bulk creation.
    */
   public static async createQuestion(req: Request, res: Response): Promise<void> {
      try {
         const data = req.body;

         if (Array.isArray(data)) {
            const questions = await QuestionService.bulkCreateQuestions(data);
            res.status(201).json({
               success: true,
               message: `${questions.length} questions created successfully.`,
               questions,
               httpStatusCode: 201,
            });
         } else {
            const question = await QuestionService.createQuestion(data);
            res.status(201).json({
               success: true,
               message: "Question created successfully.",
               question,
               httpStatusCode: 201,
            });
         }
      } catch (error: any) {
         res.status(400).json({
            success: false,
            message: error.message || "Failed to create question(s).",
            httpStatusCode: 400,
         });
      }
   }

   /**
    * PUT /api/v1/questions/:id
    */
   public static async updateQuestion(req: Request, res: Response): Promise<void> {
      try {
         const { id } = req.params;
         const data = req.body;

         const question = await QuestionService.updateQuestion(id, data);

         res.status(200).json({
            success: true,
            message: "Question updated successfully.",
            question,
            httpStatusCode: 200,
         });
      } catch (error: any) {
         res.status(400).json({
            success: false,
            message: error.message || "Failed to update question.",
            httpStatusCode: 400,
         });
      }
   }

   /**
    * DELETE /api/v1/questions/:id
    */
   public static async deleteQuestion(req: Request, res: Response): Promise<void> {
      try {
         const { id } = req.params;
         await QuestionService.deleteQuestion(id);

         res.status(200).json({
            success: true,
            message: "Question deleted successfully.",
            httpStatusCode: 200,
         });
      } catch (error: any) {
         res.status(400).json({
            success: false,
            message: error.message || "Failed to delete question.",
            httpStatusCode: 400,
         });
      }
   }
}

export default QuestionController;
