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
exports.seedSuperUser = void 0;
const user_model_1 = __importDefault(require("../models/user.model"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
/**
 * Seed a superuser if no admin user exists in the database.
 */
const seedSuperUser = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // Check specifically if an admin role exists
        const adminExists = yield user_model_1.default.findOne({ where: { role: "admin" } });
        if (!adminExists) {
            console.log("🌱 No admin user found. Creating super user...");
            const { SUPER_USER_NAME = "Admin", SUPER_USER_EMAIL = "admin@gmail.com", SUPER_USER_PASSWORD = "admin123", } = process.env;
            yield user_model_1.default.create({
                name: SUPER_USER_NAME,
                email: SUPER_USER_EMAIL,
                password: SUPER_USER_PASSWORD,
                role: "admin",
                is_verified: true,
                is_active: true,
            });
            console.log(`✅ Super user created: ${SUPER_USER_EMAIL}`);
        }
    }
    catch (error) {
        console.error("❌ Error seeding super user:", error.message);
    }
});
exports.seedSuperUser = seedSuperUser;
