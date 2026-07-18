/**
 * History Page — Timeline of all signals between partners
 *
 * Displays a beautiful reverse-chronological timeline grouped by date.
 * Each entry shows the sender, time, and optional message.
 */

"use client";

import { useAuth } from "@/context/AuthContext";
import { useSignals } from "@/hooks/useSignals";
import { TimelineEntry } from "@/components/TimelineEntry";
import { PageTransition } from "@/components/PageTransition";
import { Spinner } from "@/components/ui/Spinner";
import { Heart } from "lucide-react";
import { motion } from "motion/react";
import { format, isToday, isYesterday } from "date-fns";
import { Signal } from "@/types";

/** Group signals by date for section headers */
function groupByDate(signals: Signal[]): Map<string, Signal[]> {
  const groups = new Map<string, Signal[]>();

  signals.forEach((signal) => {
    if (!signal.timestamp?.toDate) return;
    const date = signal.timestamp.toDate();
    let key: string;

    if (isToday(date)) key = "Today";
    else if (isYesterday(date)) key = "Yesterday";
    else key = format(date, "EEEE, MMMM d");

    const existing = groups.get(key) || [];
    existing.push(signal);
    groups.set(key, existing);
  });

  return groups;
}

export default function HistoryPage() {
  const { profile } = useAuth();
  const { signals, loading } = useSignals(200);

  if (loading) {
    return (
      <div className="flex-1 flex items-center justify-center min-h-[60vh]">
        <Spinner size="lg" />
      </div>
    );
  }

  const grouped = groupByDate(signals);

  return (
    <PageTransition>
      <div className="px-6 pt-8 max-w-lg mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6"
        >
          <h1 className="text-2xl font-bold text-gray-800 dark:text-white">
            Your Story
          </h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            Every moment you thought of each other
          </p>
        </motion.div>

        {/* Empty state */}
        {signals.length === 0 && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex flex-col items-center justify-center py-20"
          >
            <Heart className="w-16 h-16 text-pink-300/50 mb-4" />
            <p className="text-gray-500 dark:text-gray-400 text-center">
              No signals yet.
              <br />
              Send your first heartbeat!
            </p>
          </motion.div>
        )}

        {/* Timeline */}
        <div className="space-y-6 pb-8">
          {Array.from(grouped.entries()).map(([date, dateSignals]) => (
            <div key={date}>
              {/* Date header */}
              <div className="flex items-center gap-3 mb-3">
                <div className="w-2 h-2 rounded-full bg-pink-400" />
                <h2 className="text-sm font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wider">
                  {date}
                </h2>
                <div className="flex-1 h-px bg-gray-200 dark:bg-gray-700/50" />
              </div>

              {/* Signals for this date */}
              <div className="space-y-3 ml-4">
                {dateSignals.map((signal, i) => (
                  <TimelineEntry
                    key={signal.id}
                    signal={signal}
                    currentUserId={profile?.uid || ""}
                    index={i}
                  />
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </PageTransition>
  );
}
