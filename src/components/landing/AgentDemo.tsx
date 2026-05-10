"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Terminal, Send, CheckCircle2, Circle } from "lucide-react";

const tasks = [
  "Analyzing 'Resume_v4.pdf' for competitive match...",
  "Optimization complete: ATS score improved from 64 to 89.",
  "Generating project: 'Full-stack AI SaaS with Next.js 15'...",
  "Task created: Implement authentication with Firebase.",
  "Searching for matching internships in Bangalore...",
  "Found 3 matches: Google, CRED, and Razorpay.",
  "Drafting personalized cover letter for Razorpay..."
];

export const AgentDemo = () => {
  const [activeTasks, setActiveTasks] = useState<string[]>([]);
  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (index < tasks.length) {
      const timer = setTimeout(() => {
        setActiveTasks((prev) => [...prev, tasks[index]]);
        setIndex(index + 1);
      }, 1500);
      return () => clearTimeout(timer);
    }
  }, [index]);

  return (
    <section id="agent" className="py-24 bg-rcb-dark/50">
      <div className="container mx-auto px-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <div>
            <h2 className="text-4xl md:text-5xl font-extrabold mb-6 tracking-tighter leading-tight">
              MEET YOUR <span className="text-rcb-red">AI CO-PILOT</span>
            </h2>
            <p className="text-lg text-white/60 mb-8 leading-relaxed">
              The Career Agent isn't just a chatbot. It's an autonomous worker that 
              watches your progress, finds your weaknesses, and suggests real actions 
              to level up your career.
            </p>
            
            <ul className="space-y-4">
              {[
                "24/7 Autonomous Job Matching",
                "Personalized Skill Roadmaps",
                "Automated Project Suggestions",
                "Direct Integration with LinkedIn"
              ].map((item, i) => (
                <motion.li 
                  key={item}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.1 }}
                  className="flex items-center gap-3 text-white/80"
                >
                  <CheckCircle2 className="w-5 h-5 text-rcb-red" />
                  {item}
                </motion.li>
              ))}
            </ul>
          </div>

          <div className="relative">
            <div className="absolute -inset-4 bg-rcb-red/20 blur-3xl rounded-3xl" />
            <div className="relative glass rounded-3xl overflow-hidden border-white/10 shadow-2xl">
              {/* Terminal Header */}
              <div className="bg-white/5 px-6 py-4 border-b border-white/5 flex items-center justify-between">
                <div className="flex gap-2">
                  <div className="w-3 h-3 rounded-full bg-red-500/50" />
                  <div className="w-3 h-3 rounded-full bg-yellow-500/50" />
                  <div className="w-3 h-3 rounded-full bg-green-500/50" />
                </div>
                <div className="text-[10px] font-mono text-white/30 tracking-widest uppercase flex items-center gap-2">
                  <Terminal className="w-3 h-3" />
                  CareerOS Terminal
                </div>
              </div>

              {/* Terminal Body */}
              <div className="p-8 h-[400px] font-mono text-sm overflow-y-auto space-y-4 scroll-smooth">
                <AnimatePresence>
                  {activeTasks.map((task, i) => (
                    <motion.div
                      key={task}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      className="flex gap-3 text-white/80"
                    >
                      <span className="text-rcb-red">➜</span>
                      <span>{task}</span>
                    </motion.div>
                  ))}
                </AnimatePresence>
                {index < tasks.length && (
                  <motion.div 
                    animate={{ opacity: [0, 1] }}
                    transition={{ repeat: Infinity, duration: 0.8 }}
                    className="w-2 h-4 bg-rcb-red inline-block"
                  />
                )}
              </div>

              {/* Terminal Input */}
              <div className="p-6 bg-black/40 border-t border-white/5">
                <div className="flex gap-4 items-center glass-dark px-4 py-2 rounded-xl">
                  <span className="text-rcb-red font-bold">@agent</span>
                  <input 
                    disabled
                    className="bg-transparent border-none outline-none text-white/40 flex-1 text-xs" 
                    placeholder="Find me an internship in Bangalore..."
                  />
                  <Send className="w-4 h-4 text-white/20" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
