import { Op, fn, col } from "sequelize";
import User from "../models/user.model";
import Question from "../models/question.model";
import Interview from "../models/interview.model";
import QuestionCategory from "../models/questionCategory.model";
import { sequelize } from "../config/dbConfig";

export class DashboardService {
   /**
    * Get aggregate statistics for the admin dashboard.
    */
   public static async getAdminStats() {
      const [totalUsers, totalQuestions, totalInterviews] = await Promise.all([
         User.count(),
         Question.count(),
         Interview.count(),
      ]);

      // User growth (last 30 days)
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

      const userGrowth = await User.findAll({
         attributes: [
            [fn("DATE", col("createdAt")), "date"],
            [fn("COUNT", col("id")), "count"],
         ],
         where: {
            createdAt: { [Op.gte]: thirtyDaysAgo },
         },
         group: [fn("DATE", col("createdAt"))],
         order: [[fn("DATE", col("createdAt")), "ASC"]],
      });

      // Interview activity (last 7 days)
      const sevenDaysAgo = new Date();
      sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

      const interviewActivity = await Interview.findAll({
         attributes: [
            [fn("DATE", col("createdAt")), "date"],
            [fn("COUNT", col("id")), "count"],
         ],
         where: {
            createdAt: { [Op.gte]: sevenDaysAgo },
         },
         group: [fn("DATE", col("createdAt"))],
         order: [[fn("DATE", col("createdAt")), "ASC"]],
      });

      // Category distribution
      const categoryDistribution = await Question.findAll({
         attributes: [
            [col("category.name"), "name"],
            [fn("COUNT", col("Question.id")), "count"],
         ],
         include: [
            {
               model: QuestionCategory,
               as: "category",
               attributes: [],
            },
         ],
         group: [col("category.name")],
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
   }

   /**
    * Get aggregate statistics for a specific user's dashboard.
    */
   public static async getUserStats(userId: string) {
      const totalAttempts = await Interview.count({ where: { userId } });
      const completedInterviews = await Interview.findAll({
         where: { userId, status: "completed" },
         include: [
            {
               model: Question,
               as: "question",
               include: [{ model: QuestionCategory, as: "category" }],
            },
         ],
         order: [["createdAt", "DESC"]],
      });

      const totalCompleted = completedInterviews.length;
      const averageScore =
         totalCompleted > 0
            ? Math.round(
                 completedInterviews.reduce((acc, curr) => acc + (curr.score || 0), 0) /
                    totalCompleted
              )
            : 0;

      // Score progression (last 10 completed)
      const scoreProgression = completedInterviews
         .slice(0, 10)
         .reverse()
         .map((i) => ({
            date: i.createdAt.toLocaleDateString(),
            score: i.score,
            title: i.question?.title,
         }));

      // Skill distribution (avg score per category)
      const categoryScores: Record<string, { total: number; count: number }> = {};
      completedInterviews.forEach((i) => {
         const catName = i.question?.category?.name || "Other";
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
      const recentActivity = await Interview.findAll({
         where: {
            userId,
            createdAt: { [Op.gte]: sevenDaysAgo },
         },
         attributes: [
            [fn("DATE", col("createdAt")), "date"],
            [fn("COUNT", col("id")), "count"],
         ],
         group: [fn("DATE", col("createdAt"))],
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
   }
}

export default DashboardService;
