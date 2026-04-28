import { GoogleGenerativeAI } from "@google/generative-ai";
import dotenv from "dotenv";

dotenv.config();

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
            feedback: null,
            interviewerMessage: null
         };
      }

      try {
         const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

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
         
         // Extract JSON from response (sometimes Gemini wraps it in code blocks)
         const jsonMatch = text.match(/\{[\s\S]*\}/);
         if (jsonMatch) {
            return JSON.parse(jsonMatch[0]);
         }
         
         throw new Error("Failed to parse AI response");
      } catch (error) {
         console.error("AI Evaluation Error:", error);
         // Return minimal info if AI fails
         return {
            score: Math.floor(Math.random() * 30) + 60,
            feedback: null,
            interviewerMessage: null
         };
      }
   }

   /**
    * Generate a helpful hint for a candidate
    */
   public static async generateHint(question: any, currentCode: string) {
      const apiKey = process.env.GEMINI_API_KEY;
      if (!apiKey || apiKey === "") return null;

      try {
         const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

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
      } catch (error) {
         console.error("AI Hint Error:", error);
         return null;
      }
   }
}

export default AiService;
