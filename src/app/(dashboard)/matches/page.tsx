"use client";

import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Briefcase, MapPin, Clock, Zap, Heart, Search, Filter,
  ExternalLink, Building2, IndianRupee, Star, Bookmark,
  BookmarkCheck, ChevronDown, Sparkles, ArrowUpRight, X, CheckCircle2
} from "lucide-react";

interface Internship {
  id: string;
  company: string;
  logo: string;
  role: string;
  location: string;
  type: "Remote" | "On-site" | "Hybrid";
  stipend: string;
  duration: string;
  match: number;
  skills: string[];
  postedDays: number;
  description: string;
  perks: string[];
}

const internships: Internship[] = [
  {
    id: "1", company: "Google", logo: "G", role: "Software Engineering Intern",
    location: "Bangalore", type: "Hybrid", stipend: "₹80,000/mo", duration: "6 months",
    match: 96, skills: ["React", "TypeScript", "System Design", "DSA"],
    postedDays: 1, description: "Join the Google Cloud team to build next-gen AI developer tools.",
    perks: ["Free meals", "Gym access", "Return offer"]
  },
  {
    id: "2", company: "Razorpay", logo: "R", role: "Frontend Developer Intern",
    location: "Remote", type: "Remote", stipend: "₹50,000/mo", duration: "3 months",
    match: 92, skills: ["React", "Next.js", "Tailwind CSS", "JavaScript"],
    postedDays: 2, description: "Build payment UIs used by millions of merchants across India.",
    perks: ["Laptop provided", "Flexible hours", "Pre-placement offer"]
  },
  {
    id: "3", company: "CRED", logo: "C", role: "Full Stack Intern",
    location: "Bangalore", type: "On-site", stipend: "₹60,000/mo", duration: "4 months",
    match: 88, skills: ["Node.js", "React", "PostgreSQL", "Docker"],
    postedDays: 3, description: "Work on fintech products redefining how India manages money.",
    perks: ["Snacks & meals", "Team outings", "Mentorship"]
  },
  {
    id: "4", company: "Microsoft", logo: "M", role: "Cloud Engineering Intern",
    location: "Hyderabad", type: "Hybrid", stipend: "₹75,000/mo", duration: "6 months",
    match: 85, skills: ["Azure", "Python", "Kubernetes", "CI/CD"],
    postedDays: 5, description: "Build scalable cloud infrastructure for Azure AI services.",
    perks: ["Certification support", "Return offer", "Global exposure"]
  },
  {
    id: "5", company: "Flipkart", logo: "F", role: "Backend Developer Intern",
    location: "Bangalore", type: "On-site", stipend: "₹55,000/mo", duration: "3 months",
    match: 82, skills: ["Java", "Spring Boot", "Microservices", "Redis"],
    postedDays: 4, description: "Scale India's largest e-commerce backend serving 400M+ users.",
    perks: ["Employee discounts", "Gym", "PPO opportunity"]
  },
  {
    id: "6", company: "Notion", logo: "N", role: "Product Engineering Intern",
    location: "Remote", type: "Remote", stipend: "₹70,000/mo", duration: "4 months",
    match: 79, skills: ["React", "TypeScript", "GraphQL", "Figma"],
    postedDays: 7, description: "Shape the future of productivity tools used by millions globally.",
    perks: ["Async culture", "Home setup budget", "Global team"]
  },
];

const filterOptions = {
  type: ["All", "Remote", "On-site", "Hybrid"],
  sort: ["Match %", "Stipend", "Recent"],
};

