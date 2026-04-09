import { GoogleGenAI, Type } from "@google/genai";

// Core processing engine for content indexing
export const processInput = async (token: string, content: string, sourceType: string) => {
  try {
    const engine = new GoogleGenAI({ apiKey: token });
    
    const response = await engine.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `Process this ${sourceType}: "${content.substring(0, 5000)}"`,
      config: {
        systemInstruction: "You are a professional information architect. Extract metadata and return a JSON object.",
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

    const data = response.text;
    if (!data) throw new Error("Processing failed");
    return JSON.parse(data);
  } catch (error: any) {
    console.error("Engine Error:", error);
    return null;
  }
};
