"use client";

import { useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { completeOnboarding, type Struggle, STRUGGLE_LABELS } from "@/lib/store";

// ---- Struggle card data ----

interface StruggleCard {
  key: Struggle;
  icon: string;
  description: string;
}

const STRUGGLE_CARDS: StruggleCard[] = [
  { key: "anxiety", icon: "🌊", description: "Racing thoughts, constant worry, restlessness" },
  { key: "fear", icon: "🌑", description: "Uncertain about faith, afraid of the future" },
  { key: "loneliness", icon: "🏝️", description: "Feeling disconnected, lacking community" },
  { key: "anger", icon: "🔥", description: "Struggling to forgive, holding onto hurt" },
  { key: "addiction", icon: "⛓️", description: "Battling habits, fighting temptation" },
  { key: "grief", icon: "🕊️", description: "Processing pain, mourning what was lost" },
  { key: "purpose", icon: "🧭", description: "Feeling lost, unsure of God's plan" },
  { key: "relationships", icon: "💔", description: "Conflict, trust issues, broken connections" },
  { key: "identity", icon: "🪞", description: "Not feeling enough, identity struggles" },
  { key: "discipline", icon: "📖", description: "Inconsistent prayer, struggling to read the Bible" },
];

// ---- Component ----

export default function OnboardingPage() {
  const router = useRouter();

  const [step, setStep] = useState(1);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [faithLevel, setFaithLevel] = useState<"new" | "growing" | "mature">("growing");
  const [preferredTime, setPreferredTime] = useState<"morning" | "afternoon" | "evening">("morning");
  const [struggles, setStruggles] = useState<Struggle[]>([]);
  const [transitioning, setTransitioning] = useState(false);

  // Smooth step transition
  const goToStep = useCallback((nextStep: number) => {
    setTransitioning(true);
    setTimeout(() => {
      setStep(nextStep);
      setTransitioning(false);
    }, 300);
  }, []);

  const toggleStruggle = useCallback((s: Struggle) => {
    setStruggles((prev) => {
      if (prev.includes(s)) return prev.filter((x) => x !== s);
      if (prev.length >= 3) return prev;
      return [...prev, s];
    });
  }, []);

  const handleComplete = useCallback(() => {
    completeOnboarding({ name, email, struggles, faithLevel, preferredTime });
    router.push("/");
  }, [name, email, struggles, faithLevel, preferredTime, router]);

  // Get personalized verse for step 4 — we need to save first so getProfile works
  // Instead, compute it directly here from the selected struggles
  const getEncouragementForStruggles = (): { text: string; ref: string } => {
    const encouragements: Record<Struggle, { text: string; ref: string }> = {
      anxiety: {
        text: "Cast all your anxiety on him because he cares for you.",
        ref: "1 Peter 5:7",
      },
      fear: {
        text: "For God has not given us a spirit of fear, but of power and of love and of a sound mind.",
        ref: "2 Timothy 1:7",
      },
      loneliness: {
        text: "The LORD himself goes before you and will be with you; he will never leave you nor forsake you.",
        ref: "Deuteronomy 31:8",
      },
      anger: {
        text: "A gentle answer turns away wrath, but a harsh word stirs up anger.",
        ref: "Proverbs 15:1",
      },
      addiction: {
        text: "So if the Son sets you free, you will be free indeed.",
        ref: "John 8:36",
      },
      grief: {
        text: "He heals the brokenhearted and binds up their wounds.",
        ref: "Psalm 147:3",
      },
      purpose: {
        text: "For I know the plans I have for you, declares the LORD, plans to prosper you and not to harm you.",
        ref: "Jeremiah 29:11",
      },
      relationships: {
        text: "Above all, love each other deeply, because love covers over a multitude of sins.",
        ref: "1 Peter 4:8",
      },
      identity: {
        text: "I praise you because I am fearfully and wonderfully made; your works are wonderful.",
        ref: "Psalm 139:14",
      },
      discipline: {
        text: "No discipline seems pleasant at the time, but painful. Later on, however, it produces a harvest of righteousness and peace.",
        ref: "Hebrews 12:11",
      },
    };

    const primary = struggles[0];
    if (primary && encouragements[primary]) {
      return encouragements[primary];
    }
    return {
      text: "Trust in the LORD with all your heart and lean not on your own understanding.",
      ref: "Proverbs 3:5",
    };
  };

  const canProceed = name.trim().length > 0 && email.trim().length > 0;
  const encouragement = getEncouragementForStruggles();

  // ---- Progress Dots ----

  const progressDots = (
    <div className="flex items-center justify-center gap-3 pt-8 pb-4">
      {[1, 2, 3, 4].map((dot) => (
        <div
          key={dot}
          className={`h-2.5 rounded-full transition-all duration-500 ${
            dot <= step
              ? "w-8 bg-gold"
              : "w-2.5 bg-warmGray/50"
          }`}
        />
      ))}
    </div>
  );

  // ---- Render ----

  return (
    <div
      className={`transition-opacity duration-300 ${transitioning ? "opacity-0" : "opacity-100"}`}
    >
      {/* ======== Step 1: Welcome ======== */}
      {step === 1 && (
        <div className="min-h-screen hero-gradient flex flex-col items-center justify-center px-6 text-center">
          <div className={`max-w-lg mx-auto fade-in-up ${transitioning ? "opacity-0" : ""}`}>
            <div className="mb-8 fade-in-up">
              <svg width="48" height="48" viewBox="0 0 48 48" fill="none" className="mx-auto opacity-60">
                <rect x="20" y="4" width="8" height="40" rx="2" fill="#C9A96E" />
                <rect x="8" y="16" width="32" height="8" rx="2" fill="#C9A96E" />
              </svg>
            </div>
            <h1 className="font-serif text-6xl sm:text-7xl font-bold text-parchment tracking-tight mb-4 fade-in-up fade-in-up-delay-1">
              Abide
            </h1>
            <p className="text-xl sm:text-2xl text-warmGray font-light mb-12 fade-in-up fade-in-up-delay-2">
              Draw closer to God, one day at a time
            </p>
            <div className="mb-14 fade-in-up fade-in-up-delay-3">
              <div className="inline-block bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl px-8 py-6">
                <p className="verse-text text-parchment/90 text-lg italic leading-relaxed">
                  &ldquo;Draw near to God, and He will draw near to you.&rdquo;
                </p>
                <p className="text-gold/80 text-sm mt-3 font-medium tracking-wide">
                  &mdash; James 4:8
                </p>
              </div>
            </div>
            <button
              onClick={() => goToStep(2)}
              className="fade-in-up fade-in-up-delay-4 bg-gold hover:bg-gold/90 text-espresso font-semibold text-lg px-12 py-4 rounded-full transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-gold/20 active:scale-95"
            >
              Get Started
            </button>
          </div>
        </div>
      )}

      {/* ======== Step 2: Your Details ======== */}
      {step === 2 && (
        <div className="min-h-screen bg-parchment flex flex-col">
          {progressDots}
          <div className={`flex-1 flex flex-col items-center justify-center px-6 pb-12 ${transitioning ? "opacity-0" : "fade-in-up"}`}>
            <div className="w-full max-w-md mx-auto">
              <div className="text-center mb-10">
                <h2 className="font-serif text-3xl sm:text-4xl font-bold text-espresso mb-3">
                  Tell us about you
                </h2>
                <p className="text-mocha text-base">
                  Let&apos;s personalize your experience
                </p>
              </div>

              <div className="mb-6">
                <label htmlFor="onboard-name" className="block text-sm font-medium text-mocha mb-2">
                  Your Name
                </label>
                <input
                  id="onboard-name"
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Enter your name"
                  autoComplete="name"
                  className="w-full px-5 py-3.5 bg-white border border-warmBorder rounded-xl text-espresso placeholder:text-warmGray focus:outline-none focus:ring-2 focus:ring-gold/40 focus:border-gold transition-all text-base"
                />
              </div>

              <div className="mb-8">
                <label htmlFor="onboard-email" className="block text-sm font-medium text-mocha mb-2">
                  <span className="flex items-center gap-2">
                    <svg width="18" height="14" viewBox="0 0 18 14" fill="none" className="flex-shrink-0">
                      <path d="M1.5 1L9 7.5L16.5 1" stroke="#8B7355" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                      <rect x="0.75" y="0.5" width="16.5" height="13" rx="2" stroke="#8B7355" strokeWidth="1.5"/>
                    </svg>
                    Email Address
                  </span>
                </label>
                <input
                  id="onboard-email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="your@email.com"
                  autoComplete="email"
                  className="w-full px-5 py-3.5 bg-white border border-warmBorder rounded-xl text-espresso placeholder:text-warmGray focus:outline-none focus:ring-2 focus:ring-gold/40 focus:border-gold transition-all text-base"
                />
                <p className="text-xs text-warmGray mt-2 ml-1">
                  Used to connect with friends on their faith journey
                </p>
              </div>

              <div className="mb-8">
                <label className="block text-sm font-medium text-mocha mb-3">
                  Where are you on your faith journey?
                </label>
                <div className="grid grid-cols-1 gap-3">
                  {([
                    { value: "new" as const, label: "I'm new to faith", icon: "🌱" },
                    { value: "growing" as const, label: "I'm growing in my faith", icon: "🌿" },
                    { value: "mature" as const, label: "I'm mature in my faith", icon: "🌳" },
                  ]).map((opt) => (
                    <button
                      key={opt.value}
                      type="button"
                      onClick={() => setFaithLevel(opt.value)}
                      className={`flex items-center gap-3 px-5 py-3.5 rounded-xl border text-left transition-all duration-200 ${
                        faithLevel === opt.value
                          ? "border-gold bg-gold/10 shadow-sm"
                          : "border-warmBorder bg-white hover:border-warmGray hover:bg-sand/30"
                      }`}
                    >
                      <span className="text-xl">{opt.icon}</span>
                      <span className={`text-sm font-medium ${faithLevel === opt.value ? "text-espresso" : "text-mocha"}`}>
                        {opt.label}
                      </span>
                      {faithLevel === opt.value && (
                        <svg className="ml-auto w-5 h-5 text-gold" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                        </svg>
                      )}
                    </button>
                  ))}
                </div>
              </div>

              <div className="mb-10">
                <label className="block text-sm font-medium text-mocha mb-3">
                  When do you prefer your devotion?
                </label>
                <div className="grid grid-cols-3 gap-3">
                  {([
                    { value: "morning" as const, label: "Morning" },
                    { value: "afternoon" as const, label: "Afternoon" },
                    { value: "evening" as const, label: "Evening" },
                  ]).map((opt) => (
                    <button
                      key={opt.value}
                      type="button"
                      onClick={() => setPreferredTime(opt.value)}
                      className={`flex flex-col items-center gap-2 px-3 py-4 rounded-xl border transition-all duration-200 ${
                        preferredTime === opt.value
                          ? "border-gold bg-gold/10 text-gold shadow-sm"
                          : "border-warmBorder bg-white text-mocha hover:border-warmGray hover:bg-sand/30"
                      }`}
                    >
                      {opt.value === "morning" && (
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                          <circle cx="12" cy="12" r="4" /><path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M6.34 17.66l-1.41 1.41M19.07 4.93l-1.41 1.41" />
                        </svg>
                      )}
                      {opt.value === "afternoon" && (
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                          <circle cx="12" cy="12" r="5" /><path d="M12 3v2M12 19v2M5.64 5.64l1.41 1.41M16.95 16.95l1.41 1.41M3 12h2M19 12h2" />
                        </svg>
                      )}
                      {opt.value === "evening" && (
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z" />
                        </svg>
                      )}
                      <span className={`text-xs font-medium ${preferredTime === opt.value ? "text-espresso" : "text-mocha"}`}>
                        {opt.label}
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => goToStep(1)}
                  className="px-6 py-3.5 rounded-full border border-warmBorder text-mocha font-medium hover:bg-sand/50 transition-all"
                >
                  Back
                </button>
                <button
                  type="button"
                  onClick={() => goToStep(3)}
                  disabled={!canProceed}
                  className={`flex-1 py-3.5 rounded-full font-semibold text-base transition-all duration-300 ${
                    canProceed
                      ? "bg-gold text-espresso hover:bg-gold/90 hover:scale-[1.02] hover:shadow-lg hover:shadow-gold/20 active:scale-95"
                      : "bg-warmGray/30 text-warmGray cursor-not-allowed"
                  }`}
                >
                  Continue
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ======== Step 3: Struggles ======== */}
      {step === 3 && (
        <div className="min-h-screen bg-parchment flex flex-col">
          {progressDots}
          <div className={`flex-1 flex flex-col items-center px-6 pb-12 ${transitioning ? "opacity-0" : "fade-in-up"}`}>
            <div className="w-full max-w-2xl mx-auto pt-4">
              <div className="text-center mb-8">
                <h2 className="font-serif text-3xl sm:text-4xl font-bold text-espresso mb-3">
                  What are you walking through?
                </h2>
                <p className="text-mocha text-base max-w-md mx-auto leading-relaxed">
                  Everyone faces battles. Let us walk with you.
                </p>
                <p className="text-sm text-taupe mt-3 font-medium">
                  Select up to 3
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-10">
                {STRUGGLE_CARDS.map((card) => {
                  const isSelected = struggles.includes(card.key);
                  const isDisabled = !isSelected && struggles.length >= 3;
                  return (
                    <button
                      key={card.key}
                      type="button"
                      onClick={() => toggleStruggle(card.key)}
                      disabled={isDisabled}
                      className={`relative flex items-start gap-4 p-5 rounded-2xl border-2 text-left transition-all duration-200 ${
                        isSelected
                          ? "border-gold bg-gold/8 shadow-md shadow-gold/10"
                          : isDisabled
                          ? "border-warmBorder/50 bg-white/50 opacity-50 cursor-not-allowed"
                          : "border-warmBorder bg-white hover:border-taupe/40 hover:shadow-sm hover:bg-sand/20 cursor-pointer"
                      }`}
                    >
                      {isSelected && (
                        <div className="absolute top-3 right-3">
                          <svg className="w-6 h-6 text-gold" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                          </svg>
                        </div>
                      )}
                      <span className="text-2xl flex-shrink-0 mt-0.5">{card.icon}</span>
                      <div className="flex-1 pr-6">
                        <h3 className={`font-semibold text-sm mb-1 ${isSelected ? "text-espresso" : "text-mocha"}`}>
                          {STRUGGLE_LABELS[card.key]}
                        </h3>
                        <p className="text-xs text-warmGray leading-relaxed">
                          {card.description}
                        </p>
                      </div>
                    </button>
                  );
                })}
              </div>

              <div className="flex gap-3 max-w-md mx-auto">
                <button
                  type="button"
                  onClick={() => goToStep(2)}
                  className="px-6 py-3.5 rounded-full border border-warmBorder text-mocha font-medium hover:bg-sand/50 transition-all"
                >
                  Back
                </button>
                <button
                  type="button"
                  onClick={() => goToStep(4)}
                  disabled={struggles.length === 0}
                  className={`flex-1 py-3.5 rounded-full font-semibold text-base transition-all duration-300 ${
                    struggles.length > 0
                      ? "bg-gold text-espresso hover:bg-gold/90 hover:scale-[1.02] hover:shadow-lg hover:shadow-gold/20 active:scale-95"
                      : "bg-warmGray/30 text-warmGray cursor-not-allowed"
                  }`}
                >
                  Continue
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ======== Step 4: Confirmation ======== */}
      {step === 4 && (
        <div className="min-h-screen bg-parchment flex flex-col">
          {progressDots}
          <div className={`flex-1 flex flex-col items-center justify-center px-6 pb-12 ${transitioning ? "opacity-0" : "fade-in-up"}`}>
            <div className="w-full max-w-lg mx-auto text-center">
              <div className="mb-6 fade-in-up">
                <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gold/15">
                  <svg width="40" height="40" viewBox="0 0 40 40" fill="none" className="text-gold">
                    <path d="M20 4L23.09 13.26L33 14.27L25.81 20.97L27.82 30.73L20 26.27L12.18 30.73L14.19 20.97L7 14.27L16.91 13.26L20 4Z" fill="currentColor" opacity="0.9" />
                  </svg>
                </div>
              </div>
              <h2 className="font-serif text-3xl sm:text-4xl font-bold text-espresso mb-2 fade-in-up fade-in-up-delay-1">
                You&apos;re all set, {name}!
              </h2>
              <p className="text-mocha text-lg mb-8 fade-in-up fade-in-up-delay-1">
                Your journey begins now
              </p>
              <div className="flex flex-wrap justify-center gap-2 mb-8 fade-in-up fade-in-up-delay-2">
                {struggles.map((s) => (
                  <span key={s} className="inline-flex items-center gap-1.5 px-4 py-2 bg-gold/10 border border-gold/30 rounded-full text-sm font-medium text-espresso">
                    {STRUGGLE_CARDS.find((c) => c.key === s)?.icon}
                    {STRUGGLE_LABELS[s]}
                  </span>
                ))}
              </div>
              <div className="bg-white border border-warmBorder rounded-2xl p-8 mb-10 shadow-sm fade-in-up fade-in-up-delay-3">
                <p className="text-xs font-semibold uppercase tracking-widest text-gold mb-4">
                  A verse for your journey
                </p>
                <p className="verse-text text-espresso text-lg italic leading-relaxed mb-3">
                  &ldquo;{encouragement.text}&rdquo;
                </p>
                <p className="text-taupe text-sm font-medium">
                  &mdash; {encouragement.ref}
                </p>
              </div>
              <div className="flex items-center justify-center gap-3 mb-8 fade-in-up fade-in-up-delay-3">
                <div className="h-px w-12 bg-warmBorder" />
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                  <rect x="6.5" y="1" width="3" height="14" rx="1" fill="#C9A96E" opacity="0.5" />
                  <rect x="1" y="6.5" width="14" height="3" rx="1" fill="#C9A96E" opacity="0.5" />
                </svg>
                <div className="h-px w-12 bg-warmBorder" />
              </div>
              <button
                onClick={handleComplete}
                className="fade-in-up fade-in-up-delay-4 bg-gold hover:bg-gold/90 text-espresso font-semibold text-lg px-12 py-4 rounded-full transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-gold/20 active:scale-95"
              >
                Enter Abide
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
