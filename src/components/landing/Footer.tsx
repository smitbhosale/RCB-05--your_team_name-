"use client";

import { Cpu, Code, Globe, Share2, ExternalLink } from "lucide-react";
import Link from "next/link";

export const Footer = () => (
  <footer className="py-16 sm:py-20 border-t border-white/5 bg-black relative" role="contentinfo">
    <div className="absolute inset-0 grid-bg opacity-10" aria-hidden="true" />
    <div className="container mx-auto px-4 sm:px-6 relative z-10">
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-10 sm:gap-12 mb-12 sm:mb-16">
        <div className="col-span-1 sm:col-span-2">
          <div className="flex items-center gap-2 mb-5 sm:mb-6">
            <div className="w-8 h-8 rounded-lg bg-rcb-red flex items-center justify-center shadow-[0_0_15px_rgba(238,28,37,0.3)]">
              <Cpu className="text-white w-5 h-5" aria-hidden="true" />
            </div>
            <span className="text-lg sm:text-xl font-bold tracking-tighter text-white">
              RCB <span className="text-rcb-red">CareerOS</span>
            </span>
          </div>
          <p className="text-white/40 max-w-sm mb-6 sm:mb-8 leading-relaxed text-sm">
            The next generation of career development. Autonomous, intelligent,
            and built for the modern student.
          </p>
          <div className="flex gap-3">
            {[
              { Icon: Code, label: "GitHub" },
              { Icon: Globe, label: "Website" },
              { Icon: Share2, label: "Share" },
              { Icon: ExternalLink, label: "External" },
            ].map(({ Icon, label }) => (
              <a
                key={label}
                href="#"
                className="w-9 h-9 sm:w-10 sm:h-10 rounded-full glass flex items-center justify-center text-white/40 hover:text-rcb-red hover:border-rcb-red/30 transition-all"
                aria-label={label}
              >
                <Icon className="w-4 h-4 sm:w-5 sm:h-5" aria-hidden="true" />
              </a>
            ))}
          </div>
        </div>

        <nav aria-label="Product links">
          <h4 className="font-bold text-white mb-4 sm:mb-6 uppercase text-[10px] sm:text-xs tracking-widest">Product</h4>
          <ul className="space-y-3 sm:space-y-4 text-sm text-white/40">
            <li><Link href="/analyzer" className="hover:text-white transition-colors">AI Resume Analyzer</Link></li>
            <li><Link href="/agent" className="hover:text-white transition-colors">Career Agent</Link></li>
            <li><Link href="/interviews" className="hover:text-white transition-colors">Mock Interviews</Link></li>
            <li><Link href="/matches" className="hover:text-white transition-colors">Job Matching</Link></li>
          </ul>
        </nav>

        <nav aria-label="Resource links">
          <h4 className="font-bold text-white mb-4 sm:mb-6 uppercase text-[10px] sm:text-xs tracking-widest">Resources</h4>
          <ul className="space-y-3 sm:space-y-4 text-sm text-white/40">
            <li><a href="#" className="hover:text-white transition-colors">Documentation</a></li>
            <li><a href="#" className="hover:text-white transition-colors">Career Blog</a></li>
            <li><a href="#" className="hover:text-white transition-colors">API Access</a></li>
            <li><a href="#" className="hover:text-white transition-colors">Support</a></li>
          </ul>
        </nav>
      </div>

      <div className="flex flex-col sm:flex-row justify-between items-center pt-6 sm:pt-8 border-t border-white/5 text-[9px] sm:text-[10px] uppercase tracking-widest text-white/20 gap-4">
        <p>&copy; 2026 RCB CAREEROS. ALL RIGHTS RESERVED.</p>
        <div className="flex gap-6 sm:gap-8">
          <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
          <a href="#" className="hover:text-white transition-colors">Terms of Service</a>
        </div>
      </div>
    </div>
  </footer>
);
