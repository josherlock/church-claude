import type { Struggle } from "./store";
import { getProfile } from "./store";
import { devotions, type Devotion } from "./devotions";

export interface TeachingTag {
  id: string;
  struggles: Struggle[];
}

// Map teaching IDs to the struggles they address
export const teachingStruggles: TeachingTag[] = [
  { id: "power-of-prayer", struggles: ["anxiety", "discipline", "fear"] },
  { id: "identity-in-christ", struggles: ["identity", "fear", "loneliness"] },
  { id: "walking-by-faith", struggles: ["fear", "anxiety", "purpose"] },
  { id: "understanding-grace", struggles: ["identity", "addiction", "anger"] },
  { id: "heart-of-worship", struggles: ["purpose", "discipline", "grief"] },
  { id: "biblical-community", struggles: ["loneliness", "relationships", "addiction"] },
  { id: "living-with-purpose", struggles: ["purpose", "grief", "fear"] },
  { id: "overcoming-fear", struggles: ["fear", "anxiety", "identity"] },
  { id: "daily-devotion-discipline", struggles: ["discipline", "anxiety", "purpose"] },
  { id: "surrendering-control", struggles: ["anxiety", "fear", "anger"] },
  { id: "forgiveness-freedom", struggles: ["anger", "relationships", "grief"] },
  { id: "serving-as-worship", struggles: ["purpose", "loneliness", "relationships"] },
];

// Score how relevant a piece of content is to the user's struggles
function relevanceScore(contentStruggles: Struggle[], userStruggles: Struggle[]): number {
  if (userStruggles.length === 0) return 0;
  let score = 0;
  for (const s of contentStruggles) {
    const idx = userStruggles.indexOf(s);
    if (idx !== -1) {
      // Higher score for struggles listed earlier (higher priority)
      score += (userStruggles.length - idx);
    }
  }
  return score;
}

// Get devotions sorted by relevance to the user
export function getPersonalizedDevotions(): Devotion[] {
  const profile = getProfile();
  if (profile.struggles.length === 0) return devotions;

  return [...devotions].sort((a, b) => {
    const scoreA = relevanceScore(a.struggles, profile.struggles);
    const scoreB = relevanceScore(b.struggles, profile.struggles);
    return scoreB - scoreA;
  });
}

// Get the most relevant devotion for today (personalized)
export function getPersonalizedTodayDevotion(): Devotion {
  const profile = getProfile();
  if (profile.struggles.length === 0) {
    // Fallback to day-of-year rotation
    const dayOfYear = Math.floor(
      (new Date().getTime() - new Date(new Date().getFullYear(), 0, 0).getTime()) /
        (1000 * 60 * 60 * 24)
    );
    return devotions[dayOfYear % devotions.length];
  }

  // Rotate through top-scored devotions based on day
  const sorted = getPersonalizedDevotions();
  const dayOfYear = Math.floor(
    (new Date().getTime() - new Date(new Date().getFullYear(), 0, 0).getTime()) /
      (1000 * 60 * 60 * 24)
  );
  return sorted[dayOfYear % sorted.length];
}

// Get teaching IDs sorted by relevance
export function getPersonalizedTeachingOrder(): string[] {
  const profile = getProfile();
  if (profile.struggles.length === 0) return teachingStruggles.map((t) => t.id);

  return [...teachingStruggles]
    .sort((a, b) => {
      const scoreA = relevanceScore(a.struggles, profile.struggles);
      const scoreB = relevanceScore(b.struggles, profile.struggles);
      return scoreB - scoreA;
    })
    .map((t) => t.id);
}

// Check if a teaching is highly relevant to the user
export function isRecommendedTeaching(teachingId: string): boolean {
  const profile = getProfile();
  if (profile.struggles.length === 0) return false;

  const tag = teachingStruggles.find((t) => t.id === teachingId);
  if (!tag) return false;

  return relevanceScore(tag.struggles, profile.struggles) >= 2;
}

// Get a personalized greeting based on time of day and faith level
export function getPersonalizedGreeting(): string {
  const profile = getProfile();
  const hour = new Date().getHours();

  let timeGreeting = "Good day";
  if (hour < 12) timeGreeting = "Good morning";
  else if (hour < 17) timeGreeting = "Good afternoon";
  else timeGreeting = "Good evening";

  if (profile.name) {
    return `${timeGreeting}, ${profile.name}`;
  }
  return timeGreeting;
}

// Get personalized encouragement based on struggles
export function getPersonalizedEncouragement(): { text: string; ref: string } {
  const profile = getProfile();
  const primary = profile.struggles[0];

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

  if (primary && encouragements[primary]) {
    return encouragements[primary];
  }

  return {
    text: "Trust in the LORD with all your heart and lean not on your own understanding.",
    ref: "Proverbs 3:5",
  };
}
