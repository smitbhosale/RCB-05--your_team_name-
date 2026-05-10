import { NextRequest, NextResponse } from "next/server";
import { geminiPro } from "@/lib/gemini";
import { db } from "@/lib/firebase-admin";
import type { ResumeAnalysis } from "@/types/resume";


const ANALYSIS_PROMPT = `You are an elite ATS (Applicant Tracking System) and career coaching AI. Analyze the following resume text and return a comprehensive JSON analysis.

RESUME TEXT:
---
{RESUME_TEXT}
---

Return ONLY valid JSON matching this exact schema (no markdown, no code blocks, just raw JSON):
{
  "atsScore": <number 0-100>,
  "summary": "<2-3 sentence executive summary of candidate>",
  "strengths": ["<strength 1>", "<strength 2>", ...up to 5],
  "weaknesses": ["<weakness 1>", "<weakness 2>", ...up to 5],
  "skills": [
    { "name": "<skill>", "level": "beginner|intermediate|advanced|expert", "relevance": <0-100> }
  ],
  "suggestions": [
    { "category": "content|format|impact|keywords|structure", "priority": "high|medium|low", "title": "<short title>", "description": "<detailed actionable suggestion>" }
  ],
  "skillGaps": [
    { "skill": "<missing/weak skill>", "importance": <0-100>, "currentLevel": <0-100>, "targetLevel": <0-100>, "recommendation": "<how to improve>" }
  ],
  "sectionScores": [
    { "section": "<section name>", "score": <0-100>, "maxScore": 100, "feedback": "<specific feedback>" }
  ],
  "keywords": [
    { "keyword": "<industry keyword>", "found": true|false, "importance": "critical|important|nice-to-have" }
  ]
}

Be strict, detailed, and honest. Focus on modern tech industry standards. Provide at least 5 suggestions, 5 skills, 4 skill gaps, 5 section scores, and 10 keywords.`;

