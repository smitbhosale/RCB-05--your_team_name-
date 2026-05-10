"use client";

import { motion } from "framer-motion";
import { useAuth } from "@/context/AuthContext";
import { Bot, Cpu, GitBranch, Globe, Sparkles } from "lucide-react";
import Link from "next/link";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const { user, loginWithGoogle, loginWithGithub } = useAuth();
  const router = useRouter();

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
