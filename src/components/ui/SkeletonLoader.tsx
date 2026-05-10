"use client";

import { cn } from "@/lib/utils";

interface SkeletonProps {
  className?: string;
  variant?: "rectangular" | "circular" | "text";
  lines?: number;
}

export const Skeleton = ({ className, variant = "rectangular" }: SkeletonProps) => {
  const base = variant === "circular" ? "skeleton-circle" : variant === "text" ? "skeleton-text" : "skeleton";
  return <div className={cn(base, className)} role="presentation" aria-label="Loading..." />;
};

/* ── Pre-built Skeleton Layouts ── */

export const DashboardSkeleton = () => (
  <div className="space-y-8 page-enter" role="status" aria-label="Loading dashboard">
    {/* Header */}
    <div className="flex items-center gap-3">
      <Skeleton className="w-8 h-8 rounded-lg" />
      <Skeleton className="w-48 h-8 rounded-lg" />
    </div>

    {/* Banner */}
    <Skeleton className="w-full h-40 rounded-[32px]" />

    {/* Stats row */}
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      {Array.from({ length: 4 }).map((_, i) => (
        <div key={i} className="glass rounded-2xl p-6">
          <Skeleton className="w-8 h-8 rounded-lg mb-3" />
          <Skeleton className="w-20 h-7 rounded-md mb-2" />
          <Skeleton className="w-16 h-3 rounded-md" />
        </div>
      ))}
    </div>

    {/* Main content */}
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      {Array.from({ length: 3 }).map((_, i) => (
        <div key={i} className="glass rounded-3xl p-8 space-y-4">
          <Skeleton className="w-32 h-4 rounded-md" />
          <Skeleton className="w-full h-40 rounded-xl" />
          <Skeleton className="w-3/4 h-3 rounded-md" />
          <Skeleton className="w-1/2 h-3 rounded-md" />
        </div>
      ))}
    </div>
    <span className="sr-only">Loading...</span>
  </div>
);

export const CardSkeleton = () => (
  <div className="glass rounded-3xl p-6 space-y-4" role="presentation">
    <div className="flex items-center gap-4">
      <Skeleton className="w-14 h-14 rounded-2xl" />
      <div className="flex-1 space-y-2">
        <Skeleton className="w-40 h-4 rounded-md" />
        <Skeleton className="w-24 h-3 rounded-md" />
      </div>
    </div>
    <Skeleton className="w-full h-3 rounded-md" />
    <Skeleton className="w-3/4 h-3 rounded-md" />
    <div className="flex gap-2">
      {Array.from({ length: 3 }).map((_, i) => (
        <Skeleton key={i} className="w-16 h-6 rounded-lg" />
      ))}
    </div>
  </div>
);

export const ListSkeleton = ({ count = 4 }: { count?: number }) => (
  <div className="space-y-4" role="status" aria-label="Loading content">
    {Array.from({ length: count }).map((_, i) => (
      <div key={i} className="flex items-center gap-4 p-4 glass rounded-2xl">
        <Skeleton variant="circular" className="w-10 h-10" />
        <div className="flex-1 space-y-2">
          <Skeleton className="w-3/4 h-4 rounded-md" />
          <Skeleton className="w-1/2 h-3 rounded-md" />
        </div>
        <Skeleton className="w-16 h-8 rounded-lg" />
      </div>
    ))}
    <span className="sr-only">Loading...</span>
  </div>
);

export const AnalyzerSkeleton = () => (
  <div className="space-y-8 page-enter" role="status" aria-label="Loading analyzer">
    <div className="glass rounded-3xl p-10 space-y-6">
      <div className="flex items-center gap-3">
        <Skeleton className="w-8 h-8 rounded-lg" />
        <Skeleton className="w-56 h-8 rounded-lg" />
      </div>
      <Skeleton className="w-full h-48 rounded-2xl" />
      <div className="flex gap-4">
        <Skeleton className="w-32 h-10 rounded-xl" />
        <Skeleton className="w-32 h-10 rounded-xl" />
      </div>
    </div>
    <span className="sr-only">Loading...</span>
  </div>
);
