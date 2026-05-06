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
exports.QuestionService = void 0;
const question_model_1 = __importDefault(require("../models/question.model"));
const questionCategory_model_1 = __importDefault(require("../models/questionCategory.model"));
const sequelize_1 = require("sequelize");
class QuestionService {
    /**
     * Fetch questions with filtering and pagination.
     */
    static getQuestions(filters) {
        return __awaiter(this, void 0, void 0, function* () {
            const { category, difficulty, search } = filters;
            const where = {};
            if (category) {
                where.categoryId = category;
            }
            if (difficulty) {
                where.difficulty = difficulty;
            }
            if (search) {
                where.title = { [sequelize_1.Op.like]: `%${search}%` };
            }
            return yield question_model_1.default.findAll({
                where,
                include: [
                    {
                        model: questionCategory_model_1.default,
                        as: "category",
                        attributes: ["id", "name"],
                    },
                ],
                order: [["createdAt", "DESC"]],
            });
        });
    }
    /**
     * Get a single question by ID.
     */
    static getQuestionById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const question = yield question_model_1.default.findByPk(id, {
                include: [
                    {
                        model: questionCategory_model_1.default,
                        as: "category",
                        attributes: ["id", "name"],
                    },
                ],
            });
            if (!question) {
                throw new Error("Question not found.");
            }
            return question;
        });
    }
    /**
     * Create a single question.
     */
    static createQuestion(data) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield question_model_1.default.create(data);
        });
    }
    /**
     * Bulk create questions.
     */
    static bulkCreateQuestions(questions) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!Array.isArray(questions) || questions.length === 0) {
                throw new Error("Invalid questions data.");
            }
            return yield question_model_1.default.bulkCreate(questions);
        });
    }
    /**
     * Update a question.
     */
    static updateQuestion(id, data) {
        return __awaiter(this, void 0, void 0, function* () {
            const question = yield this.getQuestionById(id);
            return yield question.update(data);
        });
    }
    /**
     * Delete a question.
     */
    static deleteQuestion(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const question = yield this.getQuestionById(id);
            yield question.destroy();
            return true;
        });
    }
}
exports.QuestionService = QuestionService;
exports.default = QuestionService;
