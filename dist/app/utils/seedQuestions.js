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
const question_model_1 = __importDefault(require("../models/question.model"));
const questionCategory_model_1 = __importDefault(require("../models/questionCategory.model"));
const seedData = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        console.log("🌱 Starting Question Seeding...");
        // 1. Ensure Frontend Category exists
        let [category] = yield questionCategory_model_1.default.findOrCreate({
            where: { name: "Frontend" },
            defaults: {
                name: "Frontend",
                description: "Core frontend engineering, React, and CSS architecture.",
                is_active: true,
            },
        });
        console.log(`✅ Category confirmed: ${category.name}`);
        // 2. Define Questions
        const questions = [
            {
                title: "Implement a Debounce Function",
                description: "Write a function that limits the rate at which a function can fire. A debounced function should only execute after a specified amount of time has passed since the last time it was invoked.",
                difficulty: "medium",
                categoryId: category.id,
                starter_code: "function debounce(fn, delay) {\n  // Write your code here\n}",
                solution: "function debounce(fn, delay) {\n  let timer;\n  return function(...args) {\n    clearTimeout(timer);\n    timer = setTimeout(() => fn.apply(this, args), delay);\n  };\n}",
            },
            {
                title: "Simple Two-Way Data Binding",
                description: "Implement a basic version of two-way data binding. When the value of an input changes, the state should update, and when the state updates, the input value should reflect it.",
                difficulty: "easy",
                categoryId: category.id,
                starter_code: "function bindInput(inputEl, state) {\n  // Write your code here\n}",
                solution: 'function bindInput(inputEl, state) {\n  inputEl.value = state.value;\n  inputEl.addEventListener("input", (e) => {\n    state.value = e.target.value;\n  });\n}',
            },
            {
                title: "Array.map Polyfill",
                description: "Implement a polyfill for the native Array.prototype.map function without using the built-in map method.",
                difficulty: "medium",
                categoryId: category.id,
                starter_code: "Array.prototype.myMap = function(callback) {\n  // Write your code here\n}",
                solution: "Array.prototype.myMap = function(callback) {\n  const result = [];\n  for (let i = 0; i < this.length; i++) {\n    result.push(callback(this[i], i, this));\n  }\n  return result;\n}",
            },
            {
                title: "Deep Clone Object",
                description: "Create a function that takes an object and returns a deep copy of it. Handle nested objects and arrays.",
                difficulty: "hard",
                categoryId: category.id,
                starter_code: "function deepClone(obj) {\n  // Write your code here\n}",
                solution: 'function deepClone(obj) {\n  if (obj === null || typeof obj !== "object") return obj;\n  const copy = Array.isArray(obj) ? [] : {};\n  for (let key in obj) {\n    if (obj.hasOwnProperty(key)) {\n      copy[key] = deepClone(obj[key]);\n    }\n  }\n  return copy;\n}',
            },
        ];
        // 3. Bulk Create with duplicate check (by title)
        for (const q of questions) {
            const [existing] = yield question_model_1.default.findOrCreate({
                where: { title: q.title },
                defaults: Object.assign(Object.assign({}, q), { id: undefined // Let Sequelize generate UUID
                 }),
            });
            if (existing) {
                console.log(`- Skipping/Found: ${q.title}`);
            }
            else {
                console.log(`+ Added: ${q.title}`);
            }
        }
        console.log("✨ Seeding completed successfully!");
    }
    catch (error) {
        console.error("❌ Seeding failed:", error);
    }
    finally {
        // Don't exit process if called from app, but for standalone we might need to
    }
});
exports.default = seedData;
