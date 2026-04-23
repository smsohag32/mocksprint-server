import User from "./user.model";
import Profile from "./profile.model";
import Question from "./question.model";
import QuestionCategory from "./questionCategory.model";

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
}
