/**
 * Badge — Small status indicator
 */
"use client";

import { cn } from "@/lib/utils";

interface BadgeProps {
  children: React.ReactNode;
  variant?: "default" | "success" | "warning" | "muted";
  className?: string;
}

const badgeVariants = {
  default: "bg-pink-100 text-pink-700 dark:bg-pink-900/30 dark:text-pink-300",
  success:
    "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300",
  warning:
    "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300",
  muted: "bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400",
};

export function Badge({
  children,
  variant = "default",
  className,
}: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium",
        badgeVariants[variant],
        className
      )}
    >
      {children}
    </span>
  );
}
