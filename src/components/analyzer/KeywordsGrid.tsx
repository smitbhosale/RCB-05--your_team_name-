"use client";

import { motion } from "framer-motion";
import { CheckCircle2, XCircle, Search } from "lucide-react";
import type { KeywordMatch } from "@/types/resume";

export const KeywordsGrid = ({ keywords }: { keywords: KeywordMatch[] }) => {
  const importanceOrder = { critical: 0, important: 1, "nice-to-have": 2 };
  const sorted = [...keywords].sort((a, b) => importanceOrder[a.importance] - importanceOrder[b.importance]);

  const found = keywords.filter((k) => k.found).length;
  const total = keywords.length;

  return (
    <div className="glass rounded-3xl p-8">
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-2">
          <Search className="w-4 h-4 text-rcb-red" />
          <h3 className="text-sm font-bold tracking-widest text-white/40 uppercase">
            ATS Keywords
          </h3>
        </div>
        <span className="text-xs font-black text-white/50">
          {found}/{total} found
        </span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {sorted.map((kw, i) => (
          <motion.div
            key={kw.keyword}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 1.2 + i * 0.05 }}
            className={`flex items-center gap-3 p-3 rounded-xl border transition-all ${
              kw.found
                ? "bg-green-500/5 border-green-500/10"
                : "bg-red-500/5 border-red-500/10"
            }`}
          >
            {kw.found ? (
              <CheckCircle2 className="w-4 h-4 text-green-500 shrink-0" />
            ) : (
              <XCircle className="w-4 h-4 text-red-400 shrink-0" />
            )}
            <span className="text-xs font-medium text-white/70 flex-1">{kw.keyword}</span>
            <span
              className={`text-[8px] font-black uppercase tracking-widest px-1.5 py-0.5 rounded ${
                kw.importance === "critical"
                  ? "bg-red-500/10 text-red-400"
                  : kw.importance === "important"
                  ? "bg-amber-500/10 text-amber-400"
                  : "bg-blue-500/10 text-blue-400"
              }`}
            >
              {kw.importance}
            </span>
          </motion.div>
        ))}
      </div>
    </div>
  );
};
