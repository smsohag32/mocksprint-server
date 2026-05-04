import { Request, Response } from "express";
import DashboardService from "../services/dashboard.service";

export class DashboardController {
   /**
    * GET /api/v1/dashboard/admin
    * Fetch stats for admin dashboard.
    */
   public static async getAdminStats(req: Request, res: Response): Promise<void> {
      try {
         const stats = await DashboardService.getAdminStats();
         res.status(200).json({
            success: true,
            data: stats,
            httpStatusCode: 200,
         });
      } catch (error: any) {
         res.status(500).json({
            success: false,
            message: error.message || "Failed to fetch admin stats.",
            httpStatusCode: 500,
         });
      }
   }

   /**
    * GET /api/v1/dashboard/user
    * Fetch stats for the logged-in user.
    */
   public static async getUserStats(req: Request, res: Response): Promise<void> {
      try {
         const userId = (req as any).user.id;
         const stats = await DashboardService.getUserStats(userId);
         res.status(200).json({
            success: true,
            data: stats,
            httpStatusCode: 200,
         });
      } catch (error: any) {
         res.status(500).json({
            success: false,
            message: error.message || "Failed to fetch user stats.",
            httpStatusCode: 500,
         });
      }
   }
}

export default DashboardController;
