"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Video, Mic, MicOff, Clock, Brain, ChevronRight, RotateCcw,
  Sparkles, Send, CheckCircle2, XCircle, AlertTriangle,
  Star, Trophy, Target, MessageSquare, Zap, ArrowRight, Play,
  Volume2, VolumeX, Activity
} from "lucide-react";

type Phase = "setup" | "interview" | "review";
type QuestionType = "hr" | "technical" | "behavioral";

interface Question {
  id: number;
  type: QuestionType;
  text: string;
  difficulty: "easy" | "medium" | "hard";
  timeLimit: number;
  tips: string;
}

interface Answer {
  questionId: number;
  text: string;
  timeSpent: number;
  score: number;
  feedback: string;
  strengths: string[];
  improvements: string[];
  confidence: number;
}

const questionBank: Question[] = [
  { id: 1, type: "hr", text: "Tell me about yourself and what drives you as a software engineer.", difficulty: "easy", timeLimit: 120, tips: "Use the Present-Past-Future framework" },
  { id: 2, type: "behavioral", text: "Describe a time you faced a major technical challenge in a project. How did you resolve it?", difficulty: "medium", timeLimit: 180, tips: "Use the STAR method: Situation, Task, Action, Result" },
  { id: 3, type: "technical", text: "Explain the difference between REST and GraphQL APIs. When would you choose one over the other?", difficulty: "medium", timeLimit: 150, tips: "Compare on flexibility, performance, and use cases" },
  { id: 4, type: "technical", text: "What is the Virtual DOM in React? How does reconciliation work?", difficulty: "hard", timeLimit: 150, tips: "Explain diffing algorithm and fiber architecture" },
  { id: 5, type: "hr", text: "Why do you want to work at this company? What excites you about this role?", difficulty: "easy", timeLimit: 120, tips: "Show you've researched the company and align with their mission" },
  { id: 6, type: "behavioral", text: "Tell me about a time you had a disagreement with a teammate. How did you handle it?", difficulty: "medium", timeLimit: 180, tips: "Show emotional intelligence and conflict resolution skills" },
  { id: 7, type: "technical", text: "Design a URL shortener system. Walk me through the architecture.", difficulty: "hard", timeLimit: 240, tips: "Cover hashing, database choice, scalability, and caching" },
];

const mockEvaluate = (answer: string, question: Question): Omit<Answer, "questionId" | "text" | "timeSpent"> => {
  const len = answer.trim().length;
  const hasStructure = answer.includes("because") || answer.includes("example") || answer.includes("result") || answer.includes("so") || answer.includes("then");
  const isDetailed = len > 50; // lowered threshold for voice
  const base = Math.min(40 + Math.floor(len / 4), 75);
  const bonus = (hasStructure ? 10 : 0) + (isDetailed ? 10 : 0) + (question.difficulty === "easy" ? 5 : 0);
  const score = Math.min(base + bonus, 98);
  const confidence = Math.min(30 + Math.floor(len / 3) + (hasStructure ? 15 : 0), 95);

  const strengths: string[] = [];
  const improvements: string[] = [];

  if (isDetailed) strengths.push("Spoke clearly with sufficient detail");
  if (hasStructure) strengths.push("Maintained logical flow and structure in spoken response");
  if (len > 80) strengths.push("Good depth of explanation");
  if (strengths.length === 0) strengths.push("Attempted the question");

  if (!isDetailed) improvements.push("Speak more comprehensively about your experience");
  if (!hasStructure) improvements.push("Use the STAR method to structure your spoken answers");
  if (len < 30) improvements.push("Your response was too brief. Try to elaborate.");
  if (question.type === "technical" && !answer.includes("example"))
    improvements.push("Verbally provide concrete code examples or real-world scenarios");

  const feedback = score >= 80
    ? "Excellent vocal response! Clear, structured, and demonstrates strong communication skills."
    : score >= 60
    ? "Good answer but communication could be sharper. Try to speak more confidently and add structure."
    : "Needs work. Focus on projecting confidence and providing concrete examples.";

  return { score, feedback, strengths, improvements, confidence };
};

const typeColors: Record<QuestionType, string> = {
  hr: "#3b82f6",
  technical: "#EE1C25",
  behavioral: "#a855f7",
};
const typeLabels: Record<QuestionType, string> = {
  hr: "HR",
  technical: "Technical",
  behavioral: "Behavioral",
};

