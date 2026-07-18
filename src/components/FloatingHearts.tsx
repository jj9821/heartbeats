/**
 * FloatingHearts — Decorative floating hearts background
 *
 * Hearts randomly spawn and float upward, fading out.
 * A burst of hearts can be triggered (e.g., on button press).
 */
"use client";

import { motion, AnimatePresence } from "motion/react";
import { useEffect, useState, useCallback } from "react";

interface Heart {
  id: number;
  x: number; // percentage from left
  size: number; // px
  duration: number; // seconds
  delay: number;
  opacity: number;
}

interface FloatingHeartsProps {
  /** Trigger a burst of hearts */
  burst?: boolean;
}

let heartId = 0;

export function FloatingHearts({ burst = false }: FloatingHeartsProps) {
  const [hearts, setHearts] = useState<Heart[]>([]);

  // Remove a heart after its animation completes
  const removeHeart = useCallback((id: number) => {
    setHearts((prev) => prev.filter((h) => h.id !== id));
  }, []);

  // Spawn ambient hearts periodically
  useEffect(() => {
    const interval = setInterval(() => {
      const newHeart: Heart = {
        id: heartId++,
        x: Math.random() * 100,
        size: 12 + Math.random() * 16,
        duration: 4 + Math.random() * 3,
        delay: 0,
        opacity: 0.15 + Math.random() * 0.2,
      };
      setHearts((prev) => [...prev.slice(-15), newHeart]); // Keep max 15 ambient hearts
    }, 2500);

    return () => clearInterval(interval);
  }, []);

  // Burst effect: spawn many hearts at once
  useEffect(() => {
    if (!burst) return;
    const burstHearts: Heart[] = Array.from({ length: 12 }, (_, i) => ({
      id: heartId++,
      x: 30 + Math.random() * 40, // cluster around center
      size: 14 + Math.random() * 20,
      duration: 2 + Math.random() * 2,
      delay: i * 0.08,
      opacity: 0.3 + Math.random() * 0.4,
    }));
    setHearts((prev) => [...prev, ...burstHearts]);
  }, [burst]);

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
      <AnimatePresence>
        {hearts.map((heart) => (
          <motion.div
            key={heart.id}
            initial={{
              x: `${heart.x}vw`,
              y: "105vh",
              opacity: 0,
              scale: 0.5,
              rotate: -20 + Math.random() * 40,
            }}
            animate={{
              y: "-10vh",
              opacity: [0, heart.opacity, heart.opacity, 0],
              scale: [0.5, 1, 0.9, 0.6],
              rotate: -20 + Math.random() * 40,
            }}
            transition={{
              duration: heart.duration,
              delay: heart.delay,
              ease: "easeOut",
            }}
            onAnimationComplete={() => removeHeart(heart.id)}
            className="absolute"
            style={{ fontSize: heart.size }}
          >
            <span className="text-pink-400/60 dark:text-pink-300/40">♥</span>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}
