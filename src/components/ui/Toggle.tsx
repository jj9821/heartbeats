/**
 * Toggle — Animated switch toggle
 */
"use client";

import { motion } from "motion/react";
import { cn } from "@/lib/utils";

interface ToggleProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  label?: string;
  disabled?: boolean;
  id?: string;
}

export function Toggle({
  checked,
  onChange,
  label,
  disabled = false,
  id,
}: ToggleProps) {
  return (
    <label
      htmlFor={id}
      className={cn(
        "flex items-center justify-between gap-3 cursor-pointer",
        disabled && "opacity-50 cursor-not-allowed"
      )}
    >
      {label && (
        <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
          {label}
        </span>
      )}
      <button
        id={id}
        role="switch"
        aria-checked={checked}
        disabled={disabled}
        onClick={() => !disabled && onChange(!checked)}
        className={cn(
          "relative inline-flex h-7 w-12 shrink-0 rounded-full transition-colors duration-200 cursor-pointer",
          checked
            ? "bg-gradient-to-r from-pink-400 to-rose-400"
            : "bg-gray-300 dark:bg-gray-600"
        )}
      >
        <motion.span
          layout
          transition={{ type: "spring", stiffness: 500, damping: 30 }}
          className={cn(
            "pointer-events-none block h-5 w-5 rounded-full bg-white shadow-md mt-1",
            checked ? "ml-6" : "ml-1"
          )}
        />
      </button>
    </label>
  );
}