// Types for Web Speech API
declare global {
  interface Window {
    SpeechRecognition: any;
    webkitSpeechRecognition: any;
  }
}

export default function InterviewPage() {
  const [phase, setPhase] = useState<Phase>("setup");
  const [selectedTypes, setSelectedTypes] = useState<Set<QuestionType>>(new Set(["hr", "technical", "behavioral"]));
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentIdx, setCurrentIdx] = useState(0);
  const [answers, setAnswers] = useState<Answer[]>([]);
  
  // Voice state
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState("");
  const [isSpeakingAI, setIsSpeakingAI] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(true);
  
  const [timeLeft, setTimeLeft] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const recognitionRef = useRef<any>(null);
  const synthRef = useRef<SpeechSynthesis | null>(null);

  const currentQ = questions[currentIdx];

  // Initialize Speech APIs
  useEffect(() => {
    if (typeof window !== "undefined") {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      if (SpeechRecognition) {
        recognitionRef.current = new SpeechRecognition();
        recognitionRef.current.continuous = true;
        recognitionRef.current.interimResults = true;
        
        recognitionRef.current.onresult = (event: any) => {
          let currentTranscript = "";
          for (let i = 0; i < event.results.length; i++) {
            currentTranscript += event.results[i][0].transcript;
          }
          setTranscript(currentTranscript);
        };

        recognitionRef.current.onerror = (event: any) => {
          console.error("Speech recognition error", event.error);
          setIsListening(false);
        };
        
        recognitionRef.current.onend = () => {
          // If it ended automatically but we want it to keep listening, we could restart it,
          // but for simplicity we'll just set state to false.
          setIsListening(false);
        };
      }
      
      synthRef.current = window.speechSynthesis;
    }
    
    return () => {
      if (recognitionRef.current) recognitionRef.current.stop();
      if (synthRef.current) synthRef.current.cancel();
    };
  }, []);

  // Timer
  useEffect(() => {
    if (phase !== "interview" || !currentQ) return;
    if (timeLeft <= 0) return;
    const t = setInterval(() => setTimeLeft(p => Math.max(p - 1, 0)), 1000);
    return () => clearInterval(t);
  }, [phase, currentQ, timeLeft]);

  // Read out question when it changes
  useEffect(() => {
    if (phase === "interview" && currentQ && soundEnabled) {
      speakText(currentQ.text);
    }
  }, [currentIdx, phase, currentQ, soundEnabled]);

  const speakText = (text: string) => {
    if (!synthRef.current) return;
    synthRef.current.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    // Try to find a good English voice
    const voices = synthRef.current.getVoices();
    const preferredVoice = voices.find(v => v.name.includes("Google") || v.name.includes("Samantha") || v.name.includes("Natural"));
    if (preferredVoice) utterance.voice = preferredVoice;
    
    utterance.rate = 0.95;
    utterance.pitch = 1;
    
    utterance.onstart = () => setIsSpeakingAI(true);
    utterance.onend = () => setIsSpeakingAI(false);
    
    synthRef.current.speak(utterance);
  };

  const toggleListening = () => {
    if (isListening) {
      recognitionRef.current?.stop();
      setIsListening(false);
    } else {
      // Stop AI speaking if we start talking
      if (synthRef.current) synthRef.current.cancel();
      setIsSpeakingAI(false);
      
      try {
        recognitionRef.current?.start();
        setIsListening(true);
      } catch (e) {
        console.error("Could not start recognition", e);
      }
    }
  };

  const startInterview = () => {
    const filtered = questionBank.filter(q => selectedTypes.has(q.type));
    const shuffled = filtered.sort(() => Math.random() - 0.5).slice(0, 5);
    setQuestions(shuffled);
    setCurrentIdx(0);
    setAnswers([]);
    setTimeLeft(shuffled[0]?.timeLimit || 120);
    setTranscript("");
    setPhase("interview");
  };

  const submitAnswer = async () => {
    if (!currentQ || isSubmitting) return;
    
    if (isListening) {
      recognitionRef.current?.stop();
      setIsListening(false);
    }
    
    setIsSubmitting(true);
    await new Promise(r => setTimeout(r, 1000)); // Simulate AI processing audio/text

    const evaluation = mockEvaluate(transcript, currentQ);
    const answer: Answer = {
      questionId: currentQ.id,
      text: transcript || "[No verbal response recorded]",
      timeSpent: currentQ.timeLimit - timeLeft,
      ...evaluation,
    };
    
    const newAnswers = [...answers, answer];
    setAnswers(newAnswers);
    setTranscript("");
    setIsSubmitting(false);

    if (currentIdx < questions.length - 1) {
      const nextIdx = currentIdx + 1;
      setCurrentIdx(nextIdx);
      setTimeLeft(questions[nextIdx].timeLimit);
    } else {
      setPhase("review");
      if (soundEnabled) speakText("Interview complete. Let's review your performance.");
    }
  };

  const formatTime = (s: number) => `${Math.floor(s / 60)}:${(s % 60).toString().padStart(2, "0")}`;
  const avgScore = answers.length ? Math.round(answers.reduce((a, b) => a + b.score, 0) / answers.length) : 0;
  const avgConfidence = answers.length ? Math.round(answers.reduce((a, b) => a + b.confidence, 0) / answers.length) : 0;

  // ─── SETUP ───
  if (phase === "setup") {
    return (
      <div className="space-y-8 max-w-3xl mx-auto">
        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
          <h1 className="text-3xl md:text-4xl font-black tracking-tighter flex items-center gap-3">
            <Mic className="w-8 h-8 text-rcb-red" />
            Voice AI <span className="text-rcb-red">Interviewer</span>
          </h1>
          <p className="text-sm text-white/40 mt-2">Cinematic, real-time voice mock interviews powered by Gemini Neural Engine</p>
        </motion.div>

        {/* AI Avatar */}
        <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
          className="glass rounded-[2.5rem] p-10 text-center relative overflow-hidden border border-white/10"
        >
          <div className="absolute -top-20 left-1/2 -translate-x-1/2 w-60 h-60 bg-rcb-red/10 rounded-full blur-[100px]" />
          <div className="relative z-10">
            <div className="w-24 h-24 rounded-full bg-gradient-to-br from-rcb-red to-red-800 mx-auto mb-6 flex items-center justify-center shadow-[0_0_40px_rgba(238,28,37,0.4)]"
              style={{ perspective: "400px" }}
            >
              <Activity className="w-10 h-10 text-white animate-pulse" style={{ transform: "translateZ(15px)" }} />
            </div>
            <h2 className="text-2xl font-black mb-2">CareerOS Vocal Agent</h2>
            <p className="text-white/40 text-sm max-w-md mx-auto">
              Ensure your microphone is connected. I will ask you questions aloud, and you will respond with your voice. I'll analyze your speech patterns, confidence, and content.
            </p>
          </div>
        </motion.div>

        {/* Category Selection */}
        <div className="glass rounded-[2rem] p-8 border border-white/5">
          <h3 className="text-sm font-bold tracking-widest text-white/40 uppercase mb-6 flex items-center justify-between">
            <span>Select Categories</span>
            <button 
              onClick={() => setSoundEnabled(!soundEnabled)}
              className="flex items-center gap-2 text-xs text-white/50 hover:text-white transition-colors"
            >
              {soundEnabled ? <Volume2 className="w-4 h-4 text-green-400" /> : <VolumeX className="w-4 h-4 text-red-400" />}
              AI Voice {soundEnabled ? "ON" : "OFF"}
            </button>
          </h3>
          <div className="flex flex-wrap gap-3">
            {(["hr", "technical", "behavioral"] as QuestionType[]).map(type => {
              const active = selectedTypes.has(type);
              return (
                <button key={type}
                  onClick={() => {
                    const next = new Set(selectedTypes);
                    if (active && next.size > 1) next.delete(type);
                    else next.add(type);
                    setSelectedTypes(next);
                  }}
                  className={`px-5 py-3 rounded-2xl font-bold text-sm transition-all border ${
                    active
                      ? "text-white shadow-lg"
                      : "bg-white/5 text-white/30 border-white/5"
                  }`}
                  style={active ? {
                    backgroundColor: typeColors[type] + "20",
                    borderColor: typeColors[type] + "40",
                    color: typeColors[type],
                    boxShadow: `0 0 20px ${typeColors[type]}15`,
                  } : {}}
                >
                  {typeLabels[type]}
                </button>
              );
            })}
          </div>
        </div>

        <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
          onClick={startInterview}
          className="w-full py-5 rounded-2xl bg-rcb-red text-white font-black text-lg shadow-[0_0_40px_rgba(238,28,37,0.3)] hover:shadow-[0_0_60px_rgba(238,28,37,0.5)] transition-all flex items-center justify-center gap-3"
        >
          <Mic className="w-5 h-5 fill-white" /> INITIALIZE VOCAL INTERVIEW
        </motion.button>
      </div>
    );
  }

  // ─── INTERVIEW ───
  if (phase === "interview" && currentQ) {
    const progress = ((currentIdx + 1) / questions.length) * 100;
    const timePercent = (timeLeft / currentQ.timeLimit) * 100;
    const isLowTime = timeLeft <= 30;

    return (
      <div className="max-w-4xl mx-auto space-y-6 pb-20">
        {/* Top Bar */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <span className="text-xs font-bold text-white/40 uppercase tracking-widest">
              Question {currentIdx + 1}/{questions.length}
            </span>
            <span className="px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest"
              style={{ backgroundColor: typeColors[currentQ.type] + "20", color: typeColors[currentQ.type] }}
            >
              {typeLabels[currentQ.type]}
            </span>
          </div>
          <div className={`flex items-center gap-2 px-4 py-2 rounded-xl font-mono font-bold text-sm ${
            isLowTime ? "bg-red-500/10 text-red-400 animate-pulse" : "bg-white/5 text-white/60"
          }`}>
            <Clock className="w-4 h-4" /> {formatTime(timeLeft)}
          </div>
        </div>

        {/* Progress Bar */}
        <div className="h-1 bg-white/5 rounded-full overflow-hidden">
          <motion.div animate={{ width: `${progress}%` }}
            className="h-full bg-rcb-red rounded-full shadow-[0_0_10px_rgba(238,28,37,0.5)]"
          />
        </div>

        {/* Cinematic AI Avatar + Question */}
        <motion.div key={currentQ.id}
          initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
          className="glass-dark rounded-[2.5rem] p-10 relative overflow-hidden border border-white/5 min-h-[300px] flex flex-col items-center justify-center text-center"
        >
          {/* Audio Visualization Rings */}
          {isSpeakingAI && (
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-30">
              <div className="w-40 h-40 rounded-full border border-rcb-red animate-ping" style={{ animationDuration: '1.5s' }} />
              <div className="absolute w-60 h-60 rounded-full border border-rcb-red animate-ping" style={{ animationDuration: '2s' }} />
            </div>
          )}

          <div className="relative z-10 flex flex-col items-center gap-6">
            <div className={`w-20 h-20 rounded-full flex items-center justify-center shrink-0 shadow-[0_0_30px_rgba(238,28,37,0.4)] transition-all duration-300 ${isSpeakingAI ? 'bg-rcb-red scale-110' : 'bg-gradient-to-br from-rcb-red to-red-900 scale-100'}`}>
              <Brain className="w-10 h-10 text-white" />
            </div>
            <div>
              <p className="text-[10px] font-bold text-rcb-red uppercase tracking-widest mb-3">{isSpeakingAI ? "AI is speaking..." : "AI Interviewer"}</p>
              <h3 className="text-xl md:text-2xl font-bold text-white leading-relaxed max-w-2xl">{currentQ.text}</h3>
              <div className="mt-6 inline-flex items-center gap-2 text-xs text-white/30 bg-white/5 px-4 py-2 rounded-full">
                <Sparkles className="w-4 h-4 text-amber-500" />
                <span>Focus on: {currentQ.tips}</span>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Timer Bar */}
        <div className="h-1 bg-white/5 rounded-full overflow-hidden">
          <motion.div animate={{ width: `${timePercent}%` }}
            className={`h-full rounded-full transition-colors ${isLowTime ? "bg-red-500" : "bg-green-500"}`}
          />
        </div>

        {/* Voice Input Section */}
        <div className="glass rounded-[2rem] p-6 border border-white/10 relative overflow-hidden">
          {isListening && (
            <div className="absolute inset-0 bg-green-500/5 animate-pulse" />
          )}
          
          <div className="flex flex-col md:flex-row items-center gap-6 relative z-10">
            {/* Mic Toggle */}
            <button 
              onClick={toggleListening}
              className={`w-20 h-20 rounded-full flex items-center justify-center shrink-0 transition-all ${
                isListening 
                ? "bg-green-500 shadow-[0_0_30px_rgba(34,197,94,0.5)] scale-105" 
                : "bg-white/5 hover:bg-white/10"
              }`}
            >
              {isListening ? (
                <Mic className="w-8 h-8 text-white animate-pulse" />
              ) : (
                <MicOff className="w-8 h-8 text-white/40" />
              )}
            </button>

            {/* Live Transcript */}
            <div className="flex-1 w-full bg-black/40 rounded-2xl p-5 min-h-[120px] max-h-[200px] overflow-y-auto font-mono text-sm border border-white/5">
              {transcript ? (
                <p className="text-white/80 leading-relaxed">{transcript}</p>
              ) : (
                <div className="h-full flex items-center justify-center text-white/20 italic">
                  {isListening ? "Listening to your response... speak clearly." : "Click the microphone to start recording your answer."}
                </div>
              )}
            </div>
          </div>

          <div className="flex items-center justify-between mt-6 pt-6 border-t border-white/5 relative z-10">
            <span className="text-[10px] uppercase tracking-widest font-bold text-white/30 flex items-center gap-2">
              <Activity className="w-3 h-3" /> Voice Tracking Active
            </span>
            <motion.button whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
              onClick={submitAnswer}
              disabled={(!transcript && !isListening) || isSubmitting}
              className="px-8 py-3 rounded-xl bg-rcb-red text-white font-bold text-sm shadow-[0_0_20px_rgba(238,28,37,0.3)] disabled:opacity-30 disabled:shadow-none flex items-center gap-2"
            >
              {isSubmitting ? (
                <><div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> Analyzing Audio...</>
              ) : currentIdx < questions.length - 1 ? (
                <>Next Question <ChevronRight className="w-4 h-4" /></>
              ) : (
                <>Complete Interview <CheckCircle2 className="w-4 h-4" /></>
              )}
            </motion.button>
          </div>
        </div>
      </div>
    );
  }

  // ─── REVIEW ───
  return (
    <div className="max-w-5xl mx-auto space-y-8 pb-20">
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-black tracking-tighter">Interview <span className="text-rcb-red">Analysis</span></h1>
          <p className="text-sm text-white/40 mt-1">Neural breakdown of your voice interview</p>
        </div>
        <div className="flex items-center gap-2 text-green-400 bg-green-500/10 px-4 py-2 rounded-xl text-xs font-bold border border-green-500/20">
          <Mic className="w-4 h-4" /> Voice Processed
        </div>
      </motion.div>

      {/* Score Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: "Content Score", value: avgScore, icon: Trophy, color: avgScore >= 80 ? "#22c55e" : "#EE1C25" },
          { label: "Vocal Confidence", value: `${avgConfidence}%`, icon: Zap, color: "#3b82f6" },
          { label: "Questions Completed", value: answers.length, icon: MessageSquare, color: "#a855f7" },
          { label: "Avg Response Time", value: `${Math.round(answers.reduce((a, b) => a + b.timeSpent, 0) / (answers.length || 1))}s`, icon: Clock, color: "#f59e0b" },
        ].map((s, i) => (
          <motion.div key={s.label}
            initial={{ opacity: 0, y: 20, rotateX: 10 }} animate={{ opacity: 1, y: 0, rotateX: 0 }}
            transition={{ delay: i * 0.1 }}
            className="glass rounded-3xl p-5 text-center relative overflow-hidden group border border-white/5"
            style={{ perspective: "600px" }}
          >
            <div className="absolute -top-8 -right-8 w-20 h-20 rounded-full blur-[40px] opacity-20"
              style={{ backgroundColor: s.color }}
            />
            <s.icon className="w-6 h-6 mx-auto mb-3" style={{ color: s.color }} />
            <p className="text-3xl font-black mb-1" style={{ color: s.color }}>{s.value}</p>
            <p className="text-[9px] text-white/40 uppercase tracking-widest font-bold">{s.label}</p>
          </motion.div>
        ))}
      </div>

      {/* Per-Question Breakdown */}
      <div className="space-y-6">
        {answers.map((ans, i) => {
          const q = questions.find(x => x.id === ans.questionId)!;
          return (
            <motion.div key={ans.questionId}
              initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 + i * 0.1 }}
              className="glass rounded-3xl p-6 md:p-8 border border-white/5"
            >
              <div className="flex flex-col md:flex-row items-start justify-between gap-6 mb-6">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-3 mb-3 flex-wrap">
                    <span className="text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-md"
                      style={{ backgroundColor: typeColors[q.type] + "20", color: typeColors[q.type] }}
                    >{typeLabels[q.type]}</span>
                    <span className="text-[10px] text-white/30 font-bold uppercase tracking-widest"><Clock className="inline w-3 h-3 mr-1" />{ans.timeSpent}s</span>
                  </div>
                  <h3 className="text-lg font-bold text-white">{q.text}</h3>
                </div>
                
                <div className="flex items-center gap-4 shrink-0">
                  <div className="text-right">
                    <p className="text-[10px] text-white/40 uppercase tracking-widest font-bold mb-1">Score</p>
                    <p className={`text-2xl font-black ${ans.score >= 80 ? "text-green-500" : ans.score >= 60 ? "text-amber-500" : "text-rcb-red"}`}>
                      {ans.score}
                    </p>
                  </div>
                  <div className="relative w-16 h-16">
                    <svg className="-rotate-90 w-16 h-16">
                      <circle cx="32" cy="32" r="26" strokeWidth="4" fill="transparent" className="text-white/5" stroke="currentColor" />
                      <motion.circle cx="32" cy="32" r="26" strokeWidth="4" fill="transparent"
                        stroke={ans.score >= 80 ? "#22c55e" : ans.score >= 60 ? "#f59e0b" : "#EE1C25"}
                        strokeDasharray={163} initial={{ strokeDashoffset: 163 }}
                        animate={{ strokeDashoffset: 163 - (163 * ans.score) / 100 }}
                        transition={{ duration: 1, delay: 0.5 + i * 0.1 }} strokeLinecap="round"
                      />
                    </svg>
                  </div>
                </div>
              </div>

              {/* Transcript */}
              <div className="mb-6">
                <p className="text-[10px] font-black text-white/20 uppercase tracking-widest mb-2 flex items-center gap-2">
                  <Mic className="w-3 h-3" /> Voice Transcript
                </p>
                <div className="p-4 rounded-2xl bg-black/30 border border-white/5 font-mono text-sm">
                  <p className="text-white/60 leading-relaxed italic">"{ans.text}"</p>
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-rcb-red/5 border border-rcb-red/10 mb-6">
                <p className="text-sm font-bold text-white/80 flex items-start gap-3">
                  <Brain className="w-5 h-5 text-rcb-red shrink-0" />
                  {ans.feedback}
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 rounded-2xl bg-white/[0.02]">
                  <h4 className="text-[10px] font-bold text-green-500 uppercase tracking-widest mb-3 flex items-center gap-2"><CheckCircle2 className="w-3 h-3" /> Communication Strengths</h4>
                  {ans.strengths.map((s, j) => (
                    <p key={j} className="text-xs text-white/50 flex items-start gap-2 mb-2 leading-relaxed">
                      <div className="w-1.5 h-1.5 rounded-full bg-green-500 mt-1.5 shrink-0" />{s}
                    </p>
                  ))}
                </div>
                <div className="p-4 rounded-2xl bg-white/[0.02]">
                  <h4 className="text-[10px] font-bold text-amber-400 uppercase tracking-widest mb-3 flex items-center gap-2"><AlertTriangle className="w-3 h-3" /> Areas for Improvement</h4>
                  {ans.improvements.map((s, j) => (
                    <p key={j} className="text-xs text-white/50 flex items-start gap-2 mb-2 leading-relaxed">
                      <div className="w-1.5 h-1.5 rounded-full bg-amber-400 mt-1.5 shrink-0" />{s}
                    </p>
                  ))}
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Retry */}
      <div className="flex gap-4 pt-4 border-t border-white/10">
        <button onClick={() => { setPhase("setup"); setAnswers([]); setCurrentIdx(0); }}
          className="flex-1 py-4 rounded-2xl glass font-bold text-sm hover:bg-white/10 transition-all flex items-center justify-center gap-2 border border-white/5"
        >
          <RotateCcw className="w-4 h-4" /> Start New Session
        </button>
      </div>
    </div>
  );
}
