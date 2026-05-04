import { DataTypes, Model, Optional } from "sequelize";
import { sequelize } from "../config/dbConfig";
import { QuestionCategory } from "./questionCategory.model";

/* ─── Attribute Interfaces ───────────────────────────── */
export interface QuestionAttributes {
   id: string;
   title: string;
   description: string;
   difficulty: "easy" | "medium" | "hard";
   categoryId: string;
   starter_code: string | null;
   solution: string | null;
   is_active: boolean;
   createdAt?: Date;
   updatedAt?: Date;
}

export interface QuestionCreationAttributes
   extends Optional<
      QuestionAttributes,
      "id" | "starter_code" | "solution" | "is_active"
   > {}

/* ─── Model Class ─────────────────────────────────────── */
export class Question
   extends Model<QuestionAttributes, QuestionCreationAttributes>
   implements QuestionAttributes
{
   declare id: string;
   declare title: string;
   declare description: string;
   declare difficulty: "easy" | "medium" | "hard";
   declare categoryId: string;
   declare starter_code: string | null;
   declare solution: string | null;
   declare is_active: boolean;
   declare readonly createdAt: Date;
   declare readonly updatedAt: Date;

   // Association
   declare category?: QuestionCategory;
}

/* ─── Schema Definition ──────────────────────────────── */
Question.init(
   {
      id: {
         type: DataTypes.UUID,
         defaultValue: DataTypes.UUIDV4,
         primaryKey: true,
      },
      title: {
         type: DataTypes.STRING(255),
         allowNull: false,
         validate: { len: [2, 255] },
      },
      description: {
         type: DataTypes.TEXT,
         allowNull: false,
      },
      difficulty: {
         type: DataTypes.ENUM("easy", "medium", "hard"),
         defaultValue: "medium",
      },
      categoryId: {
         type: DataTypes.UUID,
         allowNull: false,
      },
      starter_code: {
         type: DataTypes.TEXT,
         allowNull: true,
         defaultValue: null,
      },
      solution: {
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
      tableName: "questions",
      modelName: "Question",
      timestamps: true,
   }
);

export default Question;
