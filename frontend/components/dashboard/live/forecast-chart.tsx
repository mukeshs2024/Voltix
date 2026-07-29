"use client";

import React from "react";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Legend,
} from "recharts";
import { ForecastDataPoint } from "@/components/dashboard/live/forecast-panel";

interface ForecastChartProps {
  data: ForecastDataPoint[];
}

export function ForecastChart({ data }: ForecastChartProps) {
  return (
    <div className="w-full h-[210px]">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data} margin={{ top: 5, right: 10, left: -20, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#F3F4F6" vertical={false} />
          <XAxis dataKey="time" stroke="#9CA3AF" fontSize={11} tickLine={false} />
          <YAxis stroke="#9CA3AF" fontSize={11} tickLine={false} />
          <Tooltip
            contentStyle={{
              backgroundColor: "#111827",
              borderColor: "#374151",
              borderRadius: "8px",
              color: "#FFFFFF",
              fontSize: "12px",
            }}
          />
          <Legend wrapperStyle={{ fontSize: "11px", paddingTop: "8px" }} />
          <Line
            type="monotone"
            dataKey="current"
            name="Current Load (kW)"
            stroke="#2563EB"
            strokeWidth={2.5}
            dot={{ r: 3 }}
            isAnimationActive={true}
            animationDuration={800}
          />
          <Line
            type="monotone"
            dataKey="predicted"
            name="Predicted Baseline"
            stroke="#9CA3AF"
            strokeWidth={2}
            strokeDasharray="4 4"
            dot={false}
            isAnimationActive={true}
            animationDuration={800}
          />
          <Line
            type="monotone"
            dataKey="optimized"
            name="AI Optimized"
            stroke="#10B981"
            strokeWidth={2.5}
            dot={{ r: 3 }}
            isAnimationActive={true}
            animationDuration={800}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
