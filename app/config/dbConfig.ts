import { Sequelize } from "sequelize";
import dotenv from "dotenv";

dotenv.config();

const {
   DB_HOST = "localhost",
   DB_PORT = "3306",
   DB_USER = "root",
   DB_PASSWORD = "",
   DB_NAME = "mocksprint_db",
} = process.env;

export const sequelize = new Sequelize(DB_NAME, DB_USER, DB_PASSWORD, {
   host: DB_HOST,
   port: Number(DB_PORT),
   dialect: "mysql",
   logging: false, // set to console.log to debug SQL
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
});

export const connectDb = async (): Promise<void> => {
   try {
      await sequelize.authenticate();
      console.log("✅ MySQL database connected successfully.");

      // Sync all models: alter=true updates columns without dropping data
      await sequelize.sync({ alter: true });
      console.log("✅ All models synced to MySQL.");
   } catch (error: any) {
      console.error("❌ Unable to connect to MySQL:", error.message);
      process.exit(1);
   }
};
