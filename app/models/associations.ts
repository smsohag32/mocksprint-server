import User from "./user.model";
import Profile from "./profile.model";
import Question from "./question.model";
import QuestionCategory from "./questionCategory.model";
import Interview from "./interview.model";
import Blog from "./blog.model";

/**
 * Define all Sequelize model associations here.
 * This function must be called once after the DB connection is established.
 */
export function defineAssociations(): void {
   // A User has exactly one Profile
   User.hasOne(Profile, {
      foreignKey: "userId",
      as: "profile",
      onDelete: "CASCADE",
   });

   Profile.belongsTo(User, {
      foreignKey: "userId",
      as: "user",
   });

   // A Category has many Questions
   QuestionCategory.hasMany(Question, {
      foreignKey: "categoryId",
      as: "questions",
      onDelete: "CASCADE",
   });

   // A Question belongs to a Category
   Question.belongsTo(QuestionCategory, {
      foreignKey: "categoryId",
      as: "category",
   });

   // A User has many Interviews
   User.hasMany(Interview, {
      foreignKey: "userId",
      as: "interviews",
      onDelete: "CASCADE",
   });

   Interview.belongsTo(User, {
      foreignKey: "userId",
      as: "user",
   });

   // A Question has many Interviews
   Question.hasMany(Interview, {
      foreignKey: "questionId",
      as: "interviews",
      onDelete: "CASCADE",
   });

   Interview.belongsTo(Question, {
      foreignKey: "questionId",
      as: "question",
   });

   // A User has many Blogs
   User.hasMany(Blog, {
      foreignKey: "authorId",
      as: "blogs",
      onDelete: "CASCADE",
   });

   // A Blog belongs to a User (author)
   Blog.belongsTo(User, {
      foreignKey: "authorId",
      as: "author",
   });
}
