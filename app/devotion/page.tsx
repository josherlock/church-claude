"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import {
  getTodaysDevotionIndex,
  devotions,
  Devotion,
} from "@/lib/devotions";
import {
  markDevotionComplete,
  isCompletedToday,
  saveJournalEntry,
  getTodayJournal,
  getCurrentStreak,
} from "@/lib/store";

export default function DevotionPage() {
  const [mounted, setMounted] = useState(false);
  const [completed, setCompleted] = useState(false);
  const [journalText, setJournalText] = useState("");
  const [streak, setStreak] = useState(0);
  const [showCompletionCelebration, setShowCompletionCelebration] =
    useState(false);
  const [selectedDevotionIndex, setSelectedDevotionIndex] = useState(0);
  const saveTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const todayIndex = getTodaysDevotionIndex();
  const isToday = selectedDevotionIndex === todayIndex;
  const devotion: Devotion = devotions[selectedDevotionIndex];

  const today = new Date();
  const formattedDate = today.toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  useEffect(() => {
    setSelectedDevotionIndex(todayIndex);
    setCompleted(isCompletedToday());
    setJournalText(getTodayJournal());
    setStreak(getCurrentStreak());
    setMounted(true);
  }, [todayIndex]);

  const handleJournalChange = useCallback(
    (value: string) => {
      setJournalText(value);
      if (saveTimeoutRef.current) clearTimeout(saveTimeoutRef.current);
      saveTimeoutRef.current = setTimeout(() => {
        saveJournalEntry(value);
      }, 500);
    },
    []
  );

  const handleComplete = useCallback(() => {
    if (completed) return;
    markDevotionComplete();
    setCompleted(true);
    setStreak(getCurrentStreak());
    setShowCompletionCelebration(true);
    setTimeout(() => setShowCompletionCelebration(false), 4000);
  }, [completed]);

  if (!mounted) {
    return (
      <div className="min-h-screen bg-cream flex items-center justify-center">
        <div className="w-8 h-8 rounded-full hero-gradient animate-pulse" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-cream">
      {/* ========== Completion Celebration Overlay ========== */}
      {showCompletionCelebration && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-espresso/40 backdrop-blur-sm animate-fadeIn">
          <div className="bg-parchment rounded-3xl p-8 md:p-12 max-w-md mx-4 text-center shadow-2xl animate-scaleIn">
            {/* Checkmark animation */}
            <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-taupe/10 flex items-center justify-center">
              <svg
                width="40"
                height="40"
                viewBox="0 0 24 24"
                fill="none"
                className="animate-drawCheck"
              >
                <circle
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="#8B7355"
                  strokeWidth="1.5"
                  fill="#8B7355"
                  fillOpacity="0.1"
                />
                <path
                  d="M8 12.5l2.5 3 5.5-6"
                  stroke="#8B7355"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="animate-checkPath"
                />
              </svg>
            </div>
            <h3 className="font-serif text-2xl font-bold text-espresso mb-2">
              Devotion Complete
            </h3>
            <p className="text-mocha text-sm leading-relaxed mb-6">
              You&apos;ve taken time to dwell in God&apos;s Word today. May it
              bear fruit in your life.
            </p>
            {streak > 0 && (
              <div className="inline-flex items-center gap-2 bg-gold/10 border border-gold/20 rounded-full px-5 py-2.5">
                <span className="text-lg fire-glow">&#x1F525;</span>
                <span className="text-sm font-medium text-espresso">
                  {streak} day streak
                </span>
              </div>
            )}
            <button
              onClick={() => setShowCompletionCelebration(false)}
              className="block w-full mt-6 text-sm text-mocha hover:text-espresso transition-colors"
            >
              Continue reading
            </button>
          </div>
        </div>
      )}

      {/* ========== Header ========== */}
      <header className="hero-gradient relative overflow-hidden fade-in-up">
        <div className="absolute top-0 right-0 w-72 h-72 rounded-full bg-white/5 -translate-y-1/3 translate-x-1/3" />
        <div className="absolute bottom-0 left-0 w-56 h-56 rounded-full bg-white/5 translate-y-1/2 -translate-x-1/3" />

        <div className="relative z-10 max-w-3xl mx-auto px-5 py-12 md:py-16">
          <p className="text-gold/70 text-xs font-sans font-medium tracking-[0.2em] uppercase mb-4">
            Daily Devotion
          </p>
          <h1 className="font-serif text-3xl sm:text-4xl md:text-5xl font-bold text-white/95 leading-tight mb-4">
            {devotion.title}
          </h1>
          <div className="flex flex-wrap items-center gap-3">
            <span className="inline-block text-xs font-medium font-sans text-gold bg-gold/15 px-3 py-1 rounded-full">
              {devotion.theme}
            </span>
            <span className="text-white/50 text-sm font-sans">
              {formattedDate}
            </span>
          </div>
        </div>
      </header>

      {/* ========== Main Content ========== */}
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 -mt-4 relative z-20 space-y-8 pb-12">
        {/* ========== Scripture Section ========== */}
        <section className="fade-in-up fade-in-up-delay-1">
          <div className="bg-parchment rounded-2xl border border-warmBorder overflow-hidden shadow-sm">
            <div className="p-6 md:p-8">
              <div className="flex items-center gap-2 mb-5">
                <svg
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="text-gold"
                >
                  <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
                  <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
                </svg>
                <span className="text-xs font-sans font-medium text-taupe tracking-[0.15em] uppercase">
                  Scripture
                </span>
              </div>

              <div className="border-l-[3px] border-gold/50 pl-5 md:pl-7">
                <p className="verse-text text-lg sm:text-xl md:text-2xl text-espresso leading-[1.8] mb-4">
                  &ldquo;{devotion.verse}&rdquo;
                </p>
                <p className="font-serif text-sm text-taupe italic">
                  &mdash; {devotion.verseReference}
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* ========== Reflection Section ========== */}
        <section className="fade-in-up fade-in-up-delay-2">
          <div className="bg-sand/60 rounded-2xl border border-warmBorder overflow-hidden">
            <div className="p-6 md:p-8">
              <div className="flex items-center gap-2 mb-5">
                <svg
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="text-taupe"
                >
                  <circle cx="12" cy="12" r="10" />
                  <path d="M12 16v-4" />
                  <path d="M12 8h.01" />
                </svg>
                <span className="text-xs font-sans font-medium text-taupe tracking-[0.15em] uppercase">
                  Reflection
                </span>
              </div>

              <p className="text-[15px] md:text-base text-espresso/90 leading-[1.85] font-sans">
                {devotion.reflection}
              </p>
            </div>
          </div>
        </section>

        {/* ========== Johnny Chang Insight ========== */}
        <section className="fade-in-up fade-in-up-delay-3">
          <div className="bg-parchment rounded-2xl border border-gold/20 overflow-hidden shadow-sm relative">
            {/* Gold accent strip */}
            <div className="h-1 bg-gradient-to-r from-gold/40 via-gold to-gold/40" />

            <div className="p-6 md:p-8">
              <div className="flex items-start gap-4 mb-5">
                {/* Avatar */}
                <div className="w-11 h-11 rounded-full bg-gradient-to-br from-taupe to-espresso flex items-center justify-center flex-shrink-0">
                  <span className="text-white text-sm font-serif font-bold">
                    JC
                  </span>
                </div>
                <div>
                  <h3 className="font-serif text-base font-semibold text-espresso">
                    Johnny Chang
                  </h3>
                  <p className="text-xs text-mocha font-sans">
                    {devotion.changSource}
                  </p>
                </div>
              </div>

              <p className="text-[15px] md:text-base text-espresso/85 leading-[1.85] font-sans">
                {devotion.changInsight}
              </p>
            </div>
          </div>
        </section>

        {/* ========== Prayer Prompt ========== */}
        <section className="fade-in-up fade-in-up-delay-4">
          <div className="bg-parchment rounded-2xl border border-warmBorder overflow-hidden shadow-sm">
            <div className="p-6 md:p-8">
              <div className="flex items-center gap-2 mb-5">
                {/* Praying hands icon */}
                <svg
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="text-mocha"
                >
                  <path d="M12 2L12 6" />
                  <path d="M12 18L12 22" />
                  <path d="M4.93 4.93L7.76 7.76" />
                  <path d="M16.24 16.24L19.07 19.07" />
                  <path d="M2 12L6 12" />
                  <path d="M18 12L22 12" />
                  <path d="M4.93 19.07L7.76 16.24" />
                  <path d="M16.24 7.76L19.07 4.93" />
                </svg>
                <span className="text-xs font-sans font-medium text-taupe tracking-[0.15em] uppercase">
                  Prayer
                </span>
              </div>

              <div className="bg-cream/70 rounded-xl p-5 md:p-6 border border-warmBorder/50">
                <p className="text-[15px] md:text-base text-espresso/90 leading-[1.85] font-sans italic">
                  {devotion.prayerPrompt}
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* ========== Journal Section ========== */}
        {isToday && (
          <section className="fade-in-up">
            <div className="bg-parchment rounded-2xl border border-warmBorder overflow-hidden shadow-sm">
              <div className="p-6 md:p-8">
                <div className="flex items-center justify-between mb-5">
                  <div className="flex items-center gap-2">
                    <svg
                      width="18"
                      height="18"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.8"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="text-taupe"
                    >
                      <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                      <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
                    </svg>
                    <span className="text-xs font-sans font-medium text-taupe tracking-[0.15em] uppercase">
                      Journal
                    </span>
                  </div>
                  {journalText.length > 0 && (
                    <span className="text-[10px] text-warmGray font-sans">
                      Auto-saved
                    </span>
                  )}
                </div>

                {/* Journal prompt */}
                <p className="text-sm text-mocha leading-relaxed mb-4 font-sans">
                  {devotion.journalPrompt}
                </p>

                <textarea
                  value={journalText}
                  onChange={(e) => handleJournalChange(e.target.value)}
                  placeholder="Write your reflections here..."
                  rows={6}
                  className="w-full bg-cream/70 border border-warmBorder/60 rounded-xl p-4 md:p-5 text-sm text-espresso font-sans leading-relaxed placeholder:text-warmGray resize-none focus:outline-none focus:ring-2 focus:ring-gold/30 focus:border-gold/50 transition-all"
                />
              </div>
            </div>
          </section>
        )}

        {/* ========== Complete Button ========== */}
        {isToday && (
          <section className="fade-in-up">
            {completed ? (
              <div className="bg-taupe/5 border border-taupe/20 rounded-2xl p-6 md:p-8 text-center">
                <div className="flex items-center justify-center gap-3 mb-3">
                  <svg
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    className="text-taupe"
                  >
                    <circle
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      fill="currentColor"
                      fillOpacity="0.1"
                    />
                    <path
                      d="M8 12.5l2.5 3 5.5-6"
                      stroke="currentColor"
                      strokeWidth="2.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                  <span className="font-serif text-lg font-semibold text-espresso">
                    Devotion Complete
                  </span>
                </div>
                <p className="text-sm text-mocha mb-4">
                  Well done. You&apos;ve spent time with God today.
                </p>
                {streak > 0 && (
                  <div className="inline-flex items-center gap-2 bg-gold/10 border border-gold/20 rounded-full px-4 py-2">
                    <span className="fire-glow">&#x1F525;</span>
                    <span className="text-sm font-medium text-espresso">
                      {streak} day streak &mdash; keep going!
                    </span>
                  </div>
                )}
              </div>
            ) : (
              <button
                onClick={handleComplete}
                className="w-full bg-espresso hover:bg-espresso/90 text-white font-sans font-medium text-base rounded-2xl py-4 md:py-5 shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center gap-3 group"
              >
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="group-hover:scale-110 transition-transform"
                >
                  <polyline points="20 6 9 17 4 12" />
                </svg>
                Mark Devotion as Complete
              </button>
            )}
          </section>
        )}

        {/* ========== Devotion Navigator ========== */}
        <section className="fade-in-up">
          <div className="bg-parchment rounded-2xl border border-warmBorder overflow-hidden shadow-sm">
            <div className="p-5 md:p-6">
              <p className="text-xs font-sans font-medium text-taupe tracking-[0.15em] uppercase mb-4 text-center">
                All Devotions
              </p>

              <div className="flex items-center justify-center gap-3">
                {/* Previous arrow */}
                <button
                  onClick={() =>
                    setSelectedDevotionIndex(
                      (selectedDevotionIndex - 1 + devotions.length) %
                        devotions.length
                    )
                  }
                  className="w-8 h-8 rounded-full border border-warmBorder hover:border-taupe flex items-center justify-center text-mocha hover:text-espresso transition-colors"
                  aria-label="Previous devotion"
                >
                  <svg
                    width="14"
                    height="14"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <polyline points="15 18 9 12 15 6" />
                  </svg>
                </button>

                {/* Dots */}
                <div className="flex items-center gap-2">
                  {devotions.map((d, i) => {
                    const isCurrent = i === selectedDevotionIndex;
                    const isTodayDot = i === todayIndex;
                    return (
                      <button
                        key={d.id}
                        onClick={() => setSelectedDevotionIndex(i)}
                        className={`relative transition-all duration-300 rounded-full ${
                          isCurrent
                            ? "w-8 h-3 bg-taupe"
                            : isTodayDot
                              ? "w-3 h-3 bg-gold/60 hover:bg-gold"
                              : "w-3 h-3 bg-warmGray/40 hover:bg-warmGray"
                        }`}
                        aria-label={`Devotion ${i + 1}: ${d.title}`}
                        title={d.title}
                      />
                    );
                  })}
                </div>

                {/* Next arrow */}
                <button
                  onClick={() =>
                    setSelectedDevotionIndex(
                      (selectedDevotionIndex + 1) % devotions.length
                    )
                  }
                  className="w-8 h-8 rounded-full border border-warmBorder hover:border-taupe flex items-center justify-center text-mocha hover:text-espresso transition-colors"
                  aria-label="Next devotion"
                >
                  <svg
                    width="14"
                    height="14"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <polyline points="9 18 15 12 9 6" />
                  </svg>
                </button>
              </div>

              {/* Devotion title preview */}
              <p className="text-center text-sm text-mocha mt-3 font-serif">
                {devotion.title}
                {isToday && (
                  <span className="ml-2 text-[10px] font-sans text-gold font-medium tracking-wide uppercase">
                    Today
                  </span>
                )}
              </p>
            </div>
          </div>
        </section>

        {/* Bottom spacing for mobile nav */}
        <div className="h-8 md:h-12" />
      </div>

      {/* ========== Inline Styles for Animations ========== */}
      <style jsx>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }
        @keyframes scaleIn {
          from {
            opacity: 0;
            transform: scale(0.9) translateY(10px);
          }
          to {
            opacity: 1;
            transform: scale(1) translateY(0);
          }
        }
        @keyframes drawCheck {
          from {
            stroke-dashoffset: 20;
          }
          to {
            stroke-dashoffset: 0;
          }
        }
        .animate-fadeIn {
          animation: fadeIn 0.3s ease-out forwards;
        }
        .animate-scaleIn {
          animation: scaleIn 0.4s cubic-bezier(0.34, 1.56, 0.64, 1) forwards;
        }
        .animate-checkPath {
          stroke-dasharray: 20;
          stroke-dashoffset: 20;
          animation: drawCheck 0.6s ease-out 0.3s forwards;
        }
      `}</style>
    </div>
  );
}
