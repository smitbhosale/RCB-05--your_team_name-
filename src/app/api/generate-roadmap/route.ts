import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextResponse } from "next/server";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");

export async function POST(req: Request) {
  let role = "Software Engineer";
  let timeline = "3 months";
  let skills = "";
  let userId = "";

  try {
    const body = await req.json();
    role = body.role || role;
    timeline = body.timeline || timeline;
    skills = body.skills || skills;
    userId = body.userId || userId;

    // Use mock data if API key is invalid or placeholder
    if (!process.env.GEMINI_API_KEY || process.env.GEMINI_API_KEY === "placeholder" || process.env.GEMINI_API_KEY === "your_gemini_api_key_here") {
      const mockRoadmap = getMockRoadmap(role, timeline);
      return NextResponse.json({ roadmap: mockRoadmap, mock: true });
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
      2. projects: Array of 3-4 complex, resume-worthy projects with descriptions and tech stack.
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

    return NextResponse.json({ roadmap, mock: false });
  } catch (error: any) {
    console.error("Roadmap Generation Error:", error);
    const mockRoadmap = getMockRoadmap(role || "Software Engineer", timeline || "3 months");
    return NextResponse.json({ roadmap: mockRoadmap, mock: true });
  }
}

function getMockRoadmap(role: string, timeline: string) {
  return {
    monthlyRoadmap: [
      {
        month: 1,
        title: "Foundations & Core Skills",
        focus: `Master the absolute basics required for a ${role} role.`,
        weeks: [
          { week: 1, title: "Language Mastery", tasks: ["Understand deep language concepts", "Solve 20 easy algorithm problems", "Read industry best practices"] },
          { week: 2, title: "Framework Fundamentals", tasks: ["Build a basic CRUD app", "Implement routing and state management", "Learn component lifecycles"] },
          { week: 3, title: "Database Integration", tasks: ["Design a normalized schema", "Connect frontend to backend APIs", "Write complex queries"] },
          { week: 4, title: "Deployment & CI/CD", tasks: ["Set up automated testing", "Deploy to Vercel/AWS", "Configure GitHub Actions"] }
        ]
      },
      {
        month: 2,
        title: "Advanced Concepts & Architecture",
        focus: "Build scalable and performant systems.",
        weeks: [
          { week: 1, title: "System Design Basics", tasks: ["Study distributed systems", "Design a URL shortener", "Learn caching strategies"] },
          { week: 2, title: "Performance Optimization", tasks: ["Implement lazy loading", "Optimize database indexing", "Reduce bundle size"] },
          { week: 3, title: "Security Best Practices", tasks: ["Implement JWT auth", "Prevent XSS and CSRF", "Audit dependencies"] },
          { week: 4, title: "Complex State Management", tasks: ["Set up Redux/Zustand", "Handle async side effects", "Write custom hooks"] }
        ]
      },
      {
        month: 3,
        title: "Interview Prep & Portfolio",
        focus: "Get job ready and ace the interviews.",
        weeks: [
          { week: 1, title: "Mock Interviews", tasks: ["Do 3 peer mock interviews", "Refine behavioral stories", "Practice system design on whiteboard"] },
          { week: 2, title: "Portfolio Polish", tasks: ["Update READMEs with GIFs", "Ensure 100% Lighthouse score", "Add unit tests to projects"] },
          { week: 3, title: "Open Source", tasks: ["Find 2 good first issues", "Submit a PR to a major library", "Engage with maintainers"] },
          { week: 4, title: "Applications", tasks: ["Tailor resume for 5 dream companies", "Reach out to recruiters", "Apply to 20 positions"] }
        ]
      }
    ],
    projects: [
      { title: "Real-time Collaboration Hub", description: "A Notion clone with WebSockets.", tech: ["React", "Node.js", "Socket.io", "PostgreSQL"] },
      { title: "AI-Powered Analytics Dashboard", description: "Visualize data trends using machine learning.", tech: ["Next.js", "Python", "TensorFlow", "MongoDB"] },
      { title: "Distributed Task Queue", description: "A scalable background job processor.", tech: ["Go", "Redis", "Docker", "AWS"] }
    ],
    certifications: ["AWS Certified Developer", "Meta Front-End Developer", "Google Cloud Professional"],
    interviewPrep: {
      behavioral: ["Tell me about a time you failed.", "How do you handle conflict?", "Describe your proudest achievement."],
      technical: ["Explain Event Loop.", "How does React rendering work?", "Design Twitter timeline architecture."]
    },
    dsaRoadmap: [
      { week: 1, topic: "Arrays & Hashing", problems: ["Two Sum", "Valid Anagram", "Group Anagrams"] },
      { week: 2, topic: "Two Pointers & Sliding Window", problems: ["Valid Palindrome", "3Sum", "Best Time to Buy and Sell Stock"] },
      { week: 3, topic: "Trees & Graphs", problems: ["Invert Binary Tree", "Clone Graph", "Number of Islands"] }
    ],
    milestones: ["Complete 100 LeetCode problems", "Deploy 3 full-stack applications", "Get first technical interview"]
  };
}
