"use client";

import React from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { motion } from "framer-motion";

const data = [
  { month: "Jan", savings: 12000 },
  { month: "Feb", savings: 15000 },
  { month: "Mar", savings: 18500 },
  { month: "Apr", savings: 16000 },
  { month: "May", savings: 21000 },
  { month: "Jun", savings: 28000 },
];

interface CustomTooltipProps {
  active?: boolean;
  payload?: Array<{
    value: number;
  }>;
  label?: string;
}

const CustomTooltip = ({ active, payload, label }: CustomTooltipProps) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white border border-[#E5E7EB] rounded-[12px] p-3 shadow-apple">
        <p className="text-xs font-semibold text-[#6B7280] mb-2">{label}</p>
        <div className="flex items-center justify-between gap-4 text-sm">
          <span className="flex items-center gap-1.5 text-[#4B5563]">
            <span className="w-2 h-2 rounded-full bg-[#22C55E]" />
            Savings
          </span>
          <span className="font-bold text-[#22C55E]">+${payload[0].value.toLocaleString()}</span>
        </div>
      </div>
    );
  }
  return null;
};

export function SavingsBarChart() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
    >
      <Card>
        <CardHeader>
          <CardTitle>Monthly Cost Savings</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-[240px] w-full pt-4">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F3F4F6" />
                <XAxis dataKey="month" stroke="#9CA3AF" fontSize={12} tickLine={false} axisLine={false} dy={10} />
                <YAxis stroke="#9CA3AF" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(val) => `$${val/1000}k`} />
                <Tooltip content={<CustomTooltip />} cursor={{ fill: '#F3F4F6' }} />
                <Bar dataKey="savings" fill="#22C55E" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
