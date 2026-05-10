"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Map, 
  Sparkles, 
  Target, 
  Calendar, 
  Zap, 
  ChevronRight, 
  CheckCircle2, 
  Circle, 
  Trophy, 
  BookOpen, 
  Code, 
  Video, 
  Star,
  Rocket,
  ArrowRight,
  Brain,
  History,
  Timer,
  Loader2,
  Lock
} from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { MemoryService } from "@/lib/memory";

interface RoadmapData {
  monthlyRoadmap: {
    month: number;
    title: string;
    focus: string;
    weeks: {
      week: number;
      title: string;
      tasks: string[];
    }[];
  }[];
  projects: {
    title: string;
    description: string;
    tech: string[];
  }[];
  certifications: string[];
  interviewPrep: {
    behavioral: string[];
    technical: string[];
  };
  dsaRoadmap: {
    week: number;
    topic: string;
    problems: string[];
  }[];
  milestones: string[];
}

export default function RoadmapPage() {
  const { user } = useAuth();
  const [step, setStep] = useState<"input" | "loading" | "display">("input");
  const [formData, setFormData] = useState({
    role: "",
    skills: "",
    timeline: "3 months"
  });
  const [roadmap, setRoadmap] = useState<RoadmapData | null>(null);
  const [activeMonth, setActiveMonth] = useState(0);

  // Load from memory on mount
  useEffect(() => {
    async function loadFromMemory() {
      if (user) {
        const mem = await MemoryService.getMemory(user.uid);
        if (mem?.lastRoadmap) {
          setRoadmap(mem.lastRoadmap);
          setStep("display");
          setFormData(prev => ({
            ...prev,
            role: mem.careerGoals?.[mem.careerGoals.length - 1] || ""
          }));
        }
      }
    }
    loadFromMemory();
  }, [user]);



  const generateRoadmap = async () => {
    setStep("loading");
    try {
      const res = await fetch("/api/generate-roadmap", {
        method: "POST",
        body: JSON.stringify({
          ...formData,
          userId: user?.uid
        })
      });
      const data = await res.json();
      if (data.roadmap) {
        setRoadmap(data.roadmap);
        setStep("display");
        
        // Save to memory
        if (user) {
          await MemoryService.updateMemory(user.uid, {
            careerGoals: [formData.role],
            lastRoadmap: data.roadmap,
            updatedAt: new Date()
          });
        }
      }

    } catch (err) {
      console.error(err);
      setStep("input");
    }
  };

  if (step === "input") {
    return (
      <div className="max-w-4xl mx-auto space-y-8 pb-20">
        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
          <h1 className="text-3xl md:text-4xl font-black tracking-tighter flex items-center gap-3">
            <Map className="w-8 h-8 text-rcb-red" />
            AI Career <span className="text-rcb-red">Roadmap</span>
          </h1>
          <p className="text-sm text-white/40 mt-2">Generate a battle-tested roadmap to your dream role</p>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }} 
          animate={{ opacity: 1, scale: 1 }}
          className="glass rounded-[2.5rem] p-10 border border-white/10 relative overflow-hidden"
        >
          <div className="absolute -top-20 right-0 w-80 h-80 bg-rcb-red/10 rounded-full blur-[100px]" />
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10 relative z-10">
            <div className="space-y-8">
              <div className="space-y-3">
                <label className="text-xs font-black uppercase tracking-widest text-rcb-red flex items-center gap-2">
                  <Target className="w-4 h-4" /> Target Role
                </label>
                <input 
                  value={formData.role}
                  onChange={e => setFormData({ ...formData, role: e.target.value })}
                  placeholder="e.g. Senior Frontend Engineer at Google"
                  className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 text-white placeholder:text-white/20 focus:outline-none focus:border-rcb-red/50 transition-all"
                />
              </div>

              <div className="space-y-3">
                <label className="text-xs font-black uppercase tracking-widest text-rcb-red flex items-center gap-2">
                  <Brain className="w-4 h-4" /> Current Skills
                </label>
                <textarea 
                  value={formData.skills}
                  onChange={e => setFormData({ ...formData, skills: e.target.value })}
                  placeholder="e.g. React, TypeScript, Node.js, Basic DSA"
                  rows={4}
                  className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 text-white placeholder:text-white/20 focus:outline-none focus:border-rcb-red/50 transition-all resize-none"
                />
              </div>
            </div>

            <div className="space-y-8">
              <div className="space-y-3">
                <label className="text-xs font-black uppercase tracking-widest text-rcb-red flex items-center gap-2">
                  <Calendar className="w-4 h-4" /> Target Timeline
                </label>
                <div className="grid grid-cols-2 gap-3">
                  {["1 month", "3 months", "6 months", "12 months"].map(t => (
                    <button
                      key={t}
                      onClick={() => setFormData({ ...formData, timeline: t })}
                      className={`p-4 rounded-2xl border transition-all text-sm font-bold ${
                        formData.timeline === t 
                        ? "bg-rcb-red border-rcb-red text-white" 
                        : "bg-white/5 border-white/5 text-white/40 hover:border-white/10"
                      }`}
                    >
                      {t}
                    </button>
                  ))}
                </div>
              </div>

              <div className="pt-4">
                <button
                  onClick={generateRoadmap}
                  disabled={!formData.role || !formData.skills}
                  className="w-full py-5 rounded-2xl bg-rcb-red text-white font-black text-lg shadow-[0_0_30px_rgba(238,28,37,0.4)] hover:shadow-[0_0_50px_rgba(238,28,37,0.6)] transition-all flex items-center justify-center gap-3 active:scale-[0.98] disabled:opacity-30"
                >
                  <Zap className="w-6 h-6 fill-white" />
                  INITIALIZE ROADMAP
                </button>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Feature Highlights */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            { title: "Weekly Sprints", desc: "Granular tasks to keep you on track.", icon: Timer },
            { title: "DSA Roadmap", desc: "Cracking technical interviews simplified.", icon: Brain },
            { title: "Project Engine", desc: "Build industry-grade portfolio pieces.", icon: Code },
          ].map((f, i) => (
            <motion.div
              key={f.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 * i }}
              className="glass p-6 rounded-3xl border border-white/5 space-y-3"
            >
              <div className="w-10 h-10 rounded-xl bg-rcb-red/10 flex items-center justify-center">
                <f.icon className="w-5 h-5 text-rcb-red" />
              </div>
              <h3 className="font-bold">{f.title}</h3>
              <p className="text-xs text-white/40 leading-relaxed">{f.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    );
  }

  if (step === "loading") {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-6">
        <div className="relative">
          <div className="w-24 h-24 rounded-full border-2 border-rcb-red/20 border-t-rcb-red animate-spin" />
          <div className="absolute inset-0 flex items-center justify-center">
            <Sparkles className="w-8 h-8 text-rcb-red animate-pulse" />
          </div>
        </div>
        <div className="text-center space-y-2">
          <h2 className="text-2xl font-black tracking-tight">Architecting Your Career...</h2>
          <p className="text-sm text-white/40 uppercase tracking-[0.2em] font-bold">Neural Engine v4.2 Computing</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8 pb-20">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-3xl font-black tracking-tighter flex items-center gap-3">
            <Trophy className="w-8 h-8 text-rcb-red" />
            Mission: <span className="text-rcb-red">{formData.role}</span>
          </h1>
          <div className="flex items-center gap-4 mt-2">
            <span className="text-[10px] font-black uppercase tracking-widest text-white/40 bg-white/5 px-3 py-1 rounded-full border border-white/5">
              Timeline: {formData.timeline}
            </span>
            <span className="text-[10px] font-black uppercase tracking-widest text-green-400 bg-green-500/10 px-3 py-1 rounded-full border border-green-500/20 flex items-center gap-2">
              <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
              Active Path
            </span>
          </div>
        </div>
        <button 
          onClick={() => setStep("input")}
          className="px-6 py-3 rounded-2xl glass border border-white/10 text-xs font-bold hover:bg-white/5 transition-all self-start"
        >
          Re-initialize Roadmap
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: Main Roadmap */}
        <div className="lg:col-span-8 space-y-8">
          {/* Month Selector */}
          <div className="flex gap-4 overflow-x-auto pb-2 scrollbar-hide">
            {roadmap?.monthlyRoadmap.map((month, idx) => (
              <button
                key={idx}
                onClick={() => setActiveMonth(idx)}
                className={`px-8 py-4 rounded-2xl border transition-all shrink-0 font-bold text-sm ${
                  activeMonth === idx 
                  ? "bg-rcb-red border-rcb-red text-white shadow-lg" 
                  : "bg-white/5 border-white/5 text-white/40 hover:border-white/10"
                }`}
              >
                Month {month.month}
              </button>
            ))}
          </div>

          {/* Monthly Details */}
          <AnimatePresence mode="wait">
            <motion.div
              key={activeMonth}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-6"
            >
              <div className="glass rounded-[2rem] p-8 border border-white/10 relative overflow-hidden">
                <div className="absolute top-0 right-0 p-8">
                  <div className="w-12 h-12 rounded-2xl bg-rcb-red/10 flex items-center justify-center">
                    <Star className="w-6 h-6 text-rcb-red" />
                  </div>
                </div>
                <h2 className="text-2xl font-black mb-2">{roadmap?.monthlyRoadmap[activeMonth].title}</h2>
                <p className="text-rcb-red font-bold text-xs uppercase tracking-widest mb-6">FOCUS: {roadmap?.monthlyRoadmap[activeMonth].focus}</p>

                <div className="space-y-8">
                  {roadmap?.monthlyRoadmap[activeMonth].weeks.map((week, idx) => (
                    <div key={idx} className="relative pl-10">
                      <div className="absolute left-0 top-0 bottom-0 w-px bg-white/10">
                        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-4 h-4 rounded-full bg-rcb-red border-4 border-black shadow-[0_0_10px_rgba(238,28,37,0.5)]" />
                      </div>
                      <div className="space-y-4">
                        <h4 className="font-bold text-white flex items-center gap-3">
                          Week {week.week}: {week.title}
                        </h4>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                          {week.tasks.map((task, tidx) => (
                            <div key={tidx} className="flex items-center gap-3 p-4 rounded-2xl bg-white/[0.03] border border-white/5 group hover:border-white/10 transition-all">
                              <Circle className="w-4 h-4 text-white/20 shrink-0" />
                              <span className="text-xs text-white/60 leading-relaxed">{task}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          </AnimatePresence>

          {/* DSA Roadmap Section */}
          <div className="glass rounded-[2rem] p-8 border border-white/10">
            <div className="flex items-center gap-3 mb-8">
              <div className="w-12 h-12 rounded-2xl bg-blue-500/10 flex items-center justify-center">
                <Brain className="w-6 h-6 text-blue-400" />
              </div>
              <div>
                <h2 className="text-xl font-black">DSA Mastery</h2>
                <p className="text-[10px] text-white/30 uppercase tracking-widest">Week-by-week curriculum</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {roadmap?.dsaRoadmap.map((d, i) => (
                <div key={i} className="p-6 rounded-3xl bg-white/[0.02] border border-white/5 hover:bg-white/[0.04] transition-all group">
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-[10px] font-black text-blue-400 uppercase tracking-widest">Week {d.week}</span>
                    <Lock className="w-4 h-4 text-white/10 group-hover:text-white/20" />
                  </div>
                  <h4 className="font-bold mb-3">{d.topic}</h4>
                  <div className="flex flex-wrap gap-2">
                    {d.problems.map((p, pi) => (
                      <span key={pi} className="px-2 py-1 rounded-lg bg-blue-500/10 text-[9px] text-blue-400 font-bold border border-blue-500/10">
                        {p}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column: Projects & Perks */}
        <div className="lg:col-span-4 space-y-8">
          {/* Project Suggestions */}
          <div className="glass rounded-[2rem] p-8 border border-white/10">
            <h3 className="text-sm font-black uppercase tracking-widest text-rcb-red mb-6 flex items-center gap-2">
              <Code className="w-4 h-4" /> Project Engine
            </h3>
            <div className="space-y-4">
              {roadmap?.projects.map((p, i) => (
                <div key={i} className="p-5 rounded-2xl bg-white/5 border border-white/5 hover:border-rcb-red/30 transition-all group">
                  <h4 className="font-bold text-sm mb-2 group-hover:text-rcb-red transition-colors">{p.title}</h4>
                  <p className="text-xs text-white/40 leading-relaxed mb-4">{p.description}</p>
                  <div className="flex flex-wrap gap-2">
                    {p.tech.map((t, ti) => (
                      <span key={ti} className="text-[9px] text-white/60 font-mono">#{t}</span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Interview Prep */}
          <div className="glass rounded-[2rem] p-8 border border-white/10">
            <h3 className="text-sm font-black uppercase tracking-widest text-blue-400 mb-6 flex items-center gap-2">
              <Video className="w-4 h-4" /> Interview Prep
            </h3>
            <div className="space-y-6">
              <div>
                <p className="text-[10px] font-black text-white/20 uppercase tracking-widest mb-3">Behavioral</p>
                <div className="space-y-2">
                  {roadmap?.interviewPrep.behavioral.map((b, i) => (
                    <div key={i} className="flex items-start gap-2 text-xs text-white/50">
                      <div className="w-1 h-1 rounded-full bg-blue-400 mt-2 shrink-0" />
                      {b}
                    </div>
                  ))}
                </div>
              </div>
              <div>
                <p className="text-[10px] font-black text-white/20 uppercase tracking-widest mb-3">Technical</p>
                <div className="space-y-2">
                  {roadmap?.interviewPrep.technical.map((t, i) => (
                    <div key={i} className="flex items-start gap-2 text-xs text-white/50">
                      <div className="w-1 h-1 rounded-full bg-rcb-red mt-2 shrink-0" />
                      {t}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Certifications */}
          <div className="glass rounded-[2rem] p-8 border border-white/10">
            <h3 className="text-sm font-black uppercase tracking-widest text-green-400 mb-6 flex items-center gap-2">
              <Trophy className="w-4 h-4" /> Certifications
            </h3>
            <div className="space-y-3">
              {roadmap?.certifications.map((c, i) => (
                <div key={i} className="p-4 rounded-2xl bg-green-500/5 border border-green-500/10 flex items-center gap-3">
                  <CheckCircle2 className="w-4 h-4 text-green-500" />
                  <span className="text-xs font-bold text-white/60">{c}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Milestones Footer */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass-dark p-10 rounded-[3rem] border border-white/10 text-center relative overflow-hidden"
      >
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-1 bg-gradient-to-r from-transparent via-rcb-red to-transparent" />
        <h3 className="text-2xl font-black mb-10 tracking-tight">Success Milestones</h3>
        <div className="flex flex-wrap justify-center gap-10">
          {roadmap?.milestones.map((m, i) => (
            <div key={i} className="flex flex-col items-center gap-4">
              <div className="w-16 h-16 rounded-2xl bg-white/5 flex items-center justify-center border border-white/10 group hover:border-rcb-red/50 transition-all">
                <Rocket className="w-8 h-8 text-white/20 group-hover:text-rcb-red transition-all" />
              </div>
              <p className="text-[10px] font-black uppercase tracking-[0.2em] text-white/40 max-w-[120px]">{m}</p>
            </div>
          ))}
        </div>
      </motion.div>
    </div>
  );
}
