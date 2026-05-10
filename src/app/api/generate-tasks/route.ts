import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextResponse } from "next/server";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");

export async function POST(req: Request) {
  try {
    const { role, completedLastWeek = 0 } = await req.json();

    if (!process.env.GEMINI_API_KEY) {
      return NextResponse.json({ error: "Gemini API Key missing" }, { status: 500 });
    }

    const model = genAI.getGenerativeModel({ model: "gemini-1.5-pro" });

    const prompt = `
      You are an elite autonomous AI career coach.
      The user is targeting the role: "${role || "Software Engineer"}".
      Last week, they completed ${completedLastWeek} tasks. 

      Based on this, generate exactly 4 highly-actionable, specific tasks for this week's mission.
      If they completed many tasks, make them slightly harder. If few, make them foundational.
      Also provide a short, punchy motivational message (max 15 words) from the AI.

      Return ONLY a valid JSON object matching this structure:
      {
        "tasks": [
          { "id": "1", "text": "...", "completed": false, "xp": 100 }
        ],
        "message": "..."
      }
    `;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    
    const jsonStr = text.replace(/```json|```/gi, "").trim();
    const data = JSON.parse(jsonStr);

    return NextResponse.json(data);
  } catch (error: any) {
    console.error("Task Generation Error:", error);
    return NextResponse.json({ error: "Failed to generate tasks" }, { status: 500 });
  }
}
