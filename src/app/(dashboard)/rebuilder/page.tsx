"use client";

import { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  FileEdit, 
  Sparkles, 
  Target, 
  Download, 
  Zap, 
  AlertCircle,
  CheckCircle2,
  Loader2,
  FileText,
  Brain
} from "lucide-react";

import { useAuth } from "@/context/AuthContext";

interface OptimizedResume {
  personalInfo: {
    name: string;
    email: string;
    phone: string;
    linkedin: string;
    portfolio: string;
  };
  summary: string;
  skills: {
    languages: string[];
    frameworks: string[];
    tools: string[];
  };
  experience: {
    company: string;
    role: string;
    date: string;
    bullets: string[];
  }[];
  projects: {
    title: string;
    tech: string;
    date: string;
    bullets: string[];
  }[];
  education: {
    institution: string;
    degree: string;
    date: string;
    bullets: string[];
  }[];
  missingSections: string[];
}

export default function RebuilderPage() {
  const { user } = useAuth();
  const [step, setStep] = useState<"input" | "loading" | "display">("input");
  const [formData, setFormData] = useState({
    targetRole: "",
    resumeText: ""
  });
  const [resume, setResume] = useState<OptimizedResume | null>(null);
  const printRef = useRef<HTMLDivElement>(null);

  const rebuildResume = async () => {
    setStep("loading");
    try {
      const res = await fetch("/api/rebuild-resume", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData)
      });
      const data = await res.json();
      if (data.optimizedResume) {
        setResume(data.optimizedResume);
        setStep("display");
      } else {
        throw new Error(data.error || "Failed to rebuild");
      }
    } catch (err) {
      console.error(err);
      setStep("input");
      alert("Failed to rebuild resume. Please try again.");
    }
  };

  const handlePrint = () => {
    window.print();
  };

  if (step === "input") {
    return (
      <div className="max-w-4xl mx-auto space-y-8 pb-20">
        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
          <h1 className="text-3xl md:text-4xl font-black tracking-tighter flex items-center gap-3">
            <FileEdit className="w-8 h-8 text-rcb-red" />
            AI Resume <span className="text-rcb-red">Rebuilder</span>
          </h1>
          <p className="text-sm text-white/40 mt-2">Transform your raw experience into an ATS-optimized masterpiece</p>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }} 
          animate={{ opacity: 1, scale: 1 }}
          className="glass rounded-[2.5rem] p-10 border border-white/10 relative overflow-hidden"
        >
          <div className="absolute -top-20 left-0 w-80 h-80 bg-rcb-red/10 rounded-full blur-[100px]" />
          
          <div className="relative z-10 space-y-8">
            <div className="space-y-3">
              <label className="text-xs font-black uppercase tracking-widest text-rcb-red flex items-center gap-2">
                <Target className="w-4 h-4" /> Target Role
              </label>
              <input 
                value={formData.targetRole}
                onChange={e => setFormData({ ...formData, targetRole: e.target.value })}
                placeholder="e.g. Senior Frontend Engineer at Google"
                className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 text-white placeholder:text-white/20 focus:outline-none focus:border-rcb-red/50 transition-all"
              />
            </div>

            <div className="space-y-3">
              <label className="text-xs font-black uppercase tracking-widest text-rcb-red flex items-center gap-2">
                <FileText className="w-4 h-4" /> Paste Current Resume
              </label>
              <p className="text-xs text-white/40">Paste your raw resume text, bullet points, or LinkedIn profile content here. Our AI will structure and optimize it.</p>
              <textarea 
                value={formData.resumeText}
                onChange={e => setFormData({ ...formData, resumeText: e.target.value })}
                placeholder="Experience: Software Engineer at Tech Corp...\n- built a react dashboard...\n- increased speed by a lot..."
                rows={10}
                className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 text-white placeholder:text-white/20 focus:outline-none focus:border-rcb-red/50 transition-all resize-none font-mono text-sm"
              />
            </div>

            <button
              onClick={rebuildResume}
              disabled={!formData.targetRole || !formData.resumeText}
              className="w-full py-5 rounded-2xl bg-rcb-red text-white font-black text-lg shadow-[0_0_30px_rgba(238,28,37,0.4)] hover:shadow-[0_0_50px_rgba(238,28,37,0.6)] transition-all flex items-center justify-center gap-3 active:scale-[0.98] disabled:opacity-30"
            >
              <Zap className="w-6 h-6 fill-white" />
              REBUILD RESUME
            </button>
          </div>
        </motion.div>

        {/* Feature Highlights */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            { title: "ATS Optimization", desc: "Keywords and structure tailored for passing ATS filters.", icon: CheckCircle2 },
            { title: "Impact Metrics", desc: "AI rewrites bullets to highlight quantifiable impact.", icon: Sparkles },
            { title: "1-Click PDF", desc: "Generate a beautifully formatted, recruiter-ready PDF.", icon: Download },
          ].map((f, i) => (
            <motion.div
              key={f.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 * i }}
              className="glass p-6 rounded-3xl border border-white/5 space-y-3"
            >
              <div className="w-10 h-10 rounded-xl bg-rcb-red/10 flex items-center justify-center">
                <f.icon className="w-5 h-5 text-rcb-red" />
              </div>
              <h3 className="font-bold">{f.title}</h3>
              <p className="text-xs text-white/40 leading-relaxed">{f.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    );
  }

  if (step === "loading") {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-6">
        <div className="relative">
          <div className="w-24 h-24 rounded-full border-2 border-rcb-red/20 border-t-rcb-red animate-spin" />
          <div className="absolute inset-0 flex items-center justify-center">
            <Sparkles className="w-8 h-8 text-rcb-red animate-pulse" />
          </div>
        </div>
        <div className="text-center space-y-2">
          <h2 className="text-2xl font-black tracking-tight">Rewriting History...</h2>
          <p className="text-sm text-white/40 uppercase tracking-[0.2em] font-bold">Optimizing Impact Metrics</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8 pb-20">
      {/* Action Header - Hidden during print */}
      <div className="print:hidden flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-3xl font-black tracking-tighter flex items-center gap-3">
            <Sparkles className="w-8 h-8 text-green-500" />
            Resume <span className="text-green-500">Optimized</span>
          </h1>
          <p className="text-sm text-white/40 mt-2">Ready for deployment to ATS systems</p>
        </div>
        <div className="flex items-center gap-3">
          <button 
            onClick={() => setStep("input")}
            className="px-6 py-3 rounded-2xl glass border border-white/10 text-xs font-bold hover:bg-white/5 transition-all"
          >
            Edit Raw Data
          </button>
          <button 
            onClick={handlePrint}
            className="px-6 py-3 rounded-2xl bg-rcb-red text-white shadow-[0_0_20px_rgba(238,28,37,0.3)] hover:shadow-[0_0_30px_rgba(238,28,37,0.5)] text-xs font-bold transition-all flex items-center gap-2"
          >
            <Download className="w-4 h-4" /> Download PDF
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 print:block">
        
        {/* Printable Resume Container */}
        <div className="lg:col-span-8 print:col-span-12">
          {/* 
            Print styling note:
            We use a white background for the resume container.
            In print mode, background colors might be stripped by the browser unless the user enables "Print Backgrounds",
            but we force styling via tailwind print: modifiers.
          */}
          <div 
            ref={printRef}
            className="bg-white text-black p-8 sm:p-12 min-h-[1056px] w-full max-w-[816px] mx-auto shadow-2xl rounded-sm print:shadow-none print:p-0 print:m-0"
            style={{ fontFamily: "'Inter', sans-serif" }}
          >
            {/* Header */}
            <div className="text-center border-b-2 border-gray-900 pb-4 mb-6">
              <h1 className="text-3xl font-black uppercase tracking-tight text-gray-900 mb-2">
                {resume?.personalInfo.name || user?.displayName || "John Doe"}
              </h1>
              <div className="flex flex-wrap justify-center items-center gap-x-4 gap-y-1 text-sm text-gray-600 font-medium">
                {resume?.personalInfo.email && <span>{resume.personalInfo.email}</span>}
                {resume?.personalInfo.phone && <span>• {resume.personalInfo.phone}</span>}
                {resume?.personalInfo.linkedin && <span>• {resume.personalInfo.linkedin}</span>}
                {resume?.personalInfo.portfolio && <span>• {resume.personalInfo.portfolio}</span>}
              </div>
            </div>

            {/* Summary */}
            {resume?.summary && (
              <div className="mb-6">
                <p className="text-sm leading-relaxed text-gray-800">
                  {resume.summary}
                </p>
              </div>
            )}

            {/* Skills */}
            {resume?.skills && (Object.values(resume.skills).some(s => s?.length > 0)) && (
              <div className="mb-6">
                <h2 className="text-lg font-bold uppercase tracking-widest text-gray-900 border-b border-gray-300 pb-1 mb-3">Skills</h2>
                <div className="space-y-1 text-sm text-gray-800">
                  {resume.skills.languages?.length > 0 && (
                    <p><span className="font-bold">Languages:</span> {resume.skills.languages.join(", ")}</p>
                  )}
                  {resume.skills.frameworks?.length > 0 && (
                    <p><span className="font-bold">Frameworks/Libraries:</span> {resume.skills.frameworks.join(", ")}</p>
                  )}
                  {resume.skills.tools?.length > 0 && (
                    <p><span className="font-bold">Tools/Platforms:</span> {resume.skills.tools.join(", ")}</p>
                  )}
                </div>
              </div>
            )}

            {/* Experience */}
            {resume?.experience && resume.experience.length > 0 && (
              <div className="mb-6">
                <h2 className="text-lg font-bold uppercase tracking-widest text-gray-900 border-b border-gray-300 pb-1 mb-3">Experience</h2>
                <div className="space-y-4">
                  {resume.experience.map((exp, i) => (
                    <div key={i}>
                      <div className="flex justify-between items-baseline mb-1">
                        <h3 className="font-bold text-gray-900">{exp.role} <span className="font-normal italic text-gray-600">at {exp.company}</span></h3>
                        <span className="text-sm font-medium text-gray-600 whitespace-nowrap">{exp.date}</span>
                      </div>
                      <ul className="list-disc list-outside ml-4 text-sm text-gray-800 space-y-1 marker:text-gray-400">
                        {exp.bullets.map((b, bi) => (
                          <li key={bi} className="leading-snug pl-1">{b}</li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Projects */}
            {resume?.projects && resume.projects.length > 0 && (
              <div className="mb-6">
                <h2 className="text-lg font-bold uppercase tracking-widest text-gray-900 border-b border-gray-300 pb-1 mb-3">Projects</h2>
                <div className="space-y-4">
                  {resume.projects.map((proj, i) => (
                    <div key={i}>
                      <div className="flex justify-between items-baseline mb-1">
                        <h3 className="font-bold text-gray-900">{proj.title} <span className="font-normal text-gray-600 text-sm">| {proj.tech}</span></h3>
                        <span className="text-sm font-medium text-gray-600 whitespace-nowrap">{proj.date}</span>
                      </div>
                      <ul className="list-disc list-outside ml-4 text-sm text-gray-800 space-y-1 marker:text-gray-400">
                        {proj.bullets.map((b, bi) => (
                          <li key={bi} className="leading-snug pl-1">{b}</li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Education */}
            {resume?.education && resume.education.length > 0 && (
              <div>
                <h2 className="text-lg font-bold uppercase tracking-widest text-gray-900 border-b border-gray-300 pb-1 mb-3">Education</h2>
                <div className="space-y-3">
                  {resume.education.map((edu, i) => (
                    <div key={i}>
                      <div className="flex justify-between items-baseline mb-1">
                        <h3 className="font-bold text-gray-900">{edu.institution}</h3>
                        <span className="text-sm font-medium text-gray-600 whitespace-nowrap">{edu.date}</span>
                      </div>
                      <p className="text-sm text-gray-800 italic mb-1">{edu.degree}</p>
                      {edu.bullets && edu.bullets.length > 0 && (
                        <ul className="list-disc list-outside ml-4 text-sm text-gray-800 space-y-1 marker:text-gray-400">
                          {edu.bullets.map((b, bi) => (
                            <li key={bi} className="leading-snug pl-1">{b}</li>
                          ))}
                        </ul>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

          </div>
        </div>

        {/* AI Suggestions Sidebar - Hidden during print */}
        <div className="lg:col-span-4 print:hidden space-y-6">
          <div className="glass rounded-[2rem] p-8 border border-white/10 sticky top-24">
            <h3 className="text-lg font-black flex items-center gap-2 mb-6">
              <Brain className="w-5 h-5 text-rcb-red" /> AI Insights
            </h3>
            
            <div className="space-y-6">
              <div>
                <p className="text-[10px] font-black uppercase tracking-widest text-white/30 mb-3">Strengths Added</p>
                <ul className="space-y-2">
                  <li className="flex items-start gap-2 text-xs text-white/60">
                    <CheckCircle2 className="w-4 h-4 text-green-500 shrink-0" />
                    Quantified impact metrics (STAR method)
                  </li>
                  <li className="flex items-start gap-2 text-xs text-white/60">
                    <CheckCircle2 className="w-4 h-4 text-green-500 shrink-0" />
                    Injected high-value ATS keywords for {formData.targetRole}
                  </li>
                  <li className="flex items-start gap-2 text-xs text-white/60">
                    <CheckCircle2 className="w-4 h-4 text-green-500 shrink-0" />
                    Improved readability and visual hierarchy
                  </li>
                </ul>
              </div>

              {resume?.missingSections && resume.missingSections.length > 0 && (
                <div>
                  <p className="text-[10px] font-black uppercase tracking-widest text-amber-500/50 mb-3 flex items-center gap-2">
                    <AlertCircle className="w-3 h-3 text-amber-500" /> Missing Elements
                  </p>
                  <div className="p-4 rounded-2xl bg-amber-500/5 border border-amber-500/10">
                    <p className="text-xs text-amber-500/80 mb-3">
                      The AI noted that competitive resumes for this role typically include:
                    </p>
                    <ul className="space-y-2">
                      {resume.missingSections.map((m, i) => (
                        <li key={i} className="flex items-start gap-2 text-xs text-white/60">
                          <div className="w-1.5 h-1.5 rounded-full bg-amber-500 mt-1.5 shrink-0" />
                          {m}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

      </div>

      {/* Global CSS for printing the resume properly */}
      <style dangerouslySetInnerHTML={{__html: `
        @media print {
          body * {
            visibility: hidden;
          }
          #main-content, #main-content * {
            visibility: visible;
          }
          .print\\:hidden {
            display: none !important;
          }
          .glass, .glass-dark {
            background: none !important;
            border: none !important;
            box-shadow: none !important;
          }
          .bg-black {
            background-color: white !important;
          }
          /* Attempt to position the resume container at the top left of the printed page */
          .bg-white.text-black {
            position: absolute;
            left: 0;
            top: 0;
            width: 100%;
            margin: 0 !important;
            padding: 0 !important;
            box-shadow: none !important;
          }
        }
      `}} />
    </div>
  );
}

