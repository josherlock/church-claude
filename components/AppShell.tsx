"use client";

import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { isOnboarded } from "@/lib/store";
import Navigation from "./Navigation";

export default function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [ready, setReady] = useState(false);

  const isOnboardingPage = pathname === "/onboarding";

  useEffect(() => {
    const onboarded = isOnboarded();

    if (!onboarded && !isOnboardingPage) {
      router.replace("/onboarding");
      return;
    }

    setReady(true);
  }, [pathname, router, isOnboardingPage]);

  if (!ready) {
    return (
      <div className="min-h-screen bg-cream flex items-center justify-center">
        <div className="w-8 h-8 rounded-full hero-gradient animate-pulse" />
      </div>
    );
  }

  if (isOnboardingPage) {
    return <>{children}</>;
  }

  return (
    <>
      <Navigation />
      <main className="pb-20 md:pb-0 md:pl-0">{children}</main>
    </>
  );
}
