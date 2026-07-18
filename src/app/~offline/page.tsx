/**
 * Offline Fallback Page
 *
 * Shown by the service worker when the user is offline
 * and tries to navigate to a page that isn't cached.
 */

"use client";

import { motion } from "motion/react";
import { Heart, WifiOff } from "lucide-react";

export default function OfflinePage() {
  return (
    <main className="flex-1 flex flex-col items-center justify-center min-h-dvh px-6 text-center">
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ type: "spring", stiffness: 200, damping: 15 }}
        className="relative mb-8"
      >
        <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-gray-300 to-gray-400 dark:from-gray-600 dark:to-gray-700 flex items-center justify-center">
          <WifiOff className="w-10 h-10 text-white" />
        </div>
        <div className="absolute -bottom-2 -right-2 w-8 h-8 rounded-full bg-pink-400 flex items-center justify-center">
          <Heart className="w-4 h-4 text-white fill-white" />
        </div>
      </motion.div>

      <motion.h1
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="text-2xl font-bold text-gray-800 dark:text-white mb-3"
      >
        You&apos;re offline
      </motion.h1>

      <motion.p
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="text-gray-500 dark:text-gray-400 max-w-xs"
      >
        But love doesn&apos;t need WiFi.
        <br />
        Your heartbeats will sync when you&apos;re back online.
      </motion.p>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="mt-8"
      >
        <button
          onClick={() => window.location.reload()}
          className="px-6 py-3 rounded-xl bg-pink-400/20 text-pink-600 dark:text-pink-400 font-medium hover:bg-pink-400/30 transition-colors cursor-pointer"
        >
          Try Again
        </button>
      </motion.div>
    </main>
  );
}
