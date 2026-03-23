"use client";

// ---- Types ----

export interface DevotionCompletion {
  date: string; // YYYY-MM-DD
  completed: boolean;
}

export interface Friend {
  id: string;
  name: string;
  email: string;
  streak: number;
  completedToday: boolean;
  lastActive: string;
}

export interface JournalEntry {
  date: string;
  content: string;
}

export type Struggle =
  | "anxiety"
  | "fear"
  | "loneliness"
  | "anger"
  | "addiction"
  | "grief"
  | "purpose"
  | "relationships"
  | "identity"
  | "discipline";

export const STRUGGLE_LABELS: Record<Struggle, string> = {
  anxiety: "Anxiety & Worry",
  fear: "Fear & Doubt",
  loneliness: "Loneliness & Isolation",
  anger: "Anger & Bitterness",
  addiction: "Addiction & Temptation",
  grief: "Grief & Loss",
  purpose: "Purpose & Direction",
  relationships: "Relationships",
  identity: "Self-Worth & Identity",
  discipline: "Spiritual Discipline",
};

export interface UserProfile {
  name: string;
  email: string;
  id: string;
  createdAt: string;
  onboarded: boolean;
  struggles: Struggle[];
  faithLevel: "new" | "growing" | "mature";
  preferredTime: "morning" | "afternoon" | "evening";
}

// ---- Storage Keys ----

const KEYS = {
  COMPLETIONS: "abide_completions",
  FRIENDS: "abide_friends",
  JOURNAL: "abide_journal",
  PROFILE: "abide_profile",
  LAST_BIBLE_POSITION: "abide_bible_pos",
  TEACHINGS_NOTES: "abide_teachings_notes",
} as const;

// ---- Helpers ----

function getItem<T>(key: string, fallback: T): T {
  if (typeof window === "undefined") return fallback;
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch {
    return fallback;
  }
}

function setItem(key: string, value: unknown) {
  if (typeof window === "undefined") return;
  localStorage.setItem(key, JSON.stringify(value));
}

// ---- Date Helpers ----

export function todayStr(): string {
  return new Date().toISOString().split("T")[0];
}

export function getDayOfYear(): number {
  const now = new Date();
  const start = new Date(now.getFullYear(), 0, 0);
  const diff = now.getTime() - start.getTime();
  return Math.floor(diff / (1000 * 60 * 60 * 24));
}

// ---- Completions ----

export function getCompletions(): DevotionCompletion[] {
  return getItem<DevotionCompletion[]>(KEYS.COMPLETIONS, []);
}

export function markDevotionComplete(): void {
  const completions = getCompletions();
  const today = todayStr();
  const existing = completions.find((c) => c.date === today);
  if (!existing) {
    completions.push({ date: today, completed: true });
  } else {
    existing.completed = true;
  }
  setItem(KEYS.COMPLETIONS, completions);
}

export function isCompletedToday(): boolean {
  const completions = getCompletions();
  return completions.some((c) => c.date === todayStr() && c.completed);
}

export function getCurrentStreak(): number {
  const completions = getCompletions()
    .filter((c) => c.completed)
    .map((c) => c.date)
    .sort()
    .reverse();

  if (completions.length === 0) return 0;

  let streak = 0;
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  for (let i = 0; i < completions.length; i++) {
    const checkDate = new Date(today);
    checkDate.setDate(checkDate.getDate() - i);
    const checkStr = checkDate.toISOString().split("T")[0];

    if (completions.includes(checkStr)) {
      streak++;
    } else {
      break;
    }
  }

  return streak;
}

export function getLast30DaysCompletions(): { date: string; completed: boolean }[] {
  const completions = getCompletions();
  const days: { date: string; completed: boolean }[] = [];
  const today = new Date();

  for (let i = 29; i >= 0; i--) {
    const d = new Date(today);
    d.setDate(d.getDate() - i);
    const dateStr = d.toISOString().split("T")[0];
    const found = completions.find((c) => c.date === dateStr);
    days.push({ date: dateStr, completed: found?.completed ?? false });
  }

  return days;
}

