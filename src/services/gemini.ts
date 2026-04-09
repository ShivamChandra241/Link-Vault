import { GoogleGenAI, Type } from "@google/genai";

export const analyzeContent = async (apiKey: string, content: string, sourceType: string) => {
  try {
    const ai = new GoogleGenAI({ apiKey });
    
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `Analyze this ${sourceType}: "${content.substring(0, 5000)}"`,
      config: {
        systemInstruction: "You are NeuroVault AI, a professional information architect. Extract metadata and return a JSON object.",
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            title: { type: Type.STRING },
            summary: { type: Type.STRING },
            tags: { type: Type.ARRAY, items: { type: Type.STRING } },
            category: { 
              type: Type.STRING, 
              enum: ["Learning", "Work", "Finance", "Shopping", "Entertainment", "Personal"] 
            },
            type: { type: Type.STRING, enum: ["task", "bookmark", "note"] },
            priority: { type: Type.STRING, enum: ["Low", "Medium", "High"] },
            imageSearchTerm: { type: Type.STRING, description: "A highly descriptive 2-3 word term to find a relevant image for this content" }
          },
          required: ["title", "summary", "tags", "category", "type", "priority", "imageSearchTerm"]
        }
      }
    });

    const text = response.text;
    if (!text) throw new Error("No response from AI");
    return JSON.parse(text);
  } catch (error) {
    console.error("AI Analysis Failed:", error);
    return null;
  }
};
