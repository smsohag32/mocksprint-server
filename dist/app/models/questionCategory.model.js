"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.QuestionCategory = void 0;
const sequelize_1 = require("sequelize");
const dbConfig_1 = require("../config/dbConfig");
/* ─── Model Class ─────────────────────────────────────── */
class QuestionCategory extends sequelize_1.Model {
}
exports.QuestionCategory = QuestionCategory;
/* ─── Schema Definition ──────────────────────────────── */
QuestionCategory.init({
    id: {
        type: sequelize_1.DataTypes.UUID,
        defaultValue: sequelize_1.DataTypes.UUIDV4,
        primaryKey: true,
    },
    name: {
        type: sequelize_1.DataTypes.STRING(100),
        allowNull: false,
        unique: true,
        validate: { len: [2, 100] },
    },
    description: {
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
    tableName: "question_categories",
    modelName: "QuestionCategory",
    timestamps: true,
});
exports.default = QuestionCategory;
