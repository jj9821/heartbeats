"use client";

import { useAuth } from "@/context/AuthContext";
import { useSignals } from "@/hooks/useSignals";
import { useStats } from "@/hooks/useStats";
import { StatsCard } from "@/components/StatsCard";
import { WeeklyChart } from "@/components/WeeklyChart";
import { MonthlyChart } from "@/components/MonthlyChart";
import { Confetti } from "@/components/Confetti";
import { PageTransition } from "@/components/PageTransition";
import { Spinner } from "@/components/ui/Spinner";
import { ArrowUpRight, ArrowDownLeft, Flame, CalendarHeart } from "lucide-react";
import { motion } from "motion/react";

export default function StatsPage() {
  const { profile } = useAuth();
  const { signals, loading } = useSignals(500);
  const stats = useStats(signals, profile?.uid);

  if (loading) {
    return (
      <div className="flex-1 flex items-center justify-center min-h-[60vh]">
        <Spinner size="lg" />
      </div>
    );
  }

  const totalCount = stats.totalSent + stats.totalReceived;

  return (
    <PageTransition>
      <div className="px-6 pt-8 max-w-lg mx-auto pb-8">
        <Confetti count={totalCount} />
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-6">
          <h1 className="text-2xl font-bold text-gray-800 dark:text-white">Your Numbers</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Love, quantified ✨</p>
        </motion.div>

        <div className="grid grid-cols-2 gap-3 mb-6">
          <StatsCard icon={<ArrowUpRight className="w-5 h-5" />} label="Sent" value={stats.totalSent} color="pink" />
          <StatsCard icon={<ArrowDownLeft className="w-5 h-5" />} label="Received" value={stats.totalReceived} color="purple" />
          <StatsCard icon={<Flame className="w-5 h-5" />} label="Longest Streak" value={stats.longestStreak} color="amber" />
          <StatsCard icon={<CalendarHeart className="w-5 h-5" />} label="Today" value={stats.todayCount} color="emerald" />
        </div>

        {stats.currentStreak > 0 && (
          <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
            className="mb-6 p-4 rounded-2xl bg-gradient-to-r from-amber-400/20 to-orange-400/20 border border-amber-400/30 text-center">
            <p className="text-2xl font-bold text-amber-600 dark:text-amber-400">🔥 {stats.currentStreak} day streak!</p>
            <p className="text-xs text-amber-700/60 dark:text-amber-400/60 mt-1">Keep the love going</p>
          </motion.div>
        )}

        <div className="space-y-4">
          <WeeklyChart data={stats.weeklyData} />
          <MonthlyChart data={stats.monthlyData} />
        </div>
      </div>
    </PageTransition>
  );
}