function getMockAnalysis(resumeText: string = ""): ResumeAnalysis {
  // Generate a dynamic but consistent score based on text length to simulate real analysis
  const textLen = resumeText.length;
  let dynamicScore = 45;
  if (textLen > 500) dynamicScore += 15;
  if (textLen > 1500) dynamicScore += 15;
  if (textLen > 3000) dynamicScore += 10;
  // Add some pseudo-randomness based on length modulo
  dynamicScore += (textLen % 15);
  
  // Cap between 45 and 98
  dynamicScore = Math.min(Math.max(dynamicScore, 45), 98);

  return {
    atsScore: dynamicScore,
    summary: "A promising early-career software developer with a focus on web technologies. The resume shows potential but lacks quantifiable impact metrics and industry-specific keywords.",
    strengths: [
      "Strong foundation in React and JavaScript",
      "Has relevant project experience",
      "Clean formatting and professional structure",
      "Shows initiative through personal projects",
      "Education is well-presented"
    ],
    weaknesses: [
      "Missing quantifiable achievements and metrics",
      "Lack of action verbs in experience descriptions",
      "No mention of testing or CI/CD practices",
      "Skills section doesn't differentiate proficiency levels",
      "No professional summary or objective statement"
    ],
    skills: [
      { name: "React", level: "intermediate", relevance: 95 },
      { name: "JavaScript", level: "intermediate", relevance: 90 },
      { name: "Node.js", level: "beginner", relevance: 85 },
      { name: "TypeScript", level: "beginner", relevance: 88 },
      { name: "HTML/CSS", level: "advanced", relevance: 70 },
      { name: "Git", level: "intermediate", relevance: 80 },
      { name: "Python", level: "beginner", relevance: 60 }
    ],
    suggestions: [
      { category: "impact", priority: "high", title: "Add Quantifiable Metrics", description: "Transform 'Built a web app' into 'Built a React web app serving 5,000+ users with 99.9% uptime'. Numbers make your impact tangible to recruiters." },
      { category: "keywords", priority: "high", title: "Add ATS-Critical Keywords", description: "Include terms like 'Agile', 'REST API', 'CI/CD', 'unit testing', and 'microservices' that ATS systems actively scan for." },
      { category: "content", priority: "high", title: "Write a Professional Summary", description: "Add a 2-3 line summary at the top highlighting your strongest skills, years of experience, and career objective." },
      { category: "structure", priority: "medium", title: "Use STAR Method for Experience", description: "Structure each bullet point as: Situation → Task → Action → Result. This ensures every point demonstrates clear value." },
      { category: "format", priority: "medium", title: "Optimize for Single-Page Format", description: "For early career, keep to one page. Remove redundant items and consolidate skills into a clean grid layout." },
      { category: "content", priority: "low", title: "Add a Projects Section", description: "Dedicated projects section with live links and GitHub repos demonstrates hands-on capability beyond coursework." }
    ],
    skillGaps: [
      { skill: "TypeScript", importance: 92, currentLevel: 30, targetLevel: 75, recommendation: "Complete a full-stack TypeScript project. Focus on type safety patterns and generics." },
      { skill: "System Design", importance: 85, currentLevel: 10, targetLevel: 60, recommendation: "Study common system design patterns. Build a URL shortener or chat system from scratch." },
      { skill: "Testing (Jest/Vitest)", importance: 80, currentLevel: 15, targetLevel: 70, recommendation: "Add unit and integration tests to your existing projects. Aim for 80%+ coverage." },
      { skill: "Cloud Services (AWS/GCP)", importance: 78, currentLevel: 5, targetLevel: 50, recommendation: "Deploy a project on AWS or GCP. Learn EC2, S3, and Lambda fundamentals." }
    ],
    sectionScores: [
      { section: "Contact Information", score: 90, maxScore: 100, feedback: "Well-formatted with email and LinkedIn. Consider adding a portfolio link." },
      { section: "Professional Summary", score: 20, maxScore: 100, feedback: "Missing entirely. This is the first thing recruiters read — add one immediately." },
      { section: "Work Experience", score: 55, maxScore: 100, feedback: "Entries exist but lack impact metrics. Use action verbs and quantify results." },
      { section: "Skills", score: 70, maxScore: 100, feedback: "Good list but no proficiency levels. Group by category (Frontend, Backend, Tools)." },
      { section: "Education", score: 85, maxScore: 100, feedback: "Clear and well-structured. Add relevant coursework or GPA if 3.5+." }
    ],
    keywords: [
      { keyword: "React", found: true, importance: "critical" },
      { keyword: "TypeScript", found: false, importance: "critical" },
      { keyword: "REST API", found: false, importance: "critical" },
      { keyword: "Agile/Scrum", found: false, importance: "important" },
      { keyword: "CI/CD", found: false, importance: "important" },
      { keyword: "Git", found: true, importance: "important" },
      { keyword: "Unit Testing", found: false, importance: "important" },
      { keyword: "Node.js", found: true, importance: "important" },
      { keyword: "Docker", found: false, importance: "nice-to-have" },
      { keyword: "MongoDB", found: false, importance: "nice-to-have" }
    ]
  };
}

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get("resume") as File | null;
    const userId = (formData.get("userId") as string) || "guest";


    if (!file) {
      return NextResponse.json({ error: "No file uploaded" }, { status: 400 });
    }

    // Extract text from file
    let resumeText = "";
    
    if (file.type === "application/pdf") {
      const buffer = Buffer.from(await file.arrayBuffer());
      // Dynamic import for pdf-parse (Node.js only)
      const pdfParseModule = await import("pdf-parse");
      const pdfParse = (pdfParseModule as any).default || pdfParseModule;
      const pdfData = await pdfParse(buffer);
      resumeText = pdfData.text;
    } else if (file.type === "text/plain" || file.name.endsWith(".txt")) {
      resumeText = await file.text();
    } else {
      return NextResponse.json(
        { error: "Unsupported file type. Upload PDF or TXT." },
        { status: 400 }
      );
    }

    if (!resumeText || resumeText.trim().length < 50) {
      return NextResponse.json(
        { error: "Could not extract enough text from the file. Please try a different resume." },
        { status: 422 }
      );
    }

    // If no Gemini key, return mock data
    if (!process.env.GEMINI_API_KEY || process.env.GEMINI_API_KEY === "your_gemini_api_key_here" || process.env.GEMINI_API_KEY === "placeholder") {
      return NextResponse.json({ analysis: getMockAnalysis(resumeText), mock: true });
    }

    // Call Gemini
    const prompt = ANALYSIS_PROMPT.replace("{RESUME_TEXT}", resumeText);
    const result = await geminiPro.generateContent(prompt);
    const response = result.response;
    let text = response.text();

    // Strip markdown code fences if present
    text = text.replace(/```json\n?/g, "").replace(/```\n?/g, "").trim();

    const analysis: ResumeAnalysis = JSON.parse(text);

    // Save to Firestore (Persistent Memory)
    try {
      const memoryRef = db.collection("user_memory").doc(userId);
      await memoryRef.set({
        lastResumeAnalysis: analysis,
        skillGaps: analysis.skillGaps,
        updatedAt: new Date(),
      }, { merge: true });
    } catch (dbError) {
      console.error("Failed to save memory:", dbError);
    }


    return NextResponse.json({ analysis, mock: false });

  } catch (error: any) {
    console.error("Resume analysis error:", error);
    
    // Fallback to mock on any error
    return NextResponse.json({
      analysis: getMockAnalysis(""),
      mock: true,
      error: "AI analysis failed, showing demo data."
    });
  }
}
