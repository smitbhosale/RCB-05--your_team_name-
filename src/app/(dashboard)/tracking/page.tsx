"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
  BarChart3, TrendingUp, Calendar, Target, Zap, Code,
  BookOpen, Trophy, Star, ArrowUp
} from "lucide-react";

const weeklyData = [
  { week: "W1", tasks: 4, xp: 375, skills: 2 },
  { week: "W2", tasks: 7, xp: 625, skills: 3 },
  { week: "W3", tasks: 5, xp: 480, skills: 2 },
  { week: "W4", tasks: 9, xp: 820, skills: 4 },
  { week: "W5", tasks: 6, xp: 550, skills: 3 },
  { week: "W6", tasks: 11, xp: 1050, skills: 5 },
  { week: "W7", tasks: 8, xp: 760, skills: 3 },
  { week: "W8", tasks: 12, xp: 1200, skills: 6 },
];

const skillProgress = [
  { name: "React / Next.js", start: 40, current: 78, color: "#3b82f6" },
  { name: "TypeScript", start: 20, current: 62, color: "#a855f7" },
  { name: "System Design", start: 5, current: 45, color: "#f59e0b" },
  { name: "DSA / Algorithms", start: 30, current: 68, color: "#22c55e" },
  { name: "Cloud / DevOps", start: 10, current: 38, color: "#EE1C25" },
];

const achievements = [
  { title: "First Upload", desc: "Analyzed your first resume", icon: "📄", date: "Week 1", unlocked: true },
  { title: "5 Mock Interviews", desc: "Completed 5 mock sessions", icon: "🎤", date: "Week 3", unlocked: true },
  { title: "100 LeetCode", desc: "Solved 100 problems", icon: "⚡", date: "Week 5", unlocked: true },
  { title: "Open Source", desc: "Got 3 PRs merged", icon: "🌐", date: "Week 6", unlocked: true },
  { title: "ATS 90+", desc: "Resume score above 90", icon: "🎯", date: "—", unlocked: false },
  { title: "Offer Letter", desc: "Received an internship offer", icon: "🏆", date: "—", unlocked: false },
];

