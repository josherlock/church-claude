"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { saveTeachingNote, getTeachingsNotes } from "@/lib/store";

// ---- Types ----

type Topic =
  | "All"
  | "Faith"
  | "Prayer"
  | "Identity"
  | "Grace"
  | "Worship"
  | "Community"
  | "Purpose";

interface Teaching {
  id: string;
  title: string;
  topic: Topic;
  summary: string;
  duration: string;
  type: "video" | "notes";
  scriptures: string[];
  content: string;
  gradient: string;
}

// ---- Data ----

const TOPICS: Topic[] = [
  "All",
  "Faith",
  "Prayer",
  "Identity",
  "Grace",
  "Worship",
  "Community",
  "Purpose",
];

const TEACHINGS: Teaching[] = [
  {
    id: "power-of-prayer",
    title: "The Power of Prayer",
    topic: "Prayer",
    summary:
      "Discover how prayer transforms not just our circumstances, but our hearts. Pastor Johnny explores the mechanics of effective prayer and why God invites us into conversation with Him.",
    duration: "42 min",
    type: "video",
    scriptures: [
      "Philippians 4:6-7 - Do not be anxious about anything, but in every situation, by prayer and petition, with thanksgiving, present your requests to God.",
      "James 5:16 - The prayer of a righteous person is powerful and effective.",
      "Matthew 6:6 - But when you pray, go into your room, close the door and pray to your Father, who is unseen.",
    ],
    content:
      "Prayer is not a ritual or a religious obligation — it is the lifeline between our finite hearts and the infinite God. When we pray, we are not merely speaking words into the air; we are entering the throne room of the Creator of the universe. In Philippians 4:6-7, Paul instructs us to bring everything to God with thanksgiving. Notice the order: thanksgiving first, then petition. This is because gratitude reorients our hearts toward trust. When we begin with what God has already done, our anxieties lose their grip. James tells us that the prayer of a righteous person is powerful and effective — not because of the person's perfection, but because of their position in Christ. Your prayers carry weight in the heavenly realm. Jesus modeled a prayer life of withdrawal and intimacy with the Father. He did not pray to perform; He prayed to commune. When we adopt this posture — closing the door, shutting out distractions, and simply being with God — prayer becomes less about our words and more about His presence. The discipline of daily prayer rewires our spiritual reflexes so that in moments of crisis, our first instinct is not panic but petition.",
    gradient: "from-taupe/30 via-gold/20 to-sand",
  },
  {
    id: "identity-in-christ",
    title: "Finding Your Identity in Christ",
    topic: "Identity",
    summary:
      "In a world that constantly tells you who you should be, learn what God says about who you already are. This teaching anchors your sense of self in the unshakable truth of Scripture.",
    duration: "38 min",
    type: "video",
    scriptures: [
      "2 Corinthians 5:17 - Therefore, if anyone is in Christ, the new creation has come: The old has gone, the new is here!",
      "Ephesians 2:10 - For we are God's handiwork, created in Christ Jesus to do good works, which God prepared in advance for us to do.",
      "1 Peter 2:9 - But you are a chosen people, a royal priesthood, a holy nation, God's special possession.",
    ],
    content:
      "The question of identity is the most fundamental question a human being can ask. The world offers countless answers — you are what you achieve, what you own, what others think of you. But every one of these identities is fragile, subject to change, and ultimately insufficient. In Christ, your identity is settled once and for all. Paul declares in 2 Corinthians 5:17 that if anyone is in Christ, they are a new creation. This is not aspirational language — it is declarative. The old has gone; the new is here. You are not trying to become someone new; you already are someone new. Ephesians 2:10 calls you God's handiwork, His masterpiece. The Greek word is 'poiema,' from which we get the word 'poem.' You are God's creative expression, a living work of art designed for a purpose that was established before you were born. When the enemy whispers that you are not enough, when culture pressures you to perform, remember 1 Peter 2:9: you are chosen, royal, holy, and treasured. These are not titles you earn — they are realities you receive by grace. Living from this identity rather than for this identity changes everything.",
    gradient: "from-mocha/25 via-taupe/15 to-cream",
  },
  {
    id: "walking-by-faith",
    title: "Walking by Faith, Not by Sight",
    topic: "Faith",
    summary:
      "Faith is not the absence of doubt — it is the decision to trust God in the midst of uncertainty. Explore what it means to live a faith-forward life every single day.",
    duration: "45 min",
    type: "video",
    scriptures: [
      "2 Corinthians 5:7 - For we live by faith, not by sight.",
      "Hebrews 11:1 - Now faith is confidence in what we hope for and assurance about what we do not see.",
      "Proverbs 3:5-6 - Trust in the Lord with all your heart and lean not on your own understanding.",
    ],
    content:
      "Faith is one of the most misunderstood concepts in the Christian life. Many believe faith means having no questions, no struggles, and no fear. But the heroes of Hebrews 11 were not people who had it all figured out — they were people who moved forward despite what they could not see. Abraham left his homeland without knowing his destination. Moses confronted Pharaoh with a stutter and a staff. David faced Goliath with five stones and an unshakable trust in God's faithfulness. Walking by faith means making decisions based on God's promises rather than your circumstances. It means choosing obedience when logic says otherwise. Proverbs 3:5-6 is not a suggestion — it is a way of life. 'Lean not on your own understanding' is perhaps the hardest command in Scripture because our understanding feels so reliable. But God's ways are higher than ours, and His vision extends beyond our horizon. Faith is not a feeling; it is a posture. It is waking up each morning and declaring, 'God, I do not know what today holds, but I know You hold today.' And that is enough.",
    gradient: "from-gold/25 via-sand to-cream",
  },
  {
    id: "understanding-grace",
    title: "Understanding God's Grace",
    topic: "Grace",
    summary:
      "Grace is more than unmerited favor — it is the very engine of transformation. Dive deep into the radical, scandalous, life-altering grace that defines the Gospel.",
    duration: "40 min",
    type: "notes",
    scriptures: [
      "Ephesians 2:8-9 - For it is by grace you have been saved, through faith — and this is not from yourselves, it is the gift of God — not by works, so that no one can boast.",
      "Romans 5:8 - But God demonstrates his own love for us in this: While we were still sinners, Christ died for us.",
      "Titus 3:5 - He saved us, not because of righteous things we had done, but because of his mercy.",
    ],
    content:
      "Grace is the most counterintuitive concept in the universe. Every system in the world operates on merit — you get what you earn, you reap what you sow, you receive what you deserve. But grace demolishes this framework entirely. Ephesians 2:8-9 states it plainly: salvation is a gift, not a wage. You cannot earn it, and you cannot lose what you did not earn. This is what makes grace so offensive to the human ego — it strips away every reason for boasting and leaves us utterly dependent on God's generosity. Romans 5:8 reveals the timing of grace: while we were still sinners. Not after we cleaned up our act. Not after we proved ourselves worthy. While we were at our worst, Christ gave His best. This is not a God who waits for us to meet Him halfway — this is a God who crosses the entire distance while we are running in the opposite direction. Understanding grace does not lead to complacency; it leads to gratitude. And gratitude is the most powerful motivator for holy living. When you truly grasp that you are loved not because of what you do but because of who God is, your obedience shifts from duty to delight.",
    gradient: "from-sage/20 via-cream to-sand",
  },
  {
    id: "heart-of-worship",
    title: "The Heart of True Worship",
    topic: "Worship",
    summary:
      "Worship is far more than singing on Sunday mornings. Discover how every moment of your life can become an act of worship that honors God and transforms you.",
    duration: "36 min",
    type: "video",
    scriptures: [
      "Romans 12:1 - Therefore, I urge you, brothers and sisters, in view of God's mercy, to offer your bodies as a living sacrifice, holy and pleasing to God — this is your true and proper worship.",
      "John 4:24 - God is spirit, and his worshipers must worship in the Spirit and in truth.",
      "Psalm 95:6 - Come, let us bow down in worship, let us kneel before the Lord our Maker.",
    ],
    content:
      "We have reduced worship to a genre of music, a segment of a Sunday service, and a posture of raised hands. But worship, in its biblical fullness, is the orientation of your entire life toward the glory of God. Romans 12:1 calls us to offer our bodies — our everyday, mundane, ordinary bodies — as living sacrifices. This means worship happens in the boardroom, the kitchen, the carpool lane, and the hospital room. It happens when you choose integrity when no one is watching, when you extend kindness to someone who cannot repay you, and when you trust God's plan in the middle of your pain. Jesus told the woman at the well that true worshipers worship in Spirit and in truth. Spirit speaks to authenticity — God is not interested in performance or pretense. Truth speaks to alignment with His Word — worship must be grounded in who God actually is, not who we imagine Him to be. When these two elements converge — sincerity and Scripture — worship becomes the most powerful force in the believer's life. It realigns our priorities, recalibrates our emotions, and reconnects us to the source of all joy.",
    gradient: "from-taupe/20 via-gold/15 to-parchment",
  },
  {
    id: "biblical-community",
    title: "Building Biblical Community",
    topic: "Community",
    summary:
      "God never designed us to walk this journey alone. Learn the biblical blueprint for authentic, life-giving community that goes far beyond surface-level fellowship.",
    duration: "35 min",
    type: "notes",
    scriptures: [
      "Hebrews 10:24-25 - And let us consider how we may spur one another on toward love and good deeds, not giving up meeting together.",
      "Acts 2:42 - They devoted themselves to the apostles' teaching and to fellowship, to the breaking of bread and to prayer.",
      "Ecclesiastes 4:9-10 - Two are better than one... If either of them falls down, one can help the other up.",
    ],
    content:
      "The Western church has been deeply influenced by individualism, and it has cost us dearly. We approach faith as a private transaction between us and God, and while the personal dimension is essential, it was never meant to be the totality. The early church in Acts 2 devoted themselves to four things: teaching, fellowship, breaking bread, and prayer. Notice that three of the four are inherently communal. They did not merely attend services together — they shared meals, shared resources, and shared lives. Hebrews 10:24-25 gives us the purpose of community: to spur one another on toward love and good deeds. Biblical community is not a social club; it is a spiritual greenhouse where growth is accelerated through accountability, encouragement, and mutual burden-bearing. Ecclesiastes reminds us that when one falls, the other can help them up — but the one who falls alone has no one to help them. Isolation is one of the enemy's most effective strategies. When you withdraw from community, you become vulnerable. When you stay connected, you become resilient. Building biblical community requires vulnerability, consistency, and grace — the willingness to be known, the commitment to show up, and the humility to forgive.",
    gradient: "from-warmGray/30 via-sand to-cream",
  },
  {
    id: "eternal-purpose",
    title: "Living with Eternal Purpose",
    topic: "Purpose",
    summary:
      "You were created on purpose, for a purpose. This teaching unveils how to align your daily decisions with God's eternal plan and find deep meaning in every season of life.",
    duration: "44 min",
    type: "video",
    scriptures: [
      "Jeremiah 29:11 - For I know the plans I have for you, declares the Lord, plans to prosper you and not to harm you, plans to give you hope and a future.",
      "Ephesians 1:11 - In him we were also chosen, having been predestined according to the plan of him who works out everything in conformity with the purpose of his will.",
      "Colossians 3:23 - Whatever you do, work at it with all your heart, as working for the Lord, not for human masters.",
    ],
    content:
      "Purpose is not something you invent — it is something you discover. Jeremiah 29:11 assures us that God has plans for each of us, plans that were established before we drew our first breath. But discovering purpose is not about waiting for a dramatic revelation from heaven; it is about faithfully stewarding what is in front of you right now. Ephesians 1:11 reveals that God works out everything according to the purpose of His will. This means that your current circumstances — even the difficult ones — are not accidents. They are part of a larger narrative that God is writing with your life. The key to living with eternal purpose is found in Colossians 3:23: whatever you do, do it as unto the Lord. This transforms every task, no matter how small or seemingly insignificant, into an act of eternal significance. The mother changing diapers, the student studying for exams, the employee filing reports — all of it matters when it is done for God's glory. Purpose is not reserved for pastors and missionaries; it belongs to every believer who chooses to see their ordinary life through the lens of God's extraordinary plan.",
    gradient: "from-espresso/15 via-mocha/10 to-sand",
  },
  {
    id: "overcoming-fear",
    title: "Overcoming Fear with Faith",
    topic: "Faith",
    summary:
      "Fear is the thief of destiny. In this powerful teaching, Pastor Johnny reveals how faith dismantles fear and positions you for the breakthroughs God has prepared.",
    duration: "41 min",
    type: "video",
    scriptures: [
      "2 Timothy 1:7 - For the Spirit God gave us does not make us timid, but gives us power, love and self-discipline.",
      "Isaiah 41:10 - So do not fear, for I am with you; do not be dismayed, for I am your God.",
      "Psalm 56:3 - When I am afraid, I put my trust in you.",
    ],
    content:
      "Fear is mentioned over 365 times in the Bible — one reminder for every day of the year that we do not need to be afraid. This is not because fear is irrational or because our circumstances are not genuinely threatening. It is because the God who stands behind us is greater than anything that stands before us. 2 Timothy 1:7 is not merely a comforting verse; it is a diagnostic tool. If you are operating in timidity, that is not from God. The Spirit He gave you produces power, love, and self-discipline — the exact opposite of fear. Isaiah 41:10 pairs two commands with two promises: do not fear, for I am with you; do not be dismayed, for I am your God. The antidote to fear is not courage in the human sense — it is the presence of God. When you know who is with you, the size of what is against you becomes irrelevant. The Psalmist models healthy spiritual practice in Psalm 56:3: 'When I am afraid' — notice he does not deny the feeling — 'I put my trust in you.' Faith does not eliminate fear; it overrides it. Every time you choose trust over terror, you are strengthening a spiritual muscle that will carry you through the next trial and the one after that.",
    gradient: "from-gold/20 via-taupe/15 to-cream",
  },
  {
    id: "daily-devotion",
    title: "The Discipline of Daily Devotion",
    topic: "Prayer",
    summary:
      "Consistency in the secret place produces power in the public space. Learn how to build and sustain a daily devotional life that fuels everything else you do.",
    duration: "33 min",
    type: "notes",
    scriptures: [
      "Psalm 1:2-3 - But whose delight is in the law of the Lord, and who meditates on his law day and night. That person is like a tree planted by streams of water.",
      "Mark 1:35 - Very early in the morning, while it was still dark, Jesus got up, left the house and went off to a solitary place, where he prayed.",
      "Joshua 1:8 - Keep this Book of the Law always on your lips; meditate on it day and night, so that you may be careful to do everything written in it.",
    ],
    content:
      "If Jesus needed to withdraw to a solitary place for prayer, how much more do we? Mark 1:35 reveals that even the Son of God prioritized daily communion with the Father — not as a luxury, but as a necessity. The discipline of daily devotion is exactly that: a discipline. It will not always feel inspiring. There will be mornings when the alarm goes off and everything in you resists the quiet. But Psalm 1 promises that the one who meditates on God's Word day and night will be like a tree planted by streams of water — fruitful, resilient, and evergreen. Trees do not bear fruit through sporadic effort; they bear fruit through constant, hidden nourishment. Your roots are what determine your fruit. Joshua 1:8 connects meditation with obedience: we meditate so that we may be careful to do what is written. Devotion is not merely intellectual exercise — it is the formation of character. Every morning you spend in the Word is a deposit into a spiritual bank account that will sustain you when the withdrawals come. Build the habit. Protect the time. Show up even when you do not feel like it. The compound interest of daily devotion will transform your life in ways you cannot yet imagine.",
    gradient: "from-mocha/20 via-warmGray/15 to-sand",
  },
  {
    id: "surrendering-control",
    title: "Surrendering Control to God",
    topic: "Faith",
    summary:
      "The tightest grip produces the greatest anxiety. This teaching invites you into the freedom of releasing your plans, your timelines, and your outcomes to a sovereign God.",
    duration: "39 min",
    type: "video",
    scriptures: [
      "Proverbs 16:9 - In their hearts humans plan their course, but the Lord establishes their steps.",
      "Matthew 16:25 - For whoever wants to save their life will lose it, but whoever loses their life for me will find it.",
      "Isaiah 55:8-9 - For my thoughts are not your thoughts, neither are your ways my ways, declares the Lord.",
    ],
    content:
      "Control is the illusion that keeps us from peace. We plan, strategize, and engineer our lives with meticulous detail, and then we are devastated when things do not go according to plan. Proverbs 16:9 offers a liberating truth: you can plan your course, but God establishes your steps. This is not a threat — it is a promise. The God who sees the end from the beginning is actively directing your path, even when it diverges from your plan. Jesus put it paradoxically in Matthew 16:25: whoever tries to save their life will lose it, but whoever loses their life for His sake will find it. Surrender is not passive resignation — it is active trust. It is the conscious decision to open your hands and say, 'God, Your will, not mine.' Isaiah 55 reminds us that God's thoughts and ways are higher than ours. This means that when God redirects, delays, or closes a door, He is not working against you — He is working for you in ways your limited perspective cannot yet perceive. Surrendering control does not mean abandoning responsibility; it means holding your plans loosely and God's promises tightly. It means doing your part and trusting God with the outcome. And in that space between effort and surrender, you will find a peace that surpasses all understanding.",
    gradient: "from-taupe/25 via-sand to-parchment",
  },
  {
    id: "forgiveness-freedom",
    title: "Forgiveness and Freedom",
    topic: "Grace",
    summary:
      "Unforgiveness is a prison with invisible bars. Pastor Johnny unpacks the radical call to forgive as we have been forgiven, and the freedom that awaits on the other side.",
    duration: "37 min",
    type: "video",
    scriptures: [
      "Colossians 3:13 - Bear with each other and forgive one another if any of you has a grievance against someone. Forgive as the Lord forgave you.",
      "Matthew 6:14-15 - For if you forgive other people when they sin against you, your heavenly Father will also forgive you.",
      "Ephesians 4:31-32 - Get rid of all bitterness, rage and anger... Be kind and compassionate to one another, forgiving each other, just as in Christ God forgave you.",
    ],
    content:
      "Forgiveness is not a feeling — it is a decision. And it is one of the hardest decisions you will ever make. When someone wounds you deeply, every fiber of your being cries out for justice, for retribution, for acknowledgment of the wrong done. And those instincts are not entirely wrong — God is a God of justice. But He is also a God of mercy. Colossians 3:13 establishes the standard for our forgiveness: 'as the Lord forgave you.' This is staggering. God forgave us a debt we could never repay, offenses we could never undo, and rebellion we could never justify. If He can forgive that, He empowers us to forgive anything done to us. Jesus connects horizontal forgiveness to vertical relationship in Matthew 6:14-15 — not as a transactional threat, but as a spiritual reality. An unforgiving heart is a closed heart, and a closed heart cannot fully receive. Ephesians 4 gives us the process: get rid of bitterness, rage, and anger, and replace them with kindness, compassion, and forgiveness. This is not a one-time event; it is a daily practice. You may need to forgive the same person for the same offense seventy times seven times. But each act of forgiveness loosens the chains a little more, until one day you realize: you are free.",
    gradient: "from-sage/15 via-gold/10 to-cream",
  },
  {
    id: "serving-as-worship",
    title: "Serving Others as Worship",
    topic: "Worship",
    summary:
      "The highest form of worship is not what happens on stage — it is what happens in the margins, in the quiet acts of service that reflect the heart of Jesus to a watching world.",
    duration: "34 min",
    type: "notes",
    scriptures: [
      "Mark 10:45 - For even the Son of Man did not come to be served, but to serve, and to give his life as a ransom for many.",
      "Galatians 5:13 - You, my brothers and sisters, were called to be free. But do not use your freedom to indulge the flesh; rather, serve one another humbly in love.",
      "Matthew 25:40 - The King will reply, Truly I tell you, whatever you did for one of the least of these brothers and sisters of mine, you did for me.",
    ],
    content:
      "Jesus, the King of kings, wrapped a towel around His waist and washed dirty feet. In that single act, He redefined greatness for all eternity. Mark 10:45 declares His mission statement: He came not to be served, but to serve. If the Son of God identified His purpose as service, how can His followers pursue anything less? Galatians 5:13 reframes our freedom: we are set free not to live for ourselves, but to serve one another in love. Service is the overflow of a life that has been radically loved by God. When you have experienced the depth of His grace, you cannot help but extend it to others. And here is the breathtaking promise of Matthew 25:40: when you serve the marginalized, the overlooked, and the forgotten, you are serving Jesus Himself. Every meal served at a shelter, every hour spent mentoring a young person, every act of kindness extended to a stranger — these are not peripheral activities to the Christian life. They are central. They are worship in its most tangible form. The church does not exist for itself; it exists for the world. And when we serve with no expectation of return, no desire for recognition, and no agenda other than love, the world sees something it cannot explain — and that unexplainable something is the Gospel made visible.",
    gradient: "from-warmGray/20 via-taupe/10 to-sand",
  },
];

