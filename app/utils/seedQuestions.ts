import Question from "../models/question.model";
import QuestionCategory from "../models/questionCategory.model";
import { sequelize } from "../config/dbConfig";

const seedData = async () => {
   try {
      console.log("🌱 Starting Question Seeding...");

      // 1. Ensure Frontend Category exists
      let [category] = await QuestionCategory.findOrCreate({
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
            description:
               "Write a function that limits the rate at which a function can fire. A debounced function should only execute after a specified amount of time has passed since the last time it was invoked.",
            difficulty: "medium" as const,
            categoryId: category.id,
            starter_code: "function debounce(fn, delay) {\n  // Write your code here\n}",
            solution:
               "function debounce(fn, delay) {\n  let timer;\n  return function(...args) {\n    clearTimeout(timer);\n    timer = setTimeout(() => fn.apply(this, args), delay);\n  };\n}",
         },
         {
            title: "Simple Two-Way Data Binding",
            description:
               "Implement a basic version of two-way data binding. When the value of an input changes, the state should update, and when the state updates, the input value should reflect it.",
            difficulty: "easy" as const,
            categoryId: category.id,
            starter_code: "function bindInput(inputEl, state) {\n  // Write your code here\n}",
            solution:
               'function bindInput(inputEl, state) {\n  inputEl.value = state.value;\n  inputEl.addEventListener("input", (e) => {\n    state.value = e.target.value;\n  });\n}',
         },
         {
            title: "Array.map Polyfill",
            description:
               "Implement a polyfill for the native Array.prototype.map function without using the built-in map method.",
            difficulty: "medium" as const,
            categoryId: category.id,
            starter_code:
               "Array.prototype.myMap = function(callback) {\n  // Write your code here\n}",
            solution:
               "Array.prototype.myMap = function(callback) {\n  const result = [];\n  for (let i = 0; i < this.length; i++) {\n    result.push(callback(this[i], i, this));\n  }\n  return result;\n}",
         },
         {
            title: "Deep Clone Object",
            description:
               "Create a function that takes an object and returns a deep copy of it. Handle nested objects and arrays.",
            difficulty: "hard" as const,
            categoryId: category.id,
            starter_code: "function deepClone(obj) {\n  // Write your code here\n}",
            solution:
               'function deepClone(obj) {\n  if (obj === null || typeof obj !== "object") return obj;\n  const copy = Array.isArray(obj) ? [] : {};\n  for (let key in obj) {\n    if (obj.hasOwnProperty(key)) {\n      copy[key] = deepClone(obj[key]);\n    }\n  }\n  return copy;\n}',
         },
      ];

      // 3. Bulk Create with duplicate check (by title)
      for (const q of questions) {
         const [existing] = await Question.findOrCreate({
            where: { title: q.title },
            defaults: {
               ...q,
               id: undefined as any // Let Sequelize generate UUID
            } as any,
         });
         if (existing) {
            console.log(`- Skipping/Found: ${q.title}`);
         } else {
            console.log(`+ Added: ${q.title}`);
         }
      }

      console.log("✨ Seeding completed successfully!");
   } catch (error) {
      console.error("❌ Seeding failed:", error);
   } finally {
      // Don't exit process if called from app, but for standalone we might need to
   }
};

export default seedData;
