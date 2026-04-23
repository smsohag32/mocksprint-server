import { Request, Response } from "express";
import ManageUserService from "../services/manageUser.service";

export class AdminController {
   /**
    * GET /api/v1/admin/users
    * Fetch paginated list of users with optional search and status filters.
    */
   public static async getUsers(req: Request, res: Response): Promise<void> {
      try {
         const page = Number(req.query.page) || 1;
         const limit = Number(req.query.limit) || 10;
         const search = req.query.search as string;
         const status = req.query.status as string;
         const role = req.query.role as string;

         const { users, total } = await ManageUserService.getAllUsersPaged({
            page,
            limit,
            search,
            status,
            role,
         });

         res.status(200).json({
            success: true,
            message: "Users retrieved successfully.",
            users,
            total,
            httpStatusCode: 200,
         });
      } catch (error: any) {
         res.status(500).json({
            success: false,
            message: error.message || "Failed to fetch users.",
            httpStatusCode: 500,
         });
      }
   }

   /**
    * GET /api/v1/admin/users/:id
    * Get full details of a specific user.
    */
   public static async getUserDetails(req: Request, res: Response): Promise<void> {
      try {
         const { id } = req.params;
         const user = await ManageUserService.getUserById(id);

         res.status(200).json({
            success: true,
            message: "User details retrieved successfully.",
            user,
            httpStatusCode: 200,
         });
      } catch (error: any) {
         res.status(404).json({
            success: false,
            message: error.message || "User not found.",
            httpStatusCode: 404,
         });
      }
   }

   /**
    * PATCH /api/v1/admin/users/:id/status
    * Toggle user account status (active/inactive).
    */
   public static async toggleStatus(req: Request, res: Response): Promise<void> {
      try {
         const { id } = req.params;
         const { status } = req.body;

         if (!status || !["active", "inactive"].includes(status)) {
            res.status(400).json({
               success: false,
               message: "Invalid status provided.",
               httpStatusCode: 400,
            });
            return;
         }

         await ManageUserService.toggleUserStatus(id, status);

         res.status(200).json({
            success: true,
            message: `User status successfully updated to ${status}.`,
            httpStatusCode: 200,
         });
      } catch (error: any) {
         res.status(400).json({
            success: false,
            message: error.message || "Failed to update status.",
            httpStatusCode: 400,
         });
      }
   }

   /**
    * PUT /api/v1/admin/users/:id
    * Update user profile information and role.
    */
   public static async updateUser(req: Request, res: Response): Promise<void> {
      try {
         const { id } = req.params;
         const { name, email, role } = req.body;

         if (!name || !email || !role) {
            res.status(400).json({
               success: false,
               message: "Missing required fields.",
               httpStatusCode: 400,
            });
            return;
         }

         const user = await ManageUserService.updateUser(id, { name, email, role });

         res.status(200).json({
            success: true,
            message: "User account updated successfully.",
            user,
            httpStatusCode: 200,
         });
      } catch (error: any) {
         res.status(400).json({
            success: false,
            message: error.message || "Failed to update user.",
            httpStatusCode: 400,
         });
      }
   }

   /**
    * DELETE /api/v1/admin/users/:id
    * Permanently remove a user account.
    */
   public static async deleteUser(req: Request, res: Response): Promise<void> {
      try {
         const { id } = req.params;
         await ManageUserService.deleteUser(id);

         res.status(200).json({
            success: true,
            message: "User account deleted successfully.",
            httpStatusCode: 200,
         });
      } catch (error: any) {
         res.status(400).json({
            success: false,
            message: error.message || "Failed to delete user.",
            httpStatusCode: 400,
         });
      }
   }
}

export default AdminController;
