"use client";

import React from "react";
import { BarChart2 } from "lucide-react";
import { ForecastChart } from "@/components/dashboard/live/forecast-chart";

export interface ForecastDataPoint {
  time: string;
  current?: number;
  predicted: number;
  optimized: number;
}

interface ForecastPanelProps {
  data?: ForecastDataPoint[];
}

const DEFAULT_FORECAST: ForecastDataPoint[] = [
  { time: "06:00", current: 400, predicted: 420, optimized: 380 },
  { time: "07:00", current: 750, predicted: 780, optimized: 640 },
  { time: "08:00", current: 1380, predicted: 1420, optimized: 1150 },
  { time: "09:00", current: undefined, predicted: 1650, optimized: 1280 },
  { time: "10:00", current: undefined, predicted: 1720, optimized: 1340 },
  { time: "11:00", current: undefined, predicted: 1680, optimized: 1310 },
  { time: "12:00", current: undefined, predicted: 1590, optimized: 1250 },
];

export function ForecastPanel({ data = DEFAULT_FORECAST }: ForecastPanelProps) {
  return (
    <div className="bg-white rounded-xl border border-[#E5E7EB] p-5 shadow-xs flex flex-col justify-between h-full">
      {/* Header */}
      <div className="flex items-center justify-between gap-2 mb-4 pb-3 border-b border-gray-100">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-gray-900 flex items-center justify-center text-white">
            <BarChart2 className="w-4 h-4 text-blue-400" />
          </div>
          <div>
            <h3 className="text-[15px] font-bold text-gray-900 leading-none">Forecast & Optimization Panel</h3>
            <span className="text-[11px] text-gray-500 font-medium">Load Projection vs AI Optimized Curve</span>
          </div>
        </div>
      </div>

      {/* Forecast Chart */}
      <ForecastChart data={data} />
    </div>
  );
}
