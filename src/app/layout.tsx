/**
 * Root Layout — Heartbeat PWA
 *
 * Sets up:
 * - Inter font from Google Fonts
 * - Auth and Theme providers
 * - Sonner toast notifications
 * - SEO metadata
 * - PWA viewport settings
 */

import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/context/AuthContext";
import { ThemeProvider } from "@/context/ThemeContext";
import { Toaster } from "sonner";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "Heartbeat — Thinking of You",
  description:
    "A private space for two hearts. Send a gentle signal to let your special person know you're thinking of them.",
  keywords: ["love", "relationship", "couple", "thinking of you", "heartbeat"],
  authors: [{ name: "Heartbeat" }],
  openGraph: {
    title: "Heartbeat — Thinking of You",
    description:
      "A private space for two hearts. Send a gentle signal to let your special person know you're thinking of them.",
    type: "website",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  viewportFit: "cover",
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#fdf2f8" },
    { media: "(prefers-color-scheme: dark)", color: "#0f0a1a" },
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} h-full antialiased`} suppressHydrationWarning>
      <head>
        <link rel="manifest" href="/manifest.webmanifest" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
        <meta name="apple-mobile-web-app-title" content="Heartbeat" />
        <link rel="apple-touch-icon" href="/icons/icon-192x192.png" />
      </head>
      <body className="min-h-dvh flex flex-col font-sans">
        <ThemeProvider>
          <AuthProvider>
            {children}
            <Toaster
              position="top-center"
              toastOptions={{
                style: {
                  background: "rgba(255, 255, 255, 0.9)",
                  backdropFilter: "blur(12px)",
                  border: "1px solid rgba(255,255,255,0.3)",
                  borderRadius: "16px",
                  boxShadow: "0 8px 32px rgba(0,0,0,0.08)",
                },
              }}
              richColors
            />
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
