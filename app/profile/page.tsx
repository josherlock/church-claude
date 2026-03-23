"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import {
  getProfile,
  saveFullProfile,
  type UserProfile,
  type TelegramSettings,
  STRUGGLE_LABELS,
} from "@/lib/store";

export default function ProfilePage() {
  const [mounted, setMounted] = useState(false);
  const [profile, setProfile] = useState<UserProfile | null>(null);

  // Form fields
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [avatarUrl, setAvatarUrl] = useState("");

  // Telegram
  const [telegramUsername, setTelegramUsername] = useState("");
  const [telegramConnected, setTelegramConnected] = useState(false);
  const [dailyMessageEnabled, setDailyMessageEnabled] = useState(false);
  const [dailyMessageTime, setDailyMessageTime] = useState("07:00");

  // UI state
  const [saved, setSaved] = useState(false);
  const [activeSection, setActiveSection] = useState<string | null>(null);
  const [passwordError, setPasswordError] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const p = getProfile();
    setProfile(p);
    setName(p.name);
    setEmail(p.email);
    setPassword(p.password || "");
    setAvatarUrl(p.avatarUrl || "");
    setTelegramUsername(p.telegram?.username || "");
    setTelegramConnected(p.telegram?.connected || false);
    setDailyMessageEnabled(p.telegram?.dailyMessageEnabled || false);
    setDailyMessageTime(p.telegram?.dailyMessageTime || "07:00");
    setMounted(true);
  }, []);

  const handleSave = () => {
    if (password && password !== confirmPassword) {
      setPasswordError("Passwords don't match");
      return;
    }
    setPasswordError("");

    const telegram: TelegramSettings = {
      username: telegramUsername,
      chatId: profile?.telegram?.chatId || "",
      connected: telegramConnected,
      dailyMessageEnabled,
      dailyMessageTime,
    };

    saveFullProfile({
      name,
      email,
      password: password || profile?.password || "",
      avatarUrl,
      telegram,
    });

    setSaved(true);
    setConfirmPassword("");
    setTimeout(() => setSaved(false), 3000);
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 2 * 1024 * 1024) {
      alert("Image must be under 2MB");
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      const result = reader.result as string;
      setAvatarUrl(result);
    };
    reader.readAsDataURL(file);
  };

  const handleRemoveAvatar = () => {
    setAvatarUrl("");
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleConnectTelegram = () => {
    if (!telegramUsername.trim()) return;
    setTelegramConnected(true);
  };

  const handleDisconnectTelegram = () => {
    setTelegramConnected(false);
    setDailyMessageEnabled(false);
  };

  const getInitials = (n: string) => {
    return n
      .split(" ")
      .map((w) => w[0])
      .join("")
      .toUpperCase()
      .slice(0, 2) || "?";
  };

  if (!mounted || !profile) {
    return (
      <div className="min-h-screen bg-cream flex items-center justify-center">
        <div className="w-8 h-8 rounded-full hero-gradient animate-pulse" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-cream">
      {/* Header */}
      <section className="hero-gradient relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 rounded-full bg-white/5 -translate-y-1/2 translate-x-1/2" />
        <div className="absolute bottom-0 left-0 w-48 h-48 rounded-full bg-white/5 translate-y-1/2 -translate-x-1/2" />
        <div className="relative z-10 max-w-2xl mx-auto px-5 py-12 md:py-16">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-gold/80 hover:text-gold transition-colors text-sm mb-6"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="15 18 9 12 15 6" />
            </svg>
            Back to Home
          </Link>

          <div className="flex items-center gap-5">
            {/* Avatar */}
            <div className="relative group">
              <button
                onClick={() => fileInputRef.current?.click()}
                className="w-20 h-20 md:w-24 md:h-24 rounded-full overflow-hidden border-3 border-gold/40 flex-shrink-0 hover:border-gold transition-all cursor-pointer"
              >
                {avatarUrl ? (
                  <img
                    src={avatarUrl}
                    alt="Profile"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full bg-taupe/30 flex items-center justify-center">
                    <span className="text-2xl md:text-3xl font-serif font-bold text-white/80">
                      {getInitials(name)}
                    </span>
                  </div>
                )}
                <div className="absolute inset-0 bg-black/40 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z" />
                    <circle cx="12" cy="13" r="4" />
                  </svg>
                </div>
              </button>
            </div>

            <div>
              <h1 className="font-serif text-2xl md:text-3xl font-bold text-white">
                {name || "Your Profile"}
              </h1>
              <p className="text-gold/70 text-sm mt-1">{email}</p>
              <p className="text-white/40 text-xs mt-1">Member since {profile.createdAt}</p>
            </div>
          </div>
        </div>
      </section>

      {/* Content */}
      <div className="max-w-2xl mx-auto px-4 sm:px-6 -mt-4 relative z-20 pb-24">
        {/* Success Toast */}
        {saved && (
          <div className="mb-4 fade-in-up">
            <div className="bg-sage/20 border border-sage/40 rounded-xl px-5 py-3 flex items-center gap-3">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#A8B5A0" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="20 6 9 17 4 12" />
              </svg>
              <p className="text-sm font-medium text-espresso">Profile saved successfully</p>
            </div>
          </div>
        )}

        {/* ---- Profile Picture Section ---- */}
        <section className="bg-parchment rounded-2xl border border-warmBorder p-5 md:p-6 mb-4 fade-in-up">
          <h2 className="font-serif text-lg font-semibold text-espresso mb-4 flex items-center gap-2">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="text-taupe">
              <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z" />
              <circle cx="12" cy="13" r="4" />
            </svg>
            Profile Picture
          </h2>

          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-full overflow-hidden border-2 border-warmBorder flex-shrink-0">
              {avatarUrl ? (
                <img src={avatarUrl} alt="Avatar" className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full bg-taupe/15 flex items-center justify-center">
                  <span className="text-lg font-serif font-bold text-taupe">
                    {getInitials(name)}
                  </span>
                </div>
              )}
            </div>

            <div className="flex gap-2">
              <button
                onClick={() => fileInputRef.current?.click()}
                className="px-4 py-2 bg-espresso text-white rounded-xl text-sm font-medium hover:bg-espresso/90 transition-all"
              >
                {avatarUrl ? "Change Photo" : "Upload Photo"}
              </button>
              {avatarUrl && (
                <button
                  onClick={handleRemoveAvatar}
                  className="px-4 py-2 border border-warmBorder text-mocha rounded-xl text-sm font-medium hover:bg-sand/50 transition-all"
                >
                  Remove
                </button>
              )}
            </div>
          </div>

          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleImageUpload}
            className="hidden"
          />
          <p className="text-xs text-warmGray mt-3">JPG, PNG or GIF. Max 2MB.</p>
        </section>

        {/* ---- Personal Info Section ---- */}
        <section className="bg-parchment rounded-2xl border border-warmBorder p-5 md:p-6 mb-4 fade-in-up fade-in-up-delay-1">
          <h2 className="font-serif text-lg font-semibold text-espresso mb-4 flex items-center gap-2">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="text-taupe">
              <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
              <circle cx="12" cy="7" r="4" />
            </svg>
            Personal Information
          </h2>

          <div className="space-y-4">
            {/* Name */}
            <div>
              <label htmlFor="profile-name" className="block text-sm font-medium text-mocha mb-1.5">
                Full Name
              </label>
              <input
                id="profile-name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Your name"
                className="w-full px-4 py-3 bg-cream border border-warmBorder rounded-xl text-espresso placeholder:text-warmGray focus:outline-none focus:ring-2 focus:ring-gold/40 focus:border-gold transition-all text-sm"
              />
            </div>

            {/* Email */}
            <div>
              <label htmlFor="profile-email" className="block text-sm font-medium text-mocha mb-1.5">
                Email Address
              </label>
              <input
                id="profile-email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="your@email.com"
                className="w-full px-4 py-3 bg-cream border border-warmBorder rounded-xl text-espresso placeholder:text-warmGray focus:outline-none focus:ring-2 focus:ring-gold/40 focus:border-gold transition-all text-sm"
              />
            </div>
          </div>
        </section>

        {/* ---- Password Section ---- */}
        <section className="bg-parchment rounded-2xl border border-warmBorder p-5 md:p-6 mb-4 fade-in-up fade-in-up-delay-2">
          <button
            onClick={() => setActiveSection(activeSection === "password" ? null : "password")}
            className="w-full flex items-center justify-between"
          >
            <h2 className="font-serif text-lg font-semibold text-espresso flex items-center gap-2">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="text-taupe">
                <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                <path d="M7 11V7a5 5 0 0 1 10 0v4" />
              </svg>
              Change Password
            </h2>
            <svg
              width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
              className={`text-warmGray transition-transform duration-200 ${activeSection === "password" ? "rotate-180" : ""}`}
            >
              <polyline points="6 9 12 15 18 9" />
            </svg>
          </button>

          {activeSection === "password" && (
            <div className="mt-4 space-y-4 fade-in-up">
              <div>
                <label htmlFor="profile-password" className="block text-sm font-medium text-mocha mb-1.5">
                  New Password
                </label>
                <div className="relative">
                  <input
                    id="profile-password"
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => { setPassword(e.target.value); setPasswordError(""); }}
                    placeholder="Enter new password"
                    className="w-full px-4 py-3 pr-12 bg-cream border border-warmBorder rounded-xl text-espresso placeholder:text-warmGray focus:outline-none focus:ring-2 focus:ring-gold/40 focus:border-gold transition-all text-sm"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-warmGray hover:text-mocha transition-colors"
                  >
                    {showPassword ? (
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" />
                        <line x1="1" y1="1" x2="23" y2="23" />
                      </svg>
                    ) : (
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                        <circle cx="12" cy="12" r="3" />
                      </svg>
                    )}
                  </button>
                </div>
              </div>

              <div>
                <label htmlFor="profile-confirm-password" className="block text-sm font-medium text-mocha mb-1.5">
                  Confirm New Password
                </label>
                <input
                  id="profile-confirm-password"
                  type={showPassword ? "text" : "password"}
                  value={confirmPassword}
                  onChange={(e) => { setConfirmPassword(e.target.value); setPasswordError(""); }}
                  placeholder="Confirm new password"
                  className="w-full px-4 py-3 bg-cream border border-warmBorder rounded-xl text-espresso placeholder:text-warmGray focus:outline-none focus:ring-2 focus:ring-gold/40 focus:border-gold transition-all text-sm"
                />
              </div>

              {passwordError && (
                <p className="text-xs text-red-500 font-medium">{passwordError}</p>
              )}
            </div>
          )}
        </section>

        {/* ---- Telegram Integration ---- */}
        <section className="bg-parchment rounded-2xl border border-warmBorder p-5 md:p-6 mb-4 fade-in-up fade-in-up-delay-3">
          <h2 className="font-serif text-lg font-semibold text-espresso mb-1 flex items-center gap-2">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" className="text-taupe">
              <path d="M21.198 2.433a2.242 2.242 0 0 0-1.022.215l-8.609 3.33c-2.068.8-4.133 1.598-5.724 2.21a405.15 405.15 0 0 1-2.849 1.09c-.42.147-.99.332-1.473.901-.728.855.075 1.644.357 1.898.35.315.733.474.965.55l3.44 1.153a1.2 1.2 0 0 0 .125.367l1.779 3.556a1.287 1.287 0 0 0 1.159.69c.09-.002.178-.015.264-.042a1.188 1.188 0 0 0 .508-.332l1.83-1.83 3.56 2.698a1.58 1.58 0 0 0 .975.332c.636 0 1.1-.426 1.272-.949l3.456-15.153c.224-.898-.064-1.534-.392-1.877a1.711 1.711 0 0 0-1.022-.516l-.06-.004zm-9.9 10.75l-.705 2.468-1.39-2.78 8.634-7.034-6.539 7.346z" fill="currentColor" />
            </svg>
            Telegram Integration
          </h2>
          <p className="text-xs text-mocha mb-4">
            Get daily devotion reminders and verses sent to your Telegram
          </p>

          {!telegramConnected ? (
            <div className="space-y-4">
              <div>
                <label htmlFor="telegram-username" className="block text-sm font-medium text-mocha mb-1.5">
                  Telegram Username
                </label>
                <div className="flex gap-3">
                  <div className="flex-1 relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-warmGray text-sm">@</span>
                    <input
                      id="telegram-username"
                      type="text"
                      value={telegramUsername}
                      onChange={(e) => setTelegramUsername(e.target.value.replace(/^@/, ""))}
                      placeholder="username"
                      className="w-full pl-8 pr-4 py-3 bg-cream border border-warmBorder rounded-xl text-espresso placeholder:text-warmGray focus:outline-none focus:ring-2 focus:ring-gold/40 focus:border-gold transition-all text-sm"
                    />
                  </div>
                  <button
                    onClick={handleConnectTelegram}
                    disabled={!telegramUsername.trim()}
                    className="px-5 py-3 bg-espresso text-white rounded-xl text-sm font-medium hover:bg-espresso/90 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
                  >
                    Connect
                  </button>
                </div>
              </div>

              <div className="bg-cream/80 rounded-xl p-4 border border-warmBorder/50">
                <p className="text-xs font-medium text-espresso mb-2">How to connect:</p>
                <ol className="text-xs text-mocha space-y-1.5 list-decimal list-inside">
                  <li>Search for <span className="font-medium text-espresso">@AbideDevotionBot</span> on Telegram</li>
                  <li>Send <span className="font-mono bg-sand px-1.5 py-0.5 rounded text-espresso">/start</span> to the bot</li>
                  <li>Enter your Telegram username above</li>
                  <li>The bot will send you daily devotion reminders</li>
                </ol>
              </div>
            </div>
          ) : (
            <div className="space-y-5">
              {/* Connected status */}
              <div className="flex items-center justify-between bg-sage/10 border border-sage/30 rounded-xl px-4 py-3">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-sage/20 flex items-center justify-center">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#A8B5A0" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-espresso">Connected</p>
                    <p className="text-xs text-mocha">@{telegramUsername}</p>
                  </div>
                </div>
                <button
                  onClick={handleDisconnectTelegram}
                  className="text-xs text-mocha hover:text-espresso transition-colors underline"
                >
                  Disconnect
                </button>
              </div>

              {/* Daily Message Toggle */}
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-espresso">Daily Devotion Message</p>
                  <p className="text-xs text-mocha mt-0.5">
                    Receive your daily verse and devotion reminder
                  </p>
                </div>
                <button
                  onClick={() => setDailyMessageEnabled(!dailyMessageEnabled)}
                  className={`relative w-12 h-7 rounded-full transition-all duration-300 ${
                    dailyMessageEnabled ? "bg-gold" : "bg-warmGray/40"
                  }`}
                >
                  <span
                    className={`absolute top-0.5 w-6 h-6 bg-white rounded-full shadow-sm transition-all duration-300 ${
                      dailyMessageEnabled ? "left-5.5 translate-x-0" : "left-0.5"
                    }`}
                    style={{ left: dailyMessageEnabled ? "22px" : "2px" }}
                  />
                </button>
              </div>

              {/* Time Picker */}
              {dailyMessageEnabled && (
                <div className="fade-in-up">
                  <label htmlFor="telegram-time" className="block text-sm font-medium text-mocha mb-2">
                    Send daily message at:
                  </label>
                  <div className="flex items-center gap-3">
                    <div className="relative">
                      <input
                        id="telegram-time"
                        type="time"
                        value={dailyMessageTime}
                        onChange={(e) => setDailyMessageTime(e.target.value)}
                        className="px-4 py-3 bg-cream border border-warmBorder rounded-xl text-espresso focus:outline-none focus:ring-2 focus:ring-gold/40 focus:border-gold transition-all text-sm"
                      />
                    </div>
                    <p className="text-xs text-mocha">
                      Your local time
                    </p>
                  </div>

                  {/* Preview of what the message looks like */}
                  <div className="mt-4 bg-cream/80 rounded-xl p-4 border border-warmBorder/50">
                    <p className="text-xs font-medium text-mocha mb-2">Message preview:</p>
                    <div className="bg-white rounded-lg p-3 border border-warmBorder/30 text-xs text-espresso space-y-1.5">
                      <p className="font-semibold">Good morning from Abide</p>
                      <p className="italic text-mocha">&quot;Trust in the LORD with all your heart...&quot;</p>
                      <p className="text-warmGray">- Proverbs 3:5-6</p>
                      <p className="text-taupe mt-2">Today&apos;s devotion: <span className="font-medium">Rooted in Christ</span></p>
                      <p className="text-warmGray">Open Abide to begin your devotion</p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
        </section>

        {/* ---- Spiritual Profile ---- */}
        <section className="bg-parchment rounded-2xl border border-warmBorder p-5 md:p-6 mb-4 fade-in-up fade-in-up-delay-4">
          <h2 className="font-serif text-lg font-semibold text-espresso mb-4 flex items-center gap-2">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="text-taupe">
              <path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10 10-4.5 10-10S17.5 2 12 2z" />
              <path d="M12 6v6l4 2" />
            </svg>
            Spiritual Profile
          </h2>

          <div className="space-y-4">
            <div>
              <p className="text-xs font-medium text-mocha uppercase tracking-wide mb-2">Faith Journey</p>
              <div className="flex items-center gap-2">
                {profile.faithLevel === "new" && (
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="text-sage">
                    <path d="M12 22V8"/>
                    <path d="M5 12s2.5-5 7-5 7 5 7 5"/>
                    <path d="M12 8c0-3-1.5-5-1.5-5s3.5 1 1.5 5"/>
                  </svg>
                )}
                {profile.faithLevel === "growing" && (
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="text-sage">
                    <path d="M12 22V2"/>
                    <path d="M4 14s3-6 8-6 8 6 8 6"/>
                    <path d="M7 18s2-3 5-3 5 3 5 3"/>
                  </svg>
                )}
                {profile.faithLevel === "mature" && (
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="text-sage">
                    <path d="M12 22V2"/>
                    <path d="M3 16s3.5-8 9-8 9 8 9 8"/>
                    <path d="M5 20s2.5-4 7-4 7 4 7 4"/>
                    <path d="M7 12s2-4 5-4 5 4 5 4"/>
                  </svg>
                )}
                <span className="text-sm text-espresso capitalize">
                  {profile.faithLevel === "new" ? "New to faith" : profile.faithLevel === "growing" ? "Growing in faith" : "Mature in faith"}
                </span>
              </div>
            </div>

            <div>
              <p className="text-xs font-medium text-mocha uppercase tracking-wide mb-2">Preferred Devotion Time</p>
              <div className="flex items-center gap-2">
                {profile.preferredTime === "morning" && (
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="text-gold">
                    <circle cx="12" cy="12" r="4"/>
                    <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M6.34 17.66l-1.41 1.41M19.07 4.93l-1.41 1.41"/>
                  </svg>
                )}
                {profile.preferredTime === "afternoon" && (
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="text-gold">
                    <circle cx="12" cy="12" r="5"/>
                    <path d="M12 3v2M12 19v2M5.64 5.64l1.41 1.41M16.95 16.95l1.41 1.41M3 12h2M19 12h2"/>
                  </svg>
                )}
                {profile.preferredTime === "evening" && (
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="text-gold">
                    <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>
                  </svg>
                )}
                <span className="text-sm text-espresso capitalize">{profile.preferredTime}</span>
              </div>
            </div>

            {profile.struggles && profile.struggles.length > 0 && (
              <div>
                <p className="text-xs font-medium text-mocha uppercase tracking-wide mb-2">Areas of Focus</p>
                <div className="flex flex-wrap gap-2">
                  {profile.struggles.map((s) => (
                    <span
                      key={s}
                      className="text-xs font-medium text-espresso bg-gold/10 border border-gold/25 px-3 py-1.5 rounded-full"
                    >
                      {STRUGGLE_LABELS[s]}
                    </span>
                  ))}
                </div>
              </div>
            )}

            <Link
              href="/onboarding"
              className="inline-flex items-center gap-2 text-xs text-taupe hover:text-espresso transition-colors mt-2"
            >
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
              </svg>
              Retake onboarding questionnaire
            </Link>
          </div>
        </section>

        {/* ---- Save Button ---- */}
        <div className="sticky bottom-20 md:bottom-4 z-30 pt-2">
          <button
            onClick={handleSave}
            className="w-full bg-espresso text-white py-3.5 rounded-2xl text-sm font-semibold hover:bg-espresso/90 transition-all shadow-lg shadow-espresso/20 active:scale-[0.98] flex items-center justify-center gap-2"
          >
            {saved ? (
              <>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="20 6 9 17 4 12" />
                </svg>
                Saved!
              </>
            ) : (
              "Save Changes"
            )}
          </button>
        </div>

        <div className="h-4" />
      </div>
    </div>
  );
}
