import { DataTypes, Model, Optional } from "sequelize";
import { sequelize } from "../config/dbConfig";

/* ─── Attribute Interfaces ───────────────────────────── */
export interface QuestionCategoryAttributes {
   id: string;
   name: string;
   description: string | null;
   is_active: boolean;
   createdAt?: Date;
   updatedAt?: Date;
}

export interface QuestionCategoryCreationAttributes
   extends Optional<
      QuestionCategoryAttributes,
      "id" | "description" | "is_active"
   > {}

/* ─── Model Class ─────────────────────────────────────── */
export class QuestionCategory
   extends Model<QuestionCategoryAttributes, QuestionCategoryCreationAttributes>
   implements QuestionCategoryAttributes
{
   declare id: string;
   declare name: string;
   declare description: string | null;
   declare is_active: boolean;
   declare readonly createdAt: Date;
   declare readonly updatedAt: Date;
}

/* ─── Schema Definition ──────────────────────────────── */
QuestionCategory.init(
   {
      id: {
         type: DataTypes.UUID,
         defaultValue: DataTypes.UUIDV4,
         primaryKey: true,
      },
      name: {
         type: DataTypes.STRING(100),
         allowNull: false,
         unique: true,
         validate: { len: [2, 100] },
      },
      description: {
         type: DataTypes.TEXT,
         allowNull: true,
         defaultValue: null,
      },
      is_active: {
         type: DataTypes.BOOLEAN,
         defaultValue: true,
      },
   },
   {
      sequelize,
      tableName: "question_categories",
      modelName: "QuestionCategory",
      timestamps: true,
   }
);

export default QuestionCategory;
