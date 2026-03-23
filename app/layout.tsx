import type { Metadata, Viewport } from "next";
import "./globals.css";
import Navigation from "@/components/Navigation";

export const metadata: Metadata = {
  title: "Abide — Daily Devotion & Bible",
  description:
    "A beautiful Bible app for daily devotions, Scripture reading, and spiritual accountability with friends.",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="bg-cream min-h-screen">
        <Navigation />
        <main className="pb-20 md:pb-0 md:pl-0">{children}</main>
      </body>
    </html>
  );
}
