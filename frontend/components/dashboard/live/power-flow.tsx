"use client";

import React from "react";
import { Building2, Sun, BatteryCharging, Zap } from "lucide-react";
import { motion, useReducedMotion } from "framer-motion";
import { AnimatedNumber } from "@/components/shared/animated-number";

export interface PowerFlowProps {
  buildingName?: string;
  solarKw?: number;
  batteryKw?: number;
  gridKw?: number;
  loadKw?: number;
}

export function PowerFlow({
  buildingName = "HQ Tower One",
  solarKw = 450,
  batteryKw = 120,
  gridKw = 930,
  loadKw = 1380,
}: PowerFlowProps) {
  const shouldReduceMotion = useReducedMotion();

  return (
    <div className="relative w-full h-[180px] bg-gray-50/70 rounded-xl border border-gray-200 p-4 mb-4 flex items-center justify-center overflow-hidden">
      {/* Animated SVG Connections */}
      <svg className="absolute inset-0 w-full h-full pointer-events-none" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id="flowGrad" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#3B82F6" stopOpacity="0.8" />
            <stop offset="100%" stopColor="#10B981" stopOpacity="0.8" />
          </linearGradient>
        </defs>

        {/* Base Static Guide Lines */}
        <line x1="20%" y1="30%" x2="50%" y2="50%" stroke="#E5E7EB" strokeWidth="2" strokeDasharray="4 4" />
        <line x1="80%" y1="30%" x2="50%" y2="50%" stroke="#E5E7EB" strokeWidth="2" strokeDasharray="4 4" />
        <line x1="20%" y1="75%" x2="50%" y2="50%" stroke="#E5E7EB" strokeWidth="2" strokeDasharray="4 4" />
        <line x1="80%" y1="75%" x2="50%" y2="50%" stroke="#E5E7EB" strokeWidth="2" strokeDasharray="4 4" />

        {/* Animated Power Flow Lines */}
        {!shouldReduceMotion && (
          <>
            <motion.line
              x1="20%"
              y1="30%"
              x2="50%"
              y2="50%"
              stroke="url(#flowGrad)"
              strokeWidth="3"
              strokeDasharray="8 8"
              animate={{ strokeDashoffset: [0, -32] }}
              transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
            />
            <motion.line
              x1="80%"
              y1="30%"
              x2="50%"
              y2="50%"
              stroke="#10B981"
              strokeWidth="3"
              strokeDasharray="8 8"
              animate={{ strokeDashoffset: [0, -32] }}
              transition={{ duration: 1.2, repeat: Infinity, ease: "linear" }}
            />
            <motion.line
              x1="20%"
              y1="75%"
              x2="50%"
              y2="50%"
              stroke="#3B82F6"
              strokeWidth="3"
              strokeDasharray="8 8"
              animate={{ strokeDashoffset: [0, -32] }}
              transition={{ duration: 1.8, repeat: Infinity, ease: "linear" }}
            />
          </>
        )}
      </svg>

      {/* Nodes Grid */}
      <div className="relative z-10 w-full h-full flex items-center justify-between px-4">
        {/* Top Left: Solar */}
        <div className="flex flex-col items-center">
          <div className="w-10 h-10 rounded-xl bg-amber-100 border border-amber-300 flex items-center justify-center text-amber-700 shadow-xs mb-1">
            <Sun className="w-5 h-5" />
          </div>
          <span className="text-[11px] font-bold text-gray-900">Solar</span>
          <span className="text-[10px] text-emerald-600 font-semibold">
            <AnimatedNumber value={solarKw} suffix=" kW" />
          </span>
        </div>

        {/* Center: Main Building Hub */}
        <div className="flex flex-col items-center">
          <div className="w-14 h-14 rounded-2xl bg-gray-900 border-2 border-blue-500 flex items-center justify-center text-white shadow-md mb-1">
            <Building2 className="w-7 h-7 text-blue-400" />
          </div>
          <span className="text-[12px] font-bold text-gray-900">{buildingName}</span>
          <span className="text-[11px] text-gray-500 font-medium">
            <AnimatedNumber value={loadKw} suffix=" kW Total" />
          </span>
        </div>

        {/* Top Right: Battery */}
        <div className="flex flex-col items-center">
          <div className="w-10 h-10 rounded-xl bg-emerald-100 border border-emerald-300 flex items-center justify-center text-emerald-700 shadow-xs mb-1">
            <BatteryCharging className="w-5 h-5" />
          </div>
          <span className="text-[11px] font-bold text-gray-900">Battery</span>
          <span className="text-[10px] text-emerald-600 font-semibold">
            <AnimatedNumber value={batteryKw} suffix=" kW" />
          </span>
        </div>
      </div>
    </div>
  );
}
