"use client";

import { motion } from "framer-motion";
import { Lightbulb, ArrowRight } from "lucide-react";
import type { Suggestion } from "@/types/resume";

const priorityColor = {
  high: { bg: "bg-red-500/10", text: "text-red-400", border: "border-red-500/20" },
  medium: { bg: "bg-amber-500/10", text: "text-amber-400", border: "border-amber-500/20" },
  low: { bg: "bg-blue-500/10", text: "text-blue-400", border: "border-blue-500/20" },
};

const categoryIcons: Record<string, string> = {
  content: "📝",
  format: "📐",
  impact: "🎯",
  keywords: "🔑",
  structure: "🏗️",
};

export const SuggestionsPanel = ({ suggestions }: { suggestions: Suggestion[] }) => {
  return (
    <div className="glass rounded-3xl p-8">
      <div className="flex items-center gap-2 mb-8">
        <Lightbulb className="w-4 h-4 text-rcb-red" />
        <h3 className="text-sm font-bold tracking-widest text-white/40 uppercase">
          AI Suggestions
        </h3>
      </div>

      <div className="space-y-4">
        {suggestions.map((s, i) => {
          const colors = priorityColor[s.priority];
          return (
            <motion.div
              key={i}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 1 + i * 0.1 }}
              className={`p-5 rounded-2xl bg-white/[0.02] border border-white/5 hover:${colors.border} transition-all group cursor-pointer`}
            >
              <div className="flex items-start gap-4">
                <span className="text-2xl mt-0.5">{categoryIcons[s.category] || "💡"}</span>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-3 mb-2 flex-wrap">
                    <h4 className="text-sm font-bold text-white group-hover:text-rcb-red transition-colors">
                      {s.title}
                    </h4>
                    <span className={`text-[9px] font-black px-2 py-0.5 rounded uppercase tracking-widest ${colors.bg} ${colors.text}`}>
                      {s.priority}
                    </span>
                  </div>
                  <p className="text-xs text-white/40 leading-relaxed">
                    {s.description}
                  </p>
                </div>
                <ArrowRight className="w-4 h-4 text-white/10 group-hover:text-rcb-red transition-colors shrink-0 mt-1" />
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
};
