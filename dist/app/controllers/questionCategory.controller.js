"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.QuestionCategoryController = void 0;
const questionCategory_service_1 = __importDefault(require("../services/questionCategory.service"));
class QuestionCategoryController {
    /**
     * GET /api/v1/admin/categories
     */
    static getCategories(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const search = req.query.search;
                const status = req.query.status;
                const categories = yield questionCategory_service_1.default.getAllCategories({
                    search,
                    status,
                });
                res.status(200).json({
                    success: true,
                    message: "Categories retrieved successfully.",
                    categories,
                    httpStatusCode: 200,
                });
            }
            catch (error) {
                res.status(500).json({
                    success: false,
                    message: error.message || "Failed to fetch categories.",
                    httpStatusCode: 500,
                });
            }
        });
    }
    /**
     * POST /api/v1/admin/categories
     */
    static createCategory(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
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
                const category = yield questionCategory_service_1.default.createCategory({ name, description });
                res.status(201).json({
                    success: true,
                    message: "Category created successfully.",
                    category,
                    httpStatusCode: 201,
                });
            }
            catch (error) {
                res.status(400).json({
                    success: false,
                    message: error.message || "Failed to create category.",
                    httpStatusCode: 400,
                });
            }
        });
    }
    /**
     * PUT /api/v1/admin/categories/:id
     */
    static updateCategory(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { id } = req.params;
                const { name, description, is_active } = req.body;
                const category = yield questionCategory_service_1.default.updateCategory(id, {
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
            }
            catch (error) {
                res.status(400).json({
                    success: false,
                    message: error.message || "Failed to update category.",
                    httpStatusCode: 400,
                });
            }
        });
    }
    /**
     * DELETE /api/v1/admin/categories/:id
     */
    static deleteCategory(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { id } = req.params;
                yield questionCategory_service_1.default.deleteCategory(id);
                res.status(200).json({
                    success: true,
                    message: "Category deleted successfully.",
                    httpStatusCode: 200,
                });
            }
            catch (error) {
                res.status(400).json({
                    success: false,
                    message: error.message || "Failed to delete category.",
                    httpStatusCode: 400,
                });
            }
        });
    }
}
exports.QuestionCategoryController = QuestionCategoryController;
exports.default = QuestionCategoryController;
