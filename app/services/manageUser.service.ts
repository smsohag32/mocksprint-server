import { Op } from "sequelize";
import User from "../models/user.model";

export class ManageUserService {
   /**
    * Fetch paginated users with search and filter functionality.
    */
   public static async getAllUsersPaged(params: {
      page: number;
      limit: number;
      search?: string;
      status?: string;
      role?: string;
   }) {
      const { page, limit, search, status, role } = params;
      const offset = (page - 1) * limit;

      const where: any = {};

      // Search by name or email
      if (search) {
         where[Op.or] = [
            { name: { [Op.like]: `%${search}%` } },
            { email: { [Op.like]: `%${search}%` } },
         ];
      }

      // Filter by status (active/inactive)
      if (status) {
         where.is_active = status === "active";
      }

      // Filter by role
      if (role && role !== "all") {
         where.role = role;
      }

      const { rows: users, count: total } = await User.findAndCountAll({
         where,
         limit,
         offset,
         order: [["createdAt", "DESC"]],
         attributes: {
            exclude: ["password", "email_verification_token", "email_verification_expires"],
         },
         include: [
            {
               association: "profile",
               attributes: ["profile_image"],
            },
         ],
      });

      // Transform is_active to status string for frontend compatibility
      const usersWithStatus = users.map((u) => {
         const userJson = u.toJSON() as any;
         return {
            ...userJson,
            status: userJson.is_active ? "active" : "inactive",
            profile_image: userJson.profile?.profile_image || null,
         };
      });

      return { users: usersWithStatus, total };
   }

   /**
    * Get full user details including profile.
    */
   public static async getUserById(id: string) {
      const user = await User.findByPk(id, {
         attributes: {
            exclude: ["password", "email_verification_token", "email_verification_expires"],
         },
         include: ["profile"],
      });
      if (!user) throw new Error("User not found.");

      const userJson = user.toJSON();
      return {
         ...userJson,
         status: userJson.is_active ? "active" : "inactive",
      };
   }

   /**
    * Toggle a user's active status.
    */
   public static async toggleUserStatus(id: string, status: string) {
      const user = await User.findByPk(id);
      if (!user) throw new Error("User not found.");

      user.is_active = status === "active";
      await user.save();
      return user;
   }

   /**
    * Update user basic information and role.
    */
   public static async updateUser(id: string, data: { name: string; email: string; role: string }) {
      const user = await User.findByPk(id);
      if (!user) throw new Error("User not found.");

      // Check if email is already taken by another user
      if (data.email !== user.email) {
         const existing = await User.findOne({ where: { email: data.email } });
         if (existing) throw new Error("Email is already in use.");
      }

      await user.update(data);
      return user;
   }

   /**
    * Permanently delete a user account.
    */
   public static async deleteUser(id: string) {
      const user = await User.findByPk(id);
      if (!user) throw new Error("User not found.");

      await user.destroy();
      return true;
   }
}

export default ManageUserService;
