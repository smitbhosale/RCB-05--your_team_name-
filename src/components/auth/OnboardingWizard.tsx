"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "@/context/AuthContext";
import { MemoryService } from "@/lib/memory";
import { 
  Briefcase, 
  ChevronRight, 
  Rocket, 
  Target, 
  User, 
  Sparkles,
  Check
} from "lucide-react";

export const OnboardingWizard = ({ onComplete }: { onComplete: () => void }) => {
  const { user } = useAuth();
  const [step, setStep] = useState(1);
  const [data, setData] = useState({
    domain: "",
    goal: "",
    experience: "beginner"
  });

  const domains = [
    { id: "frontend", label: "Frontend Development", icon: Sparkles },
    { id: "backend", label: "Backend Engineering", icon: Target },
    { id: "fullstack", label: "Fullstack Development", icon: Rocket },
    { id: "ai", label: "AI & Machine Learning", icon: Briefcase },
  ];

  const handleComplete = async () => {
    if (user) {
      await MemoryService.updateMemory(user.uid, {
        preferredDomain: data.domain,
        careerGoals: [data.goal],
      });
      onComplete();
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-xl">
      <motion.div 
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        className="glass-dark w-full max-w-xl rounded-[2.5rem] border border-white/10 overflow-hidden shadow-2xl"
      >
        <div className="p-8 md:p-12">
          {/* Progress Bar */}
          <div className="flex gap-2 mb-10">
            {[1, 2, 3].map((s) => (
              <div 
                key={s} 
                className={`h-1.5 flex-1 rounded-full transition-all duration-500 ${
                  s <= step ? "bg-rcb-red" : "bg-white/5"
                }`} 
              />
            ))}
          </div>

          <AnimatePresence mode="wait">
            {step === 1 && (
              <motion.div
                key="step1"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-6"
              >
                <div>
                  <h2 className="text-3xl font-black mb-2 tracking-tight">Select your domain</h2>
                  <p className="text-white/40 text-sm">We'll tailor your OS to your specific field.</p>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {domains.map((d) => (
                    <button
                      key={d.id}
                      onClick={() => setData({ ...data, domain: d.label })}
                      className={`p-6 rounded-3xl border text-left transition-all group ${
                        data.domain === d.label 
                          ? "bg-rcb-red border-rcb-red text-white" 
                          : "bg-white/5 border-white/5 hover:border-white/10 text-white/60"
                      }`}
                    >
                      <d.icon className={`w-8 h-8 mb-4 ${data.domain === d.label ? "text-white" : "text-rcb-red"}`} />
                      <p className="font-bold">{d.label}</p>
                    </button>
                  ))}
                </div>
              </motion.div>
            )}

            {step === 2 && (
              <motion.div
                key="step2"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-6"
              >
                <div>
                  <h2 className="text-3xl font-black mb-2 tracking-tight">What's your primary goal?</h2>
                  <p className="text-white/40 text-sm">Be specific. e.g., "Google SDE Intern" or "Launch a SaaS"</p>
                </div>
                <div className="glass rounded-2xl p-2 border-white/10">
                  <input
                    autoFocus
                    value={data.goal}
                    onChange={(e) => setData({ ...data, goal: e.target.value })}
                    placeholder="Enter your career mission..."
                    className="w-full bg-transparent border-none outline-none text-white p-4 text-lg font-medium"
                  />
                </div>
              </motion.div>
            )}

            {step === 3 && (
              <motion.div
                key="step3"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-6 text-center py-8"
              >
                <div className="w-20 h-20 bg-rcb-red/20 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Check className="w-10 h-10 text-rcb-red" />
                </div>
                <div>
                  <h2 className="text-3xl font-black mb-2 tracking-tight">Profile Optimized</h2>
                  <p className="text-white/40 text-sm">Welcome to the future of career management, {user?.displayName?.split(" ")[0]}.</p>
                </div>
                <div className="bg-white/5 border border-white/10 rounded-2xl p-4 inline-block mx-auto">
                  <p className="text-xs text-white/40 uppercase tracking-widest font-bold">Domain: {data.domain}</p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          <div className="mt-12 flex justify-between items-center">
            {step > 1 ? (
              <button 
                onClick={() => setStep(step - 1)}
                className="text-white/40 hover:text-white font-bold text-sm transition-colors"
              >
                Back
              </button>
            ) : <div />}
            
            <button
              onClick={() => step < 3 ? setStep(step + 1) : handleComplete()}
              disabled={step === 1 ? !data.domain : step === 2 ? !data.goal : false}
              className="px-8 py-4 rounded-2xl bg-rcb-red text-white font-bold flex items-center gap-2 hover:shadow-[0_0_20px_rgba(238,28,37,0.4)] transition-all disabled:opacity-30"
            >
              {step === 3 ? "Initialize OS" : "Continue"}
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
};
