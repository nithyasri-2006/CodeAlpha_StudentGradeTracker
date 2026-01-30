
import { GoogleGenAI, Type } from "@google/genai";
import { Student } from "../types";

export const getAIInsights = async (students: Student[]): Promise<any> => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  
  const studentData = students.map(s => `${s.name}: ${s.grade}`).join(', ');
  
  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: `Analyze these student grades and provide a summary report: ${studentData}. Provide suggestions for the teacher.`,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          summary: { type: Type.STRING },
          recommendations: {
            type: Type.ARRAY,
            items: { type: Type.STRING }
          },
          performanceLevel: { 
            type: Type.STRING,
            description: "One of: Needs Improvement, Satisfactory, Exemplary"
          }
        },
        required: ["summary", "recommendations", "performanceLevel"]
      }
    }
  });

  try {
    return JSON.parse(response.text.trim());
  } catch (e) {
    console.error("Failed to parse AI response", e);
    return null;
  }
};
