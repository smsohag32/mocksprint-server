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
exports.ManageUserService = void 0;
const sequelize_1 = require("sequelize");
const user_model_1 = __importDefault(require("../models/user.model"));
class ManageUserService {
    /**
     * Fetch paginated users with search and filter functionality.
     */
    static getAllUsersPaged(params) {
        return __awaiter(this, void 0, void 0, function* () {
            const { page, limit, search, status, role } = params;
            const offset = (page - 1) * limit;
            const where = {};
            // Search by name or email
            if (search) {
                where[sequelize_1.Op.or] = [
                    { name: { [sequelize_1.Op.like]: `%${search}%` } },
                    { email: { [sequelize_1.Op.like]: `%${search}%` } },
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
            const { rows: users, count: total } = yield user_model_1.default.findAndCountAll({
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
                var _a;
                const userJson = u.toJSON();
                return Object.assign(Object.assign({}, userJson), { status: userJson.is_active ? "active" : "inactive", profile_image: ((_a = userJson.profile) === null || _a === void 0 ? void 0 : _a.profile_image) || null });
            });
            return { users: usersWithStatus, total };
        });
    }
    /**
     * Get full user details including profile.
     */
    static getUserById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = yield user_model_1.default.findByPk(id, {
                attributes: {
                    exclude: ["password", "email_verification_token", "email_verification_expires"],
                },
                include: ["profile"],
            });
            if (!user)
                throw new Error("User not found.");
            const userJson = user.toJSON();
            return Object.assign(Object.assign({}, userJson), { status: userJson.is_active ? "active" : "inactive" });
        });
    }
    /**
     * Toggle a user's active status.
     */
    static toggleUserStatus(id, status) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = yield user_model_1.default.findByPk(id);
            if (!user)
                throw new Error("User not found.");
            user.is_active = status === "active";
            yield user.save();
            return user;
        });
    }
    /**
     * Update user basic information and role.
     */
    static updateUser(id, data) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = yield user_model_1.default.findByPk(id);
            if (!user)
                throw new Error("User not found.");
            // Check if email is already taken by another user
            if (data.email !== user.email) {
                const existing = yield user_model_1.default.findOne({ where: { email: data.email } });
                if (existing)
                    throw new Error("Email is already in use.");
            }
            yield user.update(data);
            return user;
        });
    }
    /**
     * Permanently delete a user account.
     */
    static deleteUser(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = yield user_model_1.default.findByPk(id);
            if (!user)
                throw new Error("User not found.");
            yield user.destroy();
            return true;
        });
    }
}
exports.ManageUserService = ManageUserService;
exports.default = ManageUserService;
