import { Sequelize } from "sequelize";
import dotenv from "dotenv";

dotenv.config();

const { DB_HOST = "localhost", DB_USER, DB_PASSWORD, DB_NAME } = process.env;

export const sequelize = new Sequelize(
   DB_NAME as string,
   DB_USER as string,
   DB_PASSWORD as string,
   {
      host: DB_HOST,
      dialect: "mysql",
      logging: false,
      pool: {
         max: 10,
         min: 0,
         acquire: 30000,
         idle: 10000,
      },
      define: {
         timestamps: true,
         underscored: false,
      },
   },
);

export const connectDb = async (): Promise<void> => {
   try {
      await sequelize.authenticate();
      console.log("✅ MySQL database connected successfully.");

      // Sync all models
      await sequelize.sync();
      console.log("✅ All models synced to MySQL.");
   } catch (error: any) {
      console.error("❌ Unable to connect to MySQL:", error.message);
      process.exit(1);
   }
};