// ---- Component ----

export default function TeachingsPage() {
  const [selectedTopic, setSelectedTopic] = useState<Topic>("All");
  const [activeTeaching, setActiveTeaching] = useState<Teaching | null>(null);
  const [notes, setNotes] = useState<Record<string, string>>({});
  const [currentNote, setCurrentNote] = useState("");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setNotes(getTeachingsNotes());
    setMounted(true);
  }, []);

  useEffect(() => {
    if (activeTeaching) {
      setCurrentNote(notes[activeTeaching.id] || "");
    }
  }, [activeTeaching, notes]);

  const handleSaveNote = useCallback(() => {
    if (!activeTeaching) return;
    saveTeachingNote(activeTeaching.id, currentNote);
    setNotes((prev) => ({ ...prev, [activeTeaching.id]: currentNote }));
  }, [activeTeaching, currentNote]);

  const filteredTeachings =
    selectedTopic === "All"
      ? TEACHINGS
      : TEACHINGS.filter((t) => t.topic === selectedTopic);

  const getRelatedTeachings = (teaching: Teaching) =>
    TEACHINGS.filter(
      (t) => t.id !== teaching.id && t.topic === teaching.topic
    ).slice(0, 3);

  if (!mounted) {
    return (
      <div className="min-h-screen bg-cream flex items-center justify-center">
        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-taupe to-gold animate-pulse" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-cream">
      {/* ---- Header ---- */}
      <div className="bg-gradient-to-br from-espresso via-mocha to-taupe text-white">
        <div className="max-w-6xl mx-auto px-4 py-12 sm:py-16">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-gold/80 hover:text-gold transition-colors text-sm mb-6"
          >
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 19l-7-7 7-7"
              />
            </svg>
            Back to Home
          </Link>
          <h1 className="font-serif text-4xl sm:text-5xl font-bold mb-3 tracking-tight">
            Teachings
          </h1>
          <p className="text-gold/90 text-lg sm:text-xl font-sans">
            Insights from Pastor Johnny Chang
          </p>
          <p className="text-white/60 text-sm font-sans mt-2 max-w-xl">
            Explore sermon notes, video teachings, and scriptural insights to
            deepen your walk with God.
          </p>
        </div>
      </div>

      {/* ---- Topic Filter ---- */}
      <div className="sticky top-0 z-30 bg-parchment/95 backdrop-blur-sm border-b border-warmBorder">
        <div className="max-w-6xl mx-auto px-4">
          <div className="flex gap-2 py-3 overflow-x-auto scrollbar-hide -mx-4 px-4">
            {TOPICS.map((topic) => (
              <button
                key={topic}
                onClick={() => setSelectedTopic(topic)}
                className={`flex-shrink-0 px-4 py-2 rounded-full text-sm font-sans font-medium transition-all duration-200 ${
                  selectedTopic === topic
                    ? "bg-espresso text-white shadow-md"
                    : "bg-sand text-mocha hover:bg-warmGray/50 hover:text-espresso"
                }`}
              >
                {topic}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* ---- Teaching Cards Grid ---- */}
      <div className="max-w-6xl mx-auto px-4 py-8">
        {filteredTeachings.length === 0 ? (
          <div className="text-center py-16">
            <p className="text-mocha/60 font-sans text-lg">
              No teachings found for this topic.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredTeachings.map((teaching) => (
              <button
                key={teaching.id}
                onClick={() => setActiveTeaching(teaching)}
                className="group bg-white rounded-2xl border border-warmBorder shadow-sm hover:shadow-lg transition-all duration-300 overflow-hidden text-left flex flex-col"
              >
                {/* Card gradient header */}
                <div
                  className={`bg-gradient-to-br ${teaching.gradient} px-5 pt-5 pb-4`}
                >
                  <span className="inline-block px-3 py-1 rounded-full bg-white/70 backdrop-blur-sm text-xs font-sans font-semibold text-mocha uppercase tracking-wide">
                    {teaching.topic}
                  </span>
                </div>

                {/* Card body */}
                <div className="px-5 py-4 flex flex-col flex-1">
                  <h3 className="font-serif text-lg font-bold text-espresso group-hover:text-taupe transition-colors mb-2 leading-snug">
                    {teaching.title}
                  </h3>
                  <p className="text-mocha/70 text-sm font-sans leading-relaxed mb-4 line-clamp-3 flex-1">
                    {teaching.summary}
                  </p>
                  <div className="flex items-center justify-between pt-3 border-t border-warmBorder/60">
                    <div className="flex items-center gap-2 text-mocha/50 text-xs font-sans">
                      <svg
                        className="w-4 h-4"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                        />
                      </svg>
                      {teaching.duration}
                    </div>
                    <span className="inline-flex items-center gap-1.5 text-xs font-sans font-semibold text-gold group-hover:text-taupe transition-colors">
                      {teaching.type === "video" ? (
                        <>
                          <svg
                            className="w-4 h-4"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z"
                            />
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                            />
                          </svg>
                          Watch
                        </>
                      ) : (
                        <>
                          <svg
                            className="w-4 h-4"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                            />
                          </svg>
                          Read Notes
                        </>
                      )}
                    </span>
                  </div>
                </div>
              </button>
            ))}
          </div>
        )}
      </div>

      {/* ---- Teaching Detail Modal ---- */}
      {activeTeaching && (
        <div
          className="fixed inset-0 z-50 flex items-start justify-center bg-espresso/60 backdrop-blur-sm overflow-y-auto"
          onClick={(e) => {
            if (e.target === e.currentTarget) setActiveTeaching(null);
          }}
        >
          <div className="relative w-full max-w-3xl mx-4 my-8 sm:my-12 bg-parchment rounded-2xl shadow-2xl border border-warmBorder overflow-hidden">
            {/* Modal header */}
            <div
              className={`bg-gradient-to-br ${activeTeaching.gradient} px-6 sm:px-8 pt-6 pb-5`}
            >
              <div className="flex items-start justify-between">
                <div>
                  <span className="inline-block px-3 py-1 rounded-full bg-white/70 backdrop-blur-sm text-xs font-sans font-semibold text-mocha uppercase tracking-wide mb-3">
                    {activeTeaching.topic}
                  </span>
                  <h2 className="font-serif text-2xl sm:text-3xl font-bold text-espresso leading-tight">
                    {activeTeaching.title}
                  </h2>
                  <div className="flex items-center gap-4 mt-3 text-mocha/60 text-sm font-sans">
                    <span className="flex items-center gap-1.5">
                      <svg
                        className="w-4 h-4"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                        />
                      </svg>
                      {activeTeaching.duration}
                    </span>
                    <span className="flex items-center gap-1.5">
                      <svg
                        className="w-4 h-4"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                        />
                      </svg>
                      Pastor Johnny Chang
                    </span>
                  </div>
                </div>
                <button
                  onClick={() => setActiveTeaching(null)}
                  className="flex-shrink-0 w-10 h-10 rounded-full bg-white/60 hover:bg-white/90 transition-colors flex items-center justify-center text-espresso"
                >
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              </div>
            </div>

            {/* Modal body */}
            <div className="px-6 sm:px-8 py-6 space-y-8">
              {/* Teaching content */}
              <div>
                <h3 className="font-serif text-lg font-bold text-espresso mb-3 flex items-center gap-2">
                  <svg
                    className="w-5 h-5 text-gold"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
                    />
                  </svg>
                  Teaching Notes
                </h3>
                <p className="text-mocha/80 font-sans text-sm sm:text-base leading-relaxed">
                  {activeTeaching.content}
                </p>
              </div>

              {/* Scripture references */}
              <div>
                <h3 className="font-serif text-lg font-bold text-espresso mb-3 flex items-center gap-2">
                  <svg
                    className="w-5 h-5 text-gold"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z"
                    />
                  </svg>
                  Key Scriptures
                </h3>
                <div className="space-y-3">
                  {activeTeaching.scriptures.map((scripture, idx) => {
                    const [ref, ...textParts] = scripture.split(" - ");
                    const text = textParts.join(" - ");
                    return (
                      <div
                        key={idx}
                        className="bg-sand/50 border border-warmBorder/50 rounded-xl p-4"
                      >
                        <span className="font-serif text-sm font-bold text-taupe block mb-1">
                          {ref}
                        </span>
                        <span className="text-mocha/70 font-sans text-sm italic leading-relaxed">
                          &ldquo;{text}&rdquo;
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Personal notes */}
              <div>
                <h3 className="font-serif text-lg font-bold text-espresso mb-3 flex items-center gap-2">
                  <svg
                    className="w-5 h-5 text-gold"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                    />
                  </svg>
                  Personal Notes
                </h3>
                <textarea
                  value={currentNote}
                  onChange={(e) => setCurrentNote(e.target.value)}
                  placeholder="Write your personal reflections, takeaways, and prayers here..."
                  className="w-full h-32 rounded-xl border border-warmBorder bg-white p-4 text-sm font-sans text-espresso placeholder:text-mocha/30 focus:outline-none focus:ring-2 focus:ring-gold/40 focus:border-gold/60 resize-none transition-all"
                />
                <button
                  onClick={handleSaveNote}
                  className="mt-2 px-5 py-2.5 rounded-xl bg-espresso text-white text-sm font-sans font-semibold hover:bg-mocha transition-colors shadow-sm"
                >
                  Save Notes
                </button>
              </div>

              {/* Related teachings */}
              {getRelatedTeachings(activeTeaching).length > 0 && (
                <div>
                  <h3 className="font-serif text-lg font-bold text-espresso mb-3 flex items-center gap-2">
                    <svg
                      className="w-5 h-5 text-gold"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1"
                      />
                    </svg>
                    Related Teachings
                  </h3>
                  <div className="space-y-2">
                    {getRelatedTeachings(activeTeaching).map((related) => (
                      <button
                        key={related.id}
                        onClick={() => setActiveTeaching(related)}
                        className="w-full text-left flex items-center gap-4 p-3 rounded-xl bg-sand/40 hover:bg-sand border border-warmBorder/40 hover:border-warmBorder transition-all group"
                      >
                        <div
                          className={`flex-shrink-0 w-10 h-10 rounded-lg bg-gradient-to-br ${related.gradient} flex items-center justify-center`}
                        >
                          <svg
                            className="w-4 h-4 text-mocha/60"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z"
                            />
                          </svg>
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-serif text-sm font-bold text-espresso group-hover:text-taupe transition-colors truncate">
                            {related.title}
                          </p>
                          <p className="text-mocha/50 text-xs font-sans">
                            {related.duration}
                          </p>
                        </div>
                        <svg
                          className="w-4 h-4 text-mocha/30 group-hover:text-taupe transition-colors flex-shrink-0"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M9 5l7 7-7 7"
                          />
                        </svg>
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
