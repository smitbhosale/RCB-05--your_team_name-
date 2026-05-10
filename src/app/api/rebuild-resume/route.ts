import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextResponse } from "next/server";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");

export async function POST(req: Request) {
  let targetRole = "Software Engineer";
  let resumeText = "";

  try {
    const body = await req.json();
    targetRole = body.targetRole || targetRole;
    resumeText = body.resumeText || resumeText;

    if (!process.env.GEMINI_API_KEY || process.env.GEMINI_API_KEY === "placeholder" || process.env.GEMINI_API_KEY === "your_gemini_api_key_here") {
      const mockRebuild = getMockRebuild(targetRole);
      return NextResponse.json({ optimizedResume: mockRebuild, mock: true });
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

    return NextResponse.json({ optimizedResume, mock: false });
  } catch (error: any) {
    console.error("Resume Rebuild Error:", error);
    const mockRebuild = getMockRebuild(targetRole);
    return NextResponse.json({ optimizedResume: mockRebuild, mock: true });
  }
}

function getMockRebuild(targetRole: string) {
  return {
    personalInfo: {
      name: "Aryan",
      email: "aryan@example.com",
      phone: "+91 98765 43210",
      linkedin: "linkedin.com/in/aryan",
      portfolio: "aryan.dev"
    },
    summary: `Results-driven ${targetRole} with a strong foundation in modern web technologies and a passion for building scalable, high-performance applications. Proven ability to quickly learn new frameworks and collaborate in agile environments. Eager to leverage analytical skills and technical expertise to drive impact and deliver exceptional user experiences.`,
    skills: {
      languages: ["JavaScript", "TypeScript", "Python", "Java", "C++"],
      frameworks: ["React", "Next.js", "Node.js", "Express", "Tailwind CSS"],
      tools: ["Git", "Docker", "AWS", "MongoDB", "PostgreSQL"]
    },
    experience: [
      {
        company: "Tech Solutions Inc.",
        role: `Junior ${targetRole}`,
        date: "Jan 2023 - Present",
        bullets: [
          "Engineered a high-performance dashboard using React and Node.js, improving page load speeds by 40% and increasing user engagement by 15%.",
          "Collaborated with a cross-functional team of 5 to successfully migrate a legacy PHP codebase to a modern Next.js architecture, reducing server costs by 25%.",
          "Implemented robust RESTful APIs and optimized database queries, handling over 10,000 daily active users with 99.9% uptime."
        ]
      },
      {
        company: "Innovate Labs",
        role: "Software Engineering Intern",
        date: "May 2022 - Aug 2022",
        bullets: [
          "Developed automated testing scripts using Jest and Cypress, increasing test coverage from 60% to 85% and reducing production bugs by 30%.",
          "Designed and built a responsive landing page resulting in a 20% increase in lead generation during the summer marketing campaign."
        ]
      }
    ],
    projects: [
      {
        title: "E-Commerce Platform",
        tech: "React, Redux, Node.js, MongoDB",
        date: "Oct 2022",
        bullets: [
          "Architected a full-stack e-commerce solution featuring secure user authentication, shopping cart functionality, and Stripe payment integration.",
          "Utilized Redux for complex state management, ensuring a seamless checkout flow for users."
        ]
      },
      {
        title: "Real-time Chat Application",
        tech: "Next.js, Socket.io, Tailwind CSS",
        date: "Feb 2023",
        bullets: [
          "Built a real-time messaging application with instant delivery using Socket.io and a sleek UI designed with Tailwind CSS.",
          "Implemented private rooms and read receipts, supporting concurrent connections of up to 500 users."
        ]
      }
    ],
    education: [
      {
        institution: "Indian Institute of Technology",
        degree: "Bachelor of Technology in Computer Science",
        date: "2019 - 2023",
        bullets: [
          "CGPA: 8.5/10",
          "Relevant Coursework: Data Structures, Algorithms, Operating Systems, Database Management Systems."
        ]
      }
    ],
    missingSections: [
      "Certifications (Highly recommended for cloud/DevOps roles)",
      "Extracurriculars / Leadership (Good for showing soft skills)"
    ]
  };
}
