import { DataTypes, Model, Optional } from "sequelize";
import { sequelize } from "../config/dbConfig";

/* ─── Attribute Interfaces ───────────────────────────── */
export interface ProfileAttributes {
   id: string;
   userId: string;
   first_name: string | null;
   last_name: string | null;
   phone: string | null;
   secondary_phone: string | null;
   profile_image: string | null;
   address: string | null;
   bio: string | null;
   github_url: string | null;
   linkedin_url: string | null;
   portfolio_url: string | null;
   skills: string | null;
   createdAt?: Date;
   updatedAt?: Date;
}

export interface ProfileCreationAttributes
   extends Optional<
      ProfileAttributes,
      | "id"
      | "first_name"
      | "last_name"
      | "phone"
      | "secondary_phone"
      | "profile_image"
      | "address"
      | "bio"
      | "github_url"
      | "linkedin_url"
      | "portfolio_url"
      | "skills"
   > {}

/* ─── Model Class ─────────────────────────────────────── */
export class Profile
   extends Model<ProfileAttributes, ProfileCreationAttributes>
   implements ProfileAttributes
{
   declare id: string;
   declare userId: string;
   declare first_name: string | null;
   declare last_name: string | null;
   declare phone: string | null;
   declare secondary_phone: string | null;
   declare profile_image: string | null;
   declare address: string | null;
   declare bio: string | null;
   declare github_url: string | null;
   declare linkedin_url: string | null;
   declare portfolio_url: string | null;
   declare skills: string | null;
   declare readonly createdAt: Date;
   declare readonly updatedAt: Date;
}

/* ─── Schema Definition ──────────────────────────────── */
Profile.init(
   {
      id: {
         type: DataTypes.UUID,
         defaultValue: DataTypes.UUIDV4,
         primaryKey: true,
      },
      userId: {
         type: DataTypes.UUID,
         allowNull: false,
         references: {
            model: "users",
            key: "id",
         },
         onDelete: "CASCADE",
      },
      first_name: {
         type: DataTypes.STRING(100),
         allowNull: true,
         defaultValue: null,
      },
      last_name: {
         type: DataTypes.STRING(100),
         allowNull: true,
         defaultValue: null,
      },
      phone: {
         type: DataTypes.STRING(30),
         allowNull: true,
         defaultValue: null,
      },
      secondary_phone: {
         type: DataTypes.STRING(30),
         allowNull: true,
         defaultValue: null,
      },
      profile_image: {
         type: DataTypes.TEXT,
         allowNull: true,
         defaultValue: null,
      },
      address: {
         type: DataTypes.TEXT,
         allowNull: true,
         defaultValue: null,
      },
      bio: {
         type: DataTypes.TEXT,
         allowNull: true,
         defaultValue: null,
      },
      github_url: {
         type: DataTypes.STRING(255),
         allowNull: true,
         defaultValue: null,
      },
      linkedin_url: {
         type: DataTypes.STRING(255),
         allowNull: true,
         defaultValue: null,
      },
      portfolio_url: {
         type: DataTypes.STRING(255),
         allowNull: true,
         defaultValue: null,
      },
      skills: {
         type: DataTypes.TEXT,
         allowNull: true,
         defaultValue: null,
      },
   },
   {
      sequelize,
      tableName: "profiles",
      modelName: "Profile",
      timestamps: true,
   }
);

export default Profile;
