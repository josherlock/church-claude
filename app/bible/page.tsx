"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import {
  bibleBooks,
  oldTestament,
  newTestament,
  BibleBook,
} from "@/lib/bible-books";
import {
  saveLastBiblePosition,
  getLastBiblePosition,
} from "@/lib/store";

type ViewMode = "books" | "chapters" | "reading";

interface BibleVerse {
  verse: number;
  text: string;
}

interface BibleApiResponse {
  text: string;
  verses: BibleVerse[];
  reference: string;
}

export default function BiblePage() {
  const [view, setView] = useState<ViewMode>("books");
  const [testament, setTestament] = useState<"OT" | "NT">("OT");
  const [selectedBook, setSelectedBook] = useState<BibleBook | null>(null);
  const [selectedChapter, setSelectedChapter] = useState<number>(1);
  const [verses, setVerses] = useState<BibleVerse[]>([]);
  const [reference, setReference] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [mounted, setMounted] = useState(false);

  // Restore last position on mount
  useEffect(() => {
    const pos = getLastBiblePosition();
    const book = bibleBooks.find(
      (b) => b.name.toLowerCase() === pos.book.toLowerCase()
    );
    if (book) {
      setSelectedBook(book);
      setSelectedChapter(pos.chapter);
      setTestament(book.testament);
    }
    setMounted(true);
  }, []);

  const fetchChapter = useCallback(
    async (book: BibleBook, chapter: number) => {
      setLoading(true);
      setError(null);
      setVerses([]);

      try {
        const encodedName = encodeURIComponent(book.name);
        const res = await fetch(
          `https://bible-api.com/${encodedName}+${chapter}?translation=kjv`
        );

        if (!res.ok) {
          throw new Error(`Failed to load ${book.name} ${chapter}`);
        }

        const data: BibleApiResponse = await res.json();
        setVerses(data.verses);
        setReference(data.reference);
        saveLastBiblePosition(book.name, chapter);
      } catch (err) {
        setError(
          err instanceof Error
            ? err.message
            : "An error occurred while loading the chapter."
        );
      } finally {
        setLoading(false);
      }
    },
    []
  );

  const handleSelectBook = (book: BibleBook) => {
    setSelectedBook(book);
    setSelectedChapter(1);
    setView("chapters");
  };

  const handleSelectChapter = (chapter: number) => {
    if (!selectedBook) return;
    setSelectedChapter(chapter);
    setView("reading");
    fetchChapter(selectedBook, chapter);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleBackToBooks = () => {
    setView("books");
    setVerses([]);
    setError(null);
  };

  const handleBackToChapters = () => {
    setView("chapters");
    setVerses([]);
    setError(null);
  };

  const handlePrevChapter = () => {
    if (!selectedBook || selectedChapter <= 1) return;
    const prev = selectedChapter - 1;
    setSelectedChapter(prev);
    fetchChapter(selectedBook, prev);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleNextChapter = () => {
    if (!selectedBook || selectedChapter >= selectedBook.chapters) return;
    const next = selectedChapter + 1;
    setSelectedChapter(next);
    fetchChapter(selectedBook, next);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const displayBooks = testament === "OT" ? oldTestament : newTestament;

  if (!mounted) {
    return (
      <div className="min-h-screen bg-cream flex items-center justify-center">
        <div className="w-8 h-8 rounded-full hero-gradient animate-pulse" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-cream">
      {/* ========== Header ========== */}
      <header className="hero-gradient relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 rounded-full bg-white/5 -translate-y-1/2 translate-x-1/2" />
        <div className="absolute bottom-0 left-0 w-48 h-48 rounded-full bg-white/5 translate-y-1/2 -translate-x-1/2" />

        <div className="relative z-10 max-w-4xl mx-auto px-5 py-10 md:py-14">
          {/* Back to home */}
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 text-white/60 hover:text-white/90 text-sm font-sans transition-colors mb-6"
          >
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
              <polyline points="15 18 9 12 15 6" />
            </svg>
            Home
          </Link>

          <div className="text-center">
            <h1 className="font-serif text-3xl sm:text-4xl md:text-5xl font-bold text-white/95 mb-2">
              The Bible
            </h1>
            <p className="text-gold/80 text-xs sm:text-sm font-sans font-medium tracking-[0.2em] uppercase">
              King James Version
            </p>
          </div>
        </div>
      </header>

      {/* ========== Main Content ========== */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6 md:py-8">
        {/* ========== Books View ========== */}
        {view === "books" && (
          <div className="fade-in-up">
            {/* Testament Tabs */}
            <div className="flex justify-center mb-8">
              <div className="inline-flex bg-parchment rounded-xl border border-warmBorder p-1">
                <button
                  onClick={() => setTestament("OT")}
                  className={`px-5 py-2.5 rounded-lg text-sm font-medium font-sans transition-all ${
                    testament === "OT"
                      ? "bg-espresso text-white shadow-sm"
                      : "text-mocha hover:text-espresso"
                  }`}
                >
                  Old Testament
                </button>
                <button
                  onClick={() => setTestament("NT")}
                  className={`px-5 py-2.5 rounded-lg text-sm font-medium font-sans transition-all ${
                    testament === "NT"
                      ? "bg-espresso text-white shadow-sm"
                      : "text-mocha hover:text-espresso"
                  }`}
                >
                  New Testament
                </button>
              </div>
            </div>

            {/* Book Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
              {displayBooks.map((book) => (
                <button
                  key={book.name}
                  onClick={() => handleSelectBook(book)}
                  className="bg-parchment rounded-xl p-4 border border-warmBorder text-left card-hover group"
                >
                  <h3 className="font-serif font-semibold text-espresso text-sm md:text-base group-hover:text-taupe transition-colors leading-tight">
                    {book.name}
                  </h3>
                  <p className="text-xs text-mocha mt-1">
                    {book.chapters} {book.chapters === 1 ? "chapter" : "chapters"}
                  </p>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* ========== Chapters View ========== */}
        {view === "chapters" && selectedBook && (
          <div className="fade-in-up">
            {/* Back button */}
            <button
              onClick={handleBackToBooks}
              className="inline-flex items-center gap-1.5 text-taupe hover:text-espresso text-sm font-sans font-medium transition-colors mb-6"
            >
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
                <polyline points="15 18 9 12 15 6" />
              </svg>
              Back to Books
            </button>

            {/* Book title */}
            <div className="text-center mb-8">
              <h2 className="font-serif text-2xl sm:text-3xl font-bold text-espresso">
                {selectedBook.name}
              </h2>
              <p className="text-sm text-mocha mt-1">
                Select a chapter to begin reading
              </p>
            </div>

            {/* Chapter Grid */}
            <div className="grid grid-cols-5 sm:grid-cols-8 md:grid-cols-10 gap-2 sm:gap-3">
              {Array.from({ length: selectedBook.chapters }, (_, i) => i + 1).map(
                (ch) => (
                  <button
                    key={ch}
                    onClick={() => handleSelectChapter(ch)}
                    className={`aspect-square rounded-xl flex items-center justify-center text-sm sm:text-base font-serif font-medium border transition-all hover:scale-105 ${
                      ch === selectedChapter &&
                      selectedBook.name ===
                        getLastBiblePosition().book &&
                      ch === getLastBiblePosition().chapter
                        ? "bg-taupe text-white border-taupe shadow-sm"
                        : "bg-parchment text-espresso border-warmBorder hover:border-taupe hover:bg-sand"
                    }`}
                  >
                    {ch}
                  </button>
                )
              )}
            </div>
          </div>
        )}

        {/* ========== Reading View ========== */}
        {view === "reading" && selectedBook && (
          <div className="fade-in-up">
            {/* Navigation bar */}
            <div className="flex items-center justify-between mb-6">
              <button
                onClick={handleBackToChapters}
                className="inline-flex items-center gap-1.5 text-taupe hover:text-espresso text-sm font-sans font-medium transition-colors"
              >
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
                  <polyline points="15 18 9 12 15 6" />
                </svg>
                {selectedBook.name}
              </button>

              <button
                onClick={handleBackToBooks}
                className="text-xs text-mocha hover:text-espresso font-sans font-medium transition-colors"
              >
                All Books
              </button>
            </div>

            {/* Chapter heading */}
            <div className="text-center mb-8">
              <p className="text-gold text-xs font-sans font-medium tracking-[0.15em] uppercase mb-2">
                {selectedBook.name}
              </p>
              <h2 className="font-serif text-3xl sm:text-4xl font-bold text-espresso">
                Chapter {selectedChapter}
              </h2>
              {reference && (
                <p className="text-sm text-mocha mt-1">{reference}</p>
              )}
            </div>

            {/* Loading state */}
            {loading && (
              <div className="flex flex-col items-center justify-center py-20">
                <div className="w-10 h-10 rounded-full border-2 border-warmBorder border-t-taupe animate-spin mb-4" />
                <p className="text-sm text-mocha font-sans">
                  Loading Scripture...
                </p>
              </div>
            )}

            {/* Error state */}
            {error && (
              <div className="bg-parchment rounded-2xl border border-warmBorder p-8 text-center">
                <div className="w-12 h-12 rounded-full bg-taupe/10 flex items-center justify-center mx-auto mb-4">
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
                    <circle cx="12" cy="12" r="10" />
                    <line x1="12" y1="8" x2="12" y2="12" />
                    <line x1="12" y1="16" x2="12.01" y2="16" />
                  </svg>
                </div>
                <p className="text-sm font-medium text-espresso mb-1">
                  Unable to load chapter
                </p>
                <p className="text-xs text-mocha mb-4">{error}</p>
                <button
                  onClick={() => fetchChapter(selectedBook, selectedChapter)}
                  className="inline-flex items-center gap-2 bg-espresso text-white px-5 py-2.5 rounded-xl text-sm font-medium hover:bg-espresso/90 transition-colors"
                >
                  Try Again
                </button>
              </div>
            )}

            {/* Verse display */}
            {!loading && !error && verses.length > 0 && (
              <div className="bg-parchment rounded-2xl border border-warmBorder p-6 sm:p-8 md:p-10 lg:p-12 shadow-sm">
                <div className="max-w-2xl mx-auto">
                  {verses.map((v) => (
                    <span key={v.verse} className="verse-text text-base sm:text-lg text-espresso/90">
                      <sup className="text-[10px] sm:text-xs font-sans font-semibold text-taupe/70 mr-1 relative -top-[0.5em] select-none">
                        {v.verse}
                      </sup>
                      {v.text}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Chapter Navigation */}
            {!loading && !error && verses.length > 0 && (
              <div className="mt-8 flex items-center justify-between">
                <button
                  onClick={handlePrevChapter}
                  disabled={selectedChapter <= 1}
                  className={`inline-flex items-center gap-2 px-5 py-3 rounded-xl text-sm font-medium font-sans transition-all ${
                    selectedChapter <= 1
                      ? "text-warmGray cursor-not-allowed"
                      : "bg-parchment text-espresso border border-warmBorder hover:border-taupe hover:bg-sand"
                  }`}
                >
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
                    <polyline points="15 18 9 12 15 6" />
                  </svg>
                  Chapter {selectedChapter - 1}
                </button>

                <button
                  onClick={handleBackToChapters}
                  className="px-4 py-3 rounded-xl text-sm font-medium font-sans text-taupe hover:text-espresso transition-colors"
                >
                  Chapters
                </button>

                <button
                  onClick={handleNextChapter}
                  disabled={selectedChapter >= selectedBook.chapters}
                  className={`inline-flex items-center gap-2 px-5 py-3 rounded-xl text-sm font-medium font-sans transition-all ${
                    selectedChapter >= selectedBook.chapters
                      ? "text-warmGray cursor-not-allowed"
                      : "bg-parchment text-espresso border border-warmBorder hover:border-taupe hover:bg-sand"
                  }`}
                >
                  Chapter {selectedChapter + 1}
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
                    <polyline points="9 18 15 12 9 6" />
                  </svg>
                </button>
              </div>
            )}
          </div>
        )}

        {/* Bottom spacing */}
        <div className="h-8 md:h-12" />
      </div>
    </div>
  );
}
