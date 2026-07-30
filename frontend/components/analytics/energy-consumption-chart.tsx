"use client";

import React from "react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { motion } from "framer-motion";

const data = [
  { month: "Jan", consumption: 4000, baseline: 4400 },
  { month: "Feb", consumption: 3800, baseline: 4300 },
  { month: "Mar", consumption: 3600, baseline: 4200 },
  { month: "Apr", consumption: 3900, baseline: 4100 },
  { month: "May", consumption: 4100, baseline: 4500 },
  { month: "Jun", consumption: 4600, baseline: 5100 },
  { month: "Jul", consumption: 5100, baseline: 5800 },
  { month: "Aug", consumption: 5300, baseline: 6000 },
  { month: "Sep", consumption: 4800, baseline: 5400 },
  { month: "Oct", consumption: 4200, baseline: 4700 },
  { month: "Nov", consumption: 3800, baseline: 4400 },
  { month: "Dec", consumption: 3900, baseline: 4500 },
];

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
      <div className="bg-white border border-[#E5E7EB] rounded-[12px] p-3 shadow-soft">
        <p className="text-xs font-semibold text-[#6B7280] mb-2">{label}</p>
        {payload.map((entry, index: number) => (
          <div key={index} className="flex items-center justify-between gap-4 mb-1 text-sm">
            <span className="flex items-center gap-1.5 text-[#4B5563]">
              <span className="w-2 h-2 rounded-full" style={{ backgroundColor: entry.color }} />
              {entry.name}
            </span>
            <span className="font-bold text-[#111827]">{entry.value} MWh</span>
          </div>
        ))}
      </div>
    );
  }
  return null;
};

export function EnergyConsumptionChart() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.1 }}
    >
      <Card>
        <CardHeader>
          <CardTitle>YTD Energy Consumption</CardTitle>
          <CardDescription>Total grid draw across all monitored facilities vs Baseline</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-[320px] w-full pt-4">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="baselineGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#111827" stopOpacity={0.1} />
                    <stop offset="95%" stopColor="#111827" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="consumptionGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.2} />
                    <stop offset="95%" stopColor="#3B82F6" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F3F4F6" />
                <XAxis dataKey="month" stroke="#9CA3AF" fontSize={12} tickLine={false} axisLine={false} dy={10} />
                <YAxis stroke="#9CA3AF" fontSize={12} tickLine={false} axisLine={false} />
                <Tooltip content={<CustomTooltip />} />
                <Area type="monotone" dataKey="baseline" name="Baseline Projection" stroke="#111827" strokeWidth={2} fill="url(#baselineGrad)" strokeDasharray="4 4" />
                <Area type="monotone" dataKey="consumption" name="Actual Draw (Optimized)" stroke="#3B82F6" strokeWidth={3} fill="url(#consumptionGrad)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
