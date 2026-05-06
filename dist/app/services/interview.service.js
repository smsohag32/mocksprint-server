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
Object.defineProperty(exports, "__esModule", { value: true });
exports.InterviewService = void 0;
const interview_model_1 = require("../models/interview.model");
const question_model_1 = require("../models/question.model");
const questionCategory_model_1 = require("../models/questionCategory.model");
const user_model_1 = require("../models/user.model");
const ai_service_1 = require("./ai.service");
class InterviewService {
    /**
     * Get all interviews for a specific user
     */
    static getInterviewsByUser(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield interview_model_1.Interview.findAll({
                where: { userId },
                include: [
                    {
                        model: question_model_1.Question,
                        as: "question",
                        include: [
                            {
                                model: questionCategory_model_1.QuestionCategory,
                                as: "category",
                            },
                        ],
                    },
                ],
                order: [["createdAt", "DESC"]],
            });
        });
    }
    /**
     * Get all interviews paginated (Admin)
     */
    static getAllInterviewsPaged(_a) {
        return __awaiter(this, arguments, void 0, function* ({ page, limit }) {
            const offset = (page - 1) * limit;
            const { count, rows } = yield interview_model_1.Interview.findAndCountAll({
                limit,
                offset,
                include: [
                    {
                        model: user_model_1.User,
                        as: "user",
                        attributes: ["id", "name", "email"],
                    },
                    {
                        model: question_model_1.Question,
                        as: "question",
                        attributes: ["id", "title"],
                    },
                ],
                order: [["createdAt", "DESC"]],
            });
            return { interviews: rows, total: count };
        });
    }
    /**
     * Get a specific interview by ID for a user
     */
    static getInterviewById(id, userId) {
        return __awaiter(this, void 0, void 0, function* () {
            const interview = yield interview_model_1.Interview.findOne({
                where: { id, userId },
                include: [
                    {
                        model: question_model_1.Question,
                        as: "question",
                    },
                ],
            });
            if (!interview)
                throw new Error("Interview not found");
            return interview;
        });
    }
    /**
     * Start a new interview session
     */
    static startInterview(userId, questionId) {
        return __awaiter(this, void 0, void 0, function* () {
            const question = yield question_model_1.Question.findByPk(questionId);
            if (!question) {
                throw new Error("Question not found");
            }
            return yield interview_model_1.Interview.create({
                userId,
                questionId,
                code: question.starter_code || "",
                status: "ongoing",
                score: null,
            });
        });
    }
    /**
     * Submit an interview session
     */
    static submitInterview(id, userId, code) {
        return __awaiter(this, void 0, void 0, function* () {
            const interview = yield interview_model_1.Interview.findOne({ where: { id, userId } });
            if (!interview) {
                throw new Error("Interview not found");
            }
            if (interview.status !== "ongoing") {
                throw new Error("Interview is already completed or abandoned");
            }
            // Use AI for evaluation
            const question = yield question_model_1.Question.findByPk(interview.questionId);
            const evaluation = yield ai_service_1.AiService.evaluateSolution(question, code || interview.code || "");
            yield interview.update({
                code: code || interview.code,
                score: evaluation.score,
                feedback: evaluation.feedback,
                status: "completed",
            });
            return Object.assign(Object.assign({}, interview.get()), { interviewerMessage: evaluation.interviewerMessage });
        });
    }
    /**
     * Abandon an interview session
     */
    static abandonInterview(id, userId) {
        return __awaiter(this, void 0, void 0, function* () {
            const interview = yield interview_model_1.Interview.findOne({ where: { id, userId } });
            if (!interview) {
                throw new Error("Interview not found");
            }
            if (interview.status !== "ongoing") {
                throw new Error("Interview is already completed or abandoned");
            }
            yield interview.update({
                status: "abandoned",
            });
            return interview;
        });
    }
    /**
     * Generate a hint for an ongoing interview
     */
    static generateHint(id, userId, currentCode) {
        return __awaiter(this, void 0, void 0, function* () {
            const interview = yield interview_model_1.Interview.findOne({
                where: { id, userId },
                include: [{ model: question_model_1.Question, as: "question" }]
            });
            if (!interview) {
                throw new Error("Interview not found");
            }
            if (interview.status !== "ongoing") {
                throw new Error("Cannot get a hint for a completed interview");
            }
            try {
                const hint = yield ai_service_1.AiService.generateHint(interview.question, currentCode);
                return { hint };
            }
            catch (error) {
                return {
                    hint: null,
                    error: error.message || "Failed to generate hint"
                };
            }
        });
    }
}
exports.InterviewService = InterviewService;
exports.default = InterviewService;
