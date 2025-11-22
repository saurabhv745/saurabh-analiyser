import { GoogleGenAI, Type, Schema } from "@google/genai";
import { AnalysisResult, SentimentType } from "../types";

const apiKey = process.env.API_KEY;

// Define the response schema for structured JSON output
const sentimentSchema: Schema = {
  type: Type.OBJECT,
  properties: {
    sentiment: {
      type: Type.STRING,
      enum: [SentimentType.POSITIVE, SentimentType.NEGATIVE, SentimentType.NEUTRAL],
      description: "The overall sentiment of the text.",
    },
    score: {
      type: Type.INTEGER,
      description: "A confidence score for the sentiment classification between 0 and 100.",
    },
    reasoning: {
      type: Type.STRING,
      description: "A brief explanation (1-2 sentences) of why this sentiment was chosen.",
    },
    emotions: {
      type: Type.ARRAY,
      items: { type: Type.STRING },
      description: "A list of up to 3 specific emotions detected (e.g., 'Joy', 'Frustration', 'Sarcasm').",
    },
    keywords: {
      type: Type.ARRAY,
      items: { type: Type.STRING },
      description: "Key words or phrases that influenced the sentiment analysis.",
    }
  },
  required: ["sentiment", "score", "reasoning", "emotions", "keywords"],
};

export const analyzeText = async (text: string): Promise<AnalysisResult> => {
  if (!apiKey) {
    throw new Error("API Key is missing");
  }

  const ai = new GoogleGenAI({ apiKey });

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: `Analyze the sentiment of the following text strictly.
      
      Text to analyze:
      "${text}"
      
      Provide the sentiment classification, a confidence score (0-100), a brief reasoning, detailed emotions, and keywords.`,
      config: {
        responseMimeType: "application/json",
        responseSchema: sentimentSchema,
        temperature: 0.3, // Low temperature for consistent classification
      },
    });

    const responseText = response.text;
    if (!responseText) {
      throw new Error("Empty response from Gemini");
    }

    const data = JSON.parse(responseText) as AnalysisResult;
    return data;
  } catch (error) {
    console.error("Gemini API Error:", error);
    throw error;
  }
};