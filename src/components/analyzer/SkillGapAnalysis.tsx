"use client";

import { motion } from "framer-motion";
import { AlertTriangle, ArrowUp } from "lucide-react";
import type { SkillGap } from "@/types/resume";

export const SkillGapAnalysis = ({ gaps }: { gaps: SkillGap[] }) => {
  return (
    <div className="glass rounded-3xl p-8">
      <div className="flex items-center gap-2 mb-8">
        <AlertTriangle className="w-4 h-4 text-amber-500" />
        <h3 className="text-sm font-bold tracking-widest text-white/40 uppercase">
          Skill Gap Analysis
        </h3>
      </div>

      <div className="space-y-6">
        {gaps.map((gap, i) => (
          <motion.div
            key={gap.skill}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.2 + i * 0.15 }}
            className="p-5 rounded-2xl bg-white/[0.02] border border-white/5 hover:border-amber-500/20 transition-all group"
          >
            <div className="flex items-center justify-between mb-3">
              <span className="text-sm font-bold text-white group-hover:text-amber-400 transition-colors">
                {gap.skill}
              </span>
              <span className="text-[10px] font-black px-2 py-0.5 rounded bg-amber-500/10 text-amber-400">
                {gap.importance}% Priority
              </span>
            </div>

            {/* Current vs Target Bar */}
            <div className="relative h-3 bg-white/5 rounded-full overflow-hidden mb-3">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${gap.currentLevel}%` }}
                transition={{ duration: 1, delay: 1.5 + i * 0.1 }}
                className="absolute h-full bg-white/20 rounded-full"
              />
              <motion.div
                initial={{ left: 0 }}
                animate={{ left: `${gap.targetLevel}%` }}
                transition={{ duration: 1, delay: 1.7 + i * 0.1 }}
                className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-3 h-3 rounded-full bg-rcb-red border-2 border-[#030303] shadow-[0_0_6px_rgba(238,28,37,0.5)]"
              />
            </div>

            <div className="flex justify-between text-[10px] text-white/30 mb-3">
              <span>Current: {gap.currentLevel}%</span>
              <span className="flex items-center gap-1 text-rcb-red">
                <ArrowUp className="w-3 h-3" /> Target: {gap.targetLevel}%
              </span>
            </div>

            <p className="text-[11px] text-white/40 leading-relaxed">
              {gap.recommendation}
            </p>
          </motion.div>
        ))}
      </div>
    </div>
  );
};
