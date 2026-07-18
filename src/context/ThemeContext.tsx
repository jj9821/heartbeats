/**
 * Theme Context Provider
 *
 * Manages dark mode state with three modes:
 * - "system" — follows OS preference
 * - true — always dark
 * - false — always light
 *
 * Persists preference to Firestore user settings.
 * Applies the "dark" class to <html> element for Tailwind dark mode.
 */

"use client";

import React, { createContext, useContext, useEffect, useState } from "react";

type ThemeMode = boolean | "system";

interface ThemeContextValue {
  /** Current dark mode state (resolved — always true or false) */
  isDark: boolean;
  /** Raw theme setting (true / false / "system") */
  themeMode: ThemeMode;
  /** Update theme mode */
  setThemeMode: (mode: ThemeMode) => void;
}

const ThemeContext = createContext<ThemeContextValue>({
  isDark: false,
  themeMode: "system",
  setThemeMode: () => {},
});

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [themeMode, setThemeModeState] = useState<ThemeMode>("system");
  const [isDark, setIsDark] = useState(false);

  // Resolve the actual dark/light state
  useEffect(() => {
    if (themeMode === "system") {
      const mq = window.matchMedia("(prefers-color-scheme: dark)");
      setIsDark(mq.matches);

      const handler = (e: MediaQueryListEvent) => setIsDark(e.matches);
      mq.addEventListener("change", handler);
      return () => mq.removeEventListener("change", handler);
    } else {
      setIsDark(themeMode);
    }
  }, [themeMode]);

  // Apply dark class to HTML element
  useEffect(() => {
    document.documentElement.classList.toggle("dark", isDark);
  }, [isDark]);

  const setThemeMode = (mode: ThemeMode) => {
    setThemeModeState(mode);
    // Persist to localStorage as fallback
    localStorage.setItem("heartbeat-theme", JSON.stringify(mode));
  };

  // Load saved theme on mount
  useEffect(() => {
    const saved = localStorage.getItem("heartbeat-theme");
    if (saved) {
      try {
        setThemeModeState(JSON.parse(saved));
      } catch {
        // Invalid saved value, use system default
      }
    }
  }, []);

  return (
    <ThemeContext.Provider value={{ isDark, themeMode, setThemeMode }}>
      {children}
    </ThemeContext.Provider>
  );
}

/** Hook to access theme state */
export function useTheme() {
  return useContext(ThemeContext);
}
