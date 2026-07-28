"use client";

import React, { useState, memo } from "react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { motion } from "framer-motion";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend
} from "recharts";

const dataMap = {
  today: [
    { time: "00:00", actual: 240, optimized: 210 },
    { time: "04:00", actual: 180, optimized: 160 },
    { time: "08:00", actual: 520, optimized: 430 },
    { time: "12:00", actual: 780, optimized: 610 },
    { time: "16:00", actual: 690, optimized: 540 },
    { time: "20:00", actual: 380, optimized: 310 },
    { time: "23:59", actual: 260, optimized: 220 },
  ],
  yesterday: [
    { time: "00:00", actual: 250, optimized: 220 },
    { time: "04:00", actual: 190, optimized: 170 },
    { time: "08:00", actual: 540, optimized: 450 },
    { time: "12:00", actual: 810, optimized: 630 },
    { time: "16:00", actual: 720, optimized: 560 },
    { time: "20:00", actual: 400, optimized: 330 },
    { time: "23:59", actual: 270, optimized: 230 },
  ]
};

interface CustomTooltipProps {
  active?: boolean;
  payload?: Array<{
    value: number;
    name: string;
    color: string;
  }>;
  label?: string;
}

const CustomTooltip = ({ active, payload, label }: CustomTooltipProps) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white border border-[#E5E7EB] rounded-[12px] p-3 shadow-apple">
        <p className="text-xs font-semibold text-[#6B7280] mb-2">{label}</p>
        {payload.map((entry, index: number) => (
          <div key={index} className="flex items-center justify-between gap-4 mb-1 text-sm">
            <span className="flex items-center gap-1.5 text-[#4B5563]">
              <span className="w-2 h-2 rounded-full" style={{ backgroundColor: entry.color }} />
              {entry.name}
            </span>
            <span className="font-bold text-[#111827]">{entry.value} kW</span>
          </div>
        ))}
      </div>
    );
  }
  return null;
};

export const EnergyChart = memo(function EnergyChart() {
  const [range, setRange] = useState<"today" | "yesterday">("today");

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
    >
      <Card>
        <CardHeader className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
          <div>
            <div className="flex items-center gap-3">
              <CardTitle>Autonomous Energy Load Curve</CardTitle>
              <Badge variant="accent">Live Telemetry</Badge>
            </div>
            <CardDescription className="mt-1">
              Comparing actual facility draw vs AI-optimized dynamic setpoints (kW)
            </CardDescription>
          </div>
          <div className="flex bg-[#F3F4F6] p-1 rounded-lg">
            <button
              onClick={() => setRange("today")}
              className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-all ${
                range === "today" ? "bg-white text-[#111827] shadow-sm" : "text-[#6B7280] hover:text-[#111827]"
              }`}
            >
              Today
            </button>
            <button
              onClick={() => setRange("yesterday")}
              className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-all ${
                range === "yesterday" ? "bg-white text-[#111827] shadow-sm" : "text-[#6B7280] hover:text-[#111827]"
              }`}
            >
              Yesterday
            </button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="h-[320px] w-full pt-4">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={dataMap[range]} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="actualGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#111827" stopOpacity={0.2} />
                    <stop offset="95%" stopColor="#111827" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="optimizedGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#22C55E" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#22C55E" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F3F4F6" />
                <XAxis 
                  dataKey="time" 
                  stroke="#9CA3AF" 
                  fontSize={12} 
                  tickLine={false} 
                  axisLine={false} 
                  dy={10}
                />
                <YAxis 
                  stroke="#9CA3AF" 
                  fontSize={12} 
                  tickLine={false} 
                  axisLine={false} 
                  tickFormatter={(val) => `${val}`}
                />
                <Tooltip content={<CustomTooltip />} />
                <Legend 
                  verticalAlign="top" 
                  align="right" 
                  iconType="circle" 
                  wrapperStyle={{ fontSize: '12px', paddingBottom: '20px' }}
                />
                <Area
                  type="monotone"
                  dataKey="actual"
                  name="Unoptimized Baseline"
                  stroke="#111827"
                  strokeWidth={2}
                  fillOpacity={1}
                  fill="url(#actualGrad)"
                  animationDuration={1000}
                />
                <Area
                  type="monotone"
                  dataKey="optimized"
                  name="VOLTIX Autonomous"
                  stroke="#22C55E"
                  strokeWidth={3}
                  fillOpacity={1}
                  fill="url(#optimizedGrad)"
                  animationDuration={1000}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
});
