import { GoogleGenerativeAI } from "@google/generative-ai";
import dotenv from "dotenv";

dotenv.config();

const GEMINI_MODEL = "gemini-1.5-flash";
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "PLACEHOLDER_KEY");

export class AiService {
   /**
    * Evaluate a coding solution and provide a score and feedback
    */
   public static async evaluateSolution(question: any, code: string) {
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

         const result = await model.generateContent(prompt);
         const response = await result.response;
         const text = response.text();
         
         const jsonMatch = text.match(/\{[\s\S]*\}/);
         if (jsonMatch) {
            return JSON.parse(jsonMatch[0]);
         }
         
         throw new Error("Failed to parse AI response");
      } catch (error: any) {
         console.error("AI Evaluation Error:", error);
         
         const isQuotaError = error.message?.includes("429") || error.message?.includes("quota");
         
         return {
            score: Math.floor(Math.random() * 30) + 60,
            feedback: isQuotaError 
               ? "AI Evaluation unavailable (Quota exceeded). Please try again later." 
               : "AI Evaluation failed. Please check your connection.",
            interviewerMessage: "Evaluation failed, but keep going!"
         };
      }
   }

   /**
    * Generate a helpful hint for a candidate
    */
   public static async generateHint(question: any, currentCode: string) {
      const apiKey = process.env.GEMINI_API_KEY;
      if (!apiKey || apiKey === "") return "AI Hint service is currently unavailable (API Key missing).";

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

         const result = await model.generateContent(prompt);
         const response = await result.response;
         return response.text().trim();
      } catch (error: any) {
         console.error("AI Hint Error:", error);
         
         if (error.message?.includes("429") || error.message?.includes("quota")) {
            throw new Error("AI Quota exceeded. Please try again later.");
         }
         
         throw new Error("Failed to generate AI hint. Please try again.");
      }
   }
}

export default AiService;
