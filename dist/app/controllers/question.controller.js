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
exports.QuestionController = void 0;
const question_service_1 = __importDefault(require("../services/question.service"));
class QuestionController {
    /**
     * GET /api/v1/questions
     */
    static getQuestions(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { category, difficulty, search } = req.query;
                const questions = yield question_service_1.default.getQuestions({
                    category: category,
                    difficulty: difficulty,
                    search: search,
                });
                res.status(200).json({
                    success: true,
                    message: "Questions retrieved successfully.",
                    questions,
                    httpStatusCode: 200,
                });
            }
            catch (error) {
                res.status(500).json({
                    success: false,
                    message: error.message || "Failed to fetch questions.",
                    httpStatusCode: 500,
                });
            }
        });
    }
    /**
     * GET /api/v1/questions/:id
     */
    static getQuestion(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { id } = req.params;
                const question = yield question_service_1.default.getQuestionById(id);
                res.status(200).json({
                    success: true,
                    message: "Question retrieved successfully.",
                    question,
                    httpStatusCode: 200,
                });
            }
            catch (error) {
                res.status(404).json({
                    success: false,
                    message: error.message || "Question not found.",
                    httpStatusCode: 404,
                });
            }
        });
    }
    /**
     * POST /api/v1/questions
     * Supports single or bulk creation.
     */
    static createQuestion(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const data = req.body;
                if (Array.isArray(data)) {
                    const questions = yield question_service_1.default.bulkCreateQuestions(data);
                    res.status(201).json({
                        success: true,
                        message: `${questions.length} questions created successfully.`,
                        questions,
                        httpStatusCode: 201,
                    });
                }
                else {
                    const question = yield question_service_1.default.createQuestion(data);
                    res.status(201).json({
                        success: true,
                        message: "Question created successfully.",
                        question,
                        httpStatusCode: 201,
                    });
                }
            }
            catch (error) {
                res.status(400).json({
                    success: false,
                    message: error.message || "Failed to create question(s).",
                    httpStatusCode: 400,
                });
            }
        });
    }
    /**
     * PUT /api/v1/questions/:id
     */
    static updateQuestion(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { id } = req.params;
                const data = req.body;
                const question = yield question_service_1.default.updateQuestion(id, data);
                res.status(200).json({
                    success: true,
                    message: "Question updated successfully.",
                    question,
                    httpStatusCode: 200,
                });
            }
            catch (error) {
                res.status(400).json({
                    success: false,
                    message: error.message || "Failed to update question.",
                    httpStatusCode: 400,
                });
            }
        });
    }
    /**
     * DELETE /api/v1/questions/:id
     */
    static deleteQuestion(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { id } = req.params;
                yield question_service_1.default.deleteQuestion(id);
                res.status(200).json({
                    success: true,
                    message: "Question deleted successfully.",
                    httpStatusCode: 200,
                });
            }
            catch (error) {
                res.status(400).json({
                    success: false,
                    message: error.message || "Failed to delete question.",
                    httpStatusCode: 400,
                });
            }
        });
    }
}
exports.QuestionController = QuestionController;
exports.default = QuestionController;
