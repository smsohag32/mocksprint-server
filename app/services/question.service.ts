import Question from "../models/question.model";
import QuestionCategory from "../models/questionCategory.model";
import { Op } from "sequelize";

export class QuestionService {
   /**
    * Fetch questions with filtering and pagination.
    */
   public static async getQuestions(filters: {
      category?: string;
      difficulty?: string;
      search?: string;
   }) {
      const { category, difficulty, search } = filters;
      const where: any = {};

      if (category) {
         where.categoryId = category;
      }
      if (difficulty) {
         where.difficulty = difficulty;
      }
      if (search) {
         where.title = { [Op.like]: `%${search}%` };
      }

      return await Question.findAll({
         where,
         include: [
            {
               model: QuestionCategory,
               as: "category",
               attributes: ["id", "name"],
            },
         ],
         order: [["createdAt", "DESC"]],
      });
   }

   /**
    * Get a single question by ID.
    */
   public static async getQuestionById(id: string) {
      const question = await Question.findByPk(id, {
         include: [
            {
               model: QuestionCategory,
               as: "category",
               attributes: ["id", "name"],
            },
         ],
      });
      if (!question) {
         throw new Error("Question not found.");
      }
      return question;
   }

   /**
    * Create a single question.
    */
   public static async createQuestion(data: any) {
      return await Question.create(data);
   }

   /**
    * Bulk create questions.
    */
   public static async bulkCreateQuestions(questions: any[]) {
      if (!Array.isArray(questions) || questions.length === 0) {
         throw new Error("Invalid questions data.");
      }
      return await Question.bulkCreate(questions);
   }

   /**
    * Update a question.
    */
   public static async updateQuestion(id: string, data: any) {
      const question = await this.getQuestionById(id);
      return await question.update(data);
   }

   /**
    * Delete a question.
    */
   public static async deleteQuestion(id: string) {
      const question = await this.getQuestionById(id);
      await question.destroy();
      return true;
   }
}

export default QuestionService;
