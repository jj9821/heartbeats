/**
 * PageTransition — Smooth animated wrapper for page content
 */
"use client";

import { motion } from "motion/react";

interface PageTransitionProps {
  children: React.ReactNode;
}

export function PageTransition({ children }: PageTransitionProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        type: "spring",
        stiffness: 260,
        damping: 20,
        duration: 0.4,
      }}
      className="flex-1"
    >
      {children}
    </motion.div>
  );
}
