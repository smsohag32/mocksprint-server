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
exports.QuestionCategoryService = void 0;
const questionCategory_model_1 = __importDefault(require("../models/questionCategory.model"));
const sequelize_1 = require("sequelize");
class QuestionCategoryService {
    /**
     * Fetch all categories with optional search and status filters.
     */
    static getAllCategories(filters) {
        return __awaiter(this, void 0, void 0, function* () {
            const { search, status } = filters;
            const where = {};
            if (search) {
                where.name = { [sequelize_1.Op.like]: `%${search}%` };
            }
            if (status === "active") {
                where.is_active = true;
            }
            else if (status === "inactive") {
                where.is_active = false;
            }
            return yield questionCategory_model_1.default.findAll({
                where,
                order: [["name", "ASC"]],
            });
        });
    }
    /**
     * Get a single category by ID.
     */
    static getCategoryById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const category = yield questionCategory_model_1.default.findByPk(id);
            if (!category) {
                throw new Error("Category not found.");
            }
            return category;
        });
    }
    /**
     * Create a new category.
     */
    static createCategory(data) {
        return __awaiter(this, void 0, void 0, function* () {
            // Check if name already exists
            const existing = yield questionCategory_model_1.default.findOne({ where: { name: data.name } });
            if (existing) {
                throw new Error("Category with this name already exists.");
            }
            return yield questionCategory_model_1.default.create(data);
        });
    }
    /**
     * Update an existing category.
     */
    static updateCategory(id, data) {
        return __awaiter(this, void 0, void 0, function* () {
            const category = yield this.getCategoryById(id);
            if (data.name && data.name !== category.name) {
                const existing = yield questionCategory_model_1.default.findOne({ where: { name: data.name } });
                if (existing) {
                    throw new Error("Category with this name already exists.");
                }
            }
            return yield category.update(data);
        });
    }
    /**
     * Delete a category.
     */
    static deleteCategory(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const category = yield this.getCategoryById(id);
            yield category.destroy();
            return true;
        });
    }
}
exports.QuestionCategoryService = QuestionCategoryService;
exports.default = QuestionCategoryService;
