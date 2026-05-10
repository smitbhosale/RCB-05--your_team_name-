import { GoogleGenerativeAI } from "@google/generative-ai";

if (!process.env.GEMINI_API_KEY) {
  console.warn("⚠ GEMINI_API_KEY not set. AI features will use mock data.");
}

export const genAI = new GoogleGenerativeAI(
  process.env.GEMINI_API_KEY || "placeholder"
);

export const geminiPro = genAI.getGenerativeModel({
  model: "gemini-1.5-pro",
});

export const geminiFlash = genAI.getGenerativeModel({
  model: "gemini-1.5-flash",
});
