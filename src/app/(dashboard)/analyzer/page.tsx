"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  FileSearch,
  Sparkles,
  BrainCircuit,
  Loader2,
  CheckCircle2,
  ThumbsUp,
  ThumbsDown,
  Info,
  User,
} from "lucide-react";
import { useAuth } from "@/context/AuthContext";

import { FileUpload } from "@/components/analyzer/FileUpload";
import { ScoreRing } from "@/components/analyzer/ScoreRing";
import { SectionScores } from "@/components/analyzer/SectionScores";
import { SkillGapAnalysis } from "@/components/analyzer/SkillGapAnalysis";
import { SuggestionsPanel } from "@/components/analyzer/SuggestionsPanel";
import { KeywordsGrid } from "@/components/analyzer/KeywordsGrid";
import { SkillsRadar } from "@/components/analyzer/SkillsRadar";
import type { ResumeAnalysis } from "@/types/resume";

type AnalysisStep = "idle" | "uploading" | "parsing" | "analyzing" | "scoring" | "done";

const stepLabels: Record<AnalysisStep, string> = {
  idle: "",
  uploading: "Uploading Resume...",
  parsing: "Parsing document structure...",
  analyzing: "Running Gemini deep analysis...",
  scoring: "Calculating ATS compatibility...",
  done: "Analysis complete!",
};

