/**
 * Card — Glass-morphism card container
 */
"use client";

import { cn } from "@/lib/utils";

interface CardProps {
  children: React.ReactNode;
  className?: string;
  padding?: "sm" | "md" | "lg";
}

const paddings = {
  sm: "p-3",
  md: "p-5",
  lg: "p-7",
};

export function Card({ children, className, padding = "md" }: CardProps) {
  return (
    <div
      className={cn(
        "rounded-2xl",
        "bg-white/60 dark:bg-white/5",
        "backdrop-blur-xl",
        "border border-white/40 dark:border-white/10",
        "shadow-lg shadow-black/5 dark:shadow-black/20",
        paddings[padding],
        className
      )}
    >
      {children}
    </div>
  );
}
