"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.defineAssociations = defineAssociations;
const user_model_1 = __importDefault(require("./user.model"));
const profile_model_1 = __importDefault(require("./profile.model"));
const question_model_1 = __importDefault(require("./question.model"));
const questionCategory_model_1 = __importDefault(require("./questionCategory.model"));
const interview_model_1 = __importDefault(require("./interview.model"));
const blog_model_1 = __importDefault(require("./blog.model"));
/**
 * Define all Sequelize model associations here.
 * This function must be called once after the DB connection is established.
 */
function defineAssociations() {
    // A User has exactly one Profile
    user_model_1.default.hasOne(profile_model_1.default, {
        foreignKey: "userId",
        as: "profile",
        onDelete: "CASCADE",
    });
    profile_model_1.default.belongsTo(user_model_1.default, {
        foreignKey: "userId",
        as: "user",
    });
    // A Category has many Questions
    questionCategory_model_1.default.hasMany(question_model_1.default, {
        foreignKey: "categoryId",
        as: "questions",
        onDelete: "CASCADE",
    });
    // A Question belongs to a Category
    question_model_1.default.belongsTo(questionCategory_model_1.default, {
        foreignKey: "categoryId",
        as: "category",
    });
    // A User has many Interviews
    user_model_1.default.hasMany(interview_model_1.default, {
        foreignKey: "userId",
        as: "interviews",
        onDelete: "CASCADE",
    });
    interview_model_1.default.belongsTo(user_model_1.default, {
        foreignKey: "userId",
        as: "user",
    });
    // A Question has many Interviews
    question_model_1.default.hasMany(interview_model_1.default, {
        foreignKey: "questionId",
        as: "interviews",
        onDelete: "CASCADE",
    });
    interview_model_1.default.belongsTo(question_model_1.default, {
        foreignKey: "questionId",
        as: "question",
    });
    // A User has many Blogs
    user_model_1.default.hasMany(blog_model_1.default, {
        foreignKey: "authorId",
        as: "blogs",
        onDelete: "CASCADE",
    });
    // A Blog belongs to a User (author)
    blog_model_1.default.belongsTo(user_model_1.default, {
        foreignKey: "authorId",
        as: "author",
    });
}
