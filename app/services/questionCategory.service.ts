import QuestionCategory from "../models/questionCategory.model";
import { Op } from "sequelize";

export class QuestionCategoryService {
   /**
    * Fetch all categories with optional search and status filters.
    */
   public static async getAllCategories(filters: {
      search?: string;
      status?: string;
   }) {
      const { search, status } = filters;
      const where: any = {};

      if (search) {
         where.name = { [Op.like]: `%${search}%` };
      }

      if (status === "active") {
         where.is_active = true;
      } else if (status === "inactive") {
         where.is_active = false;
      }

      return await QuestionCategory.findAll({
         where,
         order: [["name", "ASC"]],
      });
   }

   /**
    * Get a single category by ID.
    */
   public static async getCategoryById(id: string) {
      const category = await QuestionCategory.findByPk(id);
      if (!category) {
         throw new Error("Category not found.");
      }
      return category;
   }

   /**
    * Create a new category.
    */
   public static async createCategory(data: { name: string; description?: string }) {
      // Check if name already exists
      const existing = await QuestionCategory.findOne({ where: { name: data.name } });
      if (existing) {
         throw new Error("Category with this name already exists.");
      }

      return await QuestionCategory.create(data);
   }

   /**
    * Update an existing category.
    */
   public static async updateCategory(
      id: string,
      data: { name?: string; description?: string; is_active?: boolean }
   ) {
      const category = await this.getCategoryById(id);

      if (data.name && data.name !== category.name) {
         const existing = await QuestionCategory.findOne({ where: { name: data.name } });
         if (existing) {
            throw new Error("Category with this name already exists.");
         }
      }

      return await category.update(data);
   }

   /**
    * Delete a category.
    */
   public static async deleteCategory(id: string) {
      const category = await this.getCategoryById(id);
      await category.destroy();
      return true;
   }
}

export default QuestionCategoryService;
