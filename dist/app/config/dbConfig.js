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
exports.connectDb = exports.sequelize = void 0;
const sequelize_1 = require("sequelize");
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const { DB_HOST = "localhost", DB_PORT = "3306", DB_USER = "root", DB_PASSWORD = "", DB_NAME = "mocksprint_db", } = process.env;
exports.sequelize = new sequelize_1.Sequelize(DB_NAME, DB_USER, DB_PASSWORD, {
    host: DB_HOST,
    port: Number(DB_PORT),
    dialect: "mysql",
    logging: console.log, // Enabled logging to see the SQL commands
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
const connectDb = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield exports.sequelize.authenticate();
        console.log("✅ MySQL database connected successfully.");
        // Sync all models: alter:true can sometimes cause "Too many keys" error in MySQL 
        // if it tries to recreate existing indexes repeatedly.
        // We'll use default sync() for now. If you need to update the schema, 
        // use { force: true } (WIPES DATA) or manually clean up the table indexes.
        yield exports.sequelize.sync();
        console.log("✅ All models synced to MySQL.");
    }
    catch (error) {
        console.error("❌ Unable to connect to MySQL:", error.message);
        process.exit(1);
    }
});
exports.connectDb = connectDb;
