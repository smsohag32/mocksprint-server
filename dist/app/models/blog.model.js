"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Blog = void 0;
const sequelize_1 = require("sequelize");
const dbConfig_1 = require("../config/dbConfig");
/* ─── Model Class ─────────────────────────────────────── */
class Blog extends sequelize_1.Model {
}
exports.Blog = Blog;
/* ─── Schema Definition ──────────────────────────────── */
Blog.init({
    id: {
        type: sequelize_1.DataTypes.UUID,
        defaultValue: sequelize_1.DataTypes.UUIDV4,
        primaryKey: true,
    },
    title: {
        type: sequelize_1.DataTypes.STRING(255),
        allowNull: false,
    },
    slug: {
        type: sequelize_1.DataTypes.STRING(255),
        allowNull: false,
        unique: true,
    },
    content: {
        type: sequelize_1.DataTypes.TEXT("long"),
        allowNull: false,
    },
    excerpt: {
        type: sequelize_1.DataTypes.TEXT,
        allowNull: true,
    },
    authorId: {
        type: sequelize_1.DataTypes.UUID,
        allowNull: false,
    },
    status: {
        type: sequelize_1.DataTypes.ENUM("draft", "published"),
        defaultValue: "draft",
    },
    tags: {
        type: sequelize_1.DataTypes.JSON,
        allowNull: true,
        defaultValue: [],
    },
    coverImage: {
        type: sequelize_1.DataTypes.STRING(255),
        allowNull: true,
    },
}, {
    sequelize: dbConfig_1.sequelize,
    tableName: "blogs",
    modelName: "Blog",
    timestamps: true,
});
// Auto-generate slug before validate if not present
Blog.beforeValidate((blog) => {
    if (blog.title && !blog.slug) {
        blog.slug = blog.title
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, "-")
            .replace(/(^-|-$)+/g, "");
    }
});
exports.default = Blog;
