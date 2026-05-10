export interface ResumeAnalysis {
  atsScore: number;
  summary: string;
  strengths: string[];
  weaknesses: string[];
  skills: SkillAssessment[];
  suggestions: Suggestion[];
  skillGaps: SkillGap[];
  sectionScores: SectionScore[];
  keywords: KeywordMatch[];
}

export interface SkillAssessment {
  name: string;
  level: "beginner" | "intermediate" | "advanced" | "expert";
  relevance: number; // 0-100
}

export interface Suggestion {
  category: "content" | "format" | "impact" | "keywords" | "structure";
  priority: "high" | "medium" | "low";
  title: string;
  description: string;
}

export interface SkillGap {
  skill: string;
  importance: number; // 0-100
  currentLevel: number; // 0-100
  targetLevel: number; // 0-100
  recommendation: string;
}

export interface SectionScore {
  section: string;
  score: number;
  maxScore: number;
  feedback: string;
}

export interface KeywordMatch {
  keyword: string;
  found: boolean;
  importance: "critical" | "important" | "nice-to-have";
}