export default function TrackingPage() {
  const maxXP = Math.max(...weeklyData.map(w => w.xp));
  const totalXP = weeklyData.reduce((a, b) => a + b.xp, 0);
  const totalTasks = weeklyData.reduce((a, b) => a + b.tasks, 0);

  return (
    <div className="space-y-8">
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-3xl md:text-4xl font-black tracking-tighter flex items-center gap-3">
          <BarChart3 className="w-8 h-8 text-rcb-red" />
          Growth <span className="text-rcb-red">Tracker</span>
        </h1>
        <p className="text-sm text-white/40 mt-2">Your career progression visualized</p>
      </motion.div>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: "Total XP", value: totalXP.toLocaleString(), icon: Zap, color: "#f59e0b", delta: "+32%" },
          { label: "Tasks Done", value: totalTasks, icon: Target, color: "#22c55e", delta: "+18%" },
          { label: "Current Level", value: Math.floor(totalXP / 500) + 1, icon: Star, color: "#a855f7", delta: "Level up!" },
          { label: "Week Streak", value: "8", icon: Trophy, color: "#EE1C25", delta: "🔥 Best" },
        ].map((s, i) => (
          <motion.div key={s.label}
            initial={{ opacity: 0, y: 15, rotateX: 6 }} animate={{ opacity: 1, y: 0, rotateX: 0 }}
            transition={{ delay: i * 0.08 }}
            className="glass rounded-2xl p-5 relative overflow-hidden" style={{ perspective: "600px" }}
          >
            <div className="absolute -top-6 -right-6 w-16 h-16 rounded-full blur-[30px] opacity-20" style={{ backgroundColor: s.color }} />
            <s.icon className="w-5 h-5 mb-2" style={{ color: s.color }} />
            <p className="text-2xl font-black" style={{ color: s.color }}>{s.value}</p>
            <p className="text-[9px] text-white/30 uppercase tracking-widest">{s.label}</p>
            <p className="text-[9px] mt-1 flex items-center gap-0.5" style={{ color: s.color }}>
              <ArrowUp className="w-2.5 h-2.5" />{s.delta}
            </p>
          </motion.div>
        ))}
      </div>

      {/* XP Chart */}
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}
        className="glass rounded-3xl p-8"
      >
        <h3 className="text-sm font-bold tracking-widest text-white/40 uppercase mb-8">Weekly XP Earned</h3>
        <div className="flex items-end gap-3 h-48">
          {weeklyData.map((w, i) => (
            <div key={w.week} className="flex-1 flex flex-col items-center gap-2">
              <span className="text-[10px] font-bold text-white/40">{w.xp}</span>
              <motion.div
                initial={{ height: 0 }} animate={{ height: `${(w.xp / maxXP) * 100}%` }}
                transition={{ duration: 0.8, delay: 0.4 + i * 0.08 }}
                className="w-full rounded-xl bg-gradient-to-t from-rcb-red to-red-400 relative group cursor-pointer min-h-[4px]"
                style={{ boxShadow: "0 0 10px rgba(238,28,37,0.2)" }}
              >
                <div className="absolute -top-8 left-1/2 -translate-x-1/2 px-2 py-1 rounded bg-white/10 text-[9px] font-bold opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                  {w.tasks} tasks • {w.skills} skills
                </div>
              </motion.div>
              <span className="text-[10px] text-white/20 font-bold">{w.week}</span>
            </div>
          ))}
        </div>
      </motion.div>

      {/* Skill Progress */}
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }}
        className="glass rounded-3xl p-8"
      >
        <h3 className="text-sm font-bold tracking-widest text-white/40 uppercase mb-8">Skill Progression</h3>
        <div className="space-y-6">
          {skillProgress.map((skill, i) => (
            <div key={skill.name}>
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold text-white/70">{skill.name}</span>
                <span className="text-xs font-black" style={{ color: skill.color }}>
                  {skill.start}% → {skill.current}%
                </span>
              </div>
              <div className="relative h-3 bg-white/5 rounded-full overflow-hidden">
                {/* Start marker */}
                <div className="absolute h-full w-0.5 bg-white/20 z-10" style={{ left: `${skill.start}%` }} />
                <motion.div
                  initial={{ width: `${skill.start}%` }}
                  animate={{ width: `${skill.current}%` }}
                  transition={{ duration: 1.2, delay: 0.5 + i * 0.1 }}
                  className="h-full rounded-full"
                  style={{ backgroundColor: skill.color, boxShadow: `0 0 12px ${skill.color}40` }}
                />
              </div>
              <p className="text-[10px] text-white/20 mt-1">
                +{skill.current - skill.start}% improvement
              </p>
            </div>
          ))}
        </div>
      </motion.div>

      {/* Achievements */}
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }}
        className="glass rounded-3xl p-8"
      >
        <h3 className="text-sm font-bold tracking-widest text-white/40 uppercase mb-8">Achievements</h3>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {achievements.map((a, i) => (
            <motion.div key={a.title}
              initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.6 + i * 0.08 }}
              className={`p-5 rounded-2xl border transition-all ${
                a.unlocked
                  ? "bg-white/[0.03] border-white/10 hover:border-rcb-red/20"
                  : "bg-white/[0.01] border-white/5 opacity-40"
              }`}
            >
              <span className="text-3xl mb-3 block">{a.icon}</span>
              <h4 className="text-sm font-bold text-white mb-1">{a.title}</h4>
              <p className="text-[10px] text-white/30 mb-2">{a.desc}</p>
              <p className="text-[9px] font-bold uppercase tracking-widest" style={{ color: a.unlocked ? "#22c55e" : "#666" }}>
                {a.unlocked ? `✓ ${a.date}` : "🔒 Locked"}
              </p>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </div>
  );
}
