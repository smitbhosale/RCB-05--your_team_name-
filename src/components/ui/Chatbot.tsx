"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MessageCircle, X, Send, Sparkles, Bot, User, Loader2, Minimize2, Maximize2 } from "lucide-react";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
}

const QUICK_PROMPTS = [
  "How do I improve my ATS score?",
  "Suggest projects for SDE roles",
  "How to prepare for Google interviews?",
  "Best skills for 2026 job market",
];

const BOT_RESPONSES: Record<string, string> = {
  "how do i improve my ats score": `Great question! Here are the top ways to boost your ATS score:\n\n🎯 **Use Keywords**: Mirror the exact terms from job descriptions\n📊 **Quantify Impact**: Replace "built a web app" with "built a React app serving 5K+ users"\n📝 **Add a Professional Summary**: 2-3 lines highlighting your core value\n🔧 **Use Standard Headings**: "Work Experience", "Education", "Skills"\n📋 **Format Simply**: Avoid tables, columns, and images that ATS can't parse\n\nWant me to analyze your resume for specific improvements?`,

  "suggest projects for sde roles": `Here are 5 projects that will make recruiters notice you:\n\n1. 🌐 **Real-time Collaboration Tool** — WebSocket + React + Node.js\n2. 🤖 **AI-Powered Resume Analyzer** — Next.js + Gemini API\n3. 📊 **Distributed Task Queue** — Redis + Worker threads\n4. 🔍 **Search Engine** — Inverted index + TF-IDF ranking\n5. 💬 **Chat Application** — Socket.io + MongoDB + Auth\n\nEach project demonstrates system design thinking. Want me to generate detailed specs for any of these?`,

  "how to prepare for google interviews": `Here's the Google SDE Interview Prep Blueprint:\n\n📚 **Phase 1 (Weeks 1-4): Foundations**\n- Master DSA: Arrays, Trees, Graphs, DP\n- Solve 100+ LeetCode (Easy→Medium)\n\n🧠 **Phase 2 (Weeks 5-8): Deep Dive**\n- System Design: URL shortener, chat system\n- Behavioral: STAR method for 10 stories\n\n⚡ **Phase 3 (Weeks 9-12): Mock Practice**\n- Use our AI Mock Interview Engine daily\n- Time yourself: 20 min per medium problem\n\n🎯 **Key Topics**: BFS/DFS, Sliding Window, Two Pointers, Binary Search, Dynamic Programming\n\nShall I generate a personalized study plan?`,

  "best skills for 2026 job market": `The most in-demand skills for 2026:\n\n🔥 **Hot Right Now**:\n- AI/ML Engineering (LLMs, RAG, Fine-tuning)\n- Full-Stack with AI Integration\n- Cloud Native (Kubernetes, Serverless)\n- Rust & Go for systems programming\n\n📈 **Rising Fast**:\n- AI Agent Development\n- Edge Computing & WebAssembly\n- Cybersecurity & Zero Trust\n- Data Engineering (dbt, Spark)\n\n💡 **Evergreen**:\n- React/Next.js + TypeScript\n- Python for automation\n- System Design & Architecture\n- DevOps & CI/CD\n\nWant me to create a learning roadmap for any of these?`,
};

function getResponse(userMessage: string): string {
  const lower = userMessage.toLowerCase().trim();
  
  for (const [key, response] of Object.entries(BOT_RESPONSES)) {
    if (lower.includes(key) || key.includes(lower)) {
      return response;
    }
  }
  
  // Keyword matching for broader coverage
  if (lower.includes("resume") || lower.includes("ats")) {
    return BOT_RESPONSES["how do i improve my ats score"];
  }
  if (lower.includes("project") || lower.includes("portfolio")) {
    return BOT_RESPONSES["suggest projects for sde roles"];
  }
  if (lower.includes("interview") || lower.includes("google") || lower.includes("prepare")) {
    return BOT_RESPONSES["how to prepare for google interviews"];
  }
  if (lower.includes("skill") || lower.includes("learn") || lower.includes("2026")) {
    return BOT_RESPONSES["best skills for 2026 job market"];
  }
  if (lower.includes("hello") || lower.includes("hi") || lower.includes("hey")) {
    return "Hey there! 👋 I'm your CareerOS AI assistant. I can help you with:\n\n• Resume optimization & ATS tips\n• Project ideas for your portfolio\n• Interview preparation strategies\n• Career skill recommendations\n\nWhat would you like to explore?";
  }
  if (lower.includes("thank")) {
    return "You're welcome! 🙏 Remember, consistency beats intensity. Keep pushing forward every day and you'll land your dream role. Anything else I can help with?";
  }

  return `I understand you're asking about "${userMessage}". Here's my take:\n\n🤖 As your CareerOS AI, I recommend:\n\n1. **Assess your current skill level** — Use our Resume Analyzer to get a baseline\n2. **Set clear 30-day goals** — The AI Agent can generate a roadmap\n3. **Practice daily** — Mock Interviews build real confidence\n4. **Track your growth** — Check Growth Charts for XP progress\n\nWant me to dive deeper into any specific area? Try asking about resumes, projects, interviews, or skills!`;
}

