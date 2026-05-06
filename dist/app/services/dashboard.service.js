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
exports.DashboardService = void 0;
const sequelize_1 = require("sequelize");
const user_model_1 = __importDefault(require("../models/user.model"));
const question_model_1 = __importDefault(require("../models/question.model"));
const interview_model_1 = __importDefault(require("../models/interview.model"));
const questionCategory_model_1 = __importDefault(require("../models/questionCategory.model"));
class DashboardService {
    /**
     * Get aggregate statistics for the admin dashboard.
     */
    static getAdminStats() {
        return __awaiter(this, void 0, void 0, function* () {
            const [totalUsers, totalQuestions, totalInterviews] = yield Promise.all([
                user_model_1.default.count(),
                question_model_1.default.count(),
                interview_model_1.default.count(),
            ]);
            // User growth (last 30 days)
            const thirtyDaysAgo = new Date();
            thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
            const userGrowth = yield user_model_1.default.findAll({
                attributes: [
                    [(0, sequelize_1.fn)("DATE", (0, sequelize_1.col)("createdAt")), "date"],
                    [(0, sequelize_1.fn)("COUNT", (0, sequelize_1.col)("id")), "count"],
                ],
                where: {
                    createdAt: { [sequelize_1.Op.gte]: thirtyDaysAgo },
                },
                group: [(0, sequelize_1.fn)("DATE", (0, sequelize_1.col)("createdAt"))],
                order: [[(0, sequelize_1.fn)("DATE", (0, sequelize_1.col)("createdAt")), "ASC"]],
            });
            // Interview activity (last 7 days)
            const sevenDaysAgo = new Date();
            sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
            const interviewActivity = yield interview_model_1.default.findAll({
                attributes: [
                    [(0, sequelize_1.fn)("DATE", (0, sequelize_1.col)("createdAt")), "date"],
                    [(0, sequelize_1.fn)("COUNT", (0, sequelize_1.col)("id")), "count"],
                ],
                where: {
                    createdAt: { [sequelize_1.Op.gte]: sevenDaysAgo },
                },
                group: [(0, sequelize_1.fn)("DATE", (0, sequelize_1.col)("createdAt"))],
                order: [[(0, sequelize_1.fn)("DATE", (0, sequelize_1.col)("createdAt")), "ASC"]],
            });
            // Category distribution
            const categoryDistribution = yield question_model_1.default.findAll({
                attributes: [
                    [(0, sequelize_1.col)("category.name"), "name"],
                    [(0, sequelize_1.fn)("COUNT", (0, sequelize_1.col)("Question.id")), "count"],
                ],
                include: [
                    {
                        model: questionCategory_model_1.default,
                        as: "category",
                        attributes: [],
                    },
                ],
                group: [(0, sequelize_1.col)("category.name")],
            });
            return {
                stats: {
                    totalUsers,
                    totalQuestions,
                    totalInterviews,
                    activeNow: Math.floor(Math.random() * 10) + 1, // Simulated active users
                },
                userGrowth,
                interviewActivity,
                categoryDistribution,
            };
        });
    }
    /**
     * Get aggregate statistics for a specific user's dashboard.
     */
    static getUserStats(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            const totalAttempts = yield interview_model_1.default.count({ where: { userId } });
            const completedInterviews = yield interview_model_1.default.findAll({
                where: { userId, status: "completed" },
                include: [
                    {
                        model: question_model_1.default,
                        as: "question",
                        include: [{ model: questionCategory_model_1.default, as: "category" }],
                    },
                ],
                order: [["createdAt", "DESC"]],
            });
            const totalCompleted = completedInterviews.length;
            const averageScore = totalCompleted > 0
                ? Math.round(completedInterviews.reduce((acc, curr) => acc + (curr.score || 0), 0) /
                    totalCompleted)
                : 0;
            // Score progression (last 10 completed)
            const scoreProgression = completedInterviews
                .slice(0, 10)
                .reverse()
                .map((i) => {
                var _a;
                return ({
                    date: i.createdAt.toLocaleDateString(),
                    score: i.score,
                    title: (_a = i.question) === null || _a === void 0 ? void 0 : _a.title,
                });
            });
            // Skill distribution (avg score per category)
            const categoryScores = {};
            completedInterviews.forEach((i) => {
                var _a, _b;
                const catName = ((_b = (_a = i.question) === null || _a === void 0 ? void 0 : _a.category) === null || _b === void 0 ? void 0 : _b.name) || "Other";
                if (!categoryScores[catName]) {
                    categoryScores[catName] = { total: 0, count: 0 };
                }
                categoryScores[catName].total += i.score || 0;
                categoryScores[catName].count += 1;
            });
            const skillDistribution = Object.entries(categoryScores).map(([name, data]) => ({
                subject: name,
                A: Math.round(data.total / data.count),
                fullMark: 100,
            }));
            // Consistency streak (last 7 days activity)
            const sevenDaysAgo = new Date();
            sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
            const recentActivity = yield interview_model_1.default.findAll({
                where: {
                    userId,
                    createdAt: { [sequelize_1.Op.gte]: sevenDaysAgo },
                },
                attributes: [
                    [(0, sequelize_1.fn)("DATE", (0, sequelize_1.col)("createdAt")), "date"],
                    [(0, sequelize_1.fn)("COUNT", (0, sequelize_1.col)("id")), "count"],
                ],
                group: [(0, sequelize_1.fn)("DATE", (0, sequelize_1.col)("createdAt"))],
            });
            return {
                stats: {
                    totalAttempts,
                    totalCompleted,
                    averageScore,
                    streak: 0, // Simplified streak for now
                },
                scoreProgression,
                skillDistribution,
                recentActivity,
            };
        });
    }
}
exports.DashboardService = DashboardService;
exports.default = DashboardService;
