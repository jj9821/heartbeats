"use client";

import { useMemo } from "react";
import { Signal, Stats, DayData } from "@/types";
import {
  format,
  subDays,
  startOfDay,
  isAfter,
  differenceInCalendarDays,
} from "date-fns";

/**
 * Compute statistics from the signals array.
 * All calculations are done client-side from the loaded signals.
 */
export function useStats(
  signals: Signal[],
  userId: string | undefined
): Stats {
  return useMemo(() => {
    if (!userId || signals.length === 0) {
      return {
        totalSent: 0,
        totalReceived: 0,
        longestStreak: 0,
        currentStreak: 0,
        todayCount: 0,
        weeklyData: generateEmptyWeekData(),
        monthlyData: generateEmptyMonthData(),
      };
    }

    const sent = signals.filter((s) => s.senderId === userId);
    const received = signals.filter((s) => s.receiverId === userId);
    const today = startOfDay(new Date());

    // Today's total (sent + received)
    const todayCount = signals.filter((s) => {
      if (!s.timestamp?.toDate) return false;
      return isAfter(s.timestamp.toDate(), today);
    }).length;

    // Streak calculation (days with at least one signal)
    const { longestStreak, currentStreak } = calculateStreaks(signals);

    // Weekly data (last 7 days)
    const weeklyData = calculatePeriodData(signals, userId, 7, "EEE");

    // Monthly data (last 30 days)
    const monthlyData = calculatePeriodData(signals, userId, 30, "MMM d");

    return {
      totalSent: sent.length,
      totalReceived: received.length,
      longestStreak,
      currentStreak,
      todayCount,
      weeklyData,
      monthlyData,
    };
  }, [signals, userId]);
}

function generateEmptyWeekData(): DayData[] {
  return Array.from({ length: 7 }, (_, i) => ({
    date: format(subDays(new Date(), 6 - i), "EEE"),
    sent: 0,
    received: 0,
  }));
}

function generateEmptyMonthData(): DayData[] {
  return Array.from({ length: 30 }, (_, i) => ({
    date: format(subDays(new Date(), 29 - i), "MMM d"),
    sent: 0,
    received: 0,
  }));
}

function calculatePeriodData(
  signals: Signal[],
  userId: string,
  days: number,
  dateFormat: string
): DayData[] {
  const result: DayData[] = [];
  const now = new Date();

  for (let i = days - 1; i >= 0; i--) {
    const day = subDays(now, i);
    const dayStart = startOfDay(day);
    const dayEnd = startOfDay(subDays(now, i - 1));

    const daySignals = signals.filter((s) => {
      if (!s.timestamp?.toDate) return false;
      const t = s.timestamp.toDate();
      return t >= dayStart && t < dayEnd;
    });

    result.push({
      date: format(day, dateFormat),
      sent: daySignals.filter((s) => s.senderId === userId).length,
      received: daySignals.filter((s) => s.receiverId === userId).length,
    });
  }

  return result;
}

function calculateStreaks(signals: Signal[]): {
  longestStreak: number;
  currentStreak: number;
} {
  if (signals.length === 0) return { longestStreak: 0, currentStreak: 0 };

  // Get unique days with signals
  const uniqueDays = new Set<string>();
  signals.forEach((s) => {
    if (s.timestamp?.toDate) {
      uniqueDays.add(format(s.timestamp.toDate(), "yyyy-MM-dd"));
    }
  });

  const sortedDays = Array.from(uniqueDays).sort();
  if (sortedDays.length === 0) return { longestStreak: 0, currentStreak: 0 };

  let longestStreak = 1;
  let currentRun = 1;

  for (let i = 1; i < sortedDays.length; i++) {
    const diff = differenceInCalendarDays(
      new Date(sortedDays[i]),
      new Date(sortedDays[i - 1])
    );
    if (diff === 1) {
      currentRun++;
      longestStreak = Math.max(longestStreak, currentRun);
    } else {
      currentRun = 1;
    }
  }

  // Check if current streak includes today or yesterday
  const lastDay = sortedDays[sortedDays.length - 1];
  const daysSinceLast = differenceInCalendarDays(new Date(), new Date(lastDay));
  const currentStreak = daysSinceLast <= 1 ? currentRun : 0;

  return { longestStreak, currentStreak };
}
