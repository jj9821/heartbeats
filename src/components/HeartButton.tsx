/**
 * HeartButton — The primary "I Miss You" CTA
 *
 * Features:
 * - Gradient background with shadow
 * - 2-second cooldown after press
 * - Haptic feedback on supported devices
 * - Spring animation on tap
 */
"use client";

import { motion } from "motion/react";
import { useState, useCallback } from "react";
import { Heart } from "lucide-react";
import { cn } from "@/lib/utils";

interface HeartButtonProps {
  onPress: () => Promise<void>;
  disabled?: boolean;
}

export function HeartButton({ onPress, disabled = false }: HeartButtonProps) {
  const [cooldown, setCooldown] = useState(false);
  const [pressing, setPressing] = useState(false);

  const handlePress = useCallback(async () => {
    if (cooldown || disabled) return;

    setPressing(true);
    setCooldown(true);

    // Haptic feedback on supported devices
    if (navigator.vibrate) {
      navigator.vibrate(100);
    }

    try {
      await onPress();
    } catch (err) {
      console.error("Failed to send signal:", err);
    }

    setPressing(false);

    // 2-second cooldown to prevent spam
    setTimeout(() => setCooldown(false), 2000);
  }, [onPress, cooldown, disabled]);

  return (
    <motion.button
      whileHover={{ scale: cooldown ? 1 : 1.05 }}
      whileTap={{ scale: cooldown ? 1 : 0.92 }}
      animate={pressing ? { scale: [1, 1.15, 0.95, 1.05, 1] } : {}}
      transition={{ type: "spring", stiffness: 300, damping: 15 }}
      onClick={handlePress}
      disabled={cooldown || disabled}
      aria-label="Send I Miss You signal"
      id="heart-button"
      className={cn(
        "relative w-48 h-48 rounded-full",
        "bg-gradient-to-br from-pink-400 via-rose-400 to-pink-500",
        "shadow-2xl shadow-pink-500/30",
        "flex flex-col items-center justify-center gap-2",
        "transition-all duration-300 cursor-pointer",
        "focus:outline-none focus:ring-4 focus:ring-pink-300/50",
        cooldown && "opacity-70 cursor-not-allowed",
        !cooldown &&
          "hover:shadow-pink-500/50 hover:from-pink-500 hover:via-rose-500 hover:to-pink-600"
      )}
    >
      {/* Outer glow ring */}
      <motion.div
        animate={{
          scale: [1, 1.15, 1],
          opacity: [0.3, 0.1, 0.3],
        }}
        transition={{
          duration: 2.5,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        className="absolute inset-0 rounded-full bg-pink-400/20 -z-10"
        style={{ margin: "-8px" }}
      />

      <Heart
        className="w-12 h-12 text-white fill-white drop-shadow-md"
        aria-hidden="true"
      />
      <span className="text-white font-bold text-base tracking-wide drop-shadow-sm">
        {cooldown ? "Sent ✓" : "I Miss You"}
      </span>

      {/* Cooldown progress ring */}
      {cooldown && (
        <svg
          className="absolute inset-0 w-full h-full -rotate-90"
          viewBox="0 0 100 100"
        >
          <motion.circle
            cx="50"
            cy="50"
            r="48"
            fill="none"
            stroke="rgba(255,255,255,0.3)"
            strokeWidth="2"
            strokeDasharray="301.6"
            initial={{ strokeDashoffset: 0 }}
            animate={{ strokeDashoffset: 301.6 }}
            transition={{ duration: 2, ease: "linear" }}
          />
        </svg>
      )}
    </motion.button>
  );
}
