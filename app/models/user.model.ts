import { DataTypes, Model, Optional } from "sequelize";
import bcrypt from "bcrypt";
import { sequelize } from "../config/dbConfig";

/* ─── Attribute Interfaces ───────────────────────────── */
export interface UserAttributes {
   id: string;
   name: string;
   email: string;
   password: string;
   role: string;
   is_active: boolean;
   is_verified: boolean;
   email_verification_token: string | null;
   email_verification_expires: Date | null;
   last_login: Date | null;
   createdAt?: Date;
   updatedAt?: Date;
}

export interface UserCreationAttributes
   extends Optional<
      UserAttributes,
      | "id"
      | "role"
      | "is_active"
      | "is_verified"
      | "email_verification_token"
      | "email_verification_expires"
      | "last_login"
   > {}

/* ─── Model Class ─────────────────────────────────────── */
export class User
   extends Model<UserAttributes, UserCreationAttributes>
   implements UserAttributes
{
   declare id: string;
   declare name: string;
   declare email: string;
   declare password: string;
   declare role: string;
   declare is_active: boolean;
   declare is_verified: boolean;
   declare email_verification_token: string | null;
   declare email_verification_expires: Date | null;
   declare last_login: Date | null;
   declare readonly createdAt: Date;
   declare readonly updatedAt: Date;

   /** Compare a plain-text password against the stored hash */
   async comparePassword(candidatePassword: string): Promise<boolean> {
      return bcrypt.compare(candidatePassword, this.password);
   }
}

/* ─── Schema Definition ──────────────────────────────── */
User.init(
   {
      id: {
         type: DataTypes.UUID,
         defaultValue: DataTypes.UUIDV4,
         primaryKey: true,
      },
      name: {
         type: DataTypes.STRING(100),
         allowNull: false,
         validate: { len: [2, 100] },
      },
      email: {
         type: DataTypes.STRING(255),
         allowNull: false,
         unique: true,
         validate: { isEmail: true },
      },
      password: {
         type: DataTypes.STRING(255),
         allowNull: false,
      },
      role: {
         type: DataTypes.ENUM("user", "admin"),
         defaultValue: "user",
      },
      is_active: {
         type: DataTypes.BOOLEAN,
         defaultValue: true,
      },
      is_verified: {
         type: DataTypes.BOOLEAN,
         defaultValue: false,
      },
      email_verification_token: {
         type: DataTypes.STRING(255),
         allowNull: true,
         defaultValue: null,
      },
      email_verification_expires: {
         type: DataTypes.DATE,
         allowNull: true,
         defaultValue: null,
      },
      last_login: {
         type: DataTypes.DATE,
         allowNull: true,
         defaultValue: null,
      },
   },
   {
      sequelize,
      tableName: "users",
      modelName: "User",
      timestamps: true,
   }
);

/* ─── Hooks ──────────────────────────────────────────── */
// Hash password before creating a new user
User.beforeCreate(async (user) => {
   if (user.password) {
      const salt = await bcrypt.genSalt(12);
      user.password = await bcrypt.hash(user.password, salt);
   }
});

// Hash password before updating (only when password changed)
User.beforeUpdate(async (user) => {
   if (user.changed("password") && user.password) {
      const salt = await bcrypt.genSalt(12);
      user.password = await bcrypt.hash(user.password, salt);
   }
});

export default User;
