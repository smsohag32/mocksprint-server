import { DataTypes, Model, Optional } from "sequelize";
import { sequelize } from "../config/dbConfig";
import { Question } from "./question.model";

/* ─── Attribute Interfaces ───────────────────────────── */
export interface InterviewAttributes {
   id: string;
   userId: string;
   questionId: string;
   code: string | null;
   score: number | null;
   status: "ongoing" | "completed" | "abandoned";
   feedback?: string | null;
   createdAt?: Date;
   updatedAt?: Date;
}

export interface InterviewCreationAttributes
   extends Optional<InterviewAttributes, "id" | "code" | "score" | "status"> {}

/* ─── Model Class ─────────────────────────────────────── */
export class Interview
   extends Model<InterviewAttributes, InterviewCreationAttributes>
   implements InterviewAttributes
{
   declare id: string;
   declare userId: string;
   declare questionId: string;
   declare code: string | null;
   declare score: number | null;
   declare status: "ongoing" | "completed" | "abandoned";
   declare feedback: string | null;
   declare readonly createdAt: Date;
   declare readonly updatedAt: Date;
   
   // Association
   declare question?: Question;
}

/* ─── Schema Definition ──────────────────────────────── */
Interview.init(
   {
      id: {
         type: DataTypes.UUID,
         defaultValue: DataTypes.UUIDV4,
         primaryKey: true,
      },
      userId: {
         type: DataTypes.UUID,
         allowNull: false,
      },
      questionId: {
         type: DataTypes.UUID,
         allowNull: false,
      },
      code: {
         type: DataTypes.TEXT,
         allowNull: true,
      },
      score: {
         type: DataTypes.INTEGER,
         allowNull: true,
      },
      status: {
         type: DataTypes.ENUM("ongoing", "completed", "abandoned"),
         defaultValue: "ongoing",
      },
      feedback: {
         type: DataTypes.TEXT,
         allowNull: true,
      },
   },
   {
      sequelize,
      tableName: "interviews",
      modelName: "Interview",
      timestamps: true,
   }
);

export default Interview;