export function getTotalCompletions(): number {
  return getCompletions().filter((c) => c.completed).length;
}

// ---- Friends ----

export function getFriends(): Friend[] {
  return getItem<Friend[]>(KEYS.FRIENDS, []);
}

export function addFriend(name: string, email?: string): Friend {
  const friends = getFriends();
  const friend: Friend = {
    id: Math.random().toString(36).slice(2, 10),
    name,
    email: email || "",
    streak: Math.floor(Math.random() * 20),
    completedToday: Math.random() > 0.4,
    lastActive: todayStr(),
  };
  friends.push(friend);
  setItem(KEYS.FRIENDS, friends);
  return friend;
}

export function addFriendByEmail(email: string): Friend {
  const name = email.split("@")[0].replace(/[._]/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
  return addFriend(name, email);
}

export function getFriendByEmail(email: string): Friend | undefined {
  return getFriends().find((f) => f.email.toLowerCase() === email.toLowerCase());
}

export function removeFriend(id: string): void {
  const friends = getFriends().filter((f) => f.id !== id);
  setItem(KEYS.FRIENDS, friends);
}

// ---- Journal ----

export function getJournalEntries(): JournalEntry[] {
  return getItem<JournalEntry[]>(KEYS.JOURNAL, []);
}

export function saveJournalEntry(content: string): void {
  const entries = getJournalEntries();
  const today = todayStr();
  const existing = entries.find((e) => e.date === today);
  if (existing) {
    existing.content = content;
  } else {
    entries.push({ date: today, content });
  }
  setItem(KEYS.JOURNAL, entries);
}

export function getTodayJournal(): string {
  const entries = getJournalEntries();
  return entries.find((e) => e.date === todayStr())?.content ?? "";
}

// ---- Profile ----

export function getProfile(): UserProfile {
  return getItem<UserProfile>(KEYS.PROFILE, {
    name: "",
    email: "",
    id: Math.random().toString(36).slice(2, 10),
    createdAt: todayStr(),
    onboarded: false,
    struggles: [],
    faithLevel: "growing",
    preferredTime: "morning",
  });
}

export function isOnboarded(): boolean {
  return getProfile().onboarded;
}

export function saveProfile(name: string): void {
  const profile = getProfile();
  profile.name = name;
  setItem(KEYS.PROFILE, profile);
}

export function saveFullProfile(updates: Partial<UserProfile>): void {
  const profile = getProfile();
  Object.assign(profile, updates);
  setItem(KEYS.PROFILE, profile);
}

export function completeOnboarding(data: {
  name: string;
  email: string;
  struggles: Struggle[];
  faithLevel: "new" | "growing" | "mature";
  preferredTime: "morning" | "afternoon" | "evening";
}): void {
  const profile = getProfile();
  profile.name = data.name;
  profile.email = data.email;
  profile.struggles = data.struggles;
  profile.faithLevel = data.faithLevel;
  profile.preferredTime = data.preferredTime;
  profile.onboarded = true;
  setItem(KEYS.PROFILE, profile);
}

// ---- Bible Position ----

export function getLastBiblePosition(): { book: string; chapter: number } {
  return getItem(KEYS.LAST_BIBLE_POSITION, {
    book: "Genesis",
    chapter: 1,
  });
}

export function saveLastBiblePosition(book: string, chapter: number): void {
  setItem(KEYS.LAST_BIBLE_POSITION, { book, chapter });
}

// ---- Teachings Notes ----

export function getTeachingsNotes(): Record<string, string> {
  return getItem<Record<string, string>>(KEYS.TEACHINGS_NOTES, {});
}

export function saveTeachingNote(teachingId: string, note: string): void {
  const notes = getTeachingsNotes();
  notes[teachingId] = note;
  setItem(KEYS.TEACHINGS_NOTES, notes);
}
