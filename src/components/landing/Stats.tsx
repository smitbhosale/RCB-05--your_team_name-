"use client";

import { motion, animate } from "framer-motion";
import { useEffect, useRef, useState } from "react";

const stats = [
  { label: "AI MATCHES MADE", value: 50000, suffix: "+" },
  { label: "RESUMES OPTIMIZED", value: 120000, suffix: "" },
  { label: "INTERNSHIP HIRES", value: 12000, suffix: "" },
  { label: "AVG. SALARY BOOST", value: 35, suffix: "%" },
];

function AnimatedCounter({ value, suffix }: { value: number; suffix: string }) {
  const [display, setDisplay] = useState("0");
  const [isInView, setIsInView] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setIsInView(true); },
      { threshold: 0.3 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!isInView) return;
    const controls = animate(0, value, {
      duration: 2,
      ease: [0.23, 1, 0.32, 1],
      onUpdate: (v) => {
        setDisplay(value >= 1000 ? `${Math.floor(v / 1000)}K` : Math.floor(v).toString());
      },
    });
    return () => controls.stop();
  }, [isInView, value]);

  return (
    <div ref={ref} className="text-4xl sm:text-5xl md:text-6xl font-black text-rcb-red rcb-glow tabular-nums">
      {display}{suffix}
    </div>
  );
}

export const Stats = () => (
  <section id="stats" className="py-20 sm:py-24 border-y border-white/5 bg-black relative overflow-hidden" aria-label="Platform statistics">
    <div className="absolute inset-0 grid-bg opacity-20" aria-hidden="true" />
    <div className="container mx-auto px-6 relative z-10">
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-12">
        {stats.map((stat, i) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: i * 0.1 }}
            viewport={{ once: true, amount: 0.3 }}
            className="text-center relative group"
          >
            <AnimatedCounter value={stat.value} suffix={stat.suffix} />
            <div className="text-[9px] sm:text-[10px] md:text-xs font-bold tracking-[0.2em] text-white/30 uppercase mt-2">
              {stat.label}
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  </section>
);
