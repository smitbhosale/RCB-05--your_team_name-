"use client";

import { motion } from "framer-motion";
import { Sparkles, ArrowUpRight, BrainCircuit, TrendingUp, BarChart3 } from "lucide-react";
import { ResumeScoreCard } from "@/components/dashboard/ResumeScoreCard";
import { MatchesWidget } from "@/components/dashboard/MatchesWidget";
import { AgentActivityFeed } from "@/components/dashboard/AgentActivityFeed";
import { WeeklyGoals } from "@/components/dashboard/WeeklyGoals";
import { Tilt3D } from "@/components/ui/Tilt3D";
import { GlowButton } from "@/components/ui/GlowButton";
import { StudentInsights } from "@/components/dashboard/StudentInsights";
import Link from "next/link";


const stagger: any = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.08 } },
};
const fadeUp: any = {
  hidden: { opacity: 0, y: 20, filter: "blur(4px)" },
  visible: { opacity: 1, y: 0, filter: "blur(0px)", transition: { duration: 0.5, ease: [0.23, 1, 0.32, 1] } },
};

export default function DashboardPage() {
  return (
    <motion.div
      variants={stagger}
      initial="hidden"
      animate="visible"
      className="space-y-6 sm:space-y-8"
    >
      {/* AI Recommendation Banner */}
      <motion.div variants={fadeUp}>
        <Tilt3D intensity={4} glare>
          <div className="relative overflow-hidden p-6 sm:p-8 rounded-[24px] sm:rounded-[32px] bg-gradient-to-r from-rcb-red/15 via-rcb-red/5 to-transparent border border-rcb-red/15 group">
            <div className="absolute inset-0 grid-bg opacity-10" aria-hidden="true" />
            <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:opacity-20 transition-opacity" aria-hidden="true">
              <BrainCircuit className="w-32 sm:w-40 h-32 sm:h-40 text-rcb-red" />
            </div>

            <div className="relative z-10">
              <div className="flex items-center gap-2 text-rcb-red mb-3">
                <Sparkles className="w-4 h-4 sm:w-5 sm:h-5 fill-rcb-red" aria-hidden="true" />
                <span className="text-[9px] sm:text-xs font-black tracking-[0.2em] uppercase">Priority Intelligence</span>
              </div>
              <h2 className="text-xl sm:text-2xl md:text-3xl font-black mb-3 sm:mb-4 tracking-tighter leading-tight">
                ARYAN, YOU ARE IN THE <span className="text-rcb-red">TOP 2%</span>{" "}
                <br className="hidden md:block" />
                OF APPLICANTS FOR GOOGLE SDE INTERN.
              </h2>
              <p className="text-white/50 text-xs sm:text-sm max-w-xl mb-5 sm:mb-6 leading-relaxed">
                The CareerOS Agent analyzed the latest job description and your profile.
                One project in &ldquo;Distributed Systems&rdquo; will push your match to 98%.
              </p>
              <Link href="/agent">
                <GlowButton size="md">
                  GENERATE PROJECT SPECS <ArrowUpRight className="w-4 h-4" />
                </GlowButton>
              </Link>
            </div>
          </div>
        </Tilt3D>
      </motion.div>

      {/* Real-time AI Insights */}
      <motion.div variants={fadeUp}>
        <StudentInsights />
      </motion.div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 sm:gap-8">

        <motion.div variants={fadeUp} className="space-y-5 sm:space-y-8">
          <ResumeScoreCard />
          <WeeklyGoals />
        </motion.div>
        <motion.div variants={fadeUp} className="lg:col-span-1">
          <MatchesWidget />
        </motion.div>
        <motion.div variants={fadeUp} className="lg:col-span-1">
          <AgentActivityFeed />
        </motion.div>
      </div>

      {/* Chart Placeholders with 3D */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5 sm:gap-8">
        {[
          { title: "Skill Progression", desc: "Visualize growth data", icon: TrendingUp, href: "/tracking" },
          { title: "Industry Match Heatmap", desc: "Analyze global trends", icon: BarChart3, href: "/matches" },
        ].map((item) => (
          <motion.div key={item.title} variants={fadeUp}>
            <Link href={item.href}>
              <Tilt3D intensity={5}>
                <div className="glass-premium rounded-3xl p-6 sm:p-8 h-40 sm:h-48 flex items-center justify-center cursor-pointer hover:border-rcb-red/20 transition-all group">
                  <div className="text-center">
                    <item.icon className="w-8 h-8 text-white/10 mx-auto mb-3 group-hover:text-rcb-red/40 transition-colors" aria-hidden="true" />
                    <p className="text-xs font-bold text-white/30 uppercase tracking-widest mb-1 group-hover:text-white/50 transition-colors">{item.title}</p>
                    <p className="text-[10px] text-white/15 group-hover:text-white/30 transition-colors">{item.desc}</p>
                  </div>
                </div>
              </Tilt3D>
            </Link>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}
