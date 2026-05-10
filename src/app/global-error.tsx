"use client";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-[#030303] text-white flex items-center justify-center p-6">
        <div className="text-center max-w-md">
          <div className="w-16 h-16 mx-auto mb-6 rounded-2xl bg-red-500/10 flex items-center justify-center">
            <span className="text-3xl">⚠️</span>
          </div>
          <h1 className="text-2xl font-black mb-3">Something went wrong</h1>
          <p className="text-sm text-white/40 mb-6 leading-relaxed">
            {error.message || "An unexpected error occurred. Our AI systems are recalibrating."}
          </p>
          <button
            onClick={reset}
            className="px-8 py-3 rounded-xl bg-[#EE1C25] text-white font-bold text-sm shadow-[0_0_20px_rgba(238,28,37,0.3)] hover:shadow-[0_0_40px_rgba(238,28,37,0.5)] transition-all"
          >
            Try Again
          </button>
        </div>
      </body>
    </html>
  );
}
