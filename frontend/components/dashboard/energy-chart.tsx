"use client";

import React from "react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const mockEnergyData = [
  { time: "00:00", actual: 240, optimized: 210 },
  { time: "04:00", actual: 180, optimized: 160 },
  { time: "08:00", actual: 520, optimized: 430 },
  { time: "12:00", actual: 780, optimized: 610 },
  { time: "16:00", actual: 690, optimized: 540 },
  { time: "20:00", actual: 380, optimized: 310 },
  { time: "23:59", actual: 260, optimized: 220 },
];

export function EnergyChart() {
  return (
    <Card>
      <CardHeader>
        <div>
          <CardTitle>Autonomous Energy Load Curve</CardTitle>
          <CardDescription>
            Comparing actual facility draw vs AI-optimized dynamic setpoints (kW)
          </CardDescription>
        </div>
        <Badge variant="accent">Live Telemetry</Badge>
      </CardHeader>
      <CardContent>
        <div className="h-72 w-full pt-4">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={mockEnergyData}>
              <defs>
                <linearGradient id="actualGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#111827" stopOpacity={0.15} />
                  <stop offset="95%" stopColor="#111827" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="optimizedGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#22C55E" stopOpacity={0.25} />
                  <stop offset="95%" stopColor="#22C55E" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
              <XAxis dataKey="time" stroke="#6B7280" fontSize={12} tickLine={false} axisLine={{ stroke: '#E5E7EB' }} />
              <YAxis stroke="#6B7280" fontSize={12} tickLine={false} axisLine={false} />
              <Tooltip
                contentStyle={{
                  backgroundColor: "#FFFFFF",
                  borderColor: "#E5E7EB",
                  borderRadius: "16px",
                  boxShadow: "0 4px 20px -2px rgba(0,0,0,0.08)",
                }}
              />
              <Area
                type="monotone"
                dataKey="actual"
                name="Unoptimized Baseline"
                stroke="#111827"
                strokeWidth={2}
                fillOpacity={1}
                fill="url(#actualGrad)"
              />
              <Area
                type="monotone"
                dataKey="optimized"
                name="VOLTIX Autonomous"
                stroke="#22C55E"
                strokeWidth={2}
                fillOpacity={1}
                fill="url(#optimizedGrad)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
