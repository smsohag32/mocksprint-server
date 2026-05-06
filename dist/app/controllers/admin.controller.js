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
exports.AdminController = void 0;
const manageUser_service_1 = __importDefault(require("../services/manageUser.service"));
const interview_service_1 = __importDefault(require("../services/interview.service"));
class AdminController {
    /**
     * GET /api/v1/admin/users
     * Fetch paginated list of users with optional search and status filters.
     */
    static getUsers(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const page = Number(req.query.page) || 1;
                const limit = Number(req.query.limit) || 10;
                const search = req.query.search;
                const status = req.query.status;
                const role = req.query.role;
                const { users, total } = yield manageUser_service_1.default.getAllUsersPaged({
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
            }
            catch (error) {
                res.status(500).json({
                    success: false,
                    message: error.message || "Failed to fetch users.",
                    httpStatusCode: 500,
                });
            }
        });
    }
    /**
     * GET /api/v1/admin/interviews
     * Fetch paginated list of all interviews.
     */
    static getInterviews(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const page = Number(req.query.page) || 1;
                const limit = Number(req.query.limit) || 10;
                const { interviews, total } = yield interview_service_1.default.getAllInterviewsPaged({
                    page,
                    limit,
                });
                res.status(200).json({
                    success: true,
                    message: "Interviews retrieved successfully.",
                    interviews,
                    total,
                    httpStatusCode: 200,
                });
            }
            catch (error) {
                res.status(500).json({
                    success: false,
                    message: error.message || "Failed to fetch interviews.",
                    httpStatusCode: 500,
                });
            }
        });
    }
    /**
     * GET /api/v1/admin/users/:id
     * Get full details of a specific user.
     */
    static getUserDetails(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { id } = req.params;
                const user = yield manageUser_service_1.default.getUserById(id);
                res.status(200).json({
                    success: true,
                    message: "User details retrieved successfully.",
                    user,
                    httpStatusCode: 200,
                });
            }
            catch (error) {
                res.status(404).json({
                    success: false,
                    message: error.message || "User not found.",
                    httpStatusCode: 404,
                });
            }
        });
    }
    /**
     * PATCH /api/v1/admin/users/:id/status
     * Toggle user account status (active/inactive).
     */
    static toggleStatus(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
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
                yield manageUser_service_1.default.toggleUserStatus(id, status);
                res.status(200).json({
                    success: true,
                    message: `User status successfully updated to ${status}.`,
                    httpStatusCode: 200,
                });
            }
            catch (error) {
                res.status(400).json({
                    success: false,
                    message: error.message || "Failed to update status.",
                    httpStatusCode: 400,
                });
            }
        });
    }
    /**
     * PUT /api/v1/admin/users/:id
     * Update user profile information and role.
     */
    static updateUser(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
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
                const user = yield manageUser_service_1.default.updateUser(id, { name, email, role });
                res.status(200).json({
                    success: true,
                    message: "User account updated successfully.",
                    user,
                    httpStatusCode: 200,
                });
            }
            catch (error) {
                res.status(400).json({
                    success: false,
                    message: error.message || "Failed to update user.",
                    httpStatusCode: 400,
                });
            }
        });
    }
    /**
     * DELETE /api/v1/admin/users/:id
     * Permanently remove a user account.
     */
    static deleteUser(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { id } = req.params;
                yield manageUser_service_1.default.deleteUser(id);
                res.status(200).json({
                    success: true,
                    message: "User account deleted successfully.",
                    httpStatusCode: 200,
                });
            }
            catch (error) {
                res.status(400).json({
                    success: false,
                    message: error.message || "Failed to delete user.",
                    httpStatusCode: 400,
                });
            }
        });
    }
}
exports.AdminController = AdminController;
exports.default = AdminController;
