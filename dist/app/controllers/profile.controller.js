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
exports.ProfileController = void 0;
const profile_service_1 = __importDefault(require("../services/profile.service"));
class ProfileController {
    /**
     * PUT /api/v1/auth/profile
     * Updates the logged-in user's profile information and profile image.
     */
    static updateProfile(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            try {
                const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.user_id;
                if (!userId) {
                    res.status(401).json({
                        success: false,
                        message: "Unauthorized. Please log in.",
                        httpStatusCode: 401,
                    });
                    return;
                }
                const updatedUser = yield profile_service_1.default.updateProfile(userId, req.body, req.file);
                res.status(200).json({
                    success: true,
                    message: "Profile updated successfully.",
                    user: updatedUser,
                    httpStatusCode: 200,
                });
            }
            catch (error) {
                res.status(400).json({
                    success: false,
                    message: error.message || "Failed to update profile.",
                    httpStatusCode: 400,
                });
            }
        });
    }
}
exports.ProfileController = ProfileController;
exports.default = ProfileController;
