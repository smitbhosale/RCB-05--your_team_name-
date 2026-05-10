import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextResponse } from "next/server";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");

export async function POST(req: Request) {
  try {
    const { targetRole, resumeText } = await req.json();

    if (!process.env.GEMINI_API_KEY) {
      return NextResponse.json({ error: "Gemini API Key missing" }, { status: 500 });
    }

    const model = genAI.getGenerativeModel({ model: "gemini-1.5-pro" });

    const prompt = `
      You are an elite Tech Recruiter and Resume Writer.
      The user wants to rebuild and optimize their resume for the following target role: "${targetRole}".
      
      Here is their current raw resume text/content:
      """
      ${resumeText}
      """

      Your task is to completely rewrite and optimize this resume to pass ATS systems and impress hiring managers.
      - Rewrite all bullet points using the STAR method (Situation, Task, Action, Result).
      - Ensure strong action verbs are used.
      - Quantify impact with realistic but impressive metrics where applicable (e.g., "improved performance by X%").
      - Generate a powerful, concise professional summary.
      - Extract and categorize skills properly.
      - Identify any missing sections or information that a recruiter would expect for this role, and list them in 'missingSections'.

      Return the optimized resume ONLY as a valid JSON object matching this exact structure (fill in extracted info, or use placeholders if completely missing):
      {
        "personalInfo": {
          "name": "...",
          "email": "...",
          "phone": "...",
          "linkedin": "...",
          "portfolio": "..."
        },
        "summary": "...",
        "skills": {
          "languages": ["..."],
          "frameworks": ["..."],
          "tools": ["..."]
        },
        "experience": [
          {
            "company": "...",
            "role": "...",
            "date": "...",
            "bullets": ["..."]
          }
        ],
        "projects": [
          {
            "title": "...",
            "tech": "...",
            "date": "...",
            "bullets": ["..."]
          }
        ],
        "education": [
          {
            "institution": "...",
            "degree": "...",
            "date": "...",
            "bullets": ["..."]
          }
        ],
        "missingSections": ["..."]
      }

      Do not include any markdown formatting like \`\`\`json or \`\`\`, just the raw JSON string.
    `;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    
    const jsonStr = text.replace(/```json|```/gi, "").trim();
    const optimizedResume = JSON.parse(jsonStr);

    return NextResponse.json({ optimizedResume });
  } catch (error: any) {
    console.error("Resume Rebuild Error:", error);
    return NextResponse.json({ error: "Failed to rebuild resume" }, { status: 500 });
  }
}
