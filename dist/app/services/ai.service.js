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
exports.AiService = void 0;
const generative_ai_1 = require("@google/generative-ai");
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const GEMINI_MODEL = "gemini-1.5-flash";
const genAI = new generative_ai_1.GoogleGenerativeAI(process.env.GEMINI_API_KEY || "PLACEHOLDER_KEY");
class AiService {
    /**
     * Evaluate a coding solution and provide a score and feedback
     */
    static evaluateSolution(question, code) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a, _b;
            const apiKey = process.env.GEMINI_API_KEY;
            if (!apiKey || apiKey === "") {
                return {
                    score: Math.floor(Math.random() * 30) + 60,
                    feedback: "AI Evaluation skipped (API Key missing).",
                    interviewerMessage: "Great effort! (Simulation)"
                };
            }
            try {
                const model = genAI.getGenerativeModel({ model: GEMINI_MODEL });
                const prompt = `
            You are an expert technical interviewer. Evaluate the following coding solution.
            
            Question Title: ${question.title}
            Question Description: ${question.description}
            Candidate's Code:
            \`\`\`
            ${code}
            \`\`\`

            Provide your evaluation in the following JSON format:
            {
               "score": (number between 0 and 100),
               "feedback": (detailed markdown feedback about code quality, correctness, edge cases, and performance),
               "interviewerMessage": (a short, encouraging 1-sentence summary message)
            }
            
            Return ONLY the JSON.
         `;
                const result = yield model.generateContent(prompt);
                const response = yield result.response;
                const text = response.text();
                const jsonMatch = text.match(/\{[\s\S]*\}/);
                if (jsonMatch) {
                    return JSON.parse(jsonMatch[0]);
                }
                throw new Error("Failed to parse AI response");
            }
            catch (error) {
                console.error("AI Evaluation Error:", error);
                const isQuotaError = ((_a = error.message) === null || _a === void 0 ? void 0 : _a.includes("429")) || ((_b = error.message) === null || _b === void 0 ? void 0 : _b.includes("quota"));
                return {
                    score: Math.floor(Math.random() * 30) + 60,
                    feedback: isQuotaError
                        ? "AI Evaluation unavailable (Quota exceeded). Please try again later."
                        : "AI Evaluation failed. Please check your connection.",
                    interviewerMessage: "Evaluation failed, but keep going!"
                };
            }
        });
    }
    /**
     * Generate a helpful hint for a candidate
     */
    static generateHint(question, currentCode) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a, _b;
            const apiKey = process.env.GEMINI_API_KEY;
            if (!apiKey || apiKey === "")
                return "AI Hint service is currently unavailable (API Key missing).";
            try {
                const model = genAI.getGenerativeModel({ model: GEMINI_MODEL });
                const prompt = `
            A candidate is solving a coding problem and needs a hint.
            
            Question: ${question.title}
            Description: ${question.description}
            Current Progress:
            \`\`\`
            ${currentCode}
            \`\`\`

            Provide a subtle, helpful hint that nudges them in the right direction without giving away the full solution. 
            The hint should be short (1-2 sentences).
            Return ONLY the hint text.
         `;
                const result = yield model.generateContent(prompt);
                const response = yield result.response;
                return response.text().trim();
            }
            catch (error) {
                console.error("AI Hint Error:", error);
                if (((_a = error.message) === null || _a === void 0 ? void 0 : _a.includes("429")) || ((_b = error.message) === null || _b === void 0 ? void 0 : _b.includes("quota"))) {
                    throw new Error("AI Quota exceeded. Please try again later.");
                }
                throw new Error("Failed to generate AI hint. Please try again.");
            }
        });
    }
}
exports.AiService = AiService;
exports.default = AiService;
