/**
 * MonthlyChart — Area chart showing last 30 days of signals
 */
"use client";

import {
  AreaChart,
  Area,
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

interface MonthlyChartProps {
  data: DayData[];
}

export function MonthlyChart({ data }: MonthlyChartProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3 }}
    >
      <Card>
        <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-4">
          This Month
        </h3>
        <ResponsiveContainer width="100%" height={200}>
          <AreaChart data={data}>
            <defs>
              <linearGradient id="sentGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#f472b6" stopOpacity={0.4} />
                <stop offset="95%" stopColor="#f472b6" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="receivedGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#c084fc" stopOpacity={0.4} />
                <stop offset="95%" stopColor="#c084fc" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid
              strokeDasharray="3 3"
              vertical={false}
              stroke="rgba(156,163,175,0.2)"
            />
            <XAxis
              dataKey="date"
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 10, fill: "#9ca3af" }}
              interval="preserveStartEnd"
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
            <Area
              type="monotone"
              dataKey="sent"
              stroke="#f472b6"
              fill="url(#sentGrad)"
              strokeWidth={2}
              name="Sent"
            />
            <Area
              type="monotone"
              dataKey="received"
              stroke="#c084fc"
              fill="url(#receivedGrad)"
              strokeWidth={2}
              name="Received"
            />
          </AreaChart>
        </ResponsiveContainer>
      </Card>
    </motion.div>
  );
}