export const Chatbot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "welcome",
      role: "assistant",
      content: "Hey! 👋 I'm your **CareerOS AI Assistant**. I can help with resume tips, project ideas, interview prep, and career guidance.\n\nWhat can I help you with today?",
      timestamp: new Date(),
    },
  ]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages, scrollToBottom]);

  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  const handleSend = useCallback(async (text?: string) => {
    const messageText = text || input.trim();
    if (!messageText) return;

    const userMsg: Message = {
      id: `user-${Date.now()}`,
      role: "user",
      content: messageText,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setIsTyping(true);

    // Simulate AI thinking time
    await new Promise((r) => setTimeout(r, 800 + Math.random() * 1200));

    const response = getResponse(messageText);
    const botMsg: Message = {
      id: `bot-${Date.now()}`,
      role: "assistant",
      content: response,
      timestamp: new Date(),
    };

    setIsTyping(false);
    setMessages((prev) => [...prev, botMsg]);
  }, [input]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  // Simple markdown-like rendering
  const renderContent = (content: string) => {
    return content.split("\n").map((line, i) => {
      let processed = line
        .replace(/\*\*(.*?)\*\*/g, '<strong class="text-white font-semibold">$1</strong>')
        .replace(/`(.*?)`/g, '<code class="px-1.5 py-0.5 rounded bg-white/10 text-rcb-red text-[10px] font-mono">$1</code>');

      if (line.startsWith("•") || line.startsWith("-")) {
        processed = `<span class="text-rcb-red mr-1">›</span>${processed.slice(1)}`;
      }

      return (
        <span
          key={i}
          className="block"
          dangerouslySetInnerHTML={{ __html: processed || "&nbsp;" }}
        />
      );
    });
  };

  return (
    <>
      {/* Floating Trigger Button */}
      <AnimatePresence>
        {!isOpen && (
          <motion.button
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => setIsOpen(true)}
            className="fixed bottom-6 right-6 z-[999] w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-rcb-red text-white shadow-[0_0_40px_rgba(238,28,37,0.4)] hover:shadow-[0_0_60px_rgba(238,28,37,0.6)] transition-shadow flex items-center justify-center group"
            aria-label="Open AI Career Assistant"
          >
            <MessageCircle className="w-6 h-6 sm:w-7 sm:h-7 group-hover:scale-110 transition-transform" />
            {/* Pulse ring */}
            <span className="absolute inset-0 rounded-full border-2 border-rcb-red animate-ping opacity-20" aria-hidden="true" />
          </motion.button>
        )}
      </AnimatePresence>

      {/* Chat Window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.9 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className={`fixed z-[9999] flex flex-col ${
              isExpanded
                ? "inset-4 sm:inset-8 rounded-3xl"
                : "bottom-4 right-4 sm:bottom-6 sm:right-6 w-[calc(100vw-2rem)] sm:w-[420px] h-[70vh] sm:h-[600px] rounded-3xl"
            }`}
            role="dialog"
            aria-label="CareerOS AI Assistant"
            aria-modal="true"
          >
            <div className="flex flex-col h-full glass-dark border border-white/10 rounded-3xl overflow-hidden shadow-2xl shadow-black/50">
              {/* Header */}
              <div className="flex items-center justify-between p-4 sm:p-5 border-b border-white/5 bg-gradient-to-r from-rcb-red/10 to-transparent">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-rcb-red flex items-center justify-center shadow-[0_0_20px_rgba(238,28,37,0.3)]">
                    <Bot className="w-5 h-5 text-white" aria-hidden="true" />
                  </div>
                  <div>
                    <h2 className="text-sm font-bold text-white">CareerOS Assistant</h2>
                    <div className="flex items-center gap-1.5">
                      <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" aria-hidden="true" />
                      <span className="text-[9px] text-green-400 font-semibold uppercase tracking-wider">Online</span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => setIsExpanded(!isExpanded)}
                    className="p-2 rounded-lg hover:bg-white/5 transition-colors text-white/40 hover:text-white hidden sm:block"
                    aria-label={isExpanded ? "Minimize chat" : "Maximize chat"}
                  >
                    {isExpanded ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
                  </button>
                  <button
                    onClick={() => { setIsOpen(false); setIsExpanded(false); }}
                    className="p-2 rounded-lg hover:bg-white/5 transition-colors text-white/40 hover:text-white"
                    aria-label="Close chat"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
              </div>

              {/* Messages */}
              <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-4 sm:space-y-5 scroll-smooth">
                {messages.map((msg) => (
                  <motion.div
                    key={msg.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                    className={`flex gap-3 ${msg.role === "user" ? "flex-row-reverse" : ""}`}
                  >
                    <div className={`w-7 h-7 sm:w-8 sm:h-8 rounded-lg flex-shrink-0 flex items-center justify-center ${
                      msg.role === "assistant" ? "bg-rcb-red/20 text-rcb-red" : "bg-white/10 text-white/60"
                    }`}>
                      {msg.role === "assistant" ? <Sparkles className="w-3.5 h-3.5" /> : <User className="w-3.5 h-3.5" />}
                    </div>
                    <div className={`max-w-[85%] sm:max-w-[80%] px-4 py-3 rounded-2xl text-xs sm:text-[13px] leading-relaxed ${
                      msg.role === "assistant"
                        ? "bg-white/[0.04] text-white/80 border border-white/5"
                        : "bg-rcb-red text-white"
                    }`}>
                      {renderContent(msg.content)}
                    </div>
                  </motion.div>
                ))}

                {/* Typing Indicator */}
                {isTyping && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex gap-3"
                  >
                    <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg bg-rcb-red/20 text-rcb-red flex items-center justify-center">
                      <Sparkles className="w-3.5 h-3.5" aria-hidden="true" />
                    </div>
                    <div className="bg-white/[0.04] px-4 py-3 rounded-2xl border border-white/5 flex items-center gap-1.5">
                      <Loader2 className="w-3.5 h-3.5 text-rcb-red animate-spin" aria-hidden="true" />
                      <span className="text-[10px] text-white/40">Thinking...</span>
                    </div>
                  </motion.div>
                )}

                <div ref={messagesEndRef} />
              </div>

              {/* Quick Prompts */}
              {messages.length <= 1 && (
                <div className="px-4 sm:px-5 pb-2 flex flex-wrap gap-2">
                  {QUICK_PROMPTS.map((prompt) => (
                    <button
                      key={prompt}
                      onClick={() => handleSend(prompt)}
                      className="px-3 py-1.5 rounded-full text-[10px] sm:text-xs font-medium bg-white/5 text-white/50 hover:text-white hover:bg-rcb-red/20 hover:border-rcb-red/30 border border-white/5 transition-all whitespace-nowrap"
                    >
                      {prompt}
                    </button>
                  ))}
                </div>
              )}

              {/* Input */}
              <div className="p-3 sm:p-4 border-t border-white/5">
                <div className="flex items-center gap-2 bg-white/[0.04] rounded-xl border border-white/5 focus-within:border-rcb-red/30 transition-colors px-3 sm:px-4 py-2.5 sm:py-3">
                  <input
                    ref={inputRef}
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder="Ask anything about your career..."
                    className="flex-1 bg-transparent text-xs sm:text-sm text-white placeholder:text-white/20 outline-none"
                    aria-label="Type your message"
                    disabled={isTyping}
                  />
                  <button
                    onClick={() => handleSend()}
                    disabled={!input.trim() || isTyping}
                    className="w-8 h-8 sm:w-9 sm:h-9 rounded-lg bg-rcb-red flex items-center justify-center text-white disabled:opacity-30 disabled:cursor-not-allowed hover:shadow-[0_0_15px_rgba(238,28,37,0.4)] transition-all"
                    aria-label="Send message"
                  >
                    <Send className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                  </button>
                </div>
                <p className="text-[8px] sm:text-[9px] text-white/15 text-center mt-2">
                  Powered by Gemini 2.5 Pro • CareerOS v4.2
                </p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};
