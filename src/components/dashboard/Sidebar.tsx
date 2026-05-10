"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "@/context/AuthContext";
import {

  LayoutDashboard, FileText, Briefcase, Video, Settings, LogOut,
  Cpu, BarChart3, Bot, Menu, X, Bell, Moon, Sun, Shield, User, ChevronRight, Map, FileEdit, Hexagon
} from "lucide-react";



import { cn } from "@/lib/utils";

const menuItems = [
  { name: "OS Dashboard", icon: LayoutDashboard, href: "/dashboard" },
  { name: "AI Roadmap", icon: Map, href: "/roadmap" },
  { name: "Career Twin", icon: Hexagon, href: "/twin" },
  { name: "AI Agent", icon: Bot, href: "/agent" },
  { name: "Resume Analyzer", icon: FileText, href: "/analyzer" },

  { name: "Resume Rebuilder", icon: FileEdit, href: "/rebuilder" },
  { name: "Internships", icon: Briefcase, href: "/matches" },

  { name: "Mock Interviews", icon: Video, href: "/interviews" },
  { name: "Growth Charts", icon: BarChart3, href: "/tracking" },

];

export const Sidebar = () => {
  const { user, logout } = useAuth();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [logoutConfirm, setLogoutConfirm] = useState(false);
  const pathname = usePathname();

  const [settings, setSettings] = useState({
    notifications: true,
    darkMode: true,
    aiSuggestions: true,
    emailDigest: false,
  });

  const handleLogout = async () => {
    setLogoutConfirm(false);
    setMobileOpen(false);
    await logout();
  };


  const NavContent = () => (
    <>
      <div className="flex items-center gap-3 mb-10 px-2">
        <div className="w-8 h-8 rounded-lg bg-rcb-red flex items-center justify-center shadow-[0_0_15px_rgba(238,28,37,0.4)]">
          <Cpu className="text-white w-5 h-5" aria-hidden="true" />
        </div>
        <span className="font-black text-lg tracking-tighter">
          CAREER <span className="text-rcb-red">OS</span>
        </span>
      </div>

      <nav className="flex-1 space-y-1" aria-label="Main navigation">
        {menuItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.name}
              href={item.href}
              onClick={() => setMobileOpen(false)}
              aria-current={isActive ? "page" : undefined}
              className={cn(
                "flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 group",
                isActive
                  ? "bg-rcb-red text-white shadow-[0_0_20px_rgba(238,28,37,0.2)]"
                  : "text-white/40 hover:text-white hover:bg-white/5"
              )}
            >
              <item.icon className={cn("w-5 h-5", isActive ? "text-white" : "group-hover:text-rcb-red")} aria-hidden="true" />
              <span className="text-sm font-medium">{item.name}</span>
              {isActive && (
                <motion.div
                  layoutId="active-pill"
                  className="ml-auto w-1.5 h-1.5 rounded-full bg-white"
                />
              )}
            </Link>
          );
        })}
      </nav>

      <div className="mt-auto space-y-1 pt-4 border-t border-white/5">
        <button
          onClick={() => { setSettingsOpen(true); setMobileOpen(false); }}
          className="flex items-center gap-3 px-4 py-3 w-full rounded-xl text-white/40 hover:text-white hover:bg-white/5 transition-all"
          aria-label="Open settings"
        >
          <Settings className="w-5 h-5" aria-hidden="true" />
          <span className="text-sm font-medium">Settings</span>
        </button>
        <button
          onClick={() => setLogoutConfirm(true)}
          className="flex items-center gap-3 px-4 py-3 w-full rounded-xl text-white/40 hover:text-rcb-red hover:bg-rcb-red/5 transition-all"
          aria-label="Logout"
        >
          <LogOut className="w-5 h-5" aria-hidden="true" />
          <span className="text-sm font-medium">Logout</span>
        </button>
      </div>
    </>
  );

  return (
    <>
      {/* Desktop Sidebar */}
      <aside className="fixed left-0 top-0 bottom-0 w-64 glass-dark border-r border-white/5 z-40 hidden md:flex flex-col p-6"
        role="navigation" aria-label="Desktop navigation"
      >
        <NavContent />
      </aside>

      {/* Mobile Hamburger */}
      <button
        onClick={() => setMobileOpen(true)}
        className="fixed top-4 left-4 z-50 md:hidden p-2.5 rounded-xl glass"
        aria-label="Open navigation menu"
      >
        <Menu className="w-5 h-5 text-white" />
      </button>

      {/* Mobile Overlay */}
      <AnimatePresence>
        {mobileOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 md:hidden"
              onClick={() => setMobileOpen(false)}
              aria-hidden="true"
            />
            <motion.aside
              initial={{ x: -280 }} animate={{ x: 0 }} exit={{ x: -280 }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="fixed left-0 top-0 bottom-0 w-72 glass-dark border-r border-white/5 z-50 flex flex-col p-6 md:hidden"
              role="navigation" aria-label="Mobile navigation"
            >
              <button
                onClick={() => setMobileOpen(false)}
                className="absolute top-4 right-4 p-2 rounded-lg hover:bg-white/10 transition-colors"
                aria-label="Close navigation menu"
              >
                <X className="w-5 h-5 text-white/40" />
              </button>
              <NavContent />
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      {/* Settings Modal */}
      <AnimatePresence>
        {settingsOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/70 backdrop-blur-sm z-[60]"
              onClick={() => setSettingsOpen(false)}
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              className="fixed inset-4 sm:inset-auto sm:top-1/2 sm:left-1/2 sm:-translate-x-1/2 sm:-translate-y-1/2 sm:w-full sm:max-w-lg z-[61] glass-dark rounded-3xl border border-white/10 overflow-hidden shadow-2xl"
              role="dialog"
              aria-label="Settings"
              aria-modal="true"
            >
              {/* Header */}
              <div className="flex items-center justify-between p-6 border-b border-white/5">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center">
                    <Settings className="w-5 h-5 text-rcb-red" aria-hidden="true" />
                  </div>
                  <div>
                    <h2 className="text-lg font-bold text-white">Settings</h2>
                    <p className="text-[10px] text-white/30 uppercase tracking-widest">CareerOS Configuration</p>
                  </div>
                </div>
                <button onClick={() => setSettingsOpen(false)} className="p-2 rounded-lg hover:bg-white/5 text-white/40 hover:text-white" aria-label="Close settings">
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Settings Body */}
              <div className="p-6 space-y-6 max-h-[60vh] overflow-y-auto">
                {/* Profile */}
                <div className="flex items-center gap-4 p-4 rounded-2xl bg-white/[0.03] border border-white/5">
                  <img src={user?.photoURL || "https://i.pravatar.cc/150"} alt="Profile" className="w-14 h-14 rounded-xl" />
                  <div className="flex-1">
                    <p className="font-bold text-white">{user?.displayName || "User"}</p>
                    <p className="text-xs text-white/40">{user?.email}</p>
                    <p className="text-[10px] text-rcb-red font-bold mt-1">Active Session</p>
                  </div>
                  <ChevronRight className="w-4 h-4 text-white/20" aria-hidden="true" />
                </div>


                {/* Toggle Settings */}
                {[
                  { key: "notifications" as const, label: "Push Notifications", desc: "Get alerts for new matches and tasks", icon: Bell },
                  { key: "darkMode" as const, label: "Dark Mode", desc: "Always enabled for the CareerOS theme", icon: Moon },
                  { key: "aiSuggestions" as const, label: "AI Suggestions", desc: "Get proactive career recommendations", icon: Bot },
                  { key: "emailDigest" as const, label: "Weekly Email Digest", desc: "Receive weekly progress summaries", icon: Shield },
                ].map(({ key, label, desc, icon: Icon }) => (
                  <div key={key} className="flex items-center justify-between py-3">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-lg bg-white/5 flex items-center justify-center">
                        <Icon className="w-4 h-4 text-white/40" aria-hidden="true" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-white">{label}</p>
                        <p className="text-[10px] text-white/30">{desc}</p>
                      </div>
                    </div>
                    <button
                      onClick={() => setSettings(s => ({ ...s, [key]: !s[key] }))}
                      className={cn(
                        "relative w-11 h-6 rounded-full transition-colors duration-300",
                        settings[key] ? "bg-rcb-red" : "bg-white/10"
                      )}
                      role="switch"
                      aria-checked={settings[key]}
                      aria-label={label}
                    >
                      <motion.div
                        animate={{ x: settings[key] ? 22 : 2 }}
                        transition={{ type: "spring", stiffness: 500, damping: 30 }}
                        className="absolute top-1 w-4 h-4 rounded-full bg-white shadow-md"
                      />
                    </button>
                  </div>
                ))}
              </div>

              {/* Footer */}
              <div className="p-6 border-t border-white/5">
                <button
                  onClick={() => setSettingsOpen(false)}
                  className="w-full py-3 rounded-xl bg-rcb-red text-white font-bold text-sm hover:shadow-[0_0_20px_rgba(238,28,37,0.3)] transition-all"
                >
                  Save Changes
                </button>
                <p className="text-[8px] text-white/15 text-center mt-3 uppercase tracking-widest">CareerOS v4.2.0-stable</p>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Logout Confirmation */}
      <AnimatePresence>
        {logoutConfirm && (
          <>
            <motion.div
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/70 backdrop-blur-sm z-[60]"
              onClick={() => setLogoutConfirm(false)}
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[90vw] max-w-sm z-[61] glass-dark rounded-3xl border border-white/10 p-8 text-center shadow-2xl"
              role="alertdialog"
              aria-label="Confirm logout"
              aria-describedby="logout-desc"
            >
              <div className="w-14 h-14 rounded-2xl bg-rcb-red/10 mx-auto mb-5 flex items-center justify-center border border-rcb-red/20">
                <LogOut className="w-7 h-7 text-rcb-red" aria-hidden="true" />
              </div>
              <h3 className="text-xl font-bold text-white mb-2">Leave CareerOS?</h3>
              <p id="logout-desc" className="text-sm text-white/40 mb-8">
                Your progress is saved. You can always come back and pick up where you left off.
              </p>
              <div className="flex gap-3">
                <button
                  onClick={() => setLogoutConfirm(false)}
                  className="flex-1 py-3 rounded-xl bg-white/5 text-white/60 font-bold text-sm hover:bg-white/10 transition-all border border-white/5"
                >
                  Cancel
                </button>
                <button
                  onClick={handleLogout}
                  className="flex-1 py-3 rounded-xl bg-rcb-red text-white font-bold text-sm hover:shadow-[0_0_20px_rgba(238,28,37,0.3)] transition-all"
                >
                  Logout
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
};
