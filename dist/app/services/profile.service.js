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
exports.ProfileService = void 0;
const profile_model_1 = __importDefault(require("../models/profile.model"));
const user_model_1 = __importDefault(require("../models/user.model"));
class ProfileService {
    /**
     * Update user profile and basic info.
     * Handles profile image upload if provided.
     */
    static updateProfile(userId, data, file) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = yield user_model_1.default.findByPk(userId);
            if (!user)
                throw new Error("User not found.");
            // Update basic user info
            if (data.name) {
                yield user.update({ name: data.name });
            }
            let profile = yield profile_model_1.default.findOne({ where: { userId } });
            if (!profile) {
                profile = yield profile_model_1.default.create({ userId });
            }
            const updateData = Object.assign({}, data);
            // If a file is uploaded, store the relative path
            if (file) {
                updateData.profile_image = `/uploads/profiles/${file.filename}`;
            }
            // We don't want to accidentally update userId or id
            delete updateData.userId;
            delete updateData.id;
            yield profile.update(updateData);
            // Fetch fresh combined data
            const updatedUser = yield user_model_1.default.findByPk(userId, {
                attributes: { exclude: ["password", "email_verification_token", "email_verification_expires"] },
            });
            const updatedProfile = yield profile_model_1.default.findOne({ where: { userId } });
            return Object.assign(Object.assign({}, updatedUser === null || updatedUser === void 0 ? void 0 : updatedUser.toJSON()), updatedProfile === null || updatedProfile === void 0 ? void 0 : updatedProfile.toJSON());
        });
    }
}
exports.ProfileService = ProfileService;
exports.default = ProfileService;
