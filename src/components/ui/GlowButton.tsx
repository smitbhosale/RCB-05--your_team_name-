"use client";

import { motion } from "framer-motion";
import { type ReactNode } from "react";
import { cn } from "@/lib/utils";

interface Props {
  children: ReactNode;
  variant?: "primary" | "secondary" | "ghost";
  size?: "sm" | "md" | "lg";
  className?: string;
  disabled?: boolean;
  onClick?: () => void;
  type?: "button" | "submit";
  ariaLabel?: string;
}

export const GlowButton = ({
  children,
  variant = "primary",
  size = "md",
  className = "",
  disabled = false,
  onClick,
  type = "button",
  ariaLabel,
}: Props) => {
  const sizeClasses = {
    sm: "px-4 py-2 text-xs",
    md: "px-6 py-3 text-sm",
    lg: "px-10 py-4 text-base",
  };

  const variantClasses = {
    primary: "bg-rcb-red text-white shadow-[0_0_30px_rgba(238,28,37,0.3)] hover:shadow-[0_0_50px_rgba(238,28,37,0.5)]",
    secondary: "glass text-white border-white/10 hover:bg-white/10 hover:border-white/20",
    ghost: "bg-transparent text-white/60 hover:text-white hover:bg-white/5",
  };

  return (
    <motion.button
      type={type}
      whileHover={{ scale: disabled ? 1 : 1.03, y: disabled ? 0 : -1 }}
      whileTap={{ scale: disabled ? 1 : 0.97 }}
      onClick={onClick}
      disabled={disabled}
      aria-label={ariaLabel}
      className={cn(
        "relative rounded-xl font-bold transition-all duration-300 overflow-hidden group",
        "disabled:opacity-40 disabled:cursor-not-allowed disabled:shadow-none",
        sizeClasses[size],
        variantClasses[variant],
        className
      )}
    >
      <span className="relative z-10 flex items-center justify-center gap-2">
        {children}
      </span>
      {variant === "primary" && !disabled && (
        <div
          className="absolute inset-0 bg-white/15 translate-y-full group-hover:translate-y-0 transition-transform duration-500 ease-out"
          aria-hidden="true"
        />
      )}
    </motion.button>
  );
};
