"use client";

import { getProfile, type Struggle } from "./store";

// ---- Types ----

export interface HeartPosture {
  type: "guilt" | "condemnation" | "judgment" | "fear" | "anger" | "pride" | "despair" | "seeking";
  label: string;
  description: string;
  challenge: string;
  truthVerse: string;
  truthRef: string;
}

export interface CounselResponse {
  category: string;
  acknowledgment: string;
  scripture: string;
  scriptureRef: string;
  wisdom: string;
  heartPosture: HeartPosture;
  practicalStep: string;
  followUp: string;
}

// ---- Heart Posture Definitions ----

const HEART_POSTURES: Record<HeartPosture["type"], HeartPosture> = {
  guilt: {
    type: "guilt",
    label: "Guilt",
    description: "You may be carrying guilt that was never yours to hold.",
    challenge:
      "Are you asking this from a place of guilt? Here's the truth: guilt tells you that you ARE the mistake, but conviction tells you that you MADE a mistake. God's conviction leads to repentance and freedom — guilt leads to paralysis. Which one are you listening to right now?",
    truthVerse:
      "There is therefore now no condemnation to them which are in Christ Jesus, who walk not after the flesh, but after the Spirit.",
    truthRef: "Romans 8:1",
  },
  condemnation: {
    type: "condemnation",
    label: "Condemnation",
    description: "You may be believing lies about your standing with God.",
    challenge:
      "Check your heart posture here. Are you operating under condemnation? Condemnation says 'God is done with you.' But that is the voice of the enemy, not the voice of the Father. God's discipline is always redemptive, never destructive. If you are breathing, God is not finished with your story.",
    truthVerse:
      "Who shall lay any thing to the charge of God's elect? It is God that justifieth. Who is he that condemneth?",
    truthRef: "Romans 8:33-34",
  },
  judgment: {
    type: "judgment",
    label: "Judgment",
    description: "Your heart may be positioned toward judging others rather than examining yourself.",
    challenge:
      "Let me challenge your heart posture. Are you looking at this situation through a lens of judgment? Judgment is often a mirror — the things that frustrate us most in others are often the things God is still working on in us. Before you evaluate someone else's walk, have you honestly examined your own?",
    truthVerse:
      "Judge not, that ye be not judged. For with what judgment ye judge, ye shall be judged: and with what measure ye mete, it shall be measured to you again.",
    truthRef: "Matthew 7:1-2",
  },
  fear: {
    type: "fear",
    label: "Fear",
    description: "Fear may be driving your questions more than faith.",
    challenge:
      "I want to gently ask: is fear at the steering wheel of your heart right now? Fear and faith cannot occupy the same seat. Fear says 'what if it goes wrong?' Faith says 'what if God comes through?' The question is not whether your situation is scary — it's whether you believe God is bigger than what scares you.",
    truthVerse:
      "For God hath not given us the spirit of fear; but of power, and of love, and of a sound mind.",
    truthRef: "2 Timothy 1:7",
  },
  anger: {
    type: "anger",
    label: "Anger",
    description: "Anger may be masking a deeper wound that needs healing.",
    challenge:
      "Let's talk about your heart posture. Anger is often the bodyguard of pain — it shows up to protect a wound underneath. Righteous anger is directed at injustice, but personal anger is often directed at unmet expectations. Which one are you carrying? And more importantly, are you willing to let God underneath the anger to heal what's really there?",
    truthVerse:
      "Be ye angry, and sin not: let not the sun go down upon your wrath.",
    truthRef: "Ephesians 4:26",
  },
  pride: {
    type: "pride",
    label: "Self-Reliance",
    description: "You may be trying to solve this in your own strength.",
    challenge:
      "Here's a heart check: are you bringing this to God, or are you bringing it to God after you've already decided what the answer should be? There's a difference between 'consulting God' versus 'surrendering to God.' One says 'bless my plan,' the other says 'reveal Your plan.' Which posture is your heart in right now?",
    truthVerse:
      "Trust in the LORD with all thine heart; and lean not unto thine own understanding. In all thy ways acknowledge him, and he shall direct thy paths.",
    truthRef: "Proverbs 3:5-6",
  },
  despair: {
    type: "despair",
    label: "Despair",
    description: "You may be in a season where hope feels distant.",
    challenge:
      "Your heart is heavy, and I want you to know that is okay. But let me challenge you on this: despair says 'nothing will change.' God says 'I am making all things new.' Some of God's greatest work happens in the valley, not on the mountaintop. The fact that you're here, asking, wrestling — that is not weakness. That is faith fighting to survive. Don't let go.",
    truthVerse:
      "Why art thou cast down, O my soul? and why art thou disquieted within me? hope thou in God: for I shall yet praise him, who is the health of my countenance, and my God.",
    truthRef: "Psalm 42:11",
  },
  seeking: {
    type: "seeking",
    label: "Genuine Seeking",
    description: "Your heart is in a posture of genuine seeking — this is where growth happens.",
    challenge:
      "I can sense that you're coming to this from a genuine place of wanting to grow. That is exactly the heart posture God honors. The difference between a Pharisee and a disciple is that a Pharisee thinks they've arrived, but a disciple knows they're always learning. Keep that hunger. Keep that humility. It is the soil where God plants His deepest truths.",
    truthVerse:
      "And ye shall seek me, and find me, when ye shall search for me with all your heart.",
    truthRef: "Jeremiah 29:13",
  },
};

