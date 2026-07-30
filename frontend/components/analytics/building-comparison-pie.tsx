"use client";

import React from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from "recharts";
import { motion } from "framer-motion";

const data = [
  { name: "HQ Tower One", value: 35 },
  { name: "Innovation Hub", value: 25 },
  { name: "East Coast Plaza", value: 20 },
  { name: "Westside Data Center", value: 20 },
];

const COLORS = ["#111827", "#3B82F6", "#22C55E", "#F59E0B"];

interface CustomTooltipProps {
  active?: boolean;
  payload?: Array<{
    name: string;
    value: number;
    payload: {
      fill: string;
    };
  }>;
}

const CustomTooltip = ({ active, payload }: CustomTooltipProps) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white border border-[#E5E7EB] rounded-[12px] p-3 shadow-soft">
        <div className="flex items-center justify-between gap-4 text-sm">
          <span className="flex items-center gap-1.5 text-[#4B5563]">
            <span className="w-2 h-2 rounded-full" style={{ backgroundColor: payload[0].payload.fill }} />
            {payload[0].name}
          </span>
          <span className="font-bold text-[#111827]">{payload[0].value}%</span>
        </div>
      </div>
    );
  }
  return null;
};

export function BuildingComparisonPie() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.4 }}
    >
      <Card>
        <CardHeader>
          <CardTitle>Energy Distribution</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-[280px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={data}
                  cx="50%"
                  cy="45%"
                  innerRadius={60}
                  outerRadius={90}
                  paddingAngle={2}
                  dataKey="value"
                  stroke="none"
                >
                  {data.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip content={<CustomTooltip />} />
                <Legend verticalAlign="bottom" height={36} iconType="circle" wrapperStyle={{ fontSize: '12px', color: '#6B7280' }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
