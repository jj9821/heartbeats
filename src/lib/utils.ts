/**
 * Shared utility functions
 */

import { Timestamp } from "@/types";
import { format, isToday, isYesterday, formatDistanceToNow } from "date-fns";

/**
 * Generate a random 6-character invite code (uppercase alphanumeric).
 * Used when creating a new user account for partner pairing.
 */
export function generateInviteCode(): string {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789"; // No ambiguous chars (0/O, 1/I)
  let code = "";
  for (let i = 0; i < 6; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return code;
}

/**
 * Format a Firestore Timestamp into a human-readable relative date string.
 * Examples: "Today 8:32 PM", "Yesterday 3:15 PM", "Jul 14 2:00 PM"
 */
export function formatSignalDate(timestamp: Timestamp): string {
  const date = timestamp.toDate();
  const time = format(date, "h:mm a");

  if (isToday(date)) return `Today ${time}`;
  if (isYesterday(date)) return `Yesterday ${time}`;
  return `${format(date, "MMM d")} ${time}`;
}

/**
 * Format a Firestore Timestamp into a "last seen" string.
 * Examples: "2 minutes ago", "3 hours ago"
 */
export function formatLastSeen(timestamp: Timestamp): string {
  return formatDistanceToNow(timestamp.toDate(), { addSuffix: true });
}

/**
 * Merge class names, filtering out falsy values.
 * Simple alternative to clsx for conditional class strings.
 */
export function cn(...classes: (string | false | null | undefined)[]): string {
  return classes.filter(Boolean).join(" ");
}

/**
 * Check if the current time falls within quiet hours.
 * @param start - Start time in "HH:mm" format (e.g., "22:00")
 * @param end - End time in "HH:mm" format (e.g., "07:00")
 */
export function isInQuietHours(start: string, end: string): boolean {
  const now = new Date();
  const currentMinutes = now.getHours() * 60 + now.getMinutes();

  const [startH, startM] = start.split(":").map(Number);
  const [endH, endM] = end.split(":").map(Number);

  const startMinutes = startH * 60 + startM;
  const endMinutes = endH * 60 + endM;

  // Handle overnight ranges (e.g., 22:00 → 07:00)
  if (startMinutes > endMinutes) {
    return currentMinutes >= startMinutes || currentMinutes < endMinutes;
  }
  return currentMinutes >= startMinutes && currentMinutes < endMinutes;
}
