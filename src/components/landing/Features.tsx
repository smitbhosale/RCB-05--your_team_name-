"use client";

import { motion } from "framer-motion";
import { FileSearch, Terminal, Video, TrendingUp, Zap, Layers } from "lucide-react";
import { Tilt3D } from "@/components/ui/Tilt3D";

const features = [
  { title: "AI Resume Analyzer", desc: "Deep semantic analysis of your impact using industry-standard ATS algorithms.", icon: FileSearch, color: "from-red-500 to-orange-500" },
  { title: "Career Growth Agent", desc: "A persistent AI that generates daily projects, learning tasks, and career roadmaps.", icon: Terminal, color: "from-blue-500 to-cyan-500" },
  { title: "AI Mock Interviews", desc: "Real-time analysis. Practice with Gemini-powered recruiters who never get tired.", icon: Video, color: "from-purple-500 to-pink-500" },
  { title: "Internship Matcher", desc: "Automated scraping and matching. We find roles and optimize your profile for them.", icon: Zap, color: "from-green-500 to-emerald-500" },
  { title: "Skill XP System", desc: "Gamified career tracking. Earn XP for every project, interview, and milestone.", icon: TrendingUp, color: "from-yellow-500 to-amber-500" },
  { title: "Stack Architecture", desc: "A unified OS for your entire student journey. No more scattered spreadsheets.", icon: Layers, color: "from-indigo-500 to-blue-500" },
];

export const Features = () => (
  <section id="features" className="py-20 sm:py-24 relative overflow-hidden" aria-label="Platform features">
    <div className="container mx-auto px-6">
      <div className="text-center mb-16 sm:mb-20">
        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="text-rcb-red font-bold tracking-[0.3em] uppercase text-[10px] sm:text-xs mb-4"
        >
          Capabilities
        </motion.p>
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-3xl sm:text-4xl md:text-6xl font-black tracking-tighter"
        >
          BUILT FOR THE <span className="text-white/30 font-light italic">FUTURE</span>
        </motion.h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6">
        {features.map((feature, i) => (
          <motion.div
            key={feature.title}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.08 }}
            viewport={{ once: true, amount: 0.2 }}
          >
            <Tilt3D intensity={8} className="h-full">
              <div className="group relative p-7 sm:p-8 rounded-3xl glass-premium hover:border-rcb-red/20 transition-all duration-500 h-full">
                <div className="absolute inset-0 bg-gradient-to-br from-rcb-red/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity rounded-3xl" aria-hidden="true" />

                <div className={`w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-gradient-to-br ${feature.color} p-0.5 mb-5 sm:mb-6 shadow-lg group-hover:scale-110 transition-transform duration-500`}>
                  <div className="w-full h-full rounded-[14px] bg-[#030303] flex items-center justify-center">
                    <feature.icon className="w-6 h-6 sm:w-7 sm:h-7 text-white" aria-hidden="true" />
                  </div>
                </div>

                <h3 className="text-lg sm:text-xl font-bold mb-3 sm:mb-4 group-hover:text-rcb-red transition-colors">{feature.title}</h3>
                <p className="text-white/40 leading-relaxed text-sm">{feature.desc}</p>

                <div className="mt-6 sm:mt-8 flex items-center text-[10px] sm:text-xs font-bold text-white/20 group-hover:text-rcb-red transition-colors">
                  EXPLORE <div className="ml-2 w-4 h-px bg-white/10 group-hover:bg-rcb-red transition-all group-hover:w-8" />
                </div>
              </div>
            </Tilt3D>
          </motion.div>
        ))}
      </div>
    </div>
  </section>
);