// ---- Category Response Library ----

interface ResponseTemplate {
  keywords: string[];
  category: string;
  acknowledgment: string;
  scripture: string;
  scriptureRef: string;
  wisdom: string;
  practicalStep: string;
  followUp: string;
}

const RESPONSE_LIBRARY: ResponseTemplate[] = [
  {
    keywords: ["anxious", "anxiety", "worry", "worried", "overthink", "panic", "stressed", "stress", "overwhelm", "nervous", "restless", "can't sleep", "racing thoughts"],
    category: "Anxiety & Worry",
    acknowledgment: "What you're feeling is real, and you don't need to pretend it isn't. Anxiety is one of the most common battles believers face — you are not alone in this.",
    scripture: "Be careful for nothing; but in every thing by prayer and supplication with thanksgiving let your requests be made known unto God. And the peace of God, which passeth all understanding, shall keep your hearts and minds through Christ Jesus.",
    scriptureRef: "Philippians 4:6-7",
    wisdom: "Anxiety is often the result of carrying tomorrow's weight with today's strength. God did not design you to hold the future — He designed you to hold His hand. The instruction in Philippians is not 'stop worrying' — it's 'start praying.' Replace the worry with a specific prayer. Name it. Give it to God. And then — this is the hard part — leave it there.",
    practicalStep: "Right now, write down the one thing consuming your thoughts. Then pray specifically over it, thank God for one thing He has already done, and consciously release it. Every time the anxiety returns today, repeat that prayer instead of rehearsing the worry.",
    followUp: "What is the specific thing you are anxious about? Sometimes naming it out loud takes away its power.",
  },
  {
    keywords: ["afraid", "fear", "scared", "terrified", "what if", "uncertain", "doubt", "doubting", "unsure", "don't know if god", "losing faith"],
    category: "Fear & Doubt",
    acknowledgment: "Fear and doubt are not the opposite of faith — they are the context in which faith becomes real. Every hero in the Bible had moments of fear.",
    scripture: "Fear thou not; for I am with thee: be not dismayed; for I am thy God: I will strengthen thee; yea, I will help thee; yea, I will uphold thee with the right hand of my righteousness.",
    scriptureRef: "Isaiah 41:10",
    wisdom: "'Doubt your doubts before you doubt your God.' The enemy wants you to interpret God's silence as God's absence. But some of God's most significant work happens in the seasons when you cannot feel Him. Faith is not the absence of fear — it is the decision to trust God in the middle of it. Your fear is not disqualifying you; it's revealing where God wants to meet you next.",
    practicalStep: "Write down your fear as honestly as you can. Then underneath it, write God's track record — every time He came through, every prayer He answered, every door He opened. Let the evidence speak louder than the anxiety.",
    followUp: "What are you most afraid of losing? Often our deepest fears reveal what we've made an idol of.",
  },
  {
    keywords: ["sin", "sinned", "sinning", "failed", "falling", "fell", "tempt", "temptation", "addiction", "addicted", "porn", "lust", "drunk", "relapse", "keep failing", "can't stop"],
    category: "Temptation & Struggle",
    acknowledgment: "The fact that you're here, bringing this into the light, tells me something important about your heart — you have not given up. That matters more than you know.",
    scripture: "If we confess our sins, he is faithful and just to forgive us our sins, and to cleanse us from all unrighteousness.",
    scriptureRef: "1 John 1:9",
    wisdom: "The enemy's strategy is not just to make you sin — it's to make you hide after you sin. Adam's first instinct after the fall was to hide from God. But God came looking for him. He is coming to look for you too. Confession is not about informing God of something He doesn't know — it's about refusing to let shame build a wall between you and your Father. You are not defined by your worst moment. You are defined by the blood that covers it.",
    practicalStep: "Confess it specifically to God right now — not in vague terms, but honestly. Then identify the trigger: what circumstances led to the fall? Build a boundary there. And if possible, find one trusted person you can be accountable to. Sin thrives in secrecy and dies in community.",
    followUp: "Is there someone in your life you trust enough to walk through this with? Accountability is not about judgment — it's about having someone who fights alongside you.",
  },
  {
    keywords: ["angry", "anger", "bitter", "bitterness", "resent", "resentment", "hate", "unforgiv", "forgive", "forgiveness", "hurt me", "betrayed", "betrayal", "offended"],
    category: "Anger & Unforgiveness",
    acknowledgment: "The pain you're carrying is real. What was done to you may have been deeply wrong. Your anger is not irrational — but holding onto it indefinitely will cost you more than it costs them.",
    scripture: "And be ye kind one to another, tenderhearted, forgiving one another, even as God for Christ's sake hath forgiven you.",
    scriptureRef: "Ephesians 4:32",
    wisdom: "Forgiveness is not saying what happened was okay. It's saying what happened will no longer hold you captive. Unforgiveness is like drinking poison and expecting the other person to get sick. God does not ask you to forgive because the other person deserves it — He asks you to forgive because you deserve freedom. This is one of the hardest commands in all of Scripture, and it may not happen in a single moment. But it starts with a decision: 'God, I am choosing to release this person, not because they've earned it, but because You have released me from far worse.'",
    practicalStep: "Say this prayer: 'God, I choose to forgive [name]. I release them from the debt I feel they owe me. Heal my heart where their actions wounded me. I cannot do this in my own strength, but I trust Your grace to carry me through.' You may need to pray this daily. That's okay.",
    followUp: "Is there a specific person you need to release? Sometimes the person we most need to forgive is ourselves.",
  },
  {
    keywords: ["lonely", "alone", "isolated", "no friends", "no one", "nobody", "disconnected", "don't belong", "rejected", "rejection", "left out"],
    category: "Loneliness & Isolation",
    acknowledgment: "Loneliness is one of the deepest aches a person can experience. You were never designed to walk alone — and the fact that it hurts is proof that you were made for connection.",
    scripture: "The LORD himself goes before you and will be with you; he will never leave you nor forsake you. Do not be afraid; do not be discouraged.",
    scriptureRef: "Deuteronomy 31:8",
    wisdom: "Loneliness and being alone are two different things. Jesus withdrew to be alone with God regularly — but He was never lonely, because His identity was rooted in the Father's love. Sometimes loneliness is actually a hunger for deeper connection with God that we're trying to fill with people. Other times, it's a genuine need for community that requires us to take a brave step. Either way, God sees you in this season. You are not invisible to Him.",
    practicalStep: "Take one step toward community this week. It doesn't have to be dramatic — send a message, show up to a gathering, or simply be honest with someone about how you're feeling. Vulnerability is the doorway to real connection. Also spend 10 minutes tonight simply telling God how you feel. He is the friend who sticks closer than a brother.",
    followUp: "When did you last feel truly seen and known by someone? What was different about that season?",
  },
  {
    keywords: ["purpose", "direction", "calling", "what am i supposed to", "lost", "stuck", "meaningless", "meaning", "why am i here", "what does god want", "confused about", "next step"],
    category: "Purpose & Direction",
    acknowledgment: "The search for purpose is one of the most important journeys you can take. The fact that you're wrestling with this means your soul is hungry for something real — and that hunger itself is from God.",
    scripture: "For I know the thoughts that I think toward you, saith the LORD, thoughts of peace, and not of evil, to give you an expected end.",
    scriptureRef: "Jeremiah 29:11",
    wisdom: "Purpose is not a destination — it's a direction. Too many people are paralyzed waiting for a dramatic calling from heaven when God is simply asking: 'Are you faithful with what's in front of you right now?' Moses was tending sheep when God spoke from the bush. David was watching his father's flock when Samuel came to anoint him. Purpose often hides in the mundane obedience of today, not the dramatic vision of tomorrow. Be faithful here. Be present now. God will open the next door when you've been faithful with this one.",
    practicalStep: "Instead of asking 'What is my purpose?' ask 'What has God placed in my hand today?' Look at your current responsibilities, relationships, and gifts. Where can you serve, love, or create with excellence right now? Start there.",
    followUp: "What is one thing you're naturally good at that also serves other people? That intersection is often where purpose lives.",
  },
  {
    keywords: ["marriage", "spouse", "husband", "wife", "relationship", "dating", "breakup", "broke up", "divorce", "cheated", "unfaithful", "trust", "partner"],
    category: "Relationships",
    acknowledgment: "Relationships are where our faith gets tested at the deepest level. It's easy to love God in theory — it's in the daily reality of loving imperfect people that our theology becomes real.",
    scripture: "Above all things have fervent charity among yourselves: for charity shall cover the multitude of sins.",
    scriptureRef: "1 Peter 4:8",
    wisdom: "Every relationship problem is ultimately a heart problem. Before you try to fix the other person, God wants to examine what's happening in you. Are you loving with conditions or without? Are you keeping score, or keeping grace? This doesn't mean boundaries aren't important — they absolutely are. But it means the first question is always: 'God, what are You trying to teach me through this person?' Sometimes the most difficult people in our lives are God's most effective teachers.",
    practicalStep: "Before your next interaction with this person, pray specifically: 'God, let me see them the way You see them.' Then listen more than you speak. Ask one genuine question about how they're doing. Love is often not a grand gesture — it's consistent, small acts of choosing someone else's wellbeing over your comfort.",
    followUp: "If you're honest with yourself, what is your role in the difficulty? Not all of it — just your part.",
  },
  {
    keywords: ["grief", "griev", "loss", "lost someone", "died", "death", "mourning", "mourn", "miss", "gone", "passed away", "funeral"],
    category: "Grief & Loss",
    acknowledgment: "Grief is not a problem to solve — it is love with nowhere to go. What you're feeling is the weight of how much that person or thing mattered. And it matters to God too.",
    scripture: "Blessed are they that mourn: for they shall be comforted.",
    scriptureRef: "Matthew 5:4",
    wisdom: "God does not waste pain. He is close to the brokenhearted — not standing at a distance watching, but right there in the middle of it with you. Jesus wept at the tomb of Lazarus even though He knew He was about to raise him from the dead. Your tears are not weakness — they are proof that you loved well. Grief does not follow a timeline, and anyone who tells you to 'move on' has never truly lost. Give yourself permission to grieve. But also give yourself permission to hope — because the story is not over.",
    practicalStep: "Allow yourself to feel what you feel today without judgment. Write a letter to the person or thing you've lost — say everything you wish you could say. Then bring that letter before God and ask Him to carry the weight you were never meant to bear alone.",
    followUp: "What is one beautiful memory that brings you both joy and pain? Sometimes honoring the good is part of processing the grief.",
  },
  {
    keywords: ["worth", "worthy", "enough", "not enough", "identity", "who am i", "compare", "comparison", "insecure", "insecurity", "self-esteem", "hate myself", "ugly", "failure", "loser"],
    category: "Identity & Self-Worth",
    acknowledgment: "The war over your identity is one of the fiercest battles you will ever fight. And the enemy's primary weapon is a lie: that you are not enough. Let me tell you the truth.",
    scripture: "I will praise thee; for I am fearfully and wonderfully made: marvellous are thy works; and that my soul knoweth right well.",
    scriptureRef: "Psalm 139:14",
    wisdom: "You will never find your identity by looking in the mirror or scrolling through a feed — you find it by looking into the Word. God did not make a mistake when He made you. You are not an accident, an afterthought, or a rough draft. You are His intentional, deliberate creation. The world will always move the goalposts of 'enough' — thin enough, successful enough, popular enough. But God settled your value at the cross. The price He paid for you is the price you're worth. And He paid everything.",
    practicalStep: "Identify one lie you've been believing about yourself — write it down. Then find one Scripture that directly contradicts it. Every time that lie surfaces this week, speak the Scripture out loud. You are retraining your mind to believe what God says instead of what the world whispers.",
    followUp: "Whose voice are you hearing when you feel 'not enough'? Is it a parent, a peer, culture, or your own inner critic? Naming the source helps you disarm it.",
  },
  {
    keywords: ["pray", "prayer", "praying", "god isn't listening", "god doesn't hear", "unanswered", "silent", "silence", "dry", "spiritual", "distant", "far from god", "backslid", "lukewarm", "cold"],
    category: "Spiritual Dryness",
    acknowledgment: "Seasons of spiritual dryness are not a sign that God has left — they are often a sign that He is deepening your roots. Even the most faithful believers have walked through the desert.",
    scripture: "Draw nigh to God, and he will draw nigh to you.",
    scriptureRef: "James 4:8",
    wisdom: "Feelings are real but they are not reliable indicators of God's presence. Elijah performed one of the greatest miracles in the Old Testament on Mount Carmel — and the very next chapter finds him depressed, exhausted, and hiding in a cave. God did not scold him. He fed him, let him rest, and then spoke in a still, small voice. Sometimes God seems silent not because He's absent, but because He's teaching you to listen differently. Keep showing up. Keep opening the Word even when it feels dry. The rain always comes.",
    practicalStep: "Commit to 10 minutes in the Word every day this week — not to feel something, but simply to obey. Read one Psalm per day out loud. Sometimes your spirit needs to hear your own voice declaring truth before your heart catches up.",
    followUp: "When was the last time you felt close to God? What were you doing differently in that season?",
  },
  {
    keywords: ["thank", "grateful", "blessed", "praise", "worship", "good", "joy", "happy", "testimony", "breakthrough", "answered prayer", "miracle"],
    category: "Praise & Gratitude",
    acknowledgment: "What a beautiful place to be. Gratitude is the most powerful posture a believer can hold — it shifts your perspective from what's missing to what's present.",
    scripture: "O give thanks unto the LORD; for he is good: for his mercy endureth for ever.",
    scriptureRef: "Psalm 136:1",
    wisdom: "Praise is not just a response to good circumstances — it's a weapon against the enemy. When you choose to worship in the middle of your story, you are declaring that God is bigger than your situation. But here's the deeper question: are you also grateful in the ordinary? The miraculous breakthroughs are easy to celebrate, but spiritual maturity is revealed in your ability to thank God for the mundane. Thank Him for breath. For another day. For the grace you didn't earn. Gratitude transforms the ordinary into holy ground.",
    practicalStep: "Start a gratitude practice: write down three specific things you're thankful for today. Not generic things, but specific. The more specific your gratitude, the more aware you become of God's detailed involvement in your life.",
    followUp: "Who in your life needs to hear about what God has done? Your testimony might be exactly what someone else needs to keep believing.",
  },
];

