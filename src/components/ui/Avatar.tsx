/**
 * Avatar — User profile picture with fallback
 */
"use client";

import { cn } from "@/lib/utils";
import Image from "next/image";

interface AvatarProps {
  src: string | null;
  alt: string;
  size?: "sm" | "md" | "lg" | "xl";
  className?: string;
  online?: boolean;
}

const avatarSizes = {
  sm: "h-8 w-8",
  md: "h-12 w-12",
  lg: "h-16 w-16",
  xl: "h-24 w-24",
};

const dotSizes = {
  sm: "h-2.5 w-2.5",
  md: "h-3 w-3",
  lg: "h-4 w-4",
  xl: "h-5 w-5",
};

const imageSizeMap = {
  sm: 32,
  md: 48,
  lg: 64,
  xl: 96,
};

export function Avatar({
  src,
  alt,
  size = "md",
  className,
  online,
}: AvatarProps) {
  const initials = alt
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  return (
    <div className={cn("relative inline-block", className)}>
      {src ? (
        <Image
          src={src}
          alt={alt}
          width={imageSizeMap[size]}
          height={imageSizeMap[size]}
          className={cn(
            avatarSizes[size],
            "rounded-full object-cover ring-2 ring-white/50 dark:ring-white/20"
          )}
        />
      ) : (
        <div
          className={cn(
            avatarSizes[size],
            "rounded-full bg-gradient-to-br from-pink-300 to-purple-300",
            "flex items-center justify-center text-white font-semibold",
            "ring-2 ring-white/50 dark:ring-white/20"
          )}
        >
          <span
            className={cn(
              size === "sm" && "text-xs",
              size === "md" && "text-sm",
              size === "lg" && "text-lg",
              size === "xl" && "text-2xl"
            )}
          >
            {initials}
          </span>
        </div>
      )}
      {online !== undefined && (
        <span
          className={cn(
            "absolute bottom-0 right-0 block rounded-full ring-2 ring-white dark:ring-gray-900",
            dotSizes[size],
            online ? "bg-emerald-400" : "bg-gray-400"
          )}
        />
      )}
    </div>
  );
}
