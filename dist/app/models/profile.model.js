"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Profile = void 0;
const sequelize_1 = require("sequelize");
const dbConfig_1 = require("../config/dbConfig");
/* ─── Model Class ─────────────────────────────────────── */
class Profile extends sequelize_1.Model {
}
exports.Profile = Profile;
/* ─── Schema Definition ──────────────────────────────── */
Profile.init({
    id: {
        type: sequelize_1.DataTypes.UUID,
        defaultValue: sequelize_1.DataTypes.UUIDV4,
        primaryKey: true,
    },
    userId: {
        type: sequelize_1.DataTypes.UUID,
        allowNull: false,
        references: {
            model: "users",
            key: "id",
        },
        onDelete: "CASCADE",
    },
    first_name: {
        type: sequelize_1.DataTypes.STRING(100),
        allowNull: true,
        defaultValue: null,
    },
    last_name: {
        type: sequelize_1.DataTypes.STRING(100),
        allowNull: true,
        defaultValue: null,
    },
    phone: {
        type: sequelize_1.DataTypes.STRING(30),
        allowNull: true,
        defaultValue: null,
    },
    secondary_phone: {
        type: sequelize_1.DataTypes.STRING(30),
        allowNull: true,
        defaultValue: null,
    },
    profile_image: {
        type: sequelize_1.DataTypes.TEXT,
        allowNull: true,
        defaultValue: null,
    },
    address: {
        type: sequelize_1.DataTypes.TEXT,
        allowNull: true,
        defaultValue: null,
    },
    bio: {
        type: sequelize_1.DataTypes.TEXT,
        allowNull: true,
        defaultValue: null,
    },
    github_url: {
        type: sequelize_1.DataTypes.STRING(255),
        allowNull: true,
        defaultValue: null,
    },
    linkedin_url: {
        type: sequelize_1.DataTypes.STRING(255),
        allowNull: true,
        defaultValue: null,
    },
    portfolio_url: {
        type: sequelize_1.DataTypes.STRING(255),
        allowNull: true,
        defaultValue: null,
    },
    skills: {
        type: sequelize_1.DataTypes.TEXT,
        allowNull: true,
        defaultValue: null,
    },
}, {
    sequelize: dbConfig_1.sequelize,
    tableName: "profiles",
    modelName: "Profile",
    timestamps: true,
});
exports.default = Profile;
