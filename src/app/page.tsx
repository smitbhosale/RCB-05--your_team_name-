import { Navbar } from "@/components/landing/Navbar";
import { Hero } from "@/components/landing/Hero";
import { Features } from "@/components/landing/Features";
import { AgentDemo } from "@/components/landing/AgentDemo";
import { Stats } from "@/components/landing/Stats";
import { Testimonials } from "@/components/landing/Testimonials";
import { CTA } from "@/components/landing/CTA";
import { Footer } from "@/components/landing/Footer";

export default function LandingPage() {
  return (
    <main className="min-h-screen bg-[#030303] text-white selection:bg-rcb-red selection:text-white">
      <Navbar />
      <Hero />
      <Stats />
      <Features />
      <AgentDemo />
      <Testimonials />
      <CTA />
      <Footer />
    </main>
  );
}
