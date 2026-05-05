/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { GoogleGenAI, Type } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || '' });

export interface CategorizedExpense {
  category: string;
  confidence: number;
  reasoning: string;
}

export async function categorizeExpense(description: string): Promise<CategorizedExpense> {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `Categorize this expense description: "${description}". Be concise.`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            category: { 
              type: Type.STRING, 
              description: "One of: Food, Transport, Utilities, Entertainment, Health, Shopping, Other" 
            },
            confidence: { type: Type.NUMBER, description: "Confidence score between 0 and 1" },
            reasoning: { type: Type.STRING, description: "Short reasoning why this category was chosen" },
          },
          required: ["category", "confidence", "reasoning"],
        },
      },
    });

    return JSON.parse(response.text.trim());
  } catch (error) {
    console.error("AI Categorization failed:", error);
    return {
      category: "Other",
      confidence: 0,
      reasoning: "Failed to categorize with AI",
    };
  }
}
