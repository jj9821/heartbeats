/**
 * StatsCard — Individual statistic display with count-up animation
 */
"use client";

import { motion, useMotionValue, useTransform, animate } from "motion/react";
import { useEffect } from "react";
import { Card } from "@/components/ui/Card";

interface StatsCardProps {
  icon: React.ReactNode;
  label: string;
  value: number;
  color?: string;
}

export function StatsCard({ icon, label, value, color = "pink" }: StatsCardProps) {
  const count = useMotionValue(0);
  const rounded = useTransform(count, (latest) => Math.round(latest));

  useEffect(() => {
    const animation = animate(count, value, {
      duration: 1.2,
      ease: "easeOut",
    });
    return animation.stop;
  }, [value, count]);

  const colorClasses: Record<string, string> = {
    pink: "from-pink-500/20 to-rose-500/20 text-pink-600 dark:text-pink-400",
    purple: "from-purple-500/20 to-violet-500/20 text-purple-600 dark:text-purple-400",
    amber: "from-amber-500/20 to-orange-500/20 text-amber-600 dark:text-amber-400",
    emerald: "from-emerald-500/20 to-teal-500/20 text-emerald-600 dark:text-emerald-400",
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ type: "spring", stiffness: 200, damping: 20 }}
    >
      <Card padding="sm" className="text-center">
        <div
          className={`w-10 h-10 rounded-xl bg-gradient-to-br ${colorClasses[color]} mx-auto flex items-center justify-center mb-2`}
        >
          {icon}
        </div>
        <motion.p className="text-2xl font-bold text-gray-800 dark:text-gray-100">
          {rounded}
        </motion.p>
        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">{label}</p>
      </Card>
    </motion.div>
  );
}
