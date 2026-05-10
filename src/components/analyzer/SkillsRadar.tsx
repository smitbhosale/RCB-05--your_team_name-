"use client";

import { motion } from "framer-motion";
import type { SkillAssessment } from "@/types/resume";

const levelWidth: Record<string, number> = {
  beginner: 25,
  intermediate: 50,
  advanced: 75,
  expert: 95,
};

const levelColor: Record<string, string> = {
  beginner: "#f59e0b",
  intermediate: "#3b82f6",
  advanced: "#22c55e",
  expert: "#a855f7",
};

export const SkillsRadar = ({ skills }: { skills: SkillAssessment[] }) => {
  const sorted = [...skills].sort((a, b) => b.relevance - a.relevance);

  return (
    <div className="glass rounded-3xl p-8">
      <h3 className="text-sm font-bold tracking-widest text-white/40 uppercase mb-8">
        Detected Skills
      </h3>

      <div className="space-y-5">
        {sorted.map((skill, i) => (
          <motion.div
            key={skill.name}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.8 + i * 0.08 }}
          >
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-xs font-bold text-white/80">{skill.name}</span>
              <span
                className="text-[9px] font-black uppercase tracking-widest px-2 py-0.5 rounded"
                style={{
                  backgroundColor: `${levelColor[skill.level]}15`,
                  color: levelColor[skill.level],
                }}
              >
                {skill.level}
              </span>
            </div>
            <div className="relative h-2 bg-white/5 rounded-full overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${levelWidth[skill.level]}%` }}
                transition={{ duration: 0.8, delay: 1 + i * 0.08 }}
                className="h-full rounded-full"
                style={{
                  backgroundColor: levelColor[skill.level],
                  boxShadow: `0 0 8px ${levelColor[skill.level]}40`,
                }}
              />
            </div>
            <p className="text-[10px] text-white/25 mt-1">
              Relevance: {skill.relevance}%
            </p>
          </motion.div>
        ))}
      </div>
    </div>
  );
};
