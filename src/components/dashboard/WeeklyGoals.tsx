"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CheckSquare, Square, Trophy, Bot, RefreshCw, Zap, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";
import { useAuth } from "@/context/AuthContext";
import { MemoryService } from "@/lib/memory";

interface Task {
  id: string;
  text: string;
  completed: boolean;
  xp: number;
}

export const WeeklyGoals = () => {
  const { user } = useAuth();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [aiMessage, setAiMessage] = useState("Initializing neural task engine...");
  const [totalXp, setTotalXp] = useState(0);

  // Initial load
  useEffect(() => {
    let isMounted = true;
    const fetchInitial = async () => {
      if (!user) return;
      setIsGenerating(true);
      try {
        const memory = await MemoryService.getMemory(user.uid);
        const role = memory?.careerGoals?.[0] || "Software Engineer";
        
        const res = await fetch("/api/generate-tasks", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ role, completedLastWeek: 2 })
        });
        const data = await res.json();
        
        if (isMounted && data.tasks) {
          setTasks(data.tasks);
          setAiMessage(data.message);
        }
      } catch (err) {
        console.error(err);
        if (isMounted) setAiMessage("System recalibrating. Try refreshing.");
      } finally {
        if (isMounted) setIsGenerating(false);
      }
    };
    
    fetchInitial();
    return () => { isMounted = false; };
  }, [user]);

  const toggleTask = async (id: string) => {
    setTasks(prev => {
      const newTasks = prev.map(t => t.id === id ? { ...t, completed: !t.completed } : t);
      
      const newlyCompleted = newTasks.find(t => t.id === id)?.completed;
      if (newlyCompleted) {
        setAiMessage(getRandomPraise());
        setTotalXp(x => x + (newTasks.find(t => t.id === id)?.xp || 100));
        
        // Log to memory
        if (user) {
          MemoryService.completeTask(user.uid, id).catch(console.error);
        }
      }
      
      return newTasks;
    });
  };

  const regenerateTasks = async () => {
    setIsGenerating(true);
    setAiMessage("Analyzing your trajectory...");
    try {
      const memory = await MemoryService.getMemory(user?.uid || "aryan");
      const role = memory?.careerGoals?.[0] || "Software Engineer";
      const completedCount = tasks.filter(t => t.completed).length;

      const res = await fetch("/api/generate-tasks", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ role, completedLastWeek: completedCount })
      });
      const data = await res.json();
      
      if (data.tasks) {
        setTasks(data.tasks);
        setAiMessage(data.message);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsGenerating(false);
    }
  };

  const getRandomPraise = () => {
    const praises = [
      "Excellent execution. Task logged.",
      "Trajectory adjusting. Momentum gained.",
      "Perfect. Your neural profile is growing.",
      "Efficiency detected. Keep pushing.",
      "Milestone achieved. Adapting next steps..."
    ];
    return praises[Math.floor(Math.random() * praises.length)];
  };

  const completedCount = tasks.filter(g => g.completed).length;
  const progress = tasks.length ? (completedCount / tasks.length) * 100 : 0;

  return (
    <div className="glass rounded-[2rem] p-6 sm:p-8 relative overflow-hidden" role="region" aria-label="Weekly mission goals">
      {/* Background glow when completed */}
      {progress === 100 && (
        <div className="absolute inset-0 bg-green-500/10 animate-pulse pointer-events-none" />
      )}

      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-sm font-black tracking-widest text-white uppercase flex items-center gap-2 relative z-10">
          <Zap className="w-4 h-4 text-rcb-red" /> 
          Autonomous Mission
        </h3>
        <div className="flex items-center gap-3 relative z-10">
          <div className="flex items-center gap-1 text-amber-400 bg-amber-500/10 px-2 py-1 rounded-lg border border-amber-500/20">
            <Trophy className="w-3 h-3" />
            <span className="text-[10px] font-black">{totalXp} XP</span>
          </div>
          <button 
            onClick={regenerateTasks} 
            disabled={isGenerating}
            className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-white/40 hover:text-white transition-colors disabled:opacity-50"
            title="Force Neural Recalibration"
          >
            <RefreshCw className={cn("w-4 h-4", isGenerating && "animate-spin text-rcb-red")} />
          </button>
        </div>
      </div>

      {/* AI Message Module */}
      <div className="mb-6 p-4 rounded-2xl bg-black/40 border border-white/5 flex items-start gap-3 relative z-10">
        <div className="w-8 h-8 rounded-xl bg-rcb-red/10 flex items-center justify-center shrink-0 border border-rcb-red/20">
          <Bot className="w-4 h-4 text-rcb-red" />
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-[10px] font-black text-rcb-red uppercase tracking-widest mb-1 flex items-center gap-1">
            System Agent <Sparkles className="w-2 h-2" />
          </p>
          <p className="text-xs text-white/80 font-mono italic">
            {isGenerating ? "Computing optimal trajectory..." : `"${aiMessage}"`}
          </p>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="mb-6 relative z-10">
        <div className="flex justify-between text-[10px] font-bold text-white/40 mb-2 uppercase tracking-widest">
          <span>Mission Progress</span>
          <span>{Math.round(progress)}%</span>
        </div>
        <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className={cn(
              "h-full rounded-full shadow-[0_0_10px_rgba(238,28,37,0.5)]",
              progress === 100 ? "bg-green-500" : "bg-rcb-red"
            )}
          />
        </div>
      </div>

      {/* Task List */}
      <div className="space-y-2 relative z-10">
        <AnimatePresence mode="popLayout">
          {isGenerating && tasks.length === 0 ? (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="py-4 text-center">
              <div className="w-6 h-6 border-2 border-rcb-red/30 border-t-rcb-red rounded-full animate-spin mx-auto mb-2" />
              <p className="text-[10px] text-white/40 uppercase tracking-widest">Generating tasks...</p>
            </motion.div>
          ) : (
            tasks.map((task) => (
              <motion.div 
                key={task.id}
                layout
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, scale: 0.9 }}
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.99 }}
                onClick={() => toggleTask(task.id)}
                className={cn(
                  "flex items-center gap-4 cursor-pointer p-3 rounded-2xl border transition-all",
                  task.completed 
                    ? "bg-green-500/5 border-green-500/10" 
                    : "bg-white/[0.02] border-white/5 hover:border-rcb-red/30 hover:bg-white/[0.04]"
                )}
              >
                <div className={cn(
                  "transition-colors",
                  task.completed ? "text-green-500" : "text-white/20"
                )}>
                  {task.completed ? <CheckSquare className="w-5 h-5" /> : <Square className="w-5 h-5" />}
                </div>
                <div className="flex-1 min-w-0">
                  <span className={cn(
                    "text-sm font-medium transition-colors block truncate",
                    task.completed ? "text-white/40 line-through" : "text-white/80"
                  )}>
                    {task.text}
                  </span>
                </div>
                <span className={cn(
                  "text-[10px] font-black uppercase tracking-widest px-2 py-1 rounded",
                  task.completed ? "bg-green-500/10 text-green-500" : "bg-white/5 text-white/30"
                )}>
                  {task.xp} XP
                </span>
              </motion.div>
            ))
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};
