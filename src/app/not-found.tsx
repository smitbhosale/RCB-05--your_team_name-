"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowLeft, Cpu } from "lucide-react";
import { FloatingOrb } from "@/components/ui/FloatingOrb";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-[#030303] text-white flex items-center justify-center p-6 relative overflow-hidden">
      <FloatingOrb color="rgba(238, 28, 37, 0.1)" size={400} className="top-1/4 -left-20" />
      <FloatingOrb color="rgba(59, 130, 246, 0.06)" size={350} className="bottom-1/4 -right-20" delay={2} />

      <div className="absolute inset-0 grid-bg opacity-20" aria-hidden="true" />

      <motion.div
        initial={{ opacity: 0, y: 20, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.6, ease: [0.23, 1, 0.32, 1] }}
        className="text-center max-w-md relative z-10"
      >
        <div className="w-16 h-16 rounded-2xl bg-rcb-red/10 mx-auto mb-6 flex items-center justify-center border border-rcb-red/20">
          <Cpu className="w-8 h-8 text-rcb-red" aria-hidden="true" />
        </div>

        <motion.h1
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2, duration: 0.5 }}
          className="text-[8rem] font-black text-rcb-red leading-none mb-2 rcb-glow"
        >
          404
        </motion.h1>

        <h2 className="text-xl font-black mb-3">System Route Not Found</h2>
        <p className="text-sm text-white/40 mb-8 leading-relaxed">
          The page you&apos;re looking for doesn&apos;t exist in the CareerOS kernel.
        </p>

        <Link
          href="/dashboard"
          className="inline-flex items-center gap-2 px-8 py-3.5 rounded-xl bg-rcb-red text-white font-bold text-sm shadow-[0_0_30px_rgba(238,28,37,0.3)] hover:shadow-[0_0_50px_rgba(238,28,37,0.5)] transition-all"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Dashboard
        </Link>
      </motion.div>
    </div>
  );
}
