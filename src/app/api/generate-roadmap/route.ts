import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextResponse } from "next/server";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");

export async function POST(req: Request) {
  try {
    const { role, skills, timeline, userId } = await req.json();

    if (!process.env.GEMINI_API_KEY) {
      return NextResponse.json({ error: "Gemini API Key missing" }, { status: 500 });
    }

    const model = genAI.getGenerativeModel({ model: "gemini-1.5-pro" });

    const prompt = `
      You are a world-class career coach and technical architect. 
      Generate a comprehensive, highly detailed career roadmap for a user targeting the following:
      - Target Role: ${role}
      - Current Skills: ${skills}
      - Target Timeline: ${timeline}

      The roadmap should be structured in a monthly/weekly format. 
      Include the following sections in a valid JSON format:
      1. monthlyRoadmap: Array of months, each containing:
         - title: Month title
         - focus: Main focus of the month
         - weeks: Array of 4 weeks, each with a title and list of specific actionable tasks.
      2. projectSuggestions: Array of 3-4 complex, resume-worthy projects with descriptions and tech stack.
      3. certifications: Array of 2-3 relevant industry certifications.
      4. interviewPrep: A plan for behavioral and technical interviews.
      5. dsaRoadmap: A week-by-week DSA topic schedule.
      6. milestones: Key achievements to hit.

      Return ONLY the JSON. No markdown, no prose.
      JSON structure example:
      {
        "monthlyRoadmap": [
          {
            "month": 1,
            "title": "...",
            "focus": "...",
            "weeks": [
              { "week": 1, "title": "...", "tasks": ["...", "..."] }
            ]
          }
        ],
        "projects": [{ "title": "...", "description": "...", "tech": ["...", "..."] }],
        "certifications": ["...", "..."],
        "interviewPrep": { "behavioral": ["...", "..."], "technical": ["...", "..."] },
        "dsaRoadmap": [{ "week": 1, "topic": "...", "problems": ["...", "..."] }],
        "milestones": ["...", "..."]
      }
    `;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    
    // Clean JSON response (sometimes Gemini wraps it in ```json)
    const jsonStr = text.replace(/```json|```/gi, "").trim();
    const roadmap = JSON.parse(jsonStr);

    return NextResponse.json({ roadmap });
  } catch (error: any) {
    console.error("Roadmap Generation Error:", error);
    return NextResponse.json({ error: "Failed to generate roadmap" }, { status: 500 });
  }
}
