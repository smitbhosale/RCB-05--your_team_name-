"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Bot, Send, Sparkles, CheckCircle2, Circle, Clock, Target,
  BookOpen, Code, Video, FileText, Zap, ChevronRight, Brain,
  Loader2, ArrowRight, Calendar, Trophy, Rocket, GraduationCap,
  Briefcase, Star, Timer, RotateCcw, Play, History
} from "lucide-react";
import { MemoryService, UserMemory } from "@/lib/memory";
import { useAuth } from "@/context/AuthContext";



type WorkflowStatus = "idle" | "thinking" | "generating" | "complete";

interface RoadmapPhase {
  id: number;
  title: string;
  duration: string;
  status: "done" | "active" | "upcoming";
  tasks: Task[];
}

interface Task {
  id: string;
  text: string;
  type: "project" | "course" | "interview" | "task" | "milestone";
  done: boolean;
  priority: "high" | "medium" | "low";
  xp: number;
}

interface AgentMemory {
  goal: string;
  createdAt: string;
  totalXP: number;
  level: number;
  streak: number;
}

const typeIcons: Record<string, any> = {
  project: Code, course: BookOpen, interview: Video, task: FileText, milestone: Trophy,
};
const typeColors: Record<string, string> = {
  project: "#3b82f6", course: "#a855f7", interview: "#f59e0b", task: "#22c55e", milestone: "#EE1C25",
};
const priorityBadge: Record<string, string> = {
  high: "bg-red-500/10 text-red-400", medium: "bg-amber-500/10 text-amber-400", low: "bg-blue-500/10 text-blue-400",
};

function generateRoadmap(goal: string, memory?: UserMemory | null): RoadmapPhase[] {
  const g = goal.toLowerCase();
  const isGoogle = g.includes("google");
  const isFrontend = g.includes("frontend") || g.includes("react") || memory?.preferredDomain === "Frontend";
  const isBackend = g.includes("backend") || g.includes("server") || memory?.preferredDomain === "Backend";
  const company = isGoogle ? "Google" : g.includes("microsoft") ? "Microsoft" : g.includes("amazon") ? "Amazon" : "Top Tech";

  // Use memory to add personalized tasks
  const skillGapTasks: Task[] = memory?.skillGaps?.slice(0, 2).map((gap: any, i: number) => ({
    id: `gap-${i}`,
    text: `Intensive training on ${gap.skill}: ${gap.recommendation}`,
    type: "course" as const,
    done: false,
    priority: "high" as const,
    xp: 150
  })) || [];


  return [
    {
      id: 1, title: "Foundation Sprint", duration: "Week 1-2", status: "active",
      tasks: [
        { id: "1a", text: `Research ${company}'s engineering culture and recent projects`, type: "task", done: false, priority: "high", xp: 50 },
        { id: "1b", text: "Complete 'Neetcode 150' — Arrays & Hashing section (15 problems)", type: "course", done: false, priority: "high", xp: 100 },
        { id: "1c", text: "Build portfolio site with Next.js 15, deploy to Vercel", type: "project", done: false, priority: "medium", xp: 150 },
        { id: "1d", text: "Update resume with quantifiable impact metrics (use CareerOS Analyzer)", type: "task", done: false, priority: "high", xp: 75 },
        ...skillGapTasks
      ]
    },

    {
      id: 2, title: "Skill Acceleration", duration: "Week 3-5", status: "upcoming",
      tasks: [
        { id: "2a", text: `Build a full-stack ${isFrontend ? "React dashboard" : isBackend ? "microservice API" : "SaaS application"} with auth, database, and deployment`, type: "project", done: false, priority: "high", xp: 300 },
        { id: "2b", text: "Complete System Design fundamentals — URL shortener, rate limiter, chat system", type: "course", done: false, priority: "high", xp: 200 },
        { id: "2c", text: "Solve 50 LeetCode mediums focusing on trees, graphs, and dynamic programming", type: "task", done: false, priority: "high", xp: 250 },
        { id: "2d", text: "Contribute to 2 open-source projects on GitHub (minimum 3 merged PRs)", type: "project", done: false, priority: "medium", xp: 200 },
      ]
    },
    {
      id: 3, title: "Interview Warfare", duration: "Week 6-7", status: "upcoming",
      tasks: [
        { id: "3a", text: `Complete 5 mock interviews on CareerOS (${company} behavioral format)`, type: "interview", done: false, priority: "high", xp: 250 },
        { id: "3b", text: `Practice ${company}-specific system design questions (design YouTube, Google Docs)`, type: "interview", done: false, priority: "high", xp: 200 },
        { id: "3c", text: "Record and review 3 video answers for 'Tell me about yourself'", type: "task", done: false, priority: "medium", xp: 100 },
        { id: "3d", text: "Study the STAR method — prepare 5 stories from your experience", type: "course", done: false, priority: "medium", xp: 100 },
      ]
    },
    {
      id: 4, title: "Launch & Apply", duration: "Week 8", status: "upcoming",
      tasks: [
        { id: "4a", text: `Submit application to ${company} with optimized resume (ATS score > 85)`, type: "milestone", done: false, priority: "high", xp: 500 },
        { id: "4b", text: "Apply to 5 backup companies identified by Match Engine", type: "task", done: false, priority: "medium", xp: 150 },
        { id: "4c", text: "Send personalized LinkedIn messages to 3 engineers at target companies", type: "task", done: false, priority: "medium", xp: 100 },
        { id: "4d", text: `Complete final mock interview — ${company} full-loop simulation`, type: "interview", done: false, priority: "high", xp: 300 },
      ]
    },
  ];
}