export default function MatchesPage() {
  const [saved, setSaved] = useState<Set<string>>(new Set());
  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState("All");
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [isApplying, setIsApplying] = useState(false);
  const [applicationStatus, setApplicationStatus] = useState<"idle" | "submitting" | "success">("idle");

  const filtered = useMemo(() => {
    let list = internships;
    if (search) list = list.filter(i =>
      i.role.toLowerCase().includes(search.toLowerCase()) ||
      i.company.toLowerCase().includes(search.toLowerCase()) ||
      i.skills.some(s => s.toLowerCase().includes(search.toLowerCase()))
    );
    if (typeFilter !== "All") list = list.filter(i => i.type === typeFilter);
    return list.sort((a, b) => b.match - a.match);
  }, [search, typeFilter]);

  const toggleSave = (id: string) => {
    setSaved(prev => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

  const handleApply = async () => {
    setApplicationStatus("submitting");
    // Simulate network request
    await new Promise(resolve => setTimeout(resolve, 1500));
    setApplicationStatus("success");
    setTimeout(() => {
      setSelectedId(null);
      setIsApplying(false);
      setApplicationStatus("idle");
    }, 2000);
  };

  const selected = internships.find(i => i.id === selectedId);

  const getMatchColor = (m: number) => {
    if (m >= 90) return "#22c55e";
    if (m >= 80) return "#EE1C25";
    if (m >= 70) return "#f59e0b";
    return "#6b7280";
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-3xl md:text-4xl font-black tracking-tighter flex items-center gap-3">
          <Briefcase className="w-8 h-8 text-rcb-red" />
          Internship <span className="text-rcb-red">Match Engine</span>
        </h1>
        <p className="text-sm text-white/40 mt-2">AI-curated opportunities ranked by your profile compatibility</p>
      </motion.div>

      {/* Search + Filters */}
      <div className="flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
          <input
            value={search} onChange={e => setSearch(e.target.value)}
            placeholder="Search roles, companies, or skills..."
            className="w-full bg-white/5 border border-white/5 rounded-2xl py-3 pl-12 pr-4 text-sm focus:outline-none focus:border-rcb-red/50 transition-all"
          />
        </div>
        <div className="flex gap-2 flex-wrap">
          {filterOptions.type.map(t => (
            <button key={t} onClick={() => setTypeFilter(t)}
              className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all ${
                typeFilter === t
                  ? "bg-rcb-red text-white shadow-[0_0_15px_rgba(238,28,37,0.3)]"
                  : "bg-white/5 text-white/40 hover:text-white border border-white/5"
              }`}
            >{t}</button>
          ))}
        </div>
      </div>

      {/* Stats Bar */}
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }}
        className="grid grid-cols-2 md:grid-cols-4 gap-4"
      >
        {[
          { label: "Total Matches", value: filtered.length, icon: Zap },
          { label: "Avg Match", value: `${Math.round(filtered.reduce((a, b) => a + b.match, 0) / (filtered.length || 1))}%`, icon: Star },
          { label: "Saved", value: saved.size, icon: Bookmark },
          { label: "New Today", value: filtered.filter(i => i.postedDays <= 1).length, icon: Sparkles },
        ].map((s, i) => (
          <div key={s.label} className="glass rounded-2xl p-4 flex items-center gap-3 group hover:border-rcb-red/20 transition-all"
            style={{ perspective: "600px" }}
          >
            <div className="w-10 h-10 rounded-xl bg-rcb-red/10 flex items-center justify-center group-hover:bg-rcb-red/20 transition-all"
              style={{ transform: "rotateY(-5deg)", transformStyle: "preserve-3d" }}
            >
              <s.icon className="w-5 h-5 text-rcb-red" />
            </div>
            <div>
              <p className="text-xl font-black text-white">{s.value}</p>
              <p className="text-[10px] text-white/30 uppercase tracking-widest">{s.label}</p>
            </div>
          </div>
        ))}
      </motion.div>

      {/* Cards Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <AnimatePresence>
          {filtered.map((job, i) => (
            <motion.div
              key={job.id}
              layout
              initial={{ opacity: 0, y: 20, rotateX: 5 }}
              animate={{ opacity: 1, y: 0, rotateX: 0 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ delay: i * 0.05 }}
              onClick={() => setSelectedId(job.id)}
              className="glass rounded-3xl p-6 cursor-pointer group hover:border-rcb-red/20 transition-all relative overflow-hidden"
              style={{ perspective: "800px", transformStyle: "preserve-3d" }}
            >
              {/* 3D Glow */}
              <div className="absolute -top-20 -right-20 w-40 h-40 rounded-full blur-[80px] opacity-0 group-hover:opacity-100 transition-opacity duration-700"
                style={{ backgroundColor: getMatchColor(job.match) + "30" }}
              />

              <div className="flex items-start justify-between mb-4 relative z-10">
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 rounded-2xl bg-white/5 flex items-center justify-center font-black text-2xl group-hover:bg-rcb-red group-hover:text-white transition-all duration-500"
                    style={{ transform: "translateZ(20px)", transformStyle: "preserve-3d" }}
                  >
                    {job.logo}
                  </div>
                  <div>
                    <h3 className="font-bold text-white group-hover:text-rcb-red transition-colors">{job.role}</h3>
                    <p className="text-xs text-white/40 flex items-center gap-1.5 mt-1">
                      <Building2 className="w-3 h-3" /> {job.company}
                    </p>
                  </div>
                </div>
                <button onClick={(e) => { e.stopPropagation(); toggleSave(job.id); }}
                  className="p-2 rounded-lg hover:bg-white/5 transition-colors z-20"
                >
                  {saved.has(job.id) ? <BookmarkCheck className="w-5 h-5 text-rcb-red fill-rcb-red" /> : <Bookmark className="w-5 h-5 text-white/20" />}
                </button>
              </div>

              <p className="text-xs text-white/40 mb-4 leading-relaxed line-clamp-2">{job.description}</p>

              <div className="flex flex-wrap gap-2 mb-4">
                {job.skills.slice(0, 4).map(s => (
                  <span key={s} className="px-2.5 py-1 rounded-lg bg-white/5 text-[10px] font-bold text-white/50 border border-white/5">{s}</span>
                ))}
              </div>

              <div className="flex items-center justify-between pt-4 border-t border-white/5">
                <div className="flex gap-4 text-[10px] text-white/30">
                  <span className="flex items-center gap-1"><MapPin className="w-3 h-3" />{job.location}</span>
                  <span className="flex items-center gap-1"><Clock className="w-3 h-3" />{job.duration}</span>
                  <span className="flex items-center gap-1"><IndianRupee className="w-3 h-3" />{job.stipend}</span>
                </div>

                {/* 3D Match Badge */}
                <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl font-black text-sm"
                  style={{
                    backgroundColor: getMatchColor(job.match) + "15",
                    color: getMatchColor(job.match),
                    boxShadow: `0 0 15px ${getMatchColor(job.match)}20`,
                    transform: "translateZ(10px)",
                  }}
                >
                  <Zap className="w-3 h-3" style={{ fill: getMatchColor(job.match) }} />
                  {job.match}%
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {filtered.length === 0 && (
        <div className="text-center py-20 text-white/20">
          <Search className="w-12 h-12 mx-auto mb-4" />
          <p className="text-lg font-bold">No matches found</p>
          <p className="text-sm">Try adjusting your search or filters</p>
        </div>
      )}

      {/* Detail Modal */}
      <AnimatePresence>
        {selected && (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm"
            onClick={() => { setSelectedId(null); setIsApplying(false); setApplicationStatus("idle"); }}
          >
            <motion.div
              initial={{ scale: 0.9, rotateX: 10 }} animate={{ scale: 1, rotateX: 0 }} exit={{ scale: 0.9 }}
              onClick={e => e.stopPropagation()}
              className="glass-dark rounded-3xl p-8 max-w-lg w-full border border-white/10 relative overflow-hidden"
              style={{ perspective: "1000px", transformStyle: "preserve-3d" }}
            >
              <div className="absolute -top-20 -right-20 w-60 h-60 rounded-full blur-[100px]"
                style={{ backgroundColor: getMatchColor(selected.match) + "20" }}
              />
              <button onClick={() => { setSelectedId(null); setIsApplying(false); setApplicationStatus("idle"); }} className="absolute top-4 right-4 p-2 rounded-lg hover:bg-white/10 z-20">
                <X className="w-5 h-5 text-white/40" />
              </button>

              <div className="flex items-center gap-4 mb-6 relative z-10">
                <div className="w-16 h-16 rounded-2xl bg-rcb-red flex items-center justify-center font-black text-3xl text-white shadow-[0_0_30px_rgba(238,28,37,0.4)]">
                  {selected.logo}
                </div>
                <div>
                  <h2 className="text-xl font-black text-white">{selected.role}</h2>
                  <p className="text-sm text-white/40">{selected.company} • {selected.location}</p>
                </div>
              </div>

              {!isApplying ? (
                <>
                  <div className="flex items-center gap-3 mb-6">
                    <div className="px-4 py-2 rounded-xl font-black text-lg"
                      style={{ backgroundColor: getMatchColor(selected.match) + "15", color: getMatchColor(selected.match) }}
                    >
                      {selected.match}% Match
                    </div>
                    <span className="px-3 py-1.5 rounded-lg bg-white/5 text-xs font-bold text-white/50">{selected.type}</span>
                    <span className="px-3 py-1.5 rounded-lg bg-white/5 text-xs font-bold text-white/50">{selected.stipend}</span>
                  </div>

                  <p className="text-sm text-white/60 mb-6 leading-relaxed">{selected.description}</p>

                  <div className="mb-6">
                    <h4 className="text-xs font-bold text-white/30 uppercase tracking-widest mb-3">Required Skills</h4>
                    <div className="flex flex-wrap gap-2">
                      {selected.skills.map(s => (
                        <span key={s} className="px-3 py-1.5 rounded-lg bg-rcb-red/10 text-xs font-bold text-rcb-red border border-rcb-red/20">{s}</span>
                      ))}
                    </div>
                  </div>

                  <div className="mb-8">
                    <h4 className="text-xs font-bold text-white/30 uppercase tracking-widest mb-3">Perks</h4>
                    <div className="flex flex-wrap gap-2">
                      {selected.perks.map(p => (
                        <span key={p} className="px-3 py-1.5 rounded-lg bg-green-500/10 text-xs font-bold text-green-400 border border-green-500/20">{p}</span>
                      ))}
                    </div>
                  </div>

                  <div className="flex gap-3">
                    <button 
                      onClick={() => setIsApplying(true)}
                      className="flex-1 py-3.5 rounded-xl bg-rcb-red text-white font-black text-sm shadow-[0_0_30px_rgba(238,28,37,0.3)] hover:shadow-[0_0_50px_rgba(238,28,37,0.5)] transition-all flex items-center justify-center gap-2">
                      Apply Now <ArrowUpRight className="w-4 h-4" />
                    </button>
                    <button onClick={() => toggleSave(selected.id)}
                      className="px-6 py-3.5 rounded-xl glass border-white/10 font-bold text-sm hover:bg-white/10 transition-all"
                    >
                      {saved.has(selected.id) ? "Saved ✓" : "Save"}
                    </button>
                  </div>
                </>
              ) : (
                <div className="space-y-4">
                  {applicationStatus === "success" ? (
                    <div className="flex flex-col items-center justify-center py-10 space-y-4">
                      <div className="w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center">
                        <CheckCircle2 className="w-8 h-8 text-green-500" />
                      </div>
                      <h3 className="text-xl font-black text-white">Application Sent!</h3>
                      <p className="text-sm text-white/50 text-center">Your profile and resume have been securely shared with {selected.company}.</p>
                    </div>
                  ) : (
                    <>
                      <div>
                        <label className="text-xs font-bold text-white/50 uppercase tracking-wider mb-2 block">Resume Link (Optional)</label>
                        <input type="text" placeholder="https://your-portfolio.com" className="w-full bg-white/5 border border-white/10 rounded-xl p-3 text-white placeholder:text-white/20 focus:outline-none focus:border-rcb-red/50 text-sm" />
                      </div>
                      <div>
                        <label className="text-xs font-bold text-white/50 uppercase tracking-wider mb-2 block">Why should we hire you?</label>
                        <textarea rows={4} placeholder="I am a great fit because..." className="w-full bg-white/5 border border-white/10 rounded-xl p-3 text-white placeholder:text-white/20 focus:outline-none focus:border-rcb-red/50 text-sm resize-none" />
                      </div>
                      <div className="pt-2">
                        <button 
                          onClick={handleApply}
                          disabled={applicationStatus === "submitting"}
                          className="w-full py-3.5 rounded-xl bg-rcb-red text-white font-black text-sm shadow-[0_0_30px_rgba(238,28,37,0.3)] hover:shadow-[0_0_50px_rgba(238,28,37,0.5)] transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                        >
                          {applicationStatus === "submitting" ? "Submitting..." : "Submit Application"}
                        </button>
                      </div>
                    </>
                  )}
                </div>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
