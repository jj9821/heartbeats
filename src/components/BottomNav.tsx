/**
 * BottomNav — Mobile-first bottom navigation bar
 *
 * Shows 4 tabs: Home, History, Stats, Settings
 * Active tab indicated with gradient background and filled icon
 */
"use client";

import { usePathname, useRouter } from "next/navigation";
import { Home, Clock, BarChart3, Settings } from "lucide-react";
import { motion } from "motion/react";
import { cn } from "@/lib/utils";

const tabs = [
  { href: "/home", icon: Home, label: "Home" },
  { href: "/history", icon: Clock, label: "History" },
  { href: "/stats", icon: BarChart3, label: "Stats" },
  { href: "/settings", icon: Settings, label: "Settings" },
];

export function BottomNav() {
  const pathname = usePathname();
  const router = useRouter();

  return (
    <nav
      className={cn(
        "fixed bottom-0 left-0 right-0 z-50",
        "bg-white/70 dark:bg-gray-900/70",
        "backdrop-blur-xl",
        "border-t border-white/30 dark:border-white/10",
        "safe-area-bottom"
      )}
      role="navigation"
      aria-label="Main navigation"
    >
      <div className="flex items-center justify-around max-w-lg mx-auto px-2 py-2">
        {tabs.map((tab) => {
          const isActive = pathname === tab.href;
          const Icon = tab.icon;

          return (
            <button
              key={tab.href}
              onClick={() => router.push(tab.href)}
              className={cn(
                "relative flex flex-col items-center gap-0.5 px-4 py-2 rounded-xl transition-colors cursor-pointer",
                isActive
                  ? "text-pink-600 dark:text-pink-400"
                  : "text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300"
              )}
              aria-current={isActive ? "page" : undefined}
              aria-label={tab.label}
              id={`nav-${tab.label.toLowerCase()}`}
            >
              {isActive && (
                <motion.div
                  layoutId="nav-indicator"
                  className="absolute inset-0 rounded-xl bg-pink-100/80 dark:bg-pink-900/30"
                  transition={{ type: "spring", stiffness: 400, damping: 30 }}
                />
              )}
              <Icon
                className={cn("w-5 h-5 relative z-10", isActive && "fill-current")}
              />
              <span className="text-[10px] font-medium relative z-10">
                {tab.label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}
