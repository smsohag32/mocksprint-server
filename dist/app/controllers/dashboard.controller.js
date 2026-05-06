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
exports.DashboardController = void 0;
const dashboard_service_1 = __importDefault(require("../services/dashboard.service"));
class DashboardController {
    /**
     * GET /api/v1/dashboard/admin
     * Fetch stats for admin dashboard.
     */
    static getAdminStats(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const stats = yield dashboard_service_1.default.getAdminStats();
                res.status(200).json({
                    success: true,
                    data: stats,
                    httpStatusCode: 200,
                });
            }
            catch (error) {
                res.status(500).json({
                    success: false,
                    message: error.message || "Failed to fetch admin stats.",
                    httpStatusCode: 500,
                });
            }
        });
    }
    /**
     * GET /api/v1/dashboard/user
     * Fetch stats for the logged-in user.
     */
    static getUserStats(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const userId = req.user.id;
                const stats = yield dashboard_service_1.default.getUserStats(userId);
                res.status(200).json({
                    success: true,
                    data: stats,
                    httpStatusCode: 200,
                });
            }
            catch (error) {
                res.status(500).json({
                    success: false,
                    message: error.message || "Failed to fetch user stats.",
                    httpStatusCode: 500,
                });
            }
        });
    }
}
exports.DashboardController = DashboardController;
exports.default = DashboardController;
