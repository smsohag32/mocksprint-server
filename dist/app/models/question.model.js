"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Question = void 0;
const sequelize_1 = require("sequelize");
const dbConfig_1 = require("../config/dbConfig");
/* ─── Model Class ─────────────────────────────────────── */
class Question extends sequelize_1.Model {
}
exports.Question = Question;
/* ─── Schema Definition ──────────────────────────────── */
Question.init({
    id: {
        type: sequelize_1.DataTypes.UUID,
        defaultValue: sequelize_1.DataTypes.UUIDV4,
        primaryKey: true,
    },
    title: {
        type: sequelize_1.DataTypes.STRING(255),
        allowNull: false,
        validate: { len: [2, 255] },
    },
    description: {
        type: sequelize_1.DataTypes.TEXT,
        allowNull: false,
    },
    difficulty: {
        type: sequelize_1.DataTypes.ENUM("easy", "medium", "hard"),
        defaultValue: "medium",
    },
    categoryId: {
        type: sequelize_1.DataTypes.UUID,
        allowNull: false,
    },
    starter_code: {
        type: sequelize_1.DataTypes.TEXT,
        allowNull: true,
        defaultValue: null,
    },
    solution: {
        type: sequelize_1.DataTypes.TEXT,
        allowNull: true,
        defaultValue: null,
    },
    is_active: {
        type: sequelize_1.DataTypes.BOOLEAN,
        defaultValue: true,
    },
}, {
    sequelize: dbConfig_1.sequelize,
    tableName: "questions",
    modelName: "Question",
    timestamps: true,
});
exports.default = Question;
