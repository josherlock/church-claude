"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { getProfile } from "@/lib/store";

const navItems = [
  {
    name: "Home",
    href: "/",
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
        <polyline points="9 22 9 12 15 12 15 22" />
      </svg>
    ),
  },
  {
    name: "Bible",
    href: "/bible",
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
        <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
        <line x1="12" y1="6" x2="12" y2="13" />
        <line x1="8.5" y1="9.5" x2="15.5" y2="9.5" />
      </svg>
    ),
  },
  {
    name: "Devotion",
    href: "/devotion",
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10 10-4.5 10-10S17.5 2 12 2z" />
        <path d="M12 6v6l4 2" />
      </svg>
    ),
  },
  {
    name: "Teachings",
    href: "/teachings",
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <polygon points="5 3 19 12 5 21 5 3" />
      </svg>
    ),
  },
  {
    name: "Heart",
    href: "/heart-check",
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78L12 21.23l8.84-8.84a5.5 5.5 0 0 0 0-7.78z" />
        <path d="M12 8v4" />
        <path d="M12 16h.01" />
      </svg>
    ),
  },
  {
    name: "Community",
    href: "/community",
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
        <circle cx="9" cy="7" r="4" />
        <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
        <path d="M16 3.13a4 4 0 0 1 0 7.75" />
      </svg>
    ),
  },
];

export default function Navigation() {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [avatarUrl, setAvatarUrl] = useState("");
  const [initials, setInitials] = useState("?");

  useEffect(() => {
    const profile = getProfile();
    setAvatarUrl(profile.avatarUrl || "");
    const name = profile.name || "";
    setInitials(
      name
        .split(" ")
        .map((w: string) => w[0])
        .join("")
        .toUpperCase()
        .slice(0, 2) || "?"
    );
  }, []);

  return (
    <>
      {/* Desktop Top Navigation */}
      <nav className="hidden md:flex fixed top-0 left-0 right-0 z-50 bg-parchment/90 backdrop-blur-md border-b border-warmBorder">
        <div className="w-full max-w-7xl mx-auto px-8 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full hero-gradient flex items-center justify-center">
              <span className="text-white text-xs font-serif font-bold">A</span>
            </div>
            <span className="font-serif text-xl font-semibold text-espresso tracking-wide">
              Abide
            </span>
          </Link>

          <div className="flex items-center gap-1">
            {navItems.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                    isActive
                      ? "bg-espresso/10 text-espresso"
                      : "text-mocha hover:bg-espresso/5 hover:text-espresso"
                  }`}
                >
                  {item.name}
                </Link>
              );
            })}

            {/* Profile Avatar */}
            <Link
              href="/profile"
              className={`ml-2 w-8 h-8 rounded-full overflow-hidden border-2 transition-all duration-200 flex-shrink-0 ${
                pathname === "/profile"
                  ? "border-gold shadow-sm"
                  : "border-warmBorder hover:border-taupe"
              }`}
            >
              {avatarUrl ? (
                <img src={avatarUrl} alt="Profile" className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full bg-taupe/20 flex items-center justify-center">
                  <span className="text-[10px] font-serif font-bold text-taupe">{initials}</span>
                </div>
              )}
            </Link>
          </div>
        </div>
      </nav>

      {/* Desktop nav spacer */}
      <div className="hidden md:block h-16" />

      {/* Mobile Bottom Navigation */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-parchment/95 backdrop-blur-md border-t border-warmBorder safe-area-bottom">
        <div className="flex items-center justify-around px-2 py-2">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.name}
                href={item.href}
                className={`flex flex-col items-center gap-1 px-2 py-1.5 rounded-xl transition-all duration-200 min-w-[48px] ${
                  isActive
                    ? "text-espresso"
                    : "text-warmGray hover:text-mocha"
                }`}
              >
                <span className={isActive ? "text-taupe" : ""}>{item.icon}</span>
                <span className={`text-[10px] font-medium ${isActive ? "text-espresso" : ""}`}>
                  {item.name}
                </span>
                {isActive && (
                  <span className="w-1 h-1 rounded-full bg-taupe -mt-0.5" />
                )}
              </Link>
            );
          })}

          {/* Profile */}
          <Link
            href="/profile"
            className={`flex flex-col items-center gap-1 px-2 py-1.5 rounded-xl transition-all duration-200 min-w-[48px] ${
              pathname === "/profile"
                ? "text-espresso"
                : "text-warmGray hover:text-mocha"
            }`}
          >
            <div className={`w-[22px] h-[22px] rounded-full overflow-hidden border-[1.5px] ${
              pathname === "/profile" ? "border-taupe" : "border-current"
            }`}>
              {avatarUrl ? (
                <img src={avatarUrl} alt="Profile" className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full bg-taupe/20 flex items-center justify-center">
                  <span className="text-[7px] font-serif font-bold text-taupe">{initials}</span>
                </div>
              )}
            </div>
            <span className={`text-[10px] font-medium ${pathname === "/profile" ? "text-espresso" : ""}`}>
              Profile
            </span>
            {pathname === "/profile" && (
              <span className="w-1 h-1 rounded-full bg-taupe -mt-0.5" />
            )}
          </Link>
        </div>
      </nav>
    </>
  );
}
