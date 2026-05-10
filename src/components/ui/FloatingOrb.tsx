"use client";

import { motion } from "framer-motion";

interface Props {
  color?: string;
  size?: number;
  delay?: number;
  className?: string;
  intensity?: "low" | "medium" | "high";
}

export const FloatingOrb = ({
  color = "rgba(238, 28, 37, 0.15)",
  size = 400,
  delay = 0,
  className = "",
  intensity = "medium",
}: Props) => {
  const blurMap = { low: 100, medium: 140, high: 180 };
  const blur = blurMap[intensity];

  return (
    <motion.div
      initial={{ scale: 0.8, opacity: 0 }}
      animate={{
        scale: [0.8, 1.1, 0.9, 1.05, 0.8],
        opacity: [0.3, 0.6, 0.4, 0.5, 0.3],
        x: [0, 30, -20, 15, 0],
        y: [0, -25, 15, -10, 0],
      }}
      transition={{
        duration: 12,
        repeat: Infinity,
        delay,
        ease: "easeInOut",
      }}
      className={`absolute rounded-full pointer-events-none ${className}`}
      style={{
        width: size,
        height: size,
        background: `radial-gradient(circle, ${color} 0%, transparent 70%)`,
        filter: `blur(${blur}px)`,
      }}
      aria-hidden="true"
    />
  );
};
