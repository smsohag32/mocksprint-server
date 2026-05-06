"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Interview = void 0;
const sequelize_1 = require("sequelize");
const dbConfig_1 = require("../config/dbConfig");
/* ─── Model Class ─────────────────────────────────────── */
class Interview extends sequelize_1.Model {
}
exports.Interview = Interview;
/* ─── Schema Definition ──────────────────────────────── */
Interview.init({
    id: {
        type: sequelize_1.DataTypes.UUID,
        defaultValue: sequelize_1.DataTypes.UUIDV4,
        primaryKey: true,
    },
    userId: {
        type: sequelize_1.DataTypes.UUID,
        allowNull: false,
    },
    questionId: {
        type: sequelize_1.DataTypes.UUID,
        allowNull: false,
    },
    code: {
        type: sequelize_1.DataTypes.TEXT,
        allowNull: true,
    },
    score: {
        type: sequelize_1.DataTypes.INTEGER,
        allowNull: true,
    },
    status: {
        type: sequelize_1.DataTypes.ENUM("ongoing", "completed", "abandoned"),
        defaultValue: "ongoing",
    },
    feedback: {
        type: sequelize_1.DataTypes.TEXT,
        allowNull: true,
    },
}, {
    sequelize: dbConfig_1.sequelize,
    tableName: "interviews",
    modelName: "Interview",
    timestamps: true,
});
exports.default = Interview;
