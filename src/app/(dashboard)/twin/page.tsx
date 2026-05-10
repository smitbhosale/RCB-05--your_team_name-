"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { 
  BrainCircuit, Target, TrendingUp, Zap, Activity,
  AlertTriangle, Shield, CheckCircle2, Hexagon
} from "lucide-react";
import { 
  Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, 
  ResponsiveContainer, LineChart, Line, XAxis, YAxis, Tooltip as RechartsTooltip, CartesianGrid
} from "recharts";
import { useAuth } from "@/context/AuthContext";
import { Tilt3D } from "@/components/ui/Tilt3D";

// Mock Data for the Twin
const radarData = [
  { subject: 'Algorithms', A: 85, fullMark: 100 },
  { subject: 'System Design', A: 65, fullMark: 100 },
  { subject: 'Frontend', A: 90, fullMark: 100 },
  { subject: 'Backend', A: 75, fullMark: 100 },
  { subject: 'Communication', A: 95, fullMark: 100 },
  { subject: 'Leadership', A: 70, fullMark: 100 },
];

const trendData = [
  { name: 'Jan', readiness: 45, confidence: 50 },
  { name: 'Feb', readiness: 55, confidence: 52 },
  { name: 'Mar', readiness: 65, confidence: 60 },
  { name: 'Apr', readiness: 70, confidence: 75 },
  { name: 'May', readiness: 85, confidence: 82 },
  { name: 'Jun', readiness: 92, confidence: 90 },
];

