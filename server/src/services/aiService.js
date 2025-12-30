
import dotenv from "dotenv";
dotenv.config();

import { GoogleGenAI } from "@google/genai";

// Initialize Gemini
const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY
});

export const rewriteWithGemini = async (
  original,
  ref1 = "",
  ref2 = "",
  refs = []
) => {
  try {
    const prompt = `
You are an expert SEO content writer.

TASK:
- Rewrite the article in clear, engaging, human-like English
- Improve readability, structure, and SEO
- Use proper headings, subheadings, and bullet points
- Keep the meaning intact (no hallucination)
- Add a "References" section at the end

ORIGINAL ARTICLE:
${original}

REFERENCE ARTICLE 1:
${ref1}

REFERENCE ARTICLE 2:
${ref2}

REFERENCES (links to cite):
${refs.join("\n")}
`;

    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: prompt
    });

    // Return final rewritten article text
    return response.text;
  } catch (error) {
    throw error;
  }
};
