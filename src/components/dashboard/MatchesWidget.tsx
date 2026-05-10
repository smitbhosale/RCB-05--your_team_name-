"use client";

import { motion } from "framer-motion";
import { ExternalLink, Zap } from "lucide-react";
import Link from "next/link";

const matches = [
  { company: "Google", role: "Software Engineering Intern", match: 96, location: "Bangalore", logo: "G" },
  { company: "Razorpay", role: "Frontend Developer Trainee", match: 92, location: "Remote", logo: "R" },
  { company: "CRED", role: "Backend Intern", match: 88, location: "Bangalore", logo: "C" },
];

export const MatchesWidget = () => {
  return (
    <div className="glass rounded-3xl p-8 h-full">
      <div className="flex items-center justify-between mb-8">
        <h3 className="text-sm font-bold tracking-widest text-white/40 uppercase">Top Matches</h3>
        <span className="text-[10px] font-bold text-rcb-red bg-rcb-red/10 px-2 py-1 rounded">3 NEW</span>
      </div>

      <div className="space-y-6">
        {matches.map((job, i) => (
          <motion.div
            key={job.company}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.1 }}
            className="group flex items-center justify-between p-4 rounded-2xl border border-white/5 hover:border-rcb-red/30 hover:bg-white/5 transition-all cursor-pointer"
            onClick={() => window.location.href = '/matches'}
          >
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-white/5 flex items-center justify-center font-black text-xl group-hover:bg-rcb-red group-hover:text-white transition-colors">
                {job.logo}
              </div>
              <div>
                <h4 className="text-sm font-bold text-white group-hover:text-rcb-red transition-colors">{job.role}</h4>
                <p className="text-xs text-white/40">{job.company} • {job.location}</p>
              </div>
            </div>
            <div className="text-right">
              <div className="flex items-center gap-1 text-rcb-red font-black text-lg mb-1">
                <Zap className="w-3 h-3 fill-rcb-red" />
                {job.match}%
              </div>
              <ExternalLink className="w-3 h-3 text-white/20 ml-auto group-hover:text-white transition-colors" />
            </div>
          </motion.div>
        ))}
      </div>

      <Link href="/matches" className="block w-full mt-8 py-3 rounded-xl border border-white/10 text-white/60 font-bold text-xs hover:bg-white/5 hover:text-white transition-all text-center">
        VIEW ALL MATCHES
      </Link>
    </div>
  );
};
