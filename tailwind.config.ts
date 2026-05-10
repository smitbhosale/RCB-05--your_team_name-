import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        rcb: {
          red: "#EE1C25",
          dark: "#0F0F0F",
          "red-glow": "rgba(238, 28, 37, 0.5)",
        },
      },
      animation: {
        "pulse-slow": "pulse 6s cubic-bezier(0.4, 0, 0.6, 1) infinite",
        "spin-slow": "spin 8s linear infinite",
        float: "float 6s ease-in-out infinite",
        "float-3d": "float-3d 8s ease-in-out infinite",
        morph: "morph 12s ease-in-out infinite",
        orbit: "orbit 15s linear infinite",
      },
      backgroundImage: {
        "grid-pattern": "radial-gradient(circle, rgba(238, 28, 37, 0.05) 1px, transparent 1px)",
      },
      borderRadius: {
        "4xl": "2rem",
      },
    },
  },
  plugins: [],
};
export default config;