export default function CareerTwinPage() {
  const { user } = useAuth();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <div className="space-y-8 pb-20 max-w-6xl mx-auto">
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-3xl font-black tracking-tighter flex items-center gap-3">
            <Hexagon className="w-8 h-8 text-rcb-red" />
            AI Career <span className="text-rcb-red">Twin</span>
          </h1>
          <p className="text-sm text-white/40 mt-2">Your digital intelligence profile & predictive analytics</p>
        </div>
        <div className="flex items-center gap-2 text-rcb-red bg-rcb-red/10 px-4 py-2 rounded-xl text-xs font-bold border border-rcb-red/20">
          <Activity className="w-4 h-4 animate-pulse" /> Syncing Neural Data
        </div>
      </motion.div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left Column: 3D Twin & Stats */}
        <div className="lg:col-span-4 space-y-8">
          {/* Twin Visualizer */}
          <Tilt3D intensity={10}>
            <div className="glass-premium rounded-[2.5rem] p-8 relative overflow-hidden flex flex-col items-center justify-center min-h-[350px] border border-white/10 group">
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-rcb-red/20 via-transparent to-transparent opacity-50 group-hover:opacity-80 transition-opacity" />
              
              {/* Spinning Orb */}
              <div className="relative w-40 h-40 flex items-center justify-center">
                <div className="absolute inset-0 rounded-full border-4 border-dashed border-rcb-red/30 animate-[spin_10s_linear_infinite]" />
                <div className="absolute inset-2 rounded-full border-2 border-rcb-red/20 animate-[spin_7s_linear_infinite_reverse]" />
                <div className="absolute inset-8 rounded-full bg-gradient-to-br from-rcb-red to-red-900 shadow-[0_0_50px_rgba(238,28,37,0.5)] animate-pulse flex items-center justify-center">
                  <BrainCircuit className="w-10 h-10 text-white" />
                </div>
              </div>

              <div className="relative z-10 mt-8 text-center w-full">
                <p className="text-[10px] font-black uppercase tracking-[0.2em] text-rcb-red mb-2">Subject Identification</p>
                <h3 className="text-2xl font-black">{user?.displayName || "Alpha-01"}</h3>
                <div className="flex items-center justify-center gap-2 mt-4">
                  <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                  <span className="text-xs font-mono text-white/50">Neural Link Active</span>
                </div>
              </div>
            </div>
          </Tilt3D>

          {/* Predictive Stats */}
          <div className="grid grid-cols-2 gap-4">
            <div className="glass rounded-3xl p-5 border border-white/5 relative overflow-hidden">
              <div className="absolute -right-4 -top-4 w-16 h-16 rounded-full bg-green-500/10 blur-[20px]" />
              <Target className="w-5 h-5 text-green-400 mb-3" />
              <p className="text-3xl font-black text-white">92%</p>
              <p className="text-[9px] font-bold uppercase tracking-widest text-white/40 mt-1">Career Readiness</p>
            </div>
            <div className="glass rounded-3xl p-5 border border-white/5 relative overflow-hidden">
              <div className="absolute -right-4 -top-4 w-16 h-16 rounded-full bg-blue-500/10 blur-[20px]" />
              <Zap className="w-5 h-5 text-blue-400 mb-3" />
              <p className="text-3xl font-black text-white">87%</p>
              <p className="text-[9px] font-bold uppercase tracking-widest text-white/40 mt-1">Interview Success Prob.</p>
            </div>
          </div>
        </div>

        {/* Right Column: Graphs & Analysis */}
        <div className="lg:col-span-8 space-y-8">
          
          {/* Radar Chart & Strengths */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="glass rounded-[2rem] p-6 border border-white/10 flex flex-col items-center">
              <h3 className="text-sm font-black uppercase tracking-widest text-white/60 mb-6 self-start w-full text-center">Skill Matrix</h3>
              <div className="w-full h-[250px]">
                <ResponsiveContainer width="100%" height="100%">
                  <RadarChart cx="50%" cy="50%" outerRadius="70%" data={radarData}>
                    <PolarGrid stroke="rgba(255,255,255,0.1)" />
                    <PolarAngleAxis dataKey="subject" tick={{ fill: 'rgba(255,255,255,0.4)', fontSize: 10, fontWeight: 'bold' }} />
                    <Radar name="Student" dataKey="A" stroke="#EE1C25" fill="#EE1C25" fillOpacity={0.3} />
                    <RechartsTooltip 
                      contentStyle={{ backgroundColor: 'rgba(0,0,0,0.8)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px' }}
                      itemStyle={{ color: '#fff', fontSize: '12px', fontWeight: 'bold' }}
                    />
                  </RadarChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div className="space-y-4">
              <div className="glass rounded-3xl p-6 border border-white/5">
                <h3 className="text-[10px] font-black uppercase tracking-widest text-green-400 flex items-center gap-2 mb-4">
                  <Shield className="w-4 h-4" /> Dominant Strengths
                </h3>
                <ul className="space-y-3">
                  {["Exceptional Communication & Articulation", "Strong Frontend Architecture (React/Next)", "High behavioral consistency"].map((s, i) => (
                    <li key={i} className="flex items-start gap-3 text-xs text-white/70">
                      <CheckCircle2 className="w-4 h-4 text-green-500 shrink-0" /> {s}
                    </li>
                  ))}
                </ul>
              </div>

              <div className="glass rounded-3xl p-6 border border-white/5">
                <h3 className="text-[10px] font-black uppercase tracking-widest text-amber-400 flex items-center gap-2 mb-4">
                  <AlertTriangle className="w-4 h-4" /> Vulnerabilities Detected
                </h3>
                <ul className="space-y-3">
                  {["System Design requires more depth", "Backend/Database optimization patterns", "Graph Algorithm problem solving"].map((s, i) => (
                    <li key={i} className="flex items-start gap-3 text-xs text-white/70">
                      <AlertTriangle className="w-4 h-4 text-amber-500 shrink-0" /> {s}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>

          {/* Growth Trend Line Chart */}
          <div className="glass rounded-[2rem] p-6 border border-white/10">
            <div className="flex items-center justify-between mb-8">
              <h3 className="text-sm font-black uppercase tracking-widest text-white/60 flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-rcb-red" /> Trajectory Prediction
              </h3>
              <div className="flex gap-4">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-rcb-red" />
                  <span className="text-[10px] text-white/40 font-bold uppercase">Readiness</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-blue-500" />
                  <span className="text-[10px] text-white/40 font-bold uppercase">Confidence</span>
                </div>
              </div>
            </div>
            
            <div className="w-full h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={trendData} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
                  <XAxis dataKey="name" stroke="rgba(255,255,255,0.2)" tick={{ fill: 'rgba(255,255,255,0.4)', fontSize: 10, fontWeight: 'bold' }} axisLine={false} tickLine={false} />
                  <YAxis stroke="rgba(255,255,255,0.2)" tick={{ fill: 'rgba(255,255,255,0.4)', fontSize: 10, fontWeight: 'bold' }} axisLine={false} tickLine={false} />
                  <RechartsTooltip 
                    contentStyle={{ backgroundColor: 'rgba(0,0,0,0.8)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px' }}
                    itemStyle={{ color: '#fff', fontSize: '12px', fontWeight: 'bold' }}
                  />
                  <Line type="monotone" dataKey="readiness" stroke="#EE1C25" strokeWidth={3} dot={{ r: 4, fill: '#EE1C25', strokeWidth: 0 }} activeDot={{ r: 6, fill: '#fff', stroke: '#EE1C25', strokeWidth: 2 }} />
                  <Line type="monotone" dataKey="confidence" stroke="#3b82f6" strokeWidth={3} dot={{ r: 4, fill: '#3b82f6', strokeWidth: 0 }} activeDot={{ r: 6, fill: '#fff', stroke: '#3b82f6', strokeWidth: 2 }} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
