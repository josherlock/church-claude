"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import {
  getCounselResponse,
  getGreeting,
  getOpeningPrompts,
  type CounselResponse,
} from "@/lib/heart-check";

interface Message {
  id: string;
  type: "user" | "counsel";
  text?: string;
  response?: CounselResponse;
  timestamp: Date;
}

export default function HeartCheckPage() {
  const [mounted, setMounted] = useState(false);
  const [greeting, setGreeting] = useState("");
  const [prompts, setPrompts] = useState<string[]>([]);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [expandedSections, setExpandedSections] = useState<Record<string, string[]>>({});
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    setGreeting(getGreeting());
    setPrompts(getOpeningPrompts());
    setMounted(true);
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping]);

  const toggleSection = (messageId: string, section: string) => {
    setExpandedSections((prev) => {
      const current = prev[messageId] || [];
      if (current.includes(section)) {
        return { ...prev, [messageId]: current.filter((s) => s !== section) };
      }
      return { ...prev, [messageId]: [...current, section] };
    });
  };

  const isSectionExpanded = (messageId: string, section: string) => {
    return (expandedSections[messageId] || []).includes(section);
  };

  const handleSubmit = (text?: string) => {
    const messageText = text || input.trim();
    if (!messageText) return;

    const userMessage: Message = {
      id: Math.random().toString(36).slice(2, 10),
      type: "user",
      text: messageText,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsTyping(true);

    // Auto-resize textarea back
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
    }

    // Simulate thoughtful response time
    setTimeout(() => {
      const response = getCounselResponse(messageText);
      const counselMessage: Message = {
        id: Math.random().toString(36).slice(2, 10),
        type: "counsel",
        response,
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, counselMessage]);
      setIsTyping(false);

      // Auto-expand the first few sections
      setExpandedSections((prev) => ({
        ...prev,
        [counselMessage.id]: ["scripture", "heart-posture"],
      }));
    }, 1500 + Math.random() * 1000);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  const handleTextareaResize = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInput(e.target.value);
    e.target.style.height = "auto";
    e.target.style.height = Math.min(e.target.scrollHeight, 160) + "px";
  };

  if (!mounted) {
    return (
      <div className="min-h-screen bg-cream flex items-center justify-center">
        <div className="w-8 h-8 rounded-full hero-gradient animate-pulse" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-cream flex flex-col">
      {/* ========== Header ========== */}
      <header className="hero-gradient relative overflow-hidden flex-shrink-0">
        <div className="absolute top-0 right-0 w-72 h-72 rounded-full bg-white/5 -translate-y-1/3 translate-x-1/3" />
        <div className="absolute bottom-0 left-0 w-56 h-56 rounded-full bg-white/5 translate-y-1/2 -translate-x-1/3" />

        <div className="relative z-10 max-w-3xl mx-auto px-5 py-8 md:py-12">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-gold/80 hover:text-gold transition-colors text-sm mb-4"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="15 18 9 12 15 6" />
            </svg>
            Home
          </Link>

          <div className="flex items-center gap-4">
            {/* Heart Check Icon */}
            <div className="w-12 h-12 md:w-14 md:h-14 rounded-2xl bg-white/10 backdrop-blur-sm border border-white/10 flex items-center justify-center flex-shrink-0">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" className="text-gold">
                <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78L12 21.23l8.84-8.84a5.5 5.5 0 0 0 0-7.78z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M12 8v4M12 16h.01" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
              </svg>
            </div>

            <div>
              <h1 className="font-serif text-2xl sm:text-3xl font-bold text-white/95">
                Heart Check
              </h1>
              <p className="text-white/50 text-sm mt-1 font-sans">
                Honest counsel rooted in the Word
              </p>
            </div>
          </div>
        </div>
      </header>

      {/* ========== Chat Area ========== */}
      <div className="flex-1 overflow-y-auto">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 py-6 space-y-6">
          {/* ---- Welcome Card ---- */}
          {messages.length === 0 && (
            <div className="fade-in-up space-y-6">
              {/* Greeting */}
              <div className="flex gap-3">
                <div className="w-9 h-9 rounded-full bg-gradient-to-br from-taupe to-espresso flex items-center justify-center flex-shrink-0 mt-1">
                  <span className="text-white text-xs font-serif font-bold">JC</span>
                </div>
                <div className="flex-1">
                  <p className="text-xs text-taupe font-medium mb-1.5">Pastor Johnny&apos;s Corner</p>
                  <div className="bg-parchment rounded-2xl rounded-tl-sm border border-warmBorder p-5">
                    <p className="text-sm text-espresso leading-relaxed font-sans">
                      {greeting}
                    </p>
                    <p className="text-xs text-mocha mt-3 leading-relaxed">
                      Share what you&apos;re going through. I&apos;ll offer Scripture-grounded counsel and challenge your heart posture — because sometimes the real question isn&apos;t about your situation, it&apos;s about what your heart is doing in the middle of it.
                    </p>
                  </div>
                </div>
              </div>

              {/* Info Card */}
              <div className="bg-sand/50 rounded-2xl border border-warmBorder/60 p-5 fade-in-up fade-in-up-delay-1">
                <div className="flex items-start gap-3">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="text-taupe flex-shrink-0 mt-0.5">
                    <circle cx="12" cy="12" r="10"/>
                    <path d="M12 16v-4M12 8h.01"/>
                  </svg>
                  <div>
                    <p className="text-xs font-medium text-espresso mb-1">How this works</p>
                    <p className="text-xs text-mocha leading-relaxed">
                      Share what you&apos;re struggling with. You&apos;ll receive counsel rooted in Scripture, wisdom in the style of Pastor Johnny Chang&apos;s teachings on heart posture, and a practical step to apply. This is not a replacement for pastoral care — it&apos;s a starting point for honest reflection.
                    </p>
                  </div>
                </div>
              </div>

              {/* Prompt Suggestions */}
              <div className="fade-in-up fade-in-up-delay-2">
                <p className="text-xs font-medium text-taupe tracking-wide uppercase mb-3">
                  Or start with one of these
                </p>
                <div className="flex flex-col gap-2">
                  {prompts.map((prompt, i) => (
                    <button
                      key={i}
                      onClick={() => handleSubmit(prompt)}
                      className="text-left px-4 py-3 bg-parchment rounded-xl border border-warmBorder hover:border-taupe/40 hover:bg-sand/30 transition-all text-sm text-mocha hover:text-espresso group"
                    >
                      <span className="flex items-center gap-2">
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="text-warmGray group-hover:text-taupe flex-shrink-0 transition-colors">
                          <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
                        </svg>
                        {prompt}
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* ---- Messages ---- */}
          {messages.map((message) => (
            <div key={message.id} className="fade-in-up">
              {message.type === "user" ? (
                /* ---- User Message ---- */
                <div className="flex justify-end">
                  <div className="max-w-[85%] bg-espresso text-white rounded-2xl rounded-br-sm px-5 py-3.5">
                    <p className="text-sm leading-relaxed">{message.text}</p>
                  </div>
                </div>
              ) : message.response ? (
                /* ---- Counsel Response ---- */
                <div className="flex gap-3">
                  <div className="w-9 h-9 rounded-full bg-gradient-to-br from-taupe to-espresso flex items-center justify-center flex-shrink-0 mt-1">
                    <span className="text-white text-xs font-serif font-bold">JC</span>
                  </div>
                  <div className="flex-1 space-y-3 min-w-0">
                    <div className="flex items-center gap-2">
                      <p className="text-xs text-taupe font-medium">Pastor Johnny&apos;s Corner</p>
                      <span className="text-[10px] text-mocha bg-sand px-2 py-0.5 rounded-full">
                        {message.response.category}
                      </span>
                    </div>

                    {/* Acknowledgment */}
                    <div className="bg-parchment rounded-2xl rounded-tl-sm border border-warmBorder p-5">
                      <p className="text-sm text-espresso leading-relaxed">
                        {message.response.acknowledgment}
                      </p>
                    </div>

                    {/* Scripture Section */}
                    <div className="bg-parchment rounded-2xl border border-warmBorder overflow-hidden">
                      <button
                        onClick={() => toggleSection(message.id, "scripture")}
                        className="w-full px-5 py-3.5 flex items-center justify-between hover:bg-sand/30 transition-colors"
                      >
                        <span className="flex items-center gap-2">
                          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="text-gold">
                            <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/>
                            <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/>
                          </svg>
                          <span className="text-xs font-medium text-espresso tracking-wide uppercase">Scripture</span>
                        </span>
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
                          className={`text-warmGray transition-transform duration-200 ${isSectionExpanded(message.id, "scripture") ? "rotate-180" : ""}`}
                        >
                          <polyline points="6 9 12 15 18 9"/>
                        </svg>
                      </button>
                      {isSectionExpanded(message.id, "scripture") && (
                        <div className="px-5 pb-5 fade-in-up">
                          <div className="border-l-[3px] border-gold/50 pl-4">
                            <p className="verse-text text-base text-espresso leading-[1.8] italic">
                              &ldquo;{message.response.scripture}&rdquo;
                            </p>
                            <p className="text-xs text-taupe font-serif mt-2">
                              &mdash; {message.response.scriptureRef}
                            </p>
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Wisdom Section */}
                    <div className="bg-parchment rounded-2xl border border-warmBorder overflow-hidden">
                      <button
                        onClick={() => toggleSection(message.id, "wisdom")}
                        className="w-full px-5 py-3.5 flex items-center justify-between hover:bg-sand/30 transition-colors"
                      >
                        <span className="flex items-center gap-2">
                          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="text-taupe">
                            <path d="M12 2L12 6M12 18L12 22M4.93 4.93L7.76 7.76M16.24 16.24L19.07 19.07M2 12L6 12M18 12L22 12M4.93 19.07L7.76 16.24M16.24 7.76L19.07 4.93"/>
                            <circle cx="12" cy="12" r="4" fill="currentColor" opacity="0.1"/>
                          </svg>
                          <span className="text-xs font-medium text-espresso tracking-wide uppercase">Pastoral Wisdom</span>
                        </span>
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
                          className={`text-warmGray transition-transform duration-200 ${isSectionExpanded(message.id, "wisdom") ? "rotate-180" : ""}`}
                        >
                          <polyline points="6 9 12 15 18 9"/>
                        </svg>
                      </button>
                      {isSectionExpanded(message.id, "wisdom") && (
                        <div className="px-5 pb-5 fade-in-up">
                          <p className="text-sm text-espresso/90 leading-relaxed">
                            {message.response.wisdom}
                          </p>
                        </div>
                      )}
                    </div>

                    {/* Heart Posture Challenge */}
                    <div className="bg-gold/[0.06] rounded-2xl border border-gold/20 overflow-hidden">
                      <button
                        onClick={() => toggleSection(message.id, "heart-posture")}
                        className="w-full px-5 py-3.5 flex items-center justify-between hover:bg-gold/[0.08] transition-colors"
                      >
                        <span className="flex items-center gap-2">
                          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" className="text-gold">
                            <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78L12 21.23l8.84-8.84a5.5 5.5 0 0 0 0-7.78z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                          </svg>
                          <span className="text-xs font-medium text-espresso tracking-wide uppercase">
                            Heart Posture Check
                          </span>
                          <span className="text-[10px] font-medium text-gold bg-gold/15 px-2 py-0.5 rounded-full">
                            {message.response.heartPosture.label}
                          </span>
                        </span>
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
                          className={`text-warmGray transition-transform duration-200 ${isSectionExpanded(message.id, "heart-posture") ? "rotate-180" : ""}`}
                        >
                          <polyline points="6 9 12 15 18 9"/>
                        </svg>
                      </button>
                      {isSectionExpanded(message.id, "heart-posture") && (
                        <div className="px-5 pb-5 space-y-4 fade-in-up">
                          <p className="text-sm text-espresso/90 leading-relaxed">
                            {message.response.heartPosture.challenge}
                          </p>
                          <div className="bg-white/60 rounded-xl p-4 border border-gold/15">
                            <p className="text-xs font-medium text-taupe tracking-wide uppercase mb-2">
                              The Truth
                            </p>
                            <p className="verse-text text-sm text-espresso italic leading-relaxed">
                              &ldquo;{message.response.heartPosture.truthVerse}&rdquo;
                            </p>
                            <p className="text-xs text-taupe font-serif mt-1.5">
                              &mdash; {message.response.heartPosture.truthRef}
                            </p>
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Practical Step */}
                    <div className="bg-parchment rounded-2xl border border-warmBorder overflow-hidden">
                      <button
                        onClick={() => toggleSection(message.id, "practical")}
                        className="w-full px-5 py-3.5 flex items-center justify-between hover:bg-sand/30 transition-colors"
                      >
                        <span className="flex items-center gap-2">
                          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="text-sage">
                            <polyline points="9 11 12 14 22 4"/>
                            <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"/>
                          </svg>
                          <span className="text-xs font-medium text-espresso tracking-wide uppercase">Practical Step</span>
                        </span>
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
                          className={`text-warmGray transition-transform duration-200 ${isSectionExpanded(message.id, "practical") ? "rotate-180" : ""}`}
                        >
                          <polyline points="6 9 12 15 18 9"/>
                        </svg>
                      </button>
                      {isSectionExpanded(message.id, "practical") && (
                        <div className="px-5 pb-5 fade-in-up">
                          <p className="text-sm text-espresso/90 leading-relaxed">
                            {message.response.practicalStep}
                          </p>
                        </div>
                      )}
                    </div>

                    {/* Follow-up Question */}
                    <div className="bg-sand/40 rounded-xl px-5 py-4 border border-warmBorder/50">
                      <p className="text-sm text-mocha leading-relaxed italic">
                        {message.response.followUp}
                      </p>
                    </div>
                  </div>
                </div>
              ) : null}
            </div>
          ))}

          {/* Typing Indicator */}
          {isTyping && (
            <div className="flex gap-3 fade-in">
              <div className="w-9 h-9 rounded-full bg-gradient-to-br from-taupe to-espresso flex items-center justify-center flex-shrink-0">
                <span className="text-white text-xs font-serif font-bold">JC</span>
              </div>
              <div className="bg-parchment rounded-2xl rounded-tl-sm border border-warmBorder px-5 py-4">
                <div className="flex items-center gap-1.5">
                  <div className="w-2 h-2 rounded-full bg-taupe/40 animate-bounce" style={{ animationDelay: "0ms" }} />
                  <div className="w-2 h-2 rounded-full bg-taupe/40 animate-bounce" style={{ animationDelay: "150ms" }} />
                  <div className="w-2 h-2 rounded-full bg-taupe/40 animate-bounce" style={{ animationDelay: "300ms" }} />
                </div>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* ========== Input Area ========== */}
      <div className="flex-shrink-0 border-t border-warmBorder bg-parchment/95 backdrop-blur-sm safe-area-bottom">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 py-3 md:py-4">
          <div className="flex items-end gap-3">
            <div className="flex-1 relative">
              <textarea
                ref={textareaRef}
                value={input}
                onChange={handleTextareaResize}
                onKeyDown={handleKeyDown}
                placeholder="Share what's on your heart..."
                rows={1}
                className="w-full bg-cream border border-warmBorder rounded-xl px-4 py-3 pr-12 text-sm text-espresso placeholder:text-warmGray focus:outline-none focus:ring-2 focus:ring-gold/40 focus:border-gold transition-all resize-none leading-relaxed"
                style={{ maxHeight: "160px" }}
              />
            </div>
            <button
              onClick={() => handleSubmit()}
              disabled={!input.trim() || isTyping}
              className="flex-shrink-0 w-10 h-10 rounded-xl bg-espresso text-white flex items-center justify-center hover:bg-espresso/90 disabled:opacity-40 disabled:cursor-not-allowed transition-all mb-0.5"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="22" y1="2" x2="11" y2="13"/>
                <polygon points="22 2 15 22 11 13 2 9 22 2"/>
              </svg>
            </button>
          </div>
          <p className="text-[10px] text-warmGray mt-2 text-center">
            This is not a substitute for professional counseling or pastoral care. If you are in crisis, please reach out to a trusted pastor or counselor.
          </p>
        </div>
      </div>
    </div>
  );
}
