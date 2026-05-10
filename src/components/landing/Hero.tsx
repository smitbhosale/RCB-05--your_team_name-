"use client";

import { motion, useMotionValue, useSpring, useTransform, AnimatePresence } from "framer-motion";
import { ChevronRight, Play, Sparkles, Cpu, Zap, ArrowRight, X, FileSearch, Terminal, Video, TrendingUp } from "lucide-react";
import { ParticleField } from "@/components/ui/ParticleField";
import { FloatingOrb } from "@/components/ui/FloatingOrb";
import { GlowButton } from "@/components/ui/GlowButton";
import { useRef, useState } from "react";
import Link from "next/link";

export const Hero = () => {
  const [showDemo, setShowDemo] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const springX = useSpring(mouseX, { stiffness: 50, damping: 20 });
  const springY = useSpring(mouseY, { stiffness: 50, damping: 20 });

  const rotateX = useTransform(springY, [-0.5, 0.5], [5, -5]);
  const rotateY = useTransform(springX, [-0.5, 0.5], [-5, 5]);

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    mouseX.set((e.clientX - rect.left) / rect.width - 0.5);
    mouseY.set((e.clientY - rect.top) / rect.height - 0.5);
  };

  return (
    <section
      ref={containerRef}
      onMouseMove={handleMouseMove}
      className="relative min-h-screen flex items-center justify-center pt-20 overflow-hidden"
      aria-label="Hero section"
    >
      {/* Particle Background */}
      <div className="absolute inset-0 z-0">
        <ParticleField count={60} />
      </div>

      {/* 3D Floating Orbs */}
      <FloatingOrb color="rgba(238, 28, 37, 0.15)" size={500} className="-left-40 top-1/4" delay={0} />
      <FloatingOrb color="rgba(59, 130, 246, 0.08)" size={600} className="-right-40 bottom-1/4" delay={2} />
      <FloatingOrb color="rgba(168, 85, 247, 0.06)" size={350} className="left-1/3 top-0" delay={4} />

      {/* Grid Background */}
      <div className="absolute inset-0 grid-bg opacity-30" aria-hidden="true" />

      {/* Animated Grid Lines */}
      <div className="absolute inset-0 z-0" aria-hidden="true">
        <div className="absolute top-1/2 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/5 to-transparent" />
        <div className="absolute top-0 bottom-0 left-1/2 w-px bg-gradient-to-b from-transparent via-white/5 to-transparent" />
      </div>

      <div className="container mx-auto px-6 relative z-10 text-center">
        {/* Badge */}
        <motion.div
          initial={{ opacity: 0, y: 20, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.6, ease: [0.23, 1, 0.32, 1] }}
          className="inline-flex items-center gap-2.5 px-5 py-2.5 rounded-full glass-premium mb-8"
        >
          <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse shadow-[0_0_10px_rgba(34,197,94,0.5)]" />
          <Sparkles className="w-3.5 h-3.5 text-rcb-red" aria-hidden="true" />
          <span className="text-[10px] font-black tracking-[0.25em] uppercase text-white/60">
            Powered by Gemini 2.5 Pro
          </span>
        </motion.div>

        {/* Main Heading with 3D Transform */}
        <motion.div style={{ perspective: 1200 }}>
          <motion.h1
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2, ease: [0.23, 1, 0.32, 1] }}
            style={{ rotateX, rotateY, transformStyle: "preserve-3d" }}
            className="text-5xl sm:text-7xl md:text-[6.5rem] lg:text-[8rem] font-black tracking-[-0.04em] mb-6 leading-[0.9]"
          >
            <span className="text-gradient-shine block">THE AUTONOMOUS</span>
            <span className="text-rcb-red rcb-glow relative inline-block">
              CAREER OS
              {/* Animated underline */}
              <motion.div
                initial={{ scaleX: 0 }}
                animate={{ scaleX: 1 }}
                transition={{ duration: 1, delay: 1, ease: [0.23, 1, 0.32, 1] }}
                className="absolute -bottom-2 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-rcb-red to-transparent origin-left"
              />
            </span>
          </motion.h1>
        </motion.div>

        {/* Subtitle */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="max-w-2xl mx-auto text-base sm:text-lg md:text-xl text-white/50 mb-12 leading-relaxed"
        >
          Stop building resumes. Start building a{" "}
          <span className="text-white font-semibold">legacy</span>. RCB CareerOS is the world&apos;s
          first AI-driven operating system that automates student growth, from{" "}
          <span className="text-rcb-red font-semibold">first-year</span> to{" "}
          <span className="text-rcb-red font-semibold">first-hire</span>.
        </motion.p>

        {/* CTA Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-4"
        >
          <Link href="/dashboard">
            <GlowButton size="lg" variant="primary">
              Launch CareerOS <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </GlowButton>
          </Link>

          <GlowButton size="lg" variant="secondary" onClick={() => setShowDemo(true)}>
            <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center">
              <Play className="w-4 h-4 fill-white" aria-hidden="true" />
            </div>
            Watch Demo
          </GlowButton>
        </motion.div>

        {/* 3D Dashboard Preview with Tilt Effect */}
        <motion.div
          initial={{ opacity: 0, y: 80, rotateX: 15 }}
          animate={{ opacity: 1, y: 0, rotateX: 0 }}
          transition={{ duration: 1.2, delay: 0.9, ease: [0.23, 1, 0.32, 1] }}
          className="mt-20 relative max-w-5xl mx-auto"
          style={{ perspective: 1200, transformStyle: "preserve-3d" }}
        >
          {/* Glow behind preview */}
          <div className="absolute inset-0 bg-rcb-red/15 blur-[100px] -z-10 rounded-full scale-75" aria-hidden="true" />

          <motion.div
            style={{ rotateX, rotateY, transformStyle: "preserve-3d" }}
            className="glass-premium rounded-3xl p-1.5 shadow-2xl overflow-hidden relative group"
          >
            {/* Scan line effect */}
            <div className="absolute inset-0 z-20 pointer-events-none animate-scan opacity-30" aria-hidden="true" />

            {/* Terminal-style header */}
            <div className="bg-white/[0.03] px-5 py-3 flex items-center gap-3 border-b border-white/5" aria-hidden="true">
              <div className="flex gap-1.5">
                <div className="w-2.5 h-2.5 rounded-full bg-red-500/60" />
                <div className="w-2.5 h-2.5 rounded-full bg-yellow-500/60" />
                <div className="w-2.5 h-2.5 rounded-full bg-green-500/60" />
              </div>
              <div className="flex-1 text-center">
                <span className="text-[9px] font-mono text-white/20 tracking-widest">careeros.app — Terminal v4.2.0</span>
              </div>
            </div>

            {/* Dashboard grid mockup */}
            <div className="aspect-video bg-gradient-to-br from-[#0a0a0a] to-[#111] relative overflow-hidden">
              {/* Faux dashboard content */}
              <div className="absolute inset-4 grid grid-cols-3 gap-3 opacity-40">
                <div className="col-span-1 rounded-xl bg-gradient-to-b from-white/[0.04] to-transparent border border-white/[0.04]" />
                <div className="col-span-2 rounded-xl bg-gradient-to-b from-white/[0.03] to-transparent border border-white/[0.04]" />
                <div className="col-span-1 rounded-xl bg-gradient-to-b from-rcb-red/5 to-transparent border border-rcb-red/10" />
                <div className="col-span-1 rounded-xl bg-gradient-to-b from-white/[0.03] to-transparent border border-white/[0.04]" />
                <div className="col-span-1 rounded-xl bg-gradient-to-b from-blue-500/5 to-transparent border border-blue-500/10" />
              </div>

              {/* Hover overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-transparent to-transparent z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex items-end p-8">
                <div className="text-left">
                  <div className="flex items-center gap-2 mb-2">
                    <Cpu className="w-5 h-5 text-rcb-red" aria-hidden="true" />
                    <span className="text-[10px] font-black text-rcb-red tracking-[0.2em] uppercase">Live Preview</span>
                  </div>
                  <h3 className="text-2xl font-black text-white">Career Terminal v4.2</h3>
                  <p className="text-white/50 text-sm mt-1">Real-time task automation and AI-powered growth tracking.</p>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Floating 3D badges around the preview */}
          <motion.div
            animate={{ y: [-5, 5, -5] }}
            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
            className="absolute -left-6 top-1/4 glass-premium rounded-2xl p-3 hidden lg:flex items-center gap-2 shadow-2xl"
            style={{ transform: "translateZ(40px)" }}
            aria-hidden="true"
          >
            <Zap className="w-4 h-4 text-rcb-red fill-rcb-red" />
            <span className="text-[10px] font-black text-white/80">ATS Score: 96</span>
          </motion.div>

          <motion.div
            animate={{ y: [5, -5, 5] }}
            transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 1 }}
            className="absolute -right-6 bottom-1/3 glass-premium rounded-2xl p-3 hidden lg:flex items-center gap-2 shadow-2xl"
            style={{ transform: "translateZ(30px)" }}
            aria-hidden="true"
          >
            <Sparkles className="w-4 h-4 text-green-500" />
            <span className="text-[10px] font-black text-white/80">3 New Matches</span>
          </motion.div>
        </motion.div>
      </div>

      {/* Demo Modal */}
      <AnimatePresence>
        {showDemo && (
          <>
            <motion.div
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/80 backdrop-blur-md z-[100]"
              onClick={() => setShowDemo(false)}
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              className="fixed inset-4 sm:inset-8 md:inset-16 lg:inset-20 z-[101] glass-dark rounded-3xl border border-white/10 overflow-hidden shadow-2xl flex flex-col"
              role="dialog"
              aria-label="CareerOS Demo Walkthrough"
              aria-modal="true"
            >
              {/* Modal Header */}
              <div className="flex items-center justify-between p-5 sm:p-6 border-b border-white/5">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-rcb-red flex items-center justify-center shadow-[0_0_20px_rgba(238,28,37,0.3)]">
                    <Play className="w-5 h-5 text-white fill-white" aria-hidden="true" />
                  </div>
                  <div>
                    <h2 className="text-lg font-bold text-white">CareerOS Demo</h2>
                    <p className="text-[10px] text-white/40 uppercase tracking-widest">Interactive Walkthrough</p>
                  </div>
                </div>
                <button onClick={() => setShowDemo(false)} className="p-2 rounded-lg hover:bg-white/5 text-white/40 hover:text-white transition-colors" aria-label="Close demo">
                  <X className="w-6 h-6" />
                </button>
              </div>

              {/* Modal Body */}
              <div className="flex-1 overflow-y-auto p-5 sm:p-8">
                <div className="max-w-4xl mx-auto space-y-8">
                  <div className="text-center mb-8">
                    <h3 className="text-2xl sm:text-3xl font-black tracking-tighter mb-3">
                      HOW <span className="text-rcb-red">CAREEROS</span> WORKS
                    </h3>
                    <p className="text-white/40 text-sm max-w-lg mx-auto">
                      From resume upload to job offer — the complete autonomous career pipeline
                    </p>
                  </div>

                  {/* Steps */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    {[
                      { step: 1, title: "Upload Your Resume", desc: "Drop your PDF resume and our AI performs a deep semantic analysis in under 30 seconds.", icon: FileSearch, color: "from-red-500 to-orange-500" },
                      { step: 2, title: "AI Agent Activates", desc: "Your personal AI agent scans 10,000+ job listings and generates a personalized roadmap.", icon: Terminal, color: "from-blue-500 to-cyan-500" },
                      { step: 3, title: "Practice Mock Interviews", desc: "Real-time AI-powered interviews with HR, Technical, and Behavioral tracks.", icon: Video, color: "from-purple-500 to-pink-500" },
                      { step: 4, title: "Track & Level Up", desc: "Gamified XP system tracks your growth. Earn achievements and unlock career milestones.", icon: TrendingUp, color: "from-green-500 to-emerald-500" },
                    ].map(({ step, title, desc, icon: Icon, color }, i) => (
                      <motion.div
                        key={step}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.15, duration: 0.5 }}
                        className="glass rounded-2xl p-6 group hover:border-rcb-red/20 transition-all relative overflow-hidden"
                      >
                        <div className="absolute top-3 right-4 text-[60px] font-black text-white/[0.02] leading-none select-none" aria-hidden="true">
                          {step}
                        </div>
                        <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${color} p-0.5 mb-4`}>
                          <div className="w-full h-full rounded-[10px] bg-[#030303] flex items-center justify-center">
                            <Icon className="w-6 h-6 text-white" aria-hidden="true" />
                          </div>
                        </div>
                        <div className="text-[10px] font-black text-rcb-red mb-2 tracking-widest uppercase">STEP {step}</div>
                        <h4 className="text-base font-bold mb-2 group-hover:text-rcb-red transition-colors">{title}</h4>
                        <p className="text-xs text-white/40 leading-relaxed">{desc}</p>
                      </motion.div>
                    ))}
                  </div>

                  {/* CTA */}
                  <div className="text-center pt-4">
                    <Link href="/dashboard" onClick={() => setShowDemo(false)}>
                      <GlowButton size="lg">
                        START NOW — IT&apos;S FREE <ArrowRight className="w-5 h-5" />
                      </GlowButton>
                    </Link>
                  </div>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </section>
  );
};
