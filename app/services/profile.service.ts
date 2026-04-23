import Profile from "../models/profile.model";
import User from "../models/user.model";

export class ProfileService {
   /**
    * Update user profile and basic info.
    * Handles profile image upload if provided.
    */
   public static async updateProfile(userId: string, data: any, file?: Express.Multer.File) {
      const user = await User.findByPk(userId);
      if (!user) throw new Error("User not found.");

      // Update basic user info
      if (data.name) {
         await user.update({ name: data.name });
      }

      let profile = await Profile.findOne({ where: { userId } });
      if (!profile) {
         profile = await Profile.create({ userId });
      }

      const updateData: any = { ...data };
      
      // If a file is uploaded, store the relative path
      if (file) {
         updateData.profile_image = `/uploads/profiles/${file.filename}`;
      }

      // We don't want to accidentally update userId or id
      delete updateData.userId;
      delete updateData.id;

      await profile.update(updateData);

      // Fetch fresh combined data
      const updatedUser = await User.findByPk(userId, {
         attributes: { exclude: ["password", "email_verification_token", "email_verification_expires"] },
      });
      const updatedProfile = await Profile.findOne({ where: { userId } });

      return {
         ...updatedUser?.toJSON(),
         ...updatedProfile?.toJSON(),
      };
   }
}

export default ProfileService;
