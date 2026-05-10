"use client";

import { motion } from "framer-motion";
import { Search, Bell, Zap } from "lucide-react";
import { useAuth } from "@/context/AuthContext";


export const DashboardHeader = () => {
  const { user } = useAuth();

  const currentHour = new Date().getHours();
  let greeting = "Good evening";
  if (currentHour < 12) greeting = "Good morning";
  else if (currentHour < 17) greeting = "Good afternoon";

  const getDisplayName = () => {
    if (user?.displayName) return user.displayName;
    if (user?.email) {
      const emailName = user.email.split('@')[0];
      return emailName.charAt(0).toUpperCase() + emailName.slice(1);
    }
    return "User";
  };
  const displayName = getDisplayName();

  return (
    <header
      className="h-16 sm:h-20 border-b border-white/5 flex items-center justify-between px-4 sm:px-6 md:px-8 sticky top-0 bg-[#030303]/80 backdrop-blur-xl z-30"
      role="banner"
    >
      <div className="flex items-center gap-4 flex-1">
        <div className="relative w-full max-w-md hidden md:block">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" aria-hidden="true" />
          <input
            type="search"
            placeholder="Ask CareerOS anything..."
            className="w-full bg-white/5 border border-white/5 rounded-xl py-2.5 pl-12 pr-4 text-sm focus:outline-none focus:border-rcb-red/50 transition-all placeholder:text-white/20"
            aria-label="Search CareerOS"
          />
        </div>
      </div>

      <div className="flex items-center gap-3 sm:gap-6">
        <motion.div
          whileHover={{ scale: 1.05 }}
          className="hidden lg:flex items-center gap-2 px-3 py-1.5 rounded-lg bg-rcb-red/10 border border-rcb-red/20 cursor-default"
          role="status"
          aria-label="OS Prime is active"
        >
          <Zap className="w-3.5 h-3.5 text-rcb-red fill-rcb-red" aria-hidden="true" />
          <span className="text-[9px] font-black tracking-[0.15em] text-rcb-red uppercase">OS Prime</span>
        </motion.div>

        <button
          className="relative p-2 sm:p-2.5 rounded-xl hover:bg-white/5 transition-all"
          aria-label="Notifications — 1 new"
        >
          <Bell className="w-5 h-5 text-white/60" aria-hidden="true" />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-rcb-red rounded-full border-2 border-[#030303]" aria-hidden="true" />
        </button>

        <div className="flex items-center gap-3 pl-3 sm:pl-6 border-l border-white/10">
          <div className="text-right hidden sm:block">
            <p className="text-xs font-bold text-white">{greeting}, {displayName}</p>
            <p className="text-[10px] text-white/40">Active Session</p>
          </div>
          <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl glass border-white/10 flex items-center justify-center overflow-hidden">
            <img
              src={user?.photoURL || "https://i.pravatar.cc/150"}
              alt="User avatar"
              className="w-full h-full object-cover"
              loading="lazy"
            />
          </div>

        </div>
      </div>
    </header>
  );
};
