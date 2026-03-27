import { GoogleGenAI } from "@google/genai";

const apiKey = process.env.GEMINI_API_KEY;

if (!apiKey) {
  console.warn("GEMINI_API_KEY is not set. Chatbot will not function correctly.");
}

const genAI = new GoogleGenAI({ apiKey: apiKey || "" });

export const getChatSession = (systemInstruction: string) => {
  return genAI.chats.create({
    model: "gemini-3-flash-preview",
    config: {
      systemInstruction,
    },
  });
};