export default function AnalyzerPage() {
  const { user } = useAuth();
  const [analysis, setAnalysis] = useState<ResumeAnalysis | null>(null);

  const [step, setStep] = useState<AnalysisStep>("idle");
  const [isMock, setIsMock] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleFileSelected = async (file: File) => {
    setError(null);
    setAnalysis(null);

    // Simulated multi-step progress
    setStep("uploading");
    await delay(800);
    setStep("parsing");
    await delay(1200);
    setStep("analyzing");

    try {
      const formData = new FormData();
      formData.append("resume", file);
      if (user) {
        formData.append("userId", user.uid);
      }


      const res = await fetch("/api/analyze-resume", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Analysis failed");
      }

      setStep("scoring");
      await delay(600);

      setAnalysis(data.analysis);
      setIsMock(data.mock || false);
      setStep("done");
    } catch (err: any) {
      setError(err.message || "Something went wrong.");
      setStep("idle");
    }
  };

  const isAnalyzing = step !== "idle" && step !== "done";

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <motion.h1
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-3xl md:text-4xl font-black tracking-tighter flex items-center gap-3"
          >
            <FileSearch className="w-8 h-8 text-rcb-red" />
            Resume <span className="text-rcb-red">Analyzer</span>
          </motion.h1>
          <p className="text-sm text-white/40 mt-2">
            Hey {user?.displayName?.split(" ")[0] || "there"}, let's optimize your resume for maximum impact.
          </p>

        </div>
      </div>

      {/* Upload Section */}
      <AnimatePresence mode="wait">
        {!analysis && (
          <motion.div
            key="upload-section"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="glass rounded-3xl p-10"
          >
            <FileUpload onFileSelected={handleFileSelected} isAnalyzing={isAnalyzing} />

            {/* Progress Steps */}
            <AnimatePresence>
              {isAnalyzing && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  className="mt-8 overflow-hidden"
                >
                  <div className="flex items-center gap-4 p-6 rounded-2xl bg-black/40 border border-white/5">
                    <div className="relative">
                      <Loader2 className="w-6 h-6 text-rcb-red animate-spin" />
                      <div className="absolute inset-0 w-6 h-6 bg-rcb-red/20 rounded-full blur-md animate-pulse" />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-bold text-white">{stepLabels[step]}</p>
                      <div className="mt-2 h-1 bg-white/5 rounded-full overflow-hidden">
                        <motion.div
                          animate={{
                            width:
                              step === "uploading" ? "25%" :
                              step === "parsing" ? "50%" :
                              step === "analyzing" ? "75%" :
                              step === "scoring" ? "95%" : "100%",
                          }}
                          transition={{ duration: 0.5 }}
                          className="h-full bg-rcb-red rounded-full shadow-[0_0_10px_rgba(238,28,37,0.5)]"
                        />
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {error && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-6 p-4 rounded-2xl bg-red-500/10 border border-red-500/20 text-sm text-red-400 flex items-center gap-3"
              >
                <Info className="w-5 h-5 shrink-0" />
                {error}
              </motion.div>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Results Section */}
      <AnimatePresence>
        {analysis && step === "done" && (
          <motion.div
            key="results"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="space-y-8"
          >
            {/* Mock Data Notice */}
            {isMock && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-xs text-amber-400 flex items-center gap-3"
              >
                <Sparkles className="w-4 h-4 shrink-0" />
                <span>
                  <strong>Demo Mode:</strong> Set your <code className="font-mono bg-white/5 px-1 rounded">GEMINI_API_KEY</code> in <code className="font-mono bg-white/5 px-1 rounded">.env.local</code> for real AI analysis.
                </span>
              </motion.div>
            )}

            {/* Top Row: Score + Summary + Strengths/Weaknesses */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Score Ring */}
              <div className="glass rounded-3xl p-8 flex flex-col items-center justify-center relative overflow-hidden">
                <div className="absolute -top-20 -right-20 w-60 h-60 bg-rcb-red/10 rounded-full blur-[80px]" />
                <ScoreRing score={analysis.atsScore} />
                <button
                  onClick={() => { setAnalysis(null); setStep("idle"); }}
                  className="mt-6 px-6 py-2.5 rounded-xl bg-white/5 border border-white/10 text-xs font-bold text-white/60 hover:text-white hover:border-rcb-red/30 transition-all"
                >
                  ANALYZE ANOTHER
                </button>
              </div>

              {/* Summary + Strengths/Weaknesses */}
              <div className="lg:col-span-2 glass rounded-3xl p-8">
                <h3 className="text-sm font-bold tracking-widest text-white/40 uppercase mb-4">
                  Executive Summary
                </h3>
                <p className="text-white/70 text-sm leading-relaxed mb-8">
                  {analysis.summary}
                </p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="text-xs font-bold text-green-500 uppercase tracking-widest mb-4 flex items-center gap-2">
                      <ThumbsUp className="w-3 h-3" /> Strengths
                    </h4>
                    <ul className="space-y-3">
                      {analysis.strengths.map((s, i) => (
                        <motion.li
                          key={i}
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: 0.5 + i * 0.08 }}
                          className="flex items-start gap-2 text-xs text-white/60"
                        >
                          <CheckCircle2 className="w-3.5 h-3.5 text-green-500 shrink-0 mt-0.5" />
                          {s}
                        </motion.li>
                      ))}
                    </ul>
                  </div>

                  <div>
                    <h4 className="text-xs font-bold text-red-400 uppercase tracking-widest mb-4 flex items-center gap-2">
                      <ThumbsDown className="w-3 h-3" /> Weaknesses
                    </h4>
                    <ul className="space-y-3">
                      {analysis.weaknesses.map((w, i) => (
                        <motion.li
                          key={i}
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: 0.5 + i * 0.08 }}
                          className="flex items-start gap-2 text-xs text-white/60"
                        >
                          <Info className="w-3.5 h-3.5 text-red-400 shrink-0 mt-0.5" />
                          {w}
                        </motion.li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            </div>

            {/* Middle Row: Skills + Section Scores */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <SkillsRadar skills={analysis.skills} />
              <SectionScores scores={analysis.sectionScores} />
            </div>

            {/* Keywords */}
            <KeywordsGrid keywords={analysis.keywords} />

            {/* Bottom Row: Suggestions + Skill Gaps */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <SuggestionsPanel suggestions={analysis.suggestions} />
              <SkillGapAnalysis gaps={analysis.skillGaps} />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function delay(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
