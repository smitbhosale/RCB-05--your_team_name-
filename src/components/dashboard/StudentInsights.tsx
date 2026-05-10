"use client";

import { motion } from "framer-motion";
import { 
  TrendingUp, 
  Target, 
  Activity, 
  Briefcase, 
  Zap,
  ChevronRight
} from "lucide-react";
import { Tilt3D } from "@/components/ui/Tilt3D";
import { useAuth } from "@/context/AuthContext";

const insights = [
  {
    title: "Hiring Probability",
    value: "92%",
    trend: "+5.4%",
    desc: "Based on recent ATS match rates",
    icon: Target,
    color: "text-green-500",
    bgGlow: "bg-green-500/10",
  },
  {
    title: "Interview Readiness",
    value: "85%",
    trend: "+12%",
    desc: "Behavioral & Technical avg score",
    icon: Activity,
    color: "text-blue-500",
    bgGlow: "bg-blue-500/10",
  },
  {
    title: "Skill Progression",
    value: "+15%",
    trend: "Fast",
    desc: "Weekly growth rate in core stack",
    icon: TrendingUp,
    color: "text-purple-500",
    bgGlow: "bg-purple-500/10",
  },
  {
    title: "Consistency Score",
    value: "9.4",
    trend: "Top 5%",
    desc: "Active days & completed tasks",
    icon: Zap,
    color: "text-amber-500",
    bgGlow: "bg-amber-500/10",
  },
  {
    title: "Internship Tier",
    value: "Tier 1",
    trend: "Ready",
    desc: "Qualified for FAANG & Unicorns",
    icon: Briefcase,
    color: "text-rcb-red",
    bgGlow: "bg-rcb-red/10",
  }
];

const containerVariants: any = {
  hidden: { opacity: 0 },
  visible: { 
    opacity: 1, 
    transition: { staggerChildren: 0.1 } 
  },
};

const itemVariants: any = {
  hidden: { opacity: 0, y: 20 },
  visible: { 
    opacity: 1, 
    y: 0, 
    transition: { type: "spring", stiffness: 100, damping: 15 } 
  },
};

export const StudentInsights = () => {
  const { user } = useAuth();
  
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-black uppercase tracking-widest text-white/60 flex items-center gap-2">
          <Zap className="w-4 h-4 text-rcb-red" /> Real-time Neural Insights
        </h3>
      </div>
      
      <motion.div 
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4"
      >
        {insights.map((insight, idx) => (
          <motion.div key={insight.title} variants={itemVariants}>
            <Tilt3D intensity={5} glare>
              <div className="glass-premium rounded-3xl p-5 relative overflow-hidden group h-full flex flex-col justify-between cursor-default border border-white/5 hover:border-white/10 transition-colors">
                {/* Background Glow */}
                <div className={`absolute -top-10 -right-10 w-24 h-24 rounded-full blur-[40px] opacity-20 ${insight.bgGlow}`} />
                
                <div className="relative z-10 flex items-start justify-between mb-4">
                  <div className={`w-8 h-8 rounded-xl flex items-center justify-center ${insight.bgGlow}`}>
                    <insight.icon className={`w-4 h-4 ${insight.color}`} />
                  </div>
                  <span className={`text-[10px] font-bold px-2 py-1 rounded-md ${insight.bgGlow} ${insight.color}`}>
                    {insight.trend}
                  </span>
                </div>

                <div className="relative z-10 mt-auto">
                  <h4 className="text-2xl font-black tracking-tighter mb-1">{insight.value}</h4>
                  <p className="text-xs font-bold text-white/60 mb-1">{insight.title}</p>
                  <p className="text-[9px] text-white/30 uppercase tracking-widest">{insight.desc}</p>
                </div>
                
                {/* Scanline effect on hover */}
                <div className="absolute inset-0 z-20 pointer-events-none opacity-0 group-hover:opacity-30 group-hover:animate-scan transition-opacity bg-gradient-to-b from-transparent via-white/5 to-transparent" />
              </div>
            </Tilt3D>
          </motion.div>
        ))}
      </motion.div>
    </div>
  );
};