const workflowSteps = [
  { label: "Analyzing Goal", icon: Brain },
  { label: "Building Roadmap", icon: Target },
  { label: "Generating Tasks", icon: FileText },
  { label: "Scheduling Workflow", icon: Calendar },
  { label: "Activating Agent", icon: Rocket },
];

export default function AgentPage() {
  const { user } = useAuth();
  const [goal, setGoal] = useState("");

  const [status, setStatus] = useState<WorkflowStatus>("idle");
  const [activeStep, setActiveStep] = useState(0);
  const [roadmap, setRoadmap] = useState<RoadmapPhase[]>([]);
  const [memory, setMemory] = useState<UserMemory | null>(null);
  const [loadingMemory, setLoadingMemory] = useState(true);
  const [expandedPhase, setExpandedPhase] = useState<number | null>(1);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    async function loadMemory() {
      if (!user) return;
      try {
        const mem = await MemoryService.getMemory(user.uid);
        if (mem) {
          setMemory(mem);
          if (mem.careerGoals?.length > 0) {
            setGoal(mem.careerGoals[mem.careerGoals.length - 1]);
          }
          // Show sync success
          console.log("Memory synced from neural cloud");
        }
      } catch (err) {
        console.error("Failed to load memory:", err);
      } finally {
        setLoadingMemory(false);
      }
    }
    loadMemory();
  }, [user]);




  const totalXP = roadmap.flatMap(p => p.tasks).filter(t => t.done).reduce((a, b) => a + b.xp, 0);
  const totalTasks = roadmap.flatMap(p => p.tasks).length;
  const doneTasks = roadmap.flatMap(p => p.tasks).filter(t => t.done).length;
  const progress = totalTasks ? Math.round((doneTasks / totalTasks) * 100) : 0;

  const launchAgent = async () => {
    if (!goal.trim()) return;
    setStatus("thinking");
    setActiveStep(0);

    for (let i = 0; i < workflowSteps.length; i++) {
      setActiveStep(i);
      await new Promise(r => setTimeout(r, 700));
    }

    setStatus("generating");
    await new Promise(r => setTimeout(r, 500));

    const rm = generateRoadmap(goal, memory);
    setRoadmap(rm);

    
    // Save to Persistent Memory
    const updatedMemory = {
      careerGoals: memory ? [...(memory.careerGoals || []), goal] : [goal],
      preferredDomain: goal.includes("frontend") ? "Frontend" : goal.includes("backend") ? "Backend" : "Fullstack",
    };
    
    await MemoryService.updateMemory(user?.uid || "guest", updatedMemory);
    setMemory(prev => ({ ...prev, ...updatedMemory } as UserMemory));

    setStatus("complete");

  };

  const toggleTask = (phaseId: number, taskId: string) => {
    setRoadmap(prev => prev.map(p =>
      p.id === phaseId ? {
        ...p,
        tasks: p.tasks.map(t => t.id === taskId ? { ...t, done: !t.done } : t)
      } : p
    ));
  };

  const reset = () => {
    setStatus("idle"); setGoal(""); setRoadmap([]); setMemory(null); setActiveStep(0);
  };

  // ─── IDLE: Goal Input ───
  if (status === "idle") {
    return (
      <div className="max-w-3xl mx-auto space-y-8">
        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
          <h1 className="text-3xl md:text-4xl font-black tracking-tighter flex items-center gap-3">
            <Bot className="w-8 h-8 text-rcb-red" />
            Career <span className="text-rcb-red">Agent</span>
          </h1>
          <p className="text-sm text-white/40 mt-2">Your autonomous AI co-pilot for career domination</p>
        </motion.div>

        <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
          className="glass rounded-3xl p-10 relative overflow-hidden text-center"
        >
          <div className="absolute -top-20 left-1/2 -translate-x-1/2 w-60 h-60 bg-rcb-red/10 rounded-full blur-[100px]" />
          <div className="relative z-10">
            <div className="w-20 h-20 rounded-full bg-gradient-to-br from-rcb-red to-red-900 mx-auto mb-6 flex items-center justify-center shadow-[0_0_50px_rgba(238,28,37,0.3)]"
              style={{ perspective: "400px" }}
            >
              <Bot className="w-10 h-10 text-white" style={{ transform: "translateZ(15px)" }} />
            </div>
            <h2 className="text-2xl font-black mb-2">What's your career goal?</h2>
            <p className="text-sm text-white/40 max-w-md mx-auto mb-8">
              Tell me where you want to be, and I'll build an autonomous workflow to get you there.
            </p>

            <div className="flex gap-3 items-center glass rounded-2xl p-2 border-white/10 max-w-lg mx-auto">
              <input ref={inputRef} value={goal} onChange={e => setGoal(e.target.value)}
                onKeyDown={e => e.key === "Enter" && launchAgent()}
                placeholder="I want a Google internship..."
                className="flex-1 bg-transparent border-none outline-none text-white px-4 py-3 text-sm"
              />
              <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
                onClick={launchAgent} disabled={!goal.trim()}
                className="px-6 py-3 rounded-xl bg-rcb-red text-white font-bold text-sm shadow-[0_0_20px_rgba(238,28,37,0.3)] disabled:opacity-30 flex items-center gap-2"
              >
                <Zap className="w-4 h-4" /> Launch
              </motion.button>
            </div>
          </div>
        </motion.div>

        {/* Quick Goals */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {[
            { text: "I want a Google internship", icon: Briefcase },
            { text: "I want to become a full-stack developer", icon: Code },
            { text: "I want to crack FAANG interviews", icon: GraduationCap },
          ].map((q, i) => (
            <motion.button key={q.text}
              initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 + i * 0.1 }}
              onClick={() => { setGoal(q.text); inputRef.current?.focus(); }}
              className="glass rounded-2xl p-4 text-left hover:border-rcb-red/20 transition-all group flex items-center gap-3"
            >
              <q.icon className="w-5 h-5 text-white/20 group-hover:text-rcb-red transition-colors shrink-0" />
              <span className="text-xs text-white/40 group-hover:text-white transition-colors">{q.text}</span>
            </motion.button>
          ))}
        </div>
      </div>
    );
  }

  // ─── LOADING MEMORY ───
  if (loadingMemory) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-4">
        <Loader2 className="w-10 h-10 text-rcb-red animate-spin" />
        <p className="text-sm font-bold text-white/40 uppercase tracking-widest">Accessing Synaptic Memory...</p>
      </div>
    );
  }


  // ─── THINKING: Workflow Animation ───
  if (status === "thinking" || status === "generating") {
    return (
      <div className="max-w-2xl mx-auto flex flex-col items-center justify-center min-h-[60vh]">
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}
          className="glass rounded-3xl p-10 w-full relative overflow-hidden"
        >
          <div className="absolute -top-20 left-1/2 -translate-x-1/2 w-80 h-80 bg-rcb-red/10 rounded-full blur-[120px]" />
          
          <div className="relative z-10">
            <div className="text-center mb-10">
              <div className="w-16 h-16 rounded-full bg-rcb-red/20 mx-auto mb-4 flex items-center justify-center">
                <Loader2 className="w-8 h-8 text-rcb-red animate-spin" />
              </div>
              <h2 className="text-xl font-black">Agent Initializing...</h2>
              <p className="text-xs text-white/40 mt-1">Goal: "{goal}"</p>
            </div>

            <div className="space-y-4">
              {workflowSteps.map((step, i) => {
                const isDone = i < activeStep;
                const isActive = i === activeStep;
                return (
                  <motion.div key={step.label}
                    initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.1 }}
                    className={`flex items-center gap-4 p-4 rounded-2xl transition-all ${
                      isActive ? "bg-rcb-red/10 border border-rcb-red/20" :
                      isDone ? "bg-green-500/5 border border-green-500/10" :
                      "bg-white/[0.02] border border-white/5"
                    }`}
                  >
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
                      isDone ? "bg-green-500/20" : isActive ? "bg-rcb-red/20" : "bg-white/5"
                    }`}>
                      {isDone ? <CheckCircle2 className="w-5 h-5 text-green-500" /> :
                       isActive ? <Loader2 className="w-5 h-5 text-rcb-red animate-spin" /> :
                       <step.icon className="w-5 h-5 text-white/20" />}
                    </div>
                    <span className={`text-sm font-bold ${
                      isDone ? "text-green-400" : isActive ? "text-rcb-red" : "text-white/20"
                    }`}>{step.label}</span>
                    {isDone && <span className="ml-auto text-[10px] text-green-500/50">✓ Done</span>}
                  </motion.div>
                );
              })}
            </div>
          </div>
        </motion.div>
      </div>
    );
  }

  // ─── COMPLETE: Full Dashboard ───
  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-black tracking-tighter flex items-center gap-2">
            <Bot className="w-7 h-7 text-rcb-red" /> Agent <span className="text-rcb-red">Active</span>
          </h1>
          <p className="text-xs text-white/40 mt-1">
            Goal: {memory?.careerGoals?.[memory.careerGoals.length - 1]}
          </p>
        </div>
        <div className="flex gap-2">
          {memory?.preferredDomain && (
            <div className="px-3 py-1 rounded-full bg-rcb-red/10 border border-rcb-red/20 text-[10px] font-bold text-rcb-red uppercase tracking-widest flex items-center gap-2">
              <Brain className="w-3 h-3" /> {memory.preferredDomain} Specialist
            </div>
          )}
          <button onClick={reset} className="px-4 py-2 rounded-xl glass text-xs font-bold text-white/40 hover:text-white flex items-center gap-2">
            <RotateCcw className="w-3 h-3" /> New Goal
          </button>
        </div>
      </div>


      {/* Stats Row */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        {[
          { label: "Progress", value: `${progress}%`, icon: Target, color: "#EE1C25" },
          { label: "Tasks Done", value: `${doneTasks}/${totalTasks}`, icon: CheckCircle2, color: "#22c55e" },
          { label: "XP Earned", value: totalXP, icon: Zap, color: "#f59e0b" },
          { label: "Level", value: Math.floor(totalXP / 500) + 1, icon: Star, color: "#a855f7" },
          { label: "Streak", value: `${memory?.streak || 0}d`, icon: Timer, color: "#3b82f6" },
        ].map((s, i) => (
          <motion.div key={s.label}
            initial={{ opacity: 0, y: 10, rotateX: 8 }} animate={{ opacity: 1, y: 0, rotateX: 0 }}
            transition={{ delay: i * 0.05 }}
            className="glass rounded-2xl p-4 relative overflow-hidden group" style={{ perspective: "600px" }}
          >
            <div className="absolute -top-6 -right-6 w-16 h-16 rounded-full blur-[30px] opacity-20" style={{ backgroundColor: s.color }} />
            <s.icon className="w-5 h-5 mb-2" style={{ color: s.color }} />
            <p className="text-2xl font-black" style={{ color: s.color }}>{s.value}</p>
            <p className="text-[9px] text-white/30 uppercase tracking-widest">{s.label}</p>
          </motion.div>
        ))}
      </div>

      {/* Overall Progress Bar */}
      <div className="glass rounded-2xl p-5">
        <div className="flex justify-between text-[10px] font-bold text-white/40 uppercase tracking-widest mb-2">
          <span>Mission Progress</span><span>{progress}%</span>
        </div>
        <div className="h-2 bg-white/5 rounded-full overflow-hidden">
          <motion.div initial={{ width: 0 }} animate={{ width: `${progress}%` }}
            transition={{ duration: 1 }}
            className="h-full bg-gradient-to-r from-rcb-red to-red-400 rounded-full shadow-[0_0_10px_rgba(238,28,37,0.5)]"
          />
        </div>
      </div>

      {/* Roadmap Phases */}
      <div className="space-y-4">
        {roadmap.map((phase, pi) => {
          const phaseDone = phase.tasks.filter(t => t.done).length;
          const phaseTotal = phase.tasks.length;
          const isExpanded = expandedPhase === phase.id;

          return (
            <motion.div key={phase.id}
              initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
              transition={{ delay: pi * 0.1 }}
              className="glass rounded-3xl overflow-hidden"
            >
              {/* Phase Header */}
              <button onClick={() => setExpandedPhase(isExpanded ? null : phase.id)}
                className="w-full flex items-center justify-between p-6 hover:bg-white/[0.02] transition-all text-left"
              >
                <div className="flex items-center gap-4">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-sm font-black ${
                    phase.status === "done" ? "bg-green-500/20 text-green-400" :
                    phase.status === "active" ? "bg-rcb-red text-white shadow-[0_0_15px_rgba(238,28,37,0.3)]" :
                    "bg-white/5 text-white/20"
                  }`}>
                    {phase.status === "done" ? <CheckCircle2 className="w-5 h-5" /> : phase.id}
                  </div>
                  <div>
                    <h3 className="font-bold text-white text-sm">{phase.title}</h3>
                    <p className="text-[10px] text-white/30">{phase.duration} • {phaseDone}/{phaseTotal} tasks</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="hidden md:block w-32 h-1.5 bg-white/5 rounded-full overflow-hidden">
                    <div className="h-full bg-rcb-red rounded-full" style={{ width: `${(phaseDone / phaseTotal) * 100}%` }} />
                  </div>
                  <ChevronRight className={`w-4 h-4 text-white/20 transition-transform ${isExpanded ? "rotate-90" : ""}`} />
                </div>
              </button>

              {/* Phase Tasks */}
              <AnimatePresence>
                {isExpanded && (
                  <motion.div initial={{ height: 0 }} animate={{ height: "auto" }} exit={{ height: 0 }}
                    className="overflow-hidden"
                  >
                    <div className="px-6 pb-6 space-y-3">
                      {phase.tasks.map((task, ti) => {
                        const Icon = typeIcons[task.type] || FileText;
                        const color = typeColors[task.type] || "#fff";
                        return (
                          <motion.div key={task.id}
                            initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: ti * 0.05 }}
                            className={`flex items-start gap-4 p-4 rounded-2xl border transition-all cursor-pointer group ${
                              task.done
                                ? "bg-green-500/5 border-green-500/10"
                                : "bg-white/[0.02] border-white/5 hover:border-white/10"
                            }`}
                            onClick={() => toggleTask(phase.id, task.id)}
                          >
                            <div className="mt-0.5 shrink-0">
                              {task.done
                                ? <CheckCircle2 className="w-5 h-5 text-green-500" />
                                : <Circle className="w-5 h-5 text-white/15 group-hover:text-white/30 transition-colors" />
                              }
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className={`text-sm leading-relaxed ${task.done ? "text-white/30 line-through" : "text-white/70"}`}>
                                {task.text}
                              </p>
                              <div className="flex items-center gap-2 mt-2 flex-wrap">
                                <span className="flex items-center gap-1 text-[9px] font-bold uppercase tracking-widest px-2 py-0.5 rounded"
                                  style={{ backgroundColor: color + "15", color }}
                                >
                                  <Icon className="w-3 h-3" /> {task.type}
                                </span>
                                <span className={`text-[9px] font-bold uppercase tracking-widest px-2 py-0.5 rounded ${priorityBadge[task.priority]}`}>
                                  {task.priority}
                                </span>
                                <span className="text-[9px] text-amber-500 font-bold">+{task.xp} XP</span>
                              </div>
                            </div>
                          </motion.div>
                        );
                      })}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          );
        })}
      </div>

      {/* Memory Insights Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-8">
        <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}
          className="glass rounded-3xl p-6 relative overflow-hidden"
        >
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-xl bg-blue-500/10 flex items-center justify-center">
              <History className="w-5 h-5 text-blue-400" />
            </div>
            <div>
              <h3 className="font-bold text-white">System Memory</h3>
              <p className="text-[10px] text-white/30 uppercase tracking-widest">Historical Context</p>
            </div>
          </div>

          <div className="space-y-4">
            {memory?.lastResumeAnalysis && (
              <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/5">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-xs text-white/60">Last Resume ATS Score</span>
                  <span className="text-sm font-black text-rcb-red">{memory.lastResumeAnalysis.atsScore}%</span>
                </div>
                <div className="h-1.5 bg-white/5 rounded-full overflow-hidden">
                  <div className="h-full bg-rcb-red" style={{ width: `${memory.lastResumeAnalysis.atsScore}%` }} />
                </div>
              </div>
            )}
            
            <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/5">
              <p className="text-[10px] text-white/30 uppercase tracking-widest mb-3">AI Recommendations Based on Memory</p>
              <ul className="space-y-2">
                {[
                  `Focusing on your ${memory?.preferredDomain || "Fullstack"} goals`,
                  `Improving ${memory?.skillGaps?.[0]?.skill || "System Design"} gaps`,
                  `Targeting roles matching your past performance`
                ].map((rec, i) => (
                  <li key={i} className="flex items-center gap-2 text-xs text-white/60">
                    <Sparkles className="w-3 h-3 text-rcb-red" /> {rec}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </motion.div>

        <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}
          className="glass rounded-3xl p-6 relative overflow-hidden"
        >
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-xl bg-rcb-red/10 flex items-center justify-center">
              <Target className="w-5 h-5 text-rcb-red" />
            </div>
            <div>
              <h3 className="font-bold text-white">Career Evolution</h3>
              <p className="text-[10px] text-white/30 uppercase tracking-widest">Personalized Growth</p>
            </div>
          </div>
          
          <div className="flex flex-wrap gap-2">
            {memory?.careerGoals?.map((g, i) => (
              <span key={i} className="px-3 py-1.5 rounded-xl bg-white/5 border border-white/10 text-[10px] text-white/60">
                {g}
              </span>
            ))}
            {(!memory?.careerGoals || memory.careerGoals.length === 0) && (
              <p className="text-xs text-white/20 italic">No historical goals recorded yet.</p>
            )}
          </div>
        </motion.div>
      </div>


      {/* Agent Memory Footer */}
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }}
        className="glass-dark rounded-2xl p-5 flex items-center gap-4"
      >
        <div className="w-3 h-3 rounded-full bg-green-500 animate-pulse shadow-[0_0_10px_rgba(34,197,94,0.5)]" />
        <span className="text-[10px] font-mono text-white/30 uppercase tracking-widest">
          Agent Kernel v4.2.0 • Memory Active • Goal Locked: "{memory?.careerGoals?.[0] || 'Unset'}" • Next sync in 23m
        </span>
      </motion.div>
    </div>
  );
}
