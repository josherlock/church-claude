"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  getCurrentStreak,
  isCompletedToday,
  getTotalCompletions,
  getLast30DaysCompletions,
  getFriends,
  getProfile,
  Friend,
  STRUGGLE_LABELS,
  type Struggle,
  type UserProfile,
} from "@/lib/store";
import { getTodaysVerse } from "@/lib/devotions";
import {
  getPersonalizedTodayDevotion,
  getPersonalizedGreeting,
  getPersonalizedEncouragement,
} from "@/lib/personalization";

export default function HomePage() {
  const [streak, setStreak] = useState(0);
  const [completedToday, setCompletedToday] = useState(false);
  const [totalCompletions, setTotalCompletions] = useState(0);
  const [last30Days, setLast30Days] = useState<
    { date: string; completed: boolean }[]
  >([]);
  const [friends, setFriends] = useState<Friend[]>([]);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [greeting, setGreeting] = useState("");
  const [encouragement, setEncouragement] = useState<{ text: string; ref: string }>({ text: "", ref: "" });
  const [mounted, setMounted] = useState(false);

  const todaysDevotion = getPersonalizedTodayDevotion();
  const todaysVerse = getTodaysVerse();

  useEffect(() => {
    setStreak(getCurrentStreak());
    setCompletedToday(isCompletedToday());
    setTotalCompletions(getTotalCompletions());
    setLast30Days(getLast30DaysCompletions());
    setFriends(getFriends());
    setProfile(getProfile());
    setGreeting(getPersonalizedGreeting());
    setEncouragement(getPersonalizedEncouragement());
    setMounted(true);
  }, []);

  const formatDay = (dateStr: string) => {
    const d = new Date(dateStr + "T00:00:00");
    return d.getDate();
  };

  const formatDayName = (dateStr: string) => {
    const d = new Date(dateStr + "T00:00:00");
    return d.toLocaleDateString("en-US", { weekday: "narrow" });
  };

  if (!mounted) {
    return (
      <div className="min-h-screen bg-cream flex items-center justify-center">
        <div className="w-8 h-8 rounded-full hero-gradient animate-pulse" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-cream">
      {/* ========== Hero Section ========== */}
      <section className="hero-gradient relative overflow-hidden fade-in-up">
        {/* Subtle decorative circles */}
        <div className="absolute top-0 right-0 w-64 h-64 rounded-full bg-white/5 -translate-y-1/2 translate-x-1/2" />
        <div className="absolute bottom-0 left-0 w-48 h-48 rounded-full bg-white/5 translate-y-1/2 -translate-x-1/2" />

        <div className="relative z-10 max-w-4xl mx-auto px-5 py-14 md:py-20 text-center">
          {/* Personalized Greeting */}
          {greeting && (
            <p className="text-white/70 text-sm font-sans font-medium mb-4">
              {greeting}
            </p>
          )}
          <p className="text-gold/80 text-xs font-sans font-medium tracking-[0.2em] uppercase mb-6">
            Daily Verse
          </p>
          <blockquote className="verse-text text-xl sm:text-2xl md:text-3xl text-white/95 leading-relaxed max-w-3xl mx-auto mb-6">
            &ldquo;{todaysVerse.text}&rdquo;
          </blockquote>
          <p className="text-gold font-serif text-sm md:text-base tracking-wide">
            {todaysVerse.ref}
          </p>
        </div>
      </section>

      {/* ========== Main Content ========== */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 -mt-6 relative z-20">
        {/* ========== Streak & Stats Bar ========== */}
        <section className="fade-in-up fade-in-up-delay-1">
          <div className="grid grid-cols-3 gap-3 md:gap-4">
            {/* Streak */}
            <div className="bg-parchment rounded-2xl p-4 md:p-5 shadow-sm border border-warmBorder text-center card-hover">
              <div className="fire-glow text-2xl md:text-3xl mb-1">
                {streak > 0 ? "🔥" : "✨"}
              </div>
              <p className="text-2xl md:text-3xl font-serif font-bold text-espresso">
                {streak}
              </p>
              <p className="text-xs md:text-sm text-mocha mt-1">
                Day Streak
              </p>
            </div>

            {/* Total */}
            <div className="bg-parchment rounded-2xl p-4 md:p-5 shadow-sm border border-warmBorder text-center card-hover">
              <div className="text-2xl md:text-3xl mb-1">📖</div>
              <p className="text-2xl md:text-3xl font-serif font-bold text-espresso">
                {totalCompletions}
              </p>
              <p className="text-xs md:text-sm text-mocha mt-1">
                Completed
              </p>
            </div>

            {/* Today */}
            <div
              className={`rounded-2xl p-4 md:p-5 shadow-sm border text-center card-hover ${
                completedToday
                  ? "bg-taupe/10 border-taupe/30"
                  : "bg-parchment border-warmBorder"
              }`}
            >
              <div className="text-2xl md:text-3xl mb-1">
                {completedToday ? "✅" : "⭕"}
              </div>
              <p className="text-2xl md:text-3xl font-serif font-bold text-espresso">
                {completedToday ? "Done" : "Go"}
              </p>
              <p className="text-xs md:text-sm text-mocha mt-1">
                Today
              </p>
            </div>
          </div>
        </section>

        {/* ========== Personalized Encouragement ========== */}
        {profile && profile.struggles.length > 0 && encouragement.text && (
          <section className="mt-6 fade-in-up fade-in-up-delay-1">
            <div className="bg-parchment rounded-2xl p-5 md:p-6 border border-warmBorder">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-xl bg-gold/15 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-lg">💛</span>
                </div>
                <div className="flex-1">
                  <p className="text-xs font-medium text-taupe tracking-wide uppercase mb-2">
                    A Word for Your Journey
                  </p>
                  <p className="text-sm text-espresso leading-relaxed font-serif italic">
                    &ldquo;{encouragement.text}&rdquo;
                  </p>
                  <p className="text-xs text-taupe mt-1.5">{encouragement.ref}</p>
                  <div className="flex flex-wrap gap-1.5 mt-3">
                    {profile.struggles.map((s) => (
                      <span
                        key={s}
                        className="text-[10px] font-medium text-mocha bg-sand/80 px-2.5 py-1 rounded-full"
                      >
                        {STRUGGLE_LABELS[s]}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </section>
        )}

        {/* ========== Two-Column Layout (desktop) ========== */}
        <div className="mt-8 grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
          {/* Left Column (2/3) */}
          <div className="lg:col-span-2 space-y-6">
            {/* ========== Quick Actions Grid ========== */}
            <section className="fade-in-up fade-in-up-delay-2">
              <h2 className="font-serif text-lg md:text-xl font-semibold text-espresso mb-4">
                Explore
              </h2>
              <div className="grid grid-cols-2 gap-3 md:gap-4">
                {/* Bible */}
                <Link href="/bible" className="block">
                  <div className="bg-parchment rounded-2xl p-5 md:p-6 border border-warmBorder card-hover group">
                    <div className="w-10 h-10 md:w-12 md:h-12 rounded-xl bg-taupe/10 flex items-center justify-center mb-3 group-hover:bg-taupe/20 transition-colors">
                      <svg
                        width="22"
                        height="22"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="1.8"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="text-taupe"
                      >
                        <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
                        <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
                        <line x1="12" y1="6" x2="12" y2="13" />
                        <line x1="8.5" y1="9.5" x2="15.5" y2="9.5" />
                      </svg>
                    </div>
                    <h3 className="font-serif font-semibold text-espresso text-sm md:text-base">
                      Bible
                    </h3>
                    <p className="text-xs md:text-sm text-mocha mt-1 leading-relaxed">
                      Read Scripture at your own pace
                    </p>
                  </div>
                </Link>

                {/* Devotion */}
                <Link href="/devotion" className="block">
                  <div className="bg-parchment rounded-2xl p-5 md:p-6 border border-warmBorder card-hover group">
                    <div className="w-10 h-10 md:w-12 md:h-12 rounded-xl bg-gold/10 flex items-center justify-center mb-3 group-hover:bg-gold/20 transition-colors">
                      <svg
                        width="22"
                        height="22"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="1.8"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="text-gold"
                      >
                        <circle cx="12" cy="12" r="10" />
                        <path d="M12 6v6l4 2" />
                      </svg>
                    </div>
                    <h3 className="font-serif font-semibold text-espresso text-sm md:text-base">
                      Devotion
                    </h3>
                    <p className="text-xs md:text-sm text-mocha mt-1 leading-relaxed">
                      Daily guided reflection
                    </p>
                  </div>
                </Link>

                {/* Teachings */}
                <Link href="/teachings" className="block">
                  <div className="bg-parchment rounded-2xl p-5 md:p-6 border border-warmBorder card-hover group">
                    <div className="w-10 h-10 md:w-12 md:h-12 rounded-xl bg-mocha/10 flex items-center justify-center mb-3 group-hover:bg-mocha/20 transition-colors">
                      <svg
                        width="22"
                        height="22"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="1.8"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="text-mocha"
                      >
                        <polygon points="5 3 19 12 5 21 5 3" />
                      </svg>
                    </div>
                    <h3 className="font-serif font-semibold text-espresso text-sm md:text-base">
                      Teachings
                    </h3>
                    <p className="text-xs md:text-sm text-mocha mt-1 leading-relaxed">
                      Sermons and spiritual lessons
                    </p>
                  </div>
                </Link>

                {/* Community */}
                <Link href="/community" className="block">
                  <div className="bg-parchment rounded-2xl p-5 md:p-6 border border-warmBorder card-hover group">
                    <div className="w-10 h-10 md:w-12 md:h-12 rounded-xl bg-sage/10 flex items-center justify-center mb-3 group-hover:bg-sage/20 transition-colors">
                      <svg
                        width="22"
                        height="22"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="1.8"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="text-sage"
                      >
                        <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                        <circle cx="9" cy="7" r="4" />
                        <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
                        <path d="M16 3.13a4 4 0 0 1 0 7.75" />
                      </svg>
                    </div>
                    <h3 className="font-serif font-semibold text-espresso text-sm md:text-base">
                      Community
                    </h3>
                    <p className="text-xs md:text-sm text-mocha mt-1 leading-relaxed">
                      Walk together with friends
                    </p>
                  </div>
                </Link>
              </div>
            </section>

            {/* ========== Today's Devotion Preview ========== */}
            <section className="fade-in-up fade-in-up-delay-3">
              <h2 className="font-serif text-lg md:text-xl font-semibold text-espresso mb-4">
                Today&apos;s Devotion
              </h2>
              <div className="bg-parchment rounded-2xl border border-warmBorder overflow-hidden card-hover">
                <div className="hero-gradient-light h-2" />
                <div className="p-5 md:p-7">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <span className="inline-block text-xs font-medium font-sans text-taupe bg-taupe/10 px-3 py-1 rounded-full mb-3">
                        {todaysDevotion.theme}
                      </span>
                      <h3 className="font-serif text-lg md:text-xl font-semibold text-espresso mb-2">
                        {todaysDevotion.title}
                      </h3>
                      <p className="text-sm text-mocha leading-relaxed line-clamp-2">
                        {todaysDevotion.reflection}
                      </p>
                    </div>
                  </div>

                  <div className="mt-5 flex items-center gap-3">
                    <Link
                      href="/devotion"
                      className="inline-flex items-center gap-2 bg-espresso text-white px-5 py-2.5 rounded-xl text-sm font-medium hover:bg-espresso/90 transition-colors"
                    >
                      {completedToday ? "Review Devotion" : "Begin Devotion"}
                      <svg
                        width="16"
                        height="16"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <line x1="5" y1="12" x2="19" y2="12" />
                        <polyline points="12 5 19 12 12 19" />
                      </svg>
                    </Link>
                    {completedToday && (
                      <span className="text-xs text-taupe font-medium flex items-center gap-1">
                        <svg
                          width="14"
                          height="14"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2.5"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          className="text-taupe"
                        >
                          <polyline points="20 6 9 17 4 12" />
                        </svg>
                        Completed today
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </section>

            {/* ========== 30-Day Calendar ========== */}
            <section className="fade-in-up fade-in-up-delay-4">
              <h2 className="font-serif text-lg md:text-xl font-semibold text-espresso mb-4">
                Your Journey
              </h2>
              <div className="bg-parchment rounded-2xl p-5 md:p-6 border border-warmBorder">
                <div className="flex items-center justify-between mb-4">
                  <p className="text-sm text-mocha">Last 30 days</p>
                  <p className="text-sm text-taupe font-medium">
                    {last30Days.filter((d) => d.completed).length}/30 days
                  </p>
                </div>

                {/* Calendar Grid */}
                <div className="grid grid-cols-10 sm:grid-cols-15 gap-2">
                  {last30Days.map((day, i) => {
                    const isToday = i === last30Days.length - 1;
                    return (
                      <div
                        key={day.date}
                        className="flex flex-col items-center gap-1"
                        title={`${day.date}${day.completed ? " - Completed" : ""}`}
                      >
                        <span className="text-[9px] text-warmGray font-medium">
                          {formatDay(day.date)}
                        </span>
                        <div
                          className={`w-6 h-6 md:w-7 md:h-7 rounded-full flex items-center justify-center transition-all ${
                            day.completed
                              ? "bg-taupe shadow-sm"
                              : isToday
                                ? "border-2 border-gold bg-gold/5"
                                : "border border-warmBorder bg-cream"
                          }`}
                        >
                          {day.completed && (
                            <svg
                              width="12"
                              height="12"
                              viewBox="0 0 24 24"
                              fill="none"
                              stroke="white"
                              strokeWidth="3"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            >
                              <polyline points="20 6 9 17 4 12" />
                            </svg>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </section>
          </div>

          {/* Right Column (1/3) */}
          <div className="space-y-6">
            {/* ========== Friend Activity ========== */}
            <section className="fade-in-up fade-in-up-delay-3">
              <h2 className="font-serif text-lg md:text-xl font-semibold text-espresso mb-4">
                Friend Activity
              </h2>
              <div className="bg-parchment rounded-2xl border border-warmBorder overflow-hidden">
                {friends.length > 0 ? (
                  <ul className="divide-y divide-warmBorder">
                    {friends.map((friend) => (
                      <li
                        key={friend.id}
                        className="px-5 py-4 flex items-center gap-3"
                      >
                        {/* Avatar */}
                        <div className="w-9 h-9 rounded-full bg-taupe/15 flex items-center justify-center flex-shrink-0">
                          <span className="text-sm font-serif font-semibold text-taupe">
                            {friend.name.charAt(0).toUpperCase()}
                          </span>
                        </div>

                        {/* Info */}
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-espresso truncate">
                            {friend.name}
                          </p>
                          <p className="text-xs text-mocha">
                            🔥 {friend.streak} day streak
                          </p>
                        </div>

                        {/* Status */}
                        <div
                          className={`w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0 ${
                            friend.completedToday
                              ? "bg-taupe/15"
                              : "bg-warmBorder/50"
                          }`}
                        >
                          {friend.completedToday ? (
                            <svg
                              width="13"
                              height="13"
                              viewBox="0 0 24 24"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="3"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              className="text-taupe"
                            >
                              <polyline points="20 6 9 17 4 12" />
                            </svg>
                          ) : (
                            <div className="w-2 h-2 rounded-full bg-warmGray" />
                          )}
                        </div>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <div className="px-5 py-8 text-center">
                    <div className="w-12 h-12 rounded-full bg-taupe/10 flex items-center justify-center mx-auto mb-3">
                      <svg
                        width="22"
                        height="22"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="1.8"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="text-taupe"
                      >
                        <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                        <circle cx="9" cy="7" r="4" />
                        <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
                        <path d="M16 3.13a4 4 0 0 1 0 7.75" />
                      </svg>
                    </div>
                    <p className="text-sm font-medium text-espresso mb-1">
                      No friends yet
                    </p>
                    <p className="text-xs text-mocha leading-relaxed mb-4">
                      Walk this journey with others. Add friends to encourage
                      one another in faith.
                    </p>
                    <Link
                      href="/community"
                      className="inline-flex items-center gap-1.5 text-xs font-medium text-taupe hover:text-espresso transition-colors"
                    >
                      Go to Community
                      <svg
                        width="12"
                        height="12"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <line x1="5" y1="12" x2="19" y2="12" />
                        <polyline points="12 5 19 12 12 19" />
                      </svg>
                    </Link>
                  </div>
                )}
              </div>
            </section>

            {/* ========== Scripture Encouragement (desktop sidebar filler) ========== */}
            <section className="hidden lg:block fade-in-up fade-in-up-delay-4">
              <div className="bg-parchment rounded-2xl p-6 border border-warmBorder">
                <div className="w-10 h-10 rounded-xl hero-gradient flex items-center justify-center mb-4">
                  <span className="text-white text-xs font-serif font-bold">A</span>
                </div>
                <p className="text-sm text-mocha leading-relaxed">
                  &ldquo;Let the word of Christ dwell in you richly, teaching
                  and admonishing one another in all wisdom.&rdquo;
                </p>
                <p className="text-xs text-taupe font-serif mt-2">
                  Colossians 3:16
                </p>
              </div>
            </section>
          </div>
        </div>

        {/* Bottom spacing for mobile nav */}
        <div className="h-8 md:h-12" />
      </div>
    </div>
  );
}
