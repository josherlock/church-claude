"use client";

import { useState, useEffect } from "react";
import {
  getFriends,
  addFriend,
  addFriendByEmail,
  removeFriend,
  getProfile,
  saveProfile,
  getCurrentStreak,
  getTotalCompletions,
  isCompletedToday,
  Friend,
  type UserProfile,
} from "@/lib/store";

// Avatar color palette (warm earth tones)
const AVATAR_COLORS = [
  "bg-taupe",
  "bg-mocha",
  "bg-gold",
  "bg-espresso",
  "bg-warmGray",
  "bg-sage",
];

function getAvatarColor(name: string): string {
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }
  return AVATAR_COLORS[Math.abs(hash) % AVATAR_COLORS.length];
}

function getInitials(name: string): string {
  return name
    .split(" ")
    .map((w) => w[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
}

function getRankDisplay(rank: number) {
  if (rank === 1) return (
    <span className="inline-flex items-center justify-center w-7 h-7 rounded-full bg-gold/20 text-gold font-serif font-bold text-xs">1</span>
  );
  if (rank === 2) return (
    <span className="inline-flex items-center justify-center w-7 h-7 rounded-full bg-taupe/15 text-taupe font-serif font-bold text-xs">2</span>
  );
  if (rank === 3) return (
    <span className="inline-flex items-center justify-center w-7 h-7 rounded-full bg-warmGray/20 text-mocha font-serif font-bold text-xs">3</span>
  );
  return (
    <span className="inline-flex items-center justify-center w-7 h-7 text-mocha font-serif font-bold text-xs">{rank}</span>
  );
}

export default function CommunityPage() {
  const [mounted, setMounted] = useState(false);
  const [friends, setFriends] = useState<Friend[]>([]);
  const [profileName, setProfileName] = useState("");
  const [profileId, setProfileId] = useState("");
  const [streak, setStreak] = useState(0);
  const [totalCompletions, setTotalCompletions] = useState(0);
  const [completedToday, setCompletedToday] = useState(false);
  const [newFriendEmail, setNewFriendEmail] = useState("");
  const [addMode, setAddMode] = useState<"email" | "name">("email");
  const [newFriendName, setNewFriendName] = useState("");
  const [profileEmail, setProfileEmail] = useState("");
  const [isEditingName, setIsEditingName] = useState(false);
  const [editNameValue, setEditNameValue] = useState("");
  const [confirmRemoveId, setConfirmRemoveId] = useState<string | null>(null);
  const [justAdded, setJustAdded] = useState(false);

  useEffect(() => {
    const profile = getProfile();
    setProfileName(profile.name || "You");
    setProfileId(profile.id);
    setProfileEmail(profile.email || "");
    setStreak(getCurrentStreak());
    setTotalCompletions(getTotalCompletions());
    setCompletedToday(isCompletedToday());
    setFriends(getFriends());
    setMounted(true);
  }, []);

  const handleAddFriendByEmail = () => {
    const trimmed = newFriendEmail.trim();
    if (!trimmed || !trimmed.includes("@")) return;
    const newFriend = addFriendByEmail(trimmed);
    setFriends((prev) => [...prev, newFriend]);
    setNewFriendEmail("");
    setJustAdded(true);
    setTimeout(() => setJustAdded(false), 2000);
  };

  const handleAddFriend = () => {
    const trimmed = newFriendName.trim();
    if (!trimmed) return;
    const newFriend = addFriend(trimmed);
    setFriends((prev) => [...prev, newFriend]);
    setNewFriendName("");
    setJustAdded(true);
    setTimeout(() => setJustAdded(false), 2000);
  };

  const handleRemoveFriend = (id: string) => {
    removeFriend(id);
    setFriends((prev) => prev.filter((f) => f.id !== id));
    setConfirmRemoveId(null);
  };

  const handleSaveName = () => {
    const trimmed = editNameValue.trim();
    if (trimmed) {
      saveProfile(trimmed);
      setProfileName(trimmed);
    }
    setIsEditingName(false);
  };

  const startEditingName = () => {
    setEditNameValue(profileName === "You" ? "" : profileName);
    setIsEditingName(true);
  };

  // Build leaderboard: user + friends, sorted by streak
  const leaderboardEntries = [
    {
      id: "__self__",
      name: profileName,
      streak,
      completedToday,
      isSelf: true,
    },
    ...friends.map((f) => ({
      id: f.id,
      name: f.name,
      streak: f.streak,
      completedToday: f.completedToday,
      isSelf: false,
    })),
  ].sort((a, b) => b.streak - a.streak);

  // Group stats
  const totalGroupStreak = leaderboardEntries.reduce(
    (sum, e) => sum + e.streak,
    0
  );
  const completedCount = leaderboardEntries.filter(
    (e) => e.completedToday
  ).length;
  const totalMembers = leaderboardEntries.length;

  if (!mounted) {
    return (
      <div className="min-h-screen bg-cream flex items-center justify-center">
        <div className="w-8 h-8 rounded-full hero-gradient animate-pulse" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-cream">
      {/* ========== Header / Hero ========== */}
      <section className="hero-gradient relative overflow-hidden fade-in-up">
        <div className="absolute top-0 right-0 w-64 h-64 rounded-full bg-white/5 -translate-y-1/2 translate-x-1/2" />
        <div className="absolute bottom-0 left-0 w-48 h-48 rounded-full bg-white/5 translate-y-1/2 -translate-x-1/2" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 rounded-full bg-white/[0.02]" />

        <div className="relative z-10 max-w-4xl mx-auto px-5 py-14 md:py-20 text-center">
          <div className="inline-flex items-center gap-2 mb-6">
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.8"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="text-gold/80"
            >
              <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
              <circle cx="9" cy="7" r="4" />
              <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
              <path d="M16 3.13a4 4 0 0 1 0 7.75" />
            </svg>
            <p className="text-gold/80 text-xs font-sans font-medium tracking-[0.2em] uppercase">
              Community
            </p>
          </div>
          <h1 className="font-serif text-3xl sm:text-4xl md:text-5xl font-bold text-white/95 mb-4">
            Community
          </h1>
          <p className="text-white/60 font-sans text-sm md:text-base max-w-md mx-auto leading-relaxed">
            Walk together in faith. Encourage one another and hold each other
            accountable on this journey.
          </p>
        </div>
      </section>

      {/* ========== Main Content ========== */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 -mt-6 relative z-20 pb-12">
        {/* ========== Your Profile Card ========== */}
        <section className="fade-in-up fade-in-up-delay-1 mb-8">
          <div className="bg-parchment rounded-2xl border border-warmBorder shadow-sm overflow-hidden">
            <div className="hero-gradient-light h-1.5" />
            <div className="p-5 md:p-7">
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-center gap-4">
                  {/* Avatar */}
                  <div className="w-14 h-14 md:w-16 md:h-16 rounded-full hero-gradient flex items-center justify-center flex-shrink-0 shadow-md">
                    <span className="text-white text-lg md:text-xl font-serif font-bold">
                      {getInitials(profileName || "Y")}
                    </span>
                  </div>

                  <div>
                    {isEditingName ? (
                      <div className="flex items-center gap-2">
                        <input
                          type="text"
                          value={editNameValue}
                          onChange={(e) => setEditNameValue(e.target.value)}
                          onKeyDown={(e) => e.key === "Enter" && handleSaveName()}
                          className="bg-cream border border-warmBorder rounded-lg px-3 py-1.5 text-sm font-medium text-espresso focus:outline-none focus:ring-2 focus:ring-gold/40 focus:border-gold font-sans"
                          placeholder="Your name"
                          autoFocus
                        />
                        <button
                          onClick={handleSaveName}
                          className="text-xs font-medium text-white bg-taupe hover:bg-espresso px-3 py-1.5 rounded-lg transition-colors"
                        >
                          Save
                        </button>
                        <button
                          onClick={() => setIsEditingName(false)}
                          className="text-xs font-medium text-mocha hover:text-espresso px-2 py-1.5 transition-colors"
                        >
                          Cancel
                        </button>
                      </div>
                    ) : (
                      <div className="flex items-center gap-2">
                        <h2 className="font-serif text-xl md:text-2xl font-semibold text-espresso">
                          {profileName}
                        </h2>
                        <button
                          onClick={startEditingName}
                          className="text-warmGray hover:text-taupe transition-colors p-1"
                          title="Edit name"
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
                            <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                            <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
                          </svg>
                        </button>
                      </div>
                    )}
                    {profileEmail && (
                      <p className="text-xs text-mocha mt-0.5 font-sans flex items-center gap-1">
                        <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                          <polyline points="22,6 12,13 2,6" />
                        </svg>
                        {profileEmail}
                      </p>
                    )}
                    <p className="text-[10px] text-warmGray mt-0.5 font-sans">
                      ID: {profileId}
                    </p>
                  </div>
                </div>
              </div>

              {/* Stats row */}
              <div className="grid grid-cols-3 gap-3 mt-5">
                <div className="bg-cream rounded-xl p-3 text-center border border-warmBorder/50">
                  <p className="text-lg md:text-xl font-serif font-bold text-espresso">
                    <span className="flex items-center justify-center gap-1">
                      {streak > 0 ? (
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" className="text-gold inline-block">
                          <path d="M12 2c.3 2.2.5 3.8 2 6 1.2 1.7 2 3.3 2 5.5a6 6 0 0 1-12 0c0-2.2.8-3.8 2-5.5C7.5 5.8 8 4 8.5 2c1 2 1.5 3 2 4 .5-.7 1-2 1.5-4z" fill="currentColor" opacity="0.85"/>
                        </svg>
                      ) : (
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="text-warmGray inline-block">
                          <path d="M12 3v2M12 19v2M5.64 5.64l1.41 1.41M16.95 16.95l1.41 1.41M3 12h2M19 12h2"/>
                        </svg>
                      )}
                      {streak}
                    </span>
                  </p>
                  <p className="text-xs text-mocha mt-0.5">Day Streak</p>
                </div>
                <div className="bg-cream rounded-xl p-3 text-center border border-warmBorder/50">
                  <p className="text-lg md:text-xl font-serif font-bold text-espresso">
                    {totalCompletions}
                  </p>
                  <p className="text-xs text-mocha mt-0.5">Completions</p>
                </div>
                <div
                  className={`rounded-xl p-3 text-center border ${
                    completedToday
                      ? "bg-taupe/10 border-taupe/20"
                      : "bg-cream border-warmBorder/50"
                  }`}
                >
                  <p className="text-lg md:text-xl font-serif font-bold text-espresso">
                    {completedToday ? (
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" className="text-taupe mx-auto">
                        <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="1.8" fill="currentColor" fillOpacity="0.1"/>
                        <path d="M8 12.5l2.5 3 5.5-6" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    ) : (
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="text-warmGray mx-auto">
                        <circle cx="12" cy="12" r="10"/>
                      </svg>
                    )}
                  </p>
                  <p className="text-xs text-mocha mt-0.5">
                    {completedToday ? "Done Today" : "Not Yet"}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ========== Add Friend Section ========== */}
        <section className="fade-in-up fade-in-up-delay-2 mb-8">
          <h2 className="font-serif text-lg md:text-xl font-semibold text-espresso mb-4">
            Connect with Friends
          </h2>
          <div className="bg-parchment rounded-2xl border border-warmBorder p-5 md:p-6">
            {/* Toggle between email and name */}
            <div className="flex gap-2 mb-4">
              <button
                onClick={() => setAddMode("email")}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                  addMode === "email"
                    ? "bg-espresso text-white"
                    : "bg-sand text-mocha hover:bg-warmGray/30"
                }`}
              >
                <span className="flex items-center gap-2">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                    <polyline points="22,6 12,13 2,6" />
                  </svg>
                  Gmail
                </span>
              </button>
              <button
                onClick={() => setAddMode("name")}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                  addMode === "name"
                    ? "bg-espresso text-white"
                    : "bg-sand text-mocha hover:bg-warmGray/30"
                }`}
              >
                <span className="flex items-center gap-2">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                    <circle cx="12" cy="7" r="4" />
                  </svg>
                  Name
                </span>
              </button>
            </div>

            {addMode === "email" ? (
              <>
                <p className="text-sm text-mocha mb-4 leading-relaxed">
                  Connect with friends using their Gmail address. Walk alongside them in faith and keep each other accountable.
                </p>
                <div className="flex gap-3">
                  <div className="flex-1 relative">
                    <svg
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.8"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="absolute left-3.5 top-1/2 -translate-y-1/2 text-warmGray"
                    >
                      <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                      <polyline points="22,6 12,13 2,6" />
                    </svg>
                    <input
                      type="email"
                      value={newFriendEmail}
                      onChange={(e) => setNewFriendEmail(e.target.value)}
                      onKeyDown={(e) => e.key === "Enter" && handleAddFriendByEmail()}
                      placeholder="friend@gmail.com"
                      className="w-full bg-cream border border-warmBorder rounded-xl pl-10 pr-4 py-3 text-sm text-espresso placeholder:text-warmGray focus:outline-none focus:ring-2 focus:ring-gold/40 focus:border-gold transition-all font-sans"
                    />
                  </div>
                  <button
                    onClick={handleAddFriendByEmail}
                    disabled={!newFriendEmail.trim() || !newFriendEmail.includes("@")}
                    className="inline-flex items-center gap-2 bg-espresso text-white px-5 py-3 rounded-xl text-sm font-medium hover:bg-espresso/90 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
                  >
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <line x1="12" y1="5" x2="12" y2="19" />
                      <line x1="5" y1="12" x2="19" y2="12" />
                    </svg>
                    Connect
                  </button>
                </div>
                {profileEmail && (
                  <div className="mt-4 p-3 bg-cream/80 rounded-xl border border-warmBorder/50">
                    <p className="text-xs text-mocha">
                      <span className="font-medium text-espresso">Your email:</span>{" "}
                      {profileEmail}
                    </p>
                    <p className="text-[11px] text-warmGray mt-1">
                      Share this with friends so they can connect with you
                    </p>
                  </div>
                )}
              </>
            ) : (
              <>
                <p className="text-sm text-mocha mb-4 leading-relaxed">
                  Add a friend by name to track your faith journey together.
                </p>
                <div className="flex gap-3">
                  <input
                    type="text"
                    value={newFriendName}
                    onChange={(e) => setNewFriendName(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && handleAddFriend()}
                    placeholder="Enter friend's name..."
                    className="flex-1 bg-cream border border-warmBorder rounded-xl px-4 py-3 text-sm text-espresso placeholder:text-warmGray focus:outline-none focus:ring-2 focus:ring-gold/40 focus:border-gold transition-all font-sans"
                  />
                  <button
                    onClick={handleAddFriend}
                    disabled={!newFriendName.trim()}
                    className="inline-flex items-center gap-2 bg-espresso text-white px-5 py-3 rounded-xl text-sm font-medium hover:bg-espresso/90 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
                  >
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <line x1="12" y1="5" x2="12" y2="19" />
                      <line x1="5" y1="12" x2="19" y2="12" />
                    </svg>
                    Add
                  </button>
                </div>
              </>
            )}
            {justAdded && (
              <p className="text-xs text-taupe mt-3 font-medium fade-in-up">
                Friend connected successfully!
              </p>
            )}
          </div>
        </section>

        {friends.length > 0 ? (
          <>
            {/* ========== Friends Leaderboard ========== */}
            <section className="fade-in-up fade-in-up-delay-3 mb-8">
              <h2 className="font-serif text-lg md:text-xl font-semibold text-espresso mb-4">
                Leaderboard
              </h2>
              <div className="bg-parchment rounded-2xl border border-warmBorder overflow-hidden shadow-sm">
                {/* Leaderboard header */}
                <div className="px-5 py-3 bg-cream/50 border-b border-warmBorder">
                  <div className="flex items-center text-xs text-mocha font-medium font-sans uppercase tracking-wider">
                    <span className="w-10 text-center">#</span>
                    <span className="flex-1 ml-3">Name</span>
                    <span className="w-20 text-center">Streak</span>
                    <span className="w-16 text-center">Today</span>
                  </div>
                </div>

                {/* Leaderboard entries */}
                <ul className="divide-y divide-warmBorder/60">
                  {leaderboardEntries.map((entry, index) => {
                    const rank = index + 1;
                    const isTopThree = rank <= 3;
                    return (
                      <li
                        key={entry.id}
                        className={`px-5 py-4 flex items-center transition-colors ${
                          entry.isSelf
                            ? "bg-gold/[0.06]"
                            : "hover:bg-cream/60"
                        }`}
                      >
                        {/* Rank */}
                        <span
                          className={`w-10 text-center flex-shrink-0 ${
                            isTopThree
                              ? "text-xl"
                              : "text-sm font-medium text-mocha"
                          }`}
                        >
                          {getRankDisplay(rank)}
                        </span>

                        {/* Avatar + Name */}
                        <div className="flex items-center gap-3 flex-1 ml-3 min-w-0">
                          <div
                            className={`w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0 ${
                              entry.isSelf
                                ? "hero-gradient"
                                : getAvatarColor(entry.name)
                            }`}
                          >
                            <span className="text-white text-xs font-serif font-bold">
                              {getInitials(entry.name)}
                            </span>
                          </div>
                          <div className="min-w-0">
                            <p className="text-sm font-medium text-espresso truncate">
                              {entry.name}
                              {entry.isSelf && (
                                <span className="ml-1.5 text-xs font-normal text-taupe">
                                  (you)
                                </span>
                              )}
                            </p>
                          </div>
                        </div>

                        {/* Streak */}
                        <div className="w-20 text-center flex-shrink-0">
                          <span className="text-sm font-semibold text-espresso">
                            {entry.streak > 0 && (
                              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" className="text-gold inline-block mr-0.5">
                                <path d="M12 2c.3 2.2.5 3.8 2 6 1.2 1.7 2 3.3 2 5.5a6 6 0 0 1-12 0c0-2.2.8-3.8 2-5.5C7.5 5.8 8 4 8.5 2c1 2 1.5 3 2 4 .5-.7 1-2 1.5-4z" fill="currentColor" opacity="0.85"/>
                              </svg>
                            )}
                            {entry.streak}
                          </span>
                        </div>

                        {/* Today Status */}
                        <div className="w-16 flex justify-center flex-shrink-0">
                          {entry.completedToday ? (
                            <div className="w-7 h-7 rounded-full bg-taupe/15 flex items-center justify-center">
                              <svg
                                width="14"
                                height="14"
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
                            </div>
                          ) : (
                            <div className="w-7 h-7 rounded-full border-2 border-warmBorder flex items-center justify-center">
                              <div className="w-2 h-2 rounded-full bg-warmGray/50" />
                            </div>
                          )}
                        </div>
                      </li>
                    );
                  })}
                </ul>
              </div>
            </section>

            {/* ========== Friend Cards Grid ========== */}
            <section className="fade-in-up fade-in-up-delay-4 mb-8">
              <h2 className="font-serif text-lg md:text-xl font-semibold text-espresso mb-4">
                Your Friends
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {friends.map((friend) => (
                  <div
                    key={friend.id}
                    className="bg-parchment rounded-2xl border border-warmBorder p-5 card-hover relative group"
                  >
                    {/* Top row: avatar + name */}
                    <div className="flex items-center gap-3 mb-4">
                      <div
                        className={`w-11 h-11 rounded-full flex items-center justify-center flex-shrink-0 ${getAvatarColor(
                          friend.name
                        )}`}
                      >
                        <span className="text-white text-sm font-serif font-bold">
                          {getInitials(friend.name)}
                        </span>
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="font-serif font-semibold text-espresso truncate">
                          {friend.name}
                        </p>
                        <p className="text-xs text-mocha">
                          Last active: {friend.lastActive}
                        </p>
                      </div>
                    </div>

                    {/* Stats */}
                    <div className="flex items-center gap-4 mb-4">
                      <div className="flex items-center gap-1.5">
                        {friend.streak > 0 ? (
                          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" className="text-gold">
                            <path d="M12 2c.3 2.2.5 3.8 2 6 1.2 1.7 2 3.3 2 5.5a6 6 0 0 1-12 0c0-2.2.8-3.8 2-5.5C7.5 5.8 8 4 8.5 2c1 2 1.5 3 2 4 .5-.7 1-2 1.5-4z" fill="currentColor" opacity="0.85"/>
                          </svg>
                        ) : (
                          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="text-warmGray">
                            <path d="M12 3v2M12 19v2M5.64 5.64l1.41 1.41M16.95 16.95l1.41 1.41M3 12h2M19 12h2"/>
                          </svg>
                        )}
                        <span className="text-sm font-medium text-espresso">
                          {friend.streak} day streak
                        </span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        {friend.completedToday ? (
                          <>
                            <svg
                              width="14"
                              height="14"
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
                            <span className="text-xs text-taupe font-medium">
                              Done today
                            </span>
                          </>
                        ) : (
                          <>
                            <div className="w-3.5 h-3.5 rounded-full border-2 border-warmGray" />
                            <span className="text-xs text-warmGray font-medium">
                              Not yet
                            </span>
                          </>
                        )}
                      </div>
                    </div>

                    {/* Remove button */}
                    {confirmRemoveId === friend.id ? (
                      <div className="flex items-center gap-2 pt-3 border-t border-warmBorder/60">
                        <p className="text-xs text-mocha flex-1">
                          Remove {friend.name}?
                        </p>
                        <button
                          onClick={() => handleRemoveFriend(friend.id)}
                          className="text-xs font-medium text-red-600 hover:text-red-700 px-3 py-1.5 rounded-lg bg-red-50 hover:bg-red-100 transition-colors"
                        >
                          Remove
                        </button>
                        <button
                          onClick={() => setConfirmRemoveId(null)}
                          className="text-xs font-medium text-mocha hover:text-espresso px-3 py-1.5 transition-colors"
                        >
                          Cancel
                        </button>
                      </div>
                    ) : (
                      <button
                        onClick={() => setConfirmRemoveId(friend.id)}
                        className="opacity-0 group-hover:opacity-100 transition-opacity absolute top-4 right-4 text-warmGray hover:text-mocha p-1"
                        title="Remove friend"
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
                          <line x1="18" y1="6" x2="6" y2="18" />
                          <line x1="6" y1="6" x2="18" y2="18" />
                        </svg>
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </section>

            {/* ========== Accountability Section ========== */}
            <section className="fade-in-up mb-8">
              <div className="bg-parchment rounded-2xl border border-warmBorder overflow-hidden">
                <div className="hero-gradient-light h-1.5" />
                <div className="p-6 md:p-8">
                  <div className="max-w-2xl mx-auto text-center">
                    {/* Scripture */}
                    <div className="w-12 h-12 rounded-full hero-gradient flex items-center justify-center mx-auto mb-5">
                      <svg
                        width="20"
                        height="20"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="1.8"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="text-white"
                      >
                        <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                        <circle cx="9" cy="7" r="4" />
                        <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
                        <path d="M16 3.13a4 4 0 0 1 0 7.75" />
                      </svg>
                    </div>

                    <blockquote className="font-serif text-xl md:text-2xl text-espresso leading-relaxed mb-3">
                      &ldquo;As iron sharpens iron, so one person sharpens
                      another.&rdquo;
                    </blockquote>
                    <p className="text-sm text-gold font-serif tracking-wide mb-6">
                      Proverbs 27:17
                    </p>

                    <p className="text-sm text-mocha leading-relaxed mb-8 max-w-lg mx-auto">
                      Faith grows stronger in community. When we walk with
                      others, we find encouragement in hard seasons and joy in
                      moments of celebration. Keep showing up for each other.
                    </p>

                    {/* Group Stats */}
                    <div className="grid grid-cols-3 gap-3 max-w-md mx-auto">
                      <div className="bg-cream rounded-xl p-4 border border-warmBorder/50">
                        <p className="text-xl md:text-2xl font-serif font-bold text-espresso">
                          {totalMembers}
                        </p>
                        <p className="text-xs text-mocha mt-1">Walking Together</p>
                      </div>
                      <div className="bg-cream rounded-xl p-4 border border-warmBorder/50">
                        <p className="text-xl md:text-2xl font-serif font-bold text-espresso">
                          {totalGroupStreak}
                        </p>
                        <p className="text-xs text-mocha mt-1">Combined Streak</p>
                      </div>
                      <div className="bg-cream rounded-xl p-4 border border-warmBorder/50">
                        <p className="text-xl md:text-2xl font-serif font-bold text-espresso">
                          {completedCount}/{totalMembers}
                        </p>
                        <p className="text-xs text-mocha mt-1">Done Today</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </section>
          </>
        ) : (
          /* ========== Empty State ========== */
          <section className="fade-in-up fade-in-up-delay-3 mb-8">
            <div className="bg-parchment rounded-2xl border border-warmBorder overflow-hidden">
              <div className="hero-gradient-light h-1.5" />
              <div className="p-8 md:p-12 text-center max-w-lg mx-auto">
                {/* Icon cluster */}
                <div className="flex items-center justify-center gap-3 mb-6">
                  <div className="w-10 h-10 rounded-full bg-taupe/10 flex items-center justify-center">
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
                      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                      <circle cx="12" cy="7" r="4" />
                    </svg>
                  </div>
                  <div className="w-14 h-14 rounded-full hero-gradient flex items-center justify-center shadow-md">
                    <svg
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.8"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="text-white"
                    >
                      <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                      <circle cx="9" cy="7" r="4" />
                      <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
                      <path d="M16 3.13a4 4 0 0 1 0 7.75" />
                    </svg>
                  </div>
                  <div className="w-10 h-10 rounded-full bg-gold/10 flex items-center justify-center">
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
                      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                      <circle cx="12" cy="7" r="4" />
                    </svg>
                  </div>
                </div>

                <h3 className="font-serif text-xl md:text-2xl font-semibold text-espresso mb-3">
                  Better Together
                </h3>

                <blockquote className="font-serif text-base text-mocha leading-relaxed mb-2 italic">
                  &ldquo;And let us consider how we may spur one another on
                  toward love and good deeds, not giving up meeting together, as
                  some are in the habit of doing, but encouraging one
                  another.&rdquo;
                </blockquote>
                <p className="text-sm text-gold font-serif tracking-wide mb-6">
                  Hebrews 10:24-25
                </p>

                <p className="text-sm text-mocha leading-relaxed mb-6">
                  Your faith journey is more meaningful when shared. Add friends
                  above to see their progress, celebrate streaks together, and
                  hold each other accountable in daily devotion.
                </p>

                <div className="bg-cream rounded-xl p-4 border border-warmBorder/50">
                  <p className="text-xs text-taupe font-medium mb-2 uppercase tracking-wider">
                    How it works
                  </p>
                  <div className="space-y-2">
                    <div className="flex items-center gap-3 text-sm text-mocha">
                      <span className="w-6 h-6 rounded-full bg-taupe/10 flex items-center justify-center flex-shrink-0 text-xs font-serif font-bold text-taupe">
                        1
                      </span>
                      <span>Enter a friend&apos;s name above</span>
                    </div>
                    <div className="flex items-center gap-3 text-sm text-mocha">
                      <span className="w-6 h-6 rounded-full bg-taupe/10 flex items-center justify-center flex-shrink-0 text-xs font-serif font-bold text-taupe">
                        2
                      </span>
                      <span>See their streaks and daily progress</span>
                    </div>
                    <div className="flex items-center gap-3 text-sm text-mocha">
                      <span className="w-6 h-6 rounded-full bg-taupe/10 flex items-center justify-center flex-shrink-0 text-xs font-serif font-bold text-taupe">
                        3
                      </span>
                      <span>Encourage each other to stay faithful</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>
        )}

        {/* Bottom spacing for mobile nav */}
        <div className="h-8 md:h-12" />
      </div>
    </div>
  );
}
