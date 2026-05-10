"use client";

import { motion } from "framer-motion";
import type { SectionScore } from "@/types/resume";

export const SectionScores = ({ scores }: { scores: SectionScore[] }) => {
  const getBarColor = (score: number) => {
    if (score >= 80) return "bg-green-500";
    if (score >= 60) return "bg-rcb-red";
    if (score >= 40) return "bg-amber-500";
    return "bg-red-500";
  };

  return (
    <div className="glass rounded-3xl p-8">
      <h3 className="text-sm font-bold tracking-widest text-white/40 uppercase mb-8">
        Section Breakdown
      </h3>
      <div className="space-y-6">
        {scores.map((s, i) => (
          <motion.div
            key={s.section}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.8 + i * 0.1 }}
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold text-white/70">{s.section}</span>
              <span className="text-xs font-black text-white/50">{s.score}/{s.maxScore}</span>
            </div>
            <div className="h-2 w-full bg-white/5 rounded-full overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${(s.score / s.maxScore) * 100}%` }}
                transition={{ duration: 1, delay: 1 + i * 0.1 }}
                className={`h-full rounded-full ${getBarColor(s.score)}`}
                style={{ boxShadow: "0 0 10px rgba(238,28,37,0.2)" }}
              />
            </div>
            <p className="text-[10px] text-white/30 mt-1.5 leading-relaxed">{s.feedback}</p>
          </motion.div>
        ))}
      </div>
    </div>
  );
};
