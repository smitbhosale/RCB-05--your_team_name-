"use client";

import { motion } from "framer-motion";
import { Terminal, Bot, Sparkles, CheckCircle2 } from "lucide-react";
import { cn } from "@/lib/utils";

const activities = [
  { type: 'AI', text: 'Detected 12 new relevant internships.', time: '2m ago' },
  { type: 'OS', text: 'Weekly roadmap generated successfully.', time: '1h ago' },
  { type: 'AI', text: 'Analyzing competitor resume trends...', time: '3h ago' },
  { type: 'SUCCESS', text: 'Skill "React 19" marked as Proficient.', time: '5h ago' },
];

export const AgentActivityFeed = () => {
  return (
    <div className="glass rounded-3xl p-6 sm:p-8 h-full flex flex-col" role="log" aria-label="Agent activity feed">
      <div className="flex items-center gap-2 mb-6 sm:mb-8">
        <Bot className="w-5 h-5 text-rcb-red" aria-hidden="true" />
        <h3 className="text-xs sm:text-sm font-bold tracking-widest text-white/40 uppercase">Agent Activity</h3>
      </div>

      <div className="flex-1 space-y-5 sm:space-y-6 overflow-y-auto pr-2">
        {activities.map((act, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="flex gap-3 sm:gap-4 relative"
          >
            {i !== activities.length - 1 && (
              <div className="absolute left-2.5 top-8 bottom-0 w-px bg-white/5" aria-hidden="true" />
            )}

            <div className="relative z-10">
              <div className={cn(
                "w-5 h-5 rounded-full flex items-center justify-center",
                act.type === 'AI' ? "bg-blue-500/20 text-blue-500" :
                act.type === 'SUCCESS' ? "bg-green-500/20 text-green-500" :
                "bg-rcb-red/20 text-rcb-red"
              )}>
                {act.type === 'SUCCESS' ? <CheckCircle2 className="w-3 h-3" /> : <Sparkles className="w-3 h-3" />}
              </div>
            </div>

            <div className="flex-1">
              <p className="text-xs text-white/80 leading-relaxed">{act.text}</p>
              <p className="text-[10px] text-white/30 mt-1">{act.time}</p>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="mt-6 sm:mt-8 p-3 sm:p-4 rounded-2xl bg-black/40 border border-white/5 flex items-center gap-3">
        <Terminal className="w-4 h-4 text-rcb-red animate-pulse" aria-hidden="true" />
        <span className="text-[9px] sm:text-[10px] font-mono text-white/40 uppercase tracking-tighter">
          Kernel v4.2.0-stable-rcb
        </span>
      </div>
    </div>
  );
};