// ---- Detection Functions ----

function detectHeartPosture(text: string): HeartPosture["type"] {
  const lower = text.toLowerCase();

  const patterns: { type: HeartPosture["type"]; indicators: string[] }[] = [
    {
      type: "guilt",
      indicators: ["guilty", "guilt", "i failed", "i keep", "my fault", "i should have", "i shouldn't have", "can't forgive myself", "i messed up", "disappointed god", "let god down"],
    },
    {
      type: "condemnation",
      indicators: ["god hates me", "beyond saving", "unforgivable", "too far gone", "no hope", "god gave up", "can't be saved", "damned", "going to hell", "god is punishing"],
    },
    {
      type: "judgment",
      indicators: ["they should", "they need to", "how dare", "it's not fair", "they're wrong", "hypocrit", "they always", "they never", "what's wrong with them", "i can't believe they"],
    },
    {
      type: "fear",
      indicators: ["scared", "afraid", "terrified", "what if", "i can't", "fearful", "fear", "panic", "might happen", "could go wrong"],
    },
    {
      type: "anger",
      indicators: ["angry", "furious", "rage", "bitter", "resentful", "hate", "frustrated", "sick of", "tired of", "fed up", "mad at"],
    },
    {
      type: "pride",
      indicators: ["i already know", "they don't understand", "i've tried everything", "i know better", "god should", "why isn't god", "i deserve", "it's their problem"],
    },
    {
      type: "despair",
      indicators: ["hopeless", "give up", "pointless", "nothing works", "no point", "end it", "what's the point", "why bother", "nothing changes", "empty", "numb"],
    },
  ];

  for (const pattern of patterns) {
    for (const indicator of pattern.indicators) {
      if (lower.includes(indicator)) {
        return pattern.type;
      }
    }
  }

  return "seeking";
}

