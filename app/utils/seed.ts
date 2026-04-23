import User from "../models/user.model";
import dotenv from "dotenv";

dotenv.config();

/**
 * Seed a superuser if no admin user exists in the database.
 */
export const seedSuperUser = async (): Promise<void> => {
   try {
      // Check specifically if an admin role exists
      const adminExists = await User.findOne({ where: { role: "admin" } });

      if (!adminExists) {
         console.log("🌱 No admin user found. Creating super user...");

         const {
            SUPER_USER_NAME = "Admin",
            SUPER_USER_EMAIL = "admin@gmail.com",
            SUPER_USER_PASSWORD = "admin123",
         } = process.env;

         await User.create({
            name: SUPER_USER_NAME,
            email: SUPER_USER_EMAIL,
            password: SUPER_USER_PASSWORD,
            role: "admin",
            is_verified: true,
            is_active: true,
         });

         console.log(`✅ Super user created: ${SUPER_USER_EMAIL}`);
      }
   } catch (error: any) {
      console.error("❌ Error seeding super user:", error.message);
   }
};
