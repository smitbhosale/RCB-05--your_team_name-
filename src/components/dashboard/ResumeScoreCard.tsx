"use client";

import { motion } from "framer-motion";
import { GlowButton } from "@/components/ui/GlowButton";
import Link from "next/link";

export const ResumeScoreCard = () => {
  const score = 84;

  return (
    <div className="glass-premium rounded-3xl p-6 sm:p-8 relative overflow-hidden group" role="region" aria-label="Resume health score">
      <div className="absolute -top-10 -right-10 w-40 h-40 bg-rcb-red/15 rounded-full blur-3xl group-hover:bg-rcb-red/25 transition-all duration-700" aria-hidden="true" />

      <h3 className="text-xs sm:text-sm font-bold tracking-widest text-white/40 uppercase mb-5 sm:mb-6">Resume Health</h3>

      <div className="flex flex-col items-center justify-center py-2 sm:py-4">
        <div className="relative w-32 h-32 sm:w-40 sm:h-40 flex items-center justify-center">
          <svg className="w-full h-full -rotate-90" aria-hidden="true">
            <circle
              cx="50%"
              cy="50%"
              r="45%"
              stroke="currentColor"
              strokeWidth="6"
              fill="transparent"
              className="text-white/5"
            />
            <motion.circle
              cx="50%"
              cy="50%"
              r="45%"
              stroke="currentColor"
              strokeWidth="6"
              fill="transparent"
              strokeDasharray="283"
              initial={{ strokeDashoffset: 283 }}
              animate={{ strokeDashoffset: 283 - (283 * score) / 100 }}
              transition={{ duration: 2, ease: [0.23, 1, 0.32, 1], delay: 0.3 }}
              className="text-rcb-red"
              strokeLinecap="round"
              style={{ filter: "drop-shadow(0 0 8px rgba(238,28,37,0.4))" }}
            />
          </svg>
          <div className="absolute flex flex-col items-center" aria-live="polite">
            <span className="text-3xl sm:text-4xl font-black text-white rcb-glow">{score}</span>
            <span className="text-[9px] sm:text-[10px] font-bold text-white/40 uppercase tracking-widest">ATS SCORE</span>
          </div>
        </div>
      </div>

      <div className="mt-4 sm:mt-6 p-3 sm:p-4 rounded-2xl bg-white/[0.03] border border-white/5">
        <p className="text-[10px] sm:text-xs text-white/60 leading-relaxed">
          <span className="text-green-400 font-bold">+12pts</span> since last week. Your impact statements are stronger.
        </p>
      </div>

      <Link href="/analyzer" className="block mt-4 sm:mt-6">
        <GlowButton className="w-full bg-white text-black hover:bg-rcb-red hover:text-white font-black text-xs">
          RE-ANALYZE RESUME
        </GlowButton>
      </Link>
    </div>
  );
};
