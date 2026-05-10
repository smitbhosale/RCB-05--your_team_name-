"use client";

import { motion } from "framer-motion";
import { ArrowRight, Sparkles } from "lucide-react";
import { GlowButton } from "@/components/ui/GlowButton";
import Link from "next/link";

export const CTA = () => (
  <section className="py-20 sm:py-24 relative" aria-label="Call to action">
    <div className="container mx-auto px-4 sm:px-6">
      <div className="relative glass-premium rounded-[32px] sm:rounded-[40px] p-8 sm:p-12 md:p-20 overflow-hidden border-rcb-red/10">
        {/* Animated Background Orbs */}
        <div className="absolute top-0 right-0 w-[300px] sm:w-[400px] h-[300px] sm:h-[400px] bg-rcb-red/10 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/2 animate-morph" aria-hidden="true" />
        <div className="absolute bottom-0 left-0 w-[200px] sm:w-[300px] h-[200px] sm:h-[300px] bg-blue-600/8 rounded-full blur-[100px] translate-y-1/2 -translate-x-1/2 animate-morph" aria-hidden="true" />
        <div className="absolute inset-0 grid-bg opacity-10" aria-hidden="true" />

        <div className="relative z-10 text-center max-w-3xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-rcb-red/10 border border-rcb-red/20 mb-8"
          >
            <Sparkles className="w-3.5 h-3.5 text-rcb-red" aria-hidden="true" />
            <span className="text-[10px] font-black tracking-[0.2em] uppercase text-rcb-red">Free to Start</span>
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="text-3xl sm:text-4xl md:text-6xl lg:text-7xl font-black tracking-tighter mb-6 sm:mb-8 leading-[0.95]"
          >
            READY TO <br />
            <span className="text-rcb-red rcb-glow">UPGRADE?</span>
          </motion.h2>

          <p className="text-base sm:text-lg md:text-xl text-white/40 mb-8 sm:mb-10 max-w-xl mx-auto">
            Join 50,000+ students automating their growth and dominating the job market.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link href="/dashboard">
              <GlowButton size="lg" className="w-full sm:w-auto bg-white text-black hover:bg-rcb-red hover:text-white font-black">
                START YOUR JOURNEY <ArrowRight className="w-4 h-4" />
              </GlowButton>
            </Link>
            <GlowButton size="lg" variant="secondary" className="w-full sm:w-auto">
              TALK TO AN AGENT
            </GlowButton>
          </div>
        </div>
      </div>
    </div>
  </section>
);
