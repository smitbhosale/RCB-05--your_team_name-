export default function RootLoading() {
  return (
    <div
      className="fixed inset-0 bg-[#030303] flex items-center justify-center z-[9999]"
      role="status"
      aria-label="Loading RCB CareerOS"
    >
      <div className="text-center">
        {/* 3D Rotating Cube Loader */}
        <div className="relative w-20 h-20 mx-auto mb-6" style={{ perspective: "200px" }}>
          <div
            className="w-full h-full"
            style={{
              transformStyle: "preserve-3d",
              animation: "cube-spin 2s ease-in-out infinite",
            }}
          >
            <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-[#EE1C25] to-[#ff6b6b] shadow-[0_0_40px_rgba(238,28,37,0.4)]"
              style={{ transform: "translateZ(10px)" }}
            />
            <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-[#EE1C25]/50 to-transparent border border-[#EE1C25]/30"
              style={{ transform: "translateZ(-10px)" }}
            />
          </div>
        </div>

        {/* Pulsing text */}
        <div className="space-y-2">
          <p className="text-xs font-black text-white/30 tracking-[0.4em] uppercase animate-pulse">
            Initializing CareerOS
          </p>
          <div className="flex items-center justify-center gap-1.5">
            {[0, 1, 2].map((i) => (
              <div
                key={i}
                className="w-1.5 h-1.5 rounded-full bg-[#EE1C25]"
                style={{
                  animation: `bounce 1s ease-in-out ${i * 0.15}s infinite`,
                }}
              />
            ))}
          </div>
        </div>

        <span className="sr-only">Loading application...</span>
      </div>

      <style>{`
        @keyframes cube-spin {
          0%, 100% { transform: rotateX(0) rotateY(0); }
          25% { transform: rotateX(15deg) rotateY(90deg); }
          50% { transform: rotateX(0) rotateY(180deg); }
          75% { transform: rotateX(-15deg) rotateY(270deg); }
        }
        @keyframes bounce {
          0%, 80%, 100% { transform: scale(0.6); opacity: 0.3; }
          40% { transform: scale(1); opacity: 1; }
        }
      `}</style>
    </div>
  );
}
