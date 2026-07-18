/**
 * Confetti — Milestone celebration effect
 * Uses canvas-confetti for heart-shaped confetti bursts
 */
"use client";

import { useEffect, useRef } from "react";
import confetti from "canvas-confetti";

interface ConfettiProps {
  /** When this number hits a milestone, trigger confetti */
  count: number;
}

const MILESTONES = [100, 500, 1000, 5000, 10000];

export function Confetti({ count }: ConfettiProps) {
  const lastMilestone = useRef(0);

  useEffect(() => {
    const currentMilestone = MILESTONES.find(
      (m) => count >= m && m > lastMilestone.current
    );

    if (currentMilestone) {
      lastMilestone.current = currentMilestone;

      // Fire confetti from both sides
      const defaults = {
        spread: 90,
        ticks: 100,
        gravity: 0.8,
        decay: 0.92,
        startVelocity: 30,
        colors: ["#f9a8d4", "#f472b6", "#c084fc", "#e879a0", "#fbbf24"],
      };

      confetti({
        ...defaults,
        particleCount: 40,
        origin: { x: 0.2, y: 0.6 },
        angle: 60,
      });

      confetti({
        ...defaults,
        particleCount: 40,
        origin: { x: 0.8, y: 0.6 },
        angle: 120,
      });

      // Second burst for extra drama
      setTimeout(() => {
        confetti({
          ...defaults,
          particleCount: 60,
          origin: { x: 0.5, y: 0.5 },
          spread: 120,
        });
      }, 300);
    }
  }, [count]);

  return null; // Confetti renders on the canvas, no DOM output
}
