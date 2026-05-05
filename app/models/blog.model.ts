import { DataTypes, Model, Optional } from "sequelize";
import { sequelize } from "../config/dbConfig";

/* ─── Attribute Interfaces ───────────────────────────── */
export interface BlogAttributes {
   id: string;
   title: string;
   slug: string;
   content: string;
   excerpt: string;
   authorId: string;
   status: "draft" | "published";
   tags: string[];
   coverImage: string | null;
   createdAt?: Date;
   updatedAt?: Date;
}

export interface BlogCreationAttributes
   extends Optional<BlogAttributes, "id" | "status" | "tags" | "coverImage" | "excerpt"> {}

/* ─── Model Class ─────────────────────────────────────── */
export class Blog
   extends Model<BlogAttributes, BlogCreationAttributes>
   implements BlogAttributes
{
   declare id: string;
   declare title: string;
   declare slug: string;
   declare content: string;
   declare excerpt: string;
   declare authorId: string;
   declare status: "draft" | "published";
   declare tags: string[];
   declare coverImage: string | null;
   declare readonly createdAt: Date;
   declare readonly updatedAt: Date;
}

/* ─── Schema Definition ──────────────────────────────── */
Blog.init(
   {
      id: {
         type: DataTypes.UUID,
         defaultValue: DataTypes.UUIDV4,
         primaryKey: true,
      },
      title: {
         type: DataTypes.STRING(255),
         allowNull: false,
      },
      slug: {
         type: DataTypes.STRING(255),
         allowNull: false,
         unique: true,
      },
      content: {
         type: DataTypes.TEXT("long"),
         allowNull: false,
      },
      excerpt: {
         type: DataTypes.TEXT,
         allowNull: true,
      },
      authorId: {
         type: DataTypes.UUID,
         allowNull: false,
      },
      status: {
         type: DataTypes.ENUM("draft", "published"),
         defaultValue: "draft",
      },
      tags: {
         type: DataTypes.JSON,
         allowNull: true,
         defaultValue: [],
      },
      coverImage: {
         type: DataTypes.STRING(255),
         allowNull: true,
      },
   },
   {
      sequelize,
      tableName: "blogs",
      modelName: "Blog",
      timestamps: true,
   }
);

// Auto-generate slug before validate if not present
Blog.beforeValidate((blog) => {
   if (blog.title && !blog.slug) {
      blog.slug = blog.title
         .toLowerCase()
         .replace(/[^a-z0-9]+/g, "-")
         .replace(/(^-|-$)+/g, "");
   }
});

export default Blog;