function findBestResponse(text: string): ResponseTemplate {
  const lower = text.toLowerCase();
  let bestMatch: ResponseTemplate | null = null;
  let bestScore = 0;

  for (const template of RESPONSE_LIBRARY) {
    let score = 0;
    for (const keyword of template.keywords) {
      if (lower.includes(keyword)) {
        score += keyword.length; // longer matches score higher
      }
    }
    if (score > bestScore) {
      bestScore = score;
      bestMatch = template;
    }
  }

  // Default response if nothing matches well
  if (!bestMatch || bestScore < 3) {
    return {
      keywords: [],
      category: "General Counsel",
      acknowledgment: "Thank you for sharing what's on your heart. It takes courage to be honest about where you are — and God honors that honesty.",
      scripture: "Come unto me, all ye that labour and are heavy laden, and I will give you rest. Take my yoke upon you, and learn of me; for I am meek and lowly in heart: and ye shall find rest unto your souls.",
      scriptureRef: "Matthew 11:28-29",
      wisdom: "God is not intimidated by your questions, your doubts, or your struggles. He is a Father who invites you to come as you are — not cleaned up, not figured out, but exactly as you are. The invitation of Jesus is not 'get it together and then come.' It is 'come, and I will give you rest.' Whatever you're carrying right now, He can handle it. The question is: will you let Him?",
      practicalStep: "Take five minutes right now to sit in silence. Don't try to pray perfectly. Just be present with God. Tell Him exactly what you told me — in your own words, with your own emotions. He is not looking for performance. He is looking for your presence.",
      followUp: "Is there something specific underneath what you've shared that you've been avoiding? Sometimes the presenting issue is not the real issue.",
    };
  }

  return bestMatch;
}

