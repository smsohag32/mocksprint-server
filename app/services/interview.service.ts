import { Interview } from "../models/interview.model";
import { Question } from "../models/question.model";
import { QuestionCategory } from "../models/questionCategory.model";
import { User } from "../models/user.model";
import { AiService } from "./ai.service";

export class InterviewService {
   /**
    * Get all interviews for a specific user
    */
   public static async getInterviewsByUser(userId: string) {
      return await Interview.findAll({
         where: { userId },
         include: [
            {
               model: Question,
               as: "question",
               include: [
                  {
                     model: QuestionCategory,
                     as: "category",
                  },
               ],
            },
         ],
         order: [["createdAt", "DESC"]],
      });
   }

   /**
    * Get all interviews paginated (Admin)
    */
   public static async getAllInterviewsPaged({ page, limit }: { page: number; limit: number }) {
      const offset = (page - 1) * limit;

      const { count, rows } = await Interview.findAndCountAll({
         limit,
         offset,
         include: [
            {
               model: User,
               as: "user",
               attributes: ["id", "name", "email"],
            },
            {
               model: Question,
               as: "question",
               attributes: ["id", "title"],
            },
         ],
         order: [["createdAt", "DESC"]],
      });

      return { interviews: rows, total: count };
   }

   /**
    * Get a specific interview by ID for a user
    */
   public static async getInterviewById(id: string, userId: string) {
      const interview = await Interview.findOne({
         where: { id, userId },
         include: [
            {
               model: Question,
               as: "question",
            },
         ],
      });
      if (!interview) throw new Error("Interview not found");
      return interview;
   }

   /**
    * Start a new interview session
    */
   public static async startInterview(userId: string, questionId: string) {
      const question = await Question.findByPk(questionId);
      if (!question) {
         throw new Error("Question not found");
      }

      return await Interview.create({
         userId,
         questionId,
         code: question.starter_code || "",
         status: "ongoing",
         score: null,
      });
   }

   /**
    * Submit an interview session
    */
   public static async submitInterview(id: string, userId: string, code: string | undefined) {
      const interview = await Interview.findOne({ where: { id, userId } });

      if (!interview) {
         throw new Error("Interview not found");
      }

      if (interview.status !== "ongoing") {
         throw new Error("Interview is already completed or abandoned");
      }

      // Use AI for evaluation
      const question = await Question.findByPk(interview.questionId);
      const evaluation = await AiService.evaluateSolution(question, code || interview.code || "");

      await interview.update({
         code: code || interview.code,
         score: evaluation.score,
         feedback: evaluation.feedback,
         status: "completed",
      });

      return {
         ...interview.get(),
         interviewerMessage: evaluation.interviewerMessage
      };
   }

   /**
    * Abandon an interview session
    */
   public static async abandonInterview(id: string, userId: string) {
      const interview = await Interview.findOne({ where: { id, userId } });

      if (!interview) {
         throw new Error("Interview not found");
      }

      if (interview.status !== "ongoing") {
         throw new Error("Interview is already completed or abandoned");
      }

      await interview.update({
         status: "abandoned",
      });

      return interview;
   }

   /**
    * Generate a hint for an ongoing interview
    */
   public static async generateHint(id: string, userId: string, currentCode: string) {
      const interview = await Interview.findOne({ 
         where: { id, userId },
         include: [{ model: Question, as: "question" }]
      });

      if (!interview) {
         throw new Error("Interview not found");
      }

      if (interview.status !== "ongoing") {
         throw new Error("Cannot get a hint for a completed interview");
      }

      try {
         const hint = await AiService.generateHint(interview.question, currentCode);
         return { hint };
      } catch (error: any) {
         return { 
            hint: null, 
            error: error.message || "Failed to generate hint" 
         };
      }
   }
}

export default InterviewService;
