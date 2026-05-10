"use client";

import { motion } from "framer-motion";
import { useAuth } from "@/context/AuthContext";
import { Bot, Cpu, GitBranch, Globe, Sparkles } from "lucide-react";
import Link from "next/link";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const { user, loginWithGoogle, loginWithGithub, loginWithEmail } = useAuth();
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  useEffect(() => {
    if (user) {
      router.push("/dashboard");
    }
  }, [user, router]);

  return (
    <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center relative overflow-hidden p-4">
      {/* Background Decor */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-rcb-red/10 rounded-full blur-[120px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-rcb-red/5 rounded-full blur-[120px]" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="z-10 w-full max-w-md"
      >
        <div className="text-center mb-10">
          <Link href="/" className="inline-flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-xl bg-rcb-red flex items-center justify-center shadow-[0_0_20px_rgba(238,28,37,0.4)]">
              <Cpu className="text-white w-6 h-6" />
            </div>
            <span className="font-black text-2xl tracking-tighter">
              CAREER <span className="text-rcb-red">OS</span>
            </span>
          </Link>
          <h1 className="text-3xl font-black mb-2 tracking-tight">Initialize Session</h1>
          <p className="text-white/40 text-sm">Access your autonomous career operating system</p>
        </div>

        <div className="glass rounded-3xl p-8 border border-white/10 space-y-4">
          <form onSubmit={(e) => { e.preventDefault(); loginWithEmail(email, password); }} className="space-y-4">
            <div>
              <input
                type="email"
                placeholder="Email address"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-rcb-red transition-all"
              />
            </div>
            <div>
              <input
                type="password"
                placeholder="Password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-rcb-red transition-all"
              />
            </div>
            <button
              type="submit"
              className="w-full py-4 rounded-2xl bg-rcb-red text-white font-bold flex items-center justify-center gap-3 hover:bg-red-600 transition-all active:scale-[0.98]"
            >
              Access System
            </button>
          </form>

          <div className="flex items-center gap-4 py-2 opacity-50">
            <div className="flex-1 h-px bg-white/20"></div>
            <span className="text-xs">OR</span>
            <div className="flex-1 h-px bg-white/20"></div>
          </div>

          <button
            onClick={loginWithGoogle}
            className="w-full py-4 rounded-2xl bg-white text-black font-bold flex items-center justify-center gap-3 hover:bg-white/90 transition-all active:scale-[0.98]"
          >
            <Globe className="w-5 h-5" />
            Continue with Google
          </button>

          <button
            onClick={loginWithGithub}
            className="w-full py-4 rounded-2xl bg-white/5 border border-white/10 text-white font-bold flex items-center justify-center gap-3 hover:bg-white/10 transition-all active:scale-[0.98]"
          >
            <GitBranch className="w-5 h-5" />
            Continue with GitHub
          </button>

          <div className="pt-6 flex flex-col items-center gap-4">
            <div className="flex items-center gap-2 text-[10px] uppercase tracking-[0.2em] text-white/20">
              <Sparkles className="w-3 h-3" />
              Powered by Gemini 1.5 Pro
            </div>
          </div>
        </div>

        <p className="mt-8 text-center text-xs text-white/20">
          By continuing, you agree to the CareerOS Neural Terms of Service.
        </p>
      </motion.div>
    </div>
  );
}
