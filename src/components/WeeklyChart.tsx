/**
 * WeeklyChart — Bar chart showing last 7 days of signals
 */
"use client";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import { Card } from "@/components/ui/Card";
import { DayData } from "@/types";
import { motion } from "motion/react";

interface WeeklyChartProps {
  data: DayData[];
}

export function WeeklyChart({ data }: WeeklyChartProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
    >
      <Card>
        <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-4">
          This Week
        </h3>
        <ResponsiveContainer width="100%" height={200}>
          <BarChart data={data} barCategoryGap="20%">
            <CartesianGrid
              strokeDasharray="3 3"
              vertical={false}
              stroke="rgba(156,163,175,0.2)"
            />
            <XAxis
              dataKey="date"
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 11, fill: "#9ca3af" }}
            />
            <YAxis
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 11, fill: "#9ca3af" }}
              allowDecimals={false}
            />
            <Tooltip
              contentStyle={{
                background: "rgba(255,255,255,0.9)",
                backdropFilter: "blur(8px)",
                border: "1px solid rgba(255,255,255,0.3)",
                borderRadius: "12px",
                boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
              }}
            />
            <Legend />
            <Bar
              dataKey="sent"
              fill="#f472b6"
              radius={[4, 4, 0, 0]}
              name="Sent"
            />
            <Bar
              dataKey="received"
              fill="#c084fc"
              radius={[4, 4, 0, 0]}
              name="Received"
            />
          </BarChart>
        </ResponsiveContainer>
      </Card>
    </motion.div>
  );
}
