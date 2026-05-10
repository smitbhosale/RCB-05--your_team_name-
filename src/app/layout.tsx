import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import { Chatbot } from "@/components/ui/Chatbot";
import { AuthProvider } from "@/context/AuthContext";
import { ThreeBackground } from "@/components/ui/ThreeBackground";
import "./globals.css";


const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
  preload: true,
});

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  themeColor: "#030303",
  colorScheme: "dark",
};

export const metadata: Metadata = {
  title: "RCB CareerOS — AI-Powered Career Operating System",
  description:
    "The autonomous AI platform for students. Resume analysis, internship matching, mock interviews, and career growth — all powered by Gemini AI.",
  keywords: [
    "AI career platform",
    "resume analyzer",
    "internship matcher",
    "mock interview AI",
    "career roadmap",
    "ATS score",
    "RCB CareerOS",
  ],
  authors: [{ name: "RCB CareerOS" }],
  openGraph: {
    title: "RCB CareerOS — AI Career Operating System",
    description: "Your autonomous AI co-pilot for career domination.",
    type: "website",
    locale: "en_US",
    siteName: "RCB CareerOS",
  },
  twitter: {
    card: "summary_large_image",
    title: "RCB CareerOS — AI Career Operating System",
    description: "Your autonomous AI co-pilot for career domination.",
  },
  robots: { index: true, follow: true },
  metadataBase: new URL("https://rcbcareeros.com"),
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${inter.variable} h-full antialiased`} suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      </head>
      <body className="min-h-full flex flex-col font-[var(--font-inter)]">
        <AuthProvider>
          <ThreeBackground />
          <div id="main-content">
            {children}
          </div>

          <Chatbot />
        </AuthProvider>
      </body>

    </html>
  );
}