// ---- Main Export ----

export function getCounselResponse(userMessage: string): CounselResponse {
  const template = findBestResponse(userMessage);
  const postureType = detectHeartPosture(userMessage);
  const heartPosture = HEART_POSTURES[postureType];

  return {
    category: template.category,
    acknowledgment: template.acknowledgment,
    scripture: template.scripture,
    scriptureRef: template.scriptureRef,
    wisdom: template.wisdom,
    heartPosture,
    practicalStep: template.practicalStep,
    followUp: template.followUp,
  };
}

export function getGreeting(): string {
  const profile = getProfile();
  const name = profile.name || "friend";
  const hour = new Date().getHours();

  if (hour < 12) {
    return `Good morning, ${name}. This is a safe space. What's on your heart?`;
  } else if (hour < 17) {
    return `Good afternoon, ${name}. Take a breath. What are you carrying today?`;
  } else {
    return `Good evening, ${name}. Before this day ends, let's bring what's heavy to the One who can hold it. What's on your mind?`;
  }
}

export function getOpeningPrompts(): string[] {
  const profile = getProfile();
  const struggles = profile.struggles || [];

  const basePrompts = [
    "I've been struggling with anxiety lately...",
    "I feel distant from God and I don't know why.",
    "I'm angry at someone and I can't let it go.",
    "I keep falling into the same sin and I feel hopeless.",
    "I don't know what God's plan is for my life.",
  ];

  // Add personalized prompts based on user's struggles
  const strugglePrompts: Record<Struggle, string> = {
    anxiety: "My thoughts won't stop racing and I can't find peace...",
    fear: "I'm afraid of what the future holds...",
    loneliness: "I feel completely alone in this season...",
    anger: "I'm struggling to forgive someone who hurt me...",
    addiction: "I keep falling back into the same patterns...",
    grief: "I'm grieving and I don't know how to process it...",
    purpose: "I feel stuck and purposeless...",
    relationships: "My relationships are falling apart...",
    identity: "I don't feel like I'm enough...",
    discipline: "I can't seem to stay consistent in my faith...",
  };

  const personalPrompts = struggles
    .map((s) => strugglePrompts[s])
    .filter(Boolean);

  // Combine personal prompts first, then fill with base prompts
  const combined = [...personalPrompts, ...basePrompts];
  return combined.slice(0, 5);
}
