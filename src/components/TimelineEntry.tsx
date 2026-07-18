/**
 * TimelineEntry — Single entry in the history timeline
 */
"use client";

import { motion } from "motion/react";
import { Card } from "@/components/ui/Card";
import { Signal } from "@/types";
import { formatSignalDate } from "@/lib/utils";
import { Heart } from "lucide-react";

interface TimelineEntryProps {
  signal: Signal;
  currentUserId: string;
  index: number;
}

export function TimelineEntry({
  signal,
  currentUserId,
  index,
}: TimelineEntryProps) {
  const isSent = signal.senderId === currentUserId;
  const displayName = isSent ? "You" : signal.senderName;

  return (
    <motion.div
      initial={{ opacity: 0, x: isSent ? 20 : -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{
        type: "spring",
        stiffness: 200,
        damping: 20,
        delay: index * 0.05,
      }}
    >
      <Card
        padding="sm"
        className={`flex items-start gap-3 ${
          isSent
            ? "ml-4 border-l-2 border-l-pink-400"
            : "mr-4 border-l-2 border-l-purple-400"
        }`}
      >
        <div
          className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${
            isSent
              ? "bg-pink-100 dark:bg-pink-900/30"
              : "bg-purple-100 dark:bg-purple-900/30"
          }`}
        >
          <Heart
            className={`w-4 h-4 ${
              isSent
                ? "text-pink-500 fill-pink-500"
                : "text-purple-500 fill-purple-500"
            }`}
          />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between gap-2">
            <span className="text-sm font-semibold text-gray-800 dark:text-gray-100">
              {displayName} {isSent ? "missed them" : "missed you"}
            </span>
            <span className="text-xs text-gray-500 dark:text-gray-400 whitespace-nowrap">
              {signal.timestamp ? formatSignalDate(signal.timestamp) : "..."}
            </span>
          </div>
          {signal.message && (
            <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">
              &ldquo;{signal.message}&rdquo;
            </p>
          )}
        </div>
      </Card>
    </motion.div>
  );
}
