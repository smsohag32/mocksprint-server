import { Request, Response } from "express";
import ProfileService from "../services/profile.service";

export class ProfileController {
   /**
    * PUT /api/v1/auth/profile
    * Updates the logged-in user's profile information and profile image.
    */
   public static async updateProfile(req: Request, res: Response): Promise<void> {
      try {
         const userId = req.user?.user_id;
         if (!userId) {
            res.status(401).json({
               success: false,
               message: "Unauthorized. Please log in.",
               httpStatusCode: 401,
            });
            return;
         }

         const updatedUser = await ProfileService.updateProfile(userId, req.body, req.file);

         res.status(200).json({
            success: true,
            message: "Profile updated successfully.",
            user: updatedUser,
            httpStatusCode: 200,
         });
      } catch (error: any) {
         res.status(400).json({
            success: false,
            message: error.message || "Failed to update profile.",
            httpStatusCode: 400,
         });
      }
   }
}

export default ProfileController;
