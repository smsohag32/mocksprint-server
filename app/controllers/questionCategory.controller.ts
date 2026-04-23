import { Request, Response } from "express";
import QuestionCategoryService from "../services/questionCategory.service";

export class QuestionCategoryController {
   /**
    * GET /api/v1/admin/categories
    */
   public static async getCategories(req: Request, res: Response): Promise<void> {
      try {
         const search = req.query.search as string;
         const status = req.query.status as string;

         const categories = await QuestionCategoryService.getAllCategories({
            search,
            status,
         });

         res.status(200).json({
            success: true,
            message: "Categories retrieved successfully.",
            categories,
            httpStatusCode: 200,
         });
      } catch (error: any) {
         res.status(500).json({
            success: false,
            message: error.message || "Failed to fetch categories.",
            httpStatusCode: 500,
         });
      }
   }

   /**
    * POST /api/v1/admin/categories
    */
   public static async createCategory(req: Request, res: Response): Promise<void> {
      try {
         const { name, description } = req.body;

         if (!name) {
            res.status(400).json({
               success: false,
               message: "Category name is required.",
               httpStatusCode: 400,
            });
            return;
         }

         const category = await QuestionCategoryService.createCategory({ name, description });

         res.status(201).json({
            success: true,
            message: "Category created successfully.",
            category,
            httpStatusCode: 201,
         });
      } catch (error: any) {
         res.status(400).json({
            success: false,
            message: error.message || "Failed to create category.",
            httpStatusCode: 400,
         });
      }
   }

   /**
    * PUT /api/v1/admin/categories/:id
    */
   public static async updateCategory(req: Request, res: Response): Promise<void> {
      try {
         const { id } = req.params;
         const { name, description, is_active } = req.body;

         const category = await QuestionCategoryService.updateCategory(id, {
            name,
            description,
            is_active,
         });

         res.status(200).json({
            success: true,
            message: "Category updated successfully.",
            category,
            httpStatusCode: 200,
         });
      } catch (error: any) {
         res.status(400).json({
            success: false,
            message: error.message || "Failed to update category.",
            httpStatusCode: 400,
         });
      }
   }

   /**
    * DELETE /api/v1/admin/categories/:id
    */
   public static async deleteCategory(req: Request, res: Response): Promise<void> {
      try {
         const { id } = req.params;
         await QuestionCategoryService.deleteCategory(id);

         res.status(200).json({
            success: true,
            message: "Category deleted successfully.",
            httpStatusCode: 200,
         });
      } catch (error: any) {
         res.status(400).json({
            success: false,
            message: error.message || "Failed to delete category.",
            httpStatusCode: 400,
         });
      }
   }
}

export default QuestionCategoryController;
