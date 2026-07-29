"use client";

import React, { useEffect, useState } from "react";
import { Activity, Clock, Play, Sparkles, Timer } from "lucide-react";
import { cn } from "@/lib/utils";

interface LiveHeaderProps {
  scenarioName?: string;
  status?: string;
  simulationTime?: string;
  startTime?: Date | string;
}

export function LiveHeader({
  scenarioName = "Morning Office Rush",
  status = "RUNNING",
  simulationTime = "08:45 AM",
  startTime,
}: LiveHeaderProps) {
  const [elapsedSeconds, setElapsedSeconds] = useState(142);

  useEffect(() => {
    const interval = setInterval(() => {
      setElapsedSeconds((prev) => prev + 1);
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const formatElapsed = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  const getStatusBadge = (st: string) => {
    const upper = st.toUpperCase();
    if (upper === "RUNNING" || upper === "ACTIVE") {
      return "bg-emerald-50 text-emerald-700 border-emerald-200";
    }
    if (upper === "COMPLETED") {
      return "bg-blue-50 text-blue-700 border-blue-200";
    }
    if (upper === "PAUSED") {
      return "bg-amber-50 text-amber-700 border-amber-200";
    }
    return "bg-gray-50 text-gray-700 border-gray-200";
  };

  return (
    <div className="bg-white rounded-xl border border-[#E5E7EB] p-4 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
      {/* Scenario Name & Status */}
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-gray-900 flex items-center justify-center text-white shrink-0 shadow-xs">
          <Activity className="w-5 h-5 text-blue-400" />
        </div>
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-[18px] font-bold text-gray-900 tracking-tight">{scenarioName}</h1>
            <span
              className={cn(
                "px-2.5 py-0.5 rounded-full text-[11px] font-semibold border flex items-center gap-1",
                getStatusBadge(status)
              )}
            >
              <span className="w-1.5 h-1.5 rounded-full bg-current animate-pulse" />
              {status}
            </span>
          </div>
          <p className="text-[12px] text-gray-500">Autonomous Ecosystem Simulation Engine</p>
        </div>
      </div>

      {/* Metrics Row: Simulation Time & Elapsed Time */}
      <div className="flex items-center gap-6 border-t md:border-t-0 border-gray-100 pt-3 md:pt-0">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-gray-50 border border-gray-200 flex items-center justify-center text-gray-500">
            <Clock className="w-4 h-4" />
          </div>
          <div>
            <span className="text-[11px] font-medium text-gray-400 block uppercase leading-none">Simulation Time</span>
            <span className="text-[14px] font-bold text-gray-900 tracking-tight">{simulationTime}</span>
          </div>
        </div>

        <div className="w-px h-8 bg-gray-200 hidden sm:block" />

        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-gray-50 border border-gray-200 flex items-center justify-center text-gray-500">
            <Timer className="w-4 h-4" />
          </div>
          <div>
            <span className="text-[11px] font-medium text-gray-400 block uppercase leading-none">Elapsed Time</span>
            <span className="text-[14px] font-bold text-gray-900 tracking-tight">{formatElapsed(elapsedSeconds)}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
