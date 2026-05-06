"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.User = void 0;
const sequelize_1 = require("sequelize");
const bcrypt_1 = __importDefault(require("bcrypt"));
const dbConfig_1 = require("../config/dbConfig");
/* ─── Model Class ─────────────────────────────────────── */
class User extends sequelize_1.Model {
    /** Compare a plain-text password against the stored hash */
    comparePassword(candidatePassword) {
        return __awaiter(this, void 0, void 0, function* () {
            return bcrypt_1.default.compare(candidatePassword, this.password);
        });
    }
}
exports.User = User;
/* ─── Schema Definition ──────────────────────────────── */
User.init({
    id: {
        type: sequelize_1.DataTypes.UUID,
        defaultValue: sequelize_1.DataTypes.UUIDV4,
        primaryKey: true,
    },
    name: {
        type: sequelize_1.DataTypes.STRING(100),
        allowNull: false,
        validate: { len: [2, 100] },
    },
    email: {
        type: sequelize_1.DataTypes.STRING(255),
        allowNull: false,
        unique: true,
        validate: { isEmail: true },
    },
    password: {
        type: sequelize_1.DataTypes.STRING(255),
        allowNull: false,
    },
    role: {
        type: sequelize_1.DataTypes.ENUM("user", "admin"),
        defaultValue: "user",
    },
    is_active: {
        type: sequelize_1.DataTypes.BOOLEAN,
        defaultValue: true,
    },
    is_verified: {
        type: sequelize_1.DataTypes.BOOLEAN,
        defaultValue: false,
    },
    email_verification_token: {
        type: sequelize_1.DataTypes.STRING(255),
        allowNull: true,
        defaultValue: null,
    },
    email_verification_expires: {
        type: sequelize_1.DataTypes.DATE,
        allowNull: true,
        defaultValue: null,
    },
    last_login: {
        type: sequelize_1.DataTypes.DATE,
        allowNull: true,
        defaultValue: null,
    },
}, {
    sequelize: dbConfig_1.sequelize,
    tableName: "users",
    modelName: "User",
    timestamps: true,
});
/* ─── Hooks ──────────────────────────────────────────── */
// Hash password before creating a new user
User.beforeCreate((user) => __awaiter(void 0, void 0, void 0, function* () {
    if (user.password) {
        const salt = yield bcrypt_1.default.genSalt(12);
        user.password = yield bcrypt_1.default.hash(user.password, salt);
    }
}));
// Hash password before updating (only when password changed)
User.beforeUpdate((user) => __awaiter(void 0, void 0, void 0, function* () {
    if (user.changed("password") && user.password) {
        const salt = yield bcrypt_1.default.genSalt(12);
        user.password = yield bcrypt_1.default.hash(user.password, salt);
    }
}));
exports.default = User;
