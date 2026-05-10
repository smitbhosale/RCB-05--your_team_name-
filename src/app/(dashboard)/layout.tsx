"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { Sidebar } from "@/components/dashboard/Sidebar";
import { DashboardHeader } from "@/components/dashboard/DashboardHeader";
import { OnboardingWizard } from "@/components/auth/OnboardingWizard";
import { MemoryService } from "@/lib/memory";
import { Loader2 } from "lucide-react";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [onboarded, setOnboarded] = useState<boolean | null>(null);

  useEffect(() => {
    if (!loading && !user) {
      router.push("/login");
    } else if (user) {
      checkOnboarding();
    }
  }, [user, loading, router]);

  const checkOnboarding = async () => {
    if (user) {
      const isDone = await MemoryService.isOnboarded(user.uid);
      setOnboarded(isDone);
    }
  };

  if (loading || (user && onboarded === null)) {
    return (
      <div className="min-h-screen bg-black flex flex-col items-center justify-center space-y-4">
        <Loader2 className="w-10 h-10 text-rcb-red animate-spin" />
        <p className="text-[10px] uppercase tracking-[0.2em] text-white/20 font-black">Syncing Neural OS...</p>
      </div>
    );
  }

  if (!user) return null;

  return (
    <div className="flex min-h-screen bg-[#030303] text-white">
      {/* Onboarding Wizard Overlay */}
      {onboarded === false && (
        <OnboardingWizard onComplete={() => setOnboarded(true)} />
      )}

      {/* Fixed Sidebar */}
      <Sidebar />

      {/* Main Content */}
      <main className="flex-1 flex flex-col md:pl-64" role="main">
        <DashboardHeader />
        <div className="p-3 pt-16 sm:p-4 sm:pt-16 md:pt-6 md:p-8 lg:p-10 flex-1">
          {children}
        </div>
      </main>
    </div>
  );
}
