/**
 * Button — Primary UI button with variants
 */
"use client";

import { cn } from "@/lib/utils";
import { Spinner } from "./Spinner";
import { motion } from "motion/react";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "ghost" | "danger";
  size?: "sm" | "md" | "lg";
  loading?: boolean;
  children: React.ReactNode;
}

const variants = {
  primary:
    "bg-gradient-to-r from-pink-400 to-rose-400 text-white shadow-lg shadow-pink-500/25 hover:shadow-pink-500/40 hover:from-pink-500 hover:to-rose-500 disabled:opacity-50",
  secondary:
    "bg-white/10 backdrop-blur-sm border border-white/20 text-gray-700 dark:text-gray-200 hover:bg-white/20",
  ghost:
    "text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-white/10",
  danger:
    "bg-red-500/10 text-red-600 dark:text-red-400 border border-red-500/20 hover:bg-red-500/20",
};

const buttonSizes = {
  sm: "px-3 py-1.5 text-sm rounded-lg",
  md: "px-5 py-2.5 text-base rounded-xl",
  lg: "px-8 py-4 text-lg rounded-2xl",
};

export function Button({
  variant = "primary",
  size = "md",
  loading = false,
  children,
  className,
  disabled,
  ...props
}: ButtonProps) {
  return (
    <motion.button
      whileHover={{ scale: disabled ? 1 : 1.02 }}
      whileTap={{ scale: disabled ? 1 : 0.97 }}
      className={cn(
        "font-semibold transition-all duration-200 flex items-center justify-center gap-2 cursor-pointer",
        variants[variant],
        buttonSizes[size],
        (disabled || loading) && "cursor-not-allowed opacity-60",
        className
      )}
      disabled={disabled || loading}
      {...(props as React.ComponentPropsWithoutRef<typeof motion.button>)}
    >
      {loading && <Spinner size="sm" />}
      {children}
    </motion.button>
  );
}
