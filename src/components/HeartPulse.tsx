/**
 * HeartPulse — Animated heart that pulses on the home screen
 *
 * Has two states:
 * - Idle: gentle breathing animation
 * - Active: dramatic pulse + scale triggered by button press
 */
"use client";

import { motion, AnimatePresence } from "motion/react";
import { useEffect, useState } from "react";

interface HeartPulseProps {
  /** Trigger a dramatic pulse */
  pulsing: boolean;
}

export function HeartPulse({ pulsing }: HeartPulseProps) {
  const [showRipple, setShowRipple] = useState(false);

  useEffect(() => {
    if (pulsing) {
      setShowRipple(true);
      const timer = setTimeout(() => setShowRipple(false), 1500);
      return () => clearTimeout(timer);
    }
  }, [pulsing]);

  return (
    <div className="relative flex items-center justify-center w-56 h-56">
      {/* Ripple rings on pulse */}
      <AnimatePresence>
        {showRipple && (
          <>
            {[0, 1, 2].map((i) => (
              <motion.div
                key={i}
                initial={{ scale: 0.5, opacity: 0.6 }}
                animate={{ scale: 2.5, opacity: 0 }}
                exit={{ opacity: 0 }}
                transition={{
                  duration: 1.2,
                  delay: i * 0.2,
                  ease: "easeOut",
                }}
                className="absolute inset-0 rounded-full bg-pink-400/20 dark:bg-pink-500/15"
              />
            ))}
          </>
        )}
      </AnimatePresence>

      {/* Glow behind heart */}
      <motion.div
        animate={{
          scale: pulsing ? [1, 1.4, 1.1] : [1, 1.08, 1],
          opacity: pulsing ? [0.3, 0.7, 0.4] : [0.2, 0.35, 0.2],
        }}
        transition={{
          duration: pulsing ? 0.6 : 3,
          repeat: Infinity,
          repeatType: "reverse",
          ease: "easeInOut",
        }}
        className="absolute w-40 h-40 rounded-full bg-gradient-to-br from-pink-400/40 to-rose-400/30 blur-2xl"
      />

      {/* Main heart SVG */}
      <motion.div
        animate={{
          scale: pulsing ? [1, 1.3, 0.95, 1.1, 1] : [1, 1.06, 1],
        }}
        transition={{
          duration: pulsing ? 0.8 : 2.5,
          repeat: pulsing ? 0 : Infinity,
          repeatType: "reverse",
          ease: pulsing ? "easeOut" : "easeInOut",
        }}
      >
        <svg
          viewBox="0 0 24 24"
          fill="none"
          className="w-32 h-32 drop-shadow-lg"
          aria-hidden="true"
        >
          <defs>
            <linearGradient id="heartGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#f9a8d4" />
              <stop offset="50%" stopColor="#f472b6" />
              <stop offset="100%" stopColor="#e879a0" />
            </linearGradient>
          </defs>
          <path
            d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"
            fill="url(#heartGrad)"
          />
        </svg>
      </motion.div>
    </div>
  );
}
