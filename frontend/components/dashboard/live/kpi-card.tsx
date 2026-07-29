"use client";

import React from "react";
import { LucideIcon } from "lucide-react";
import { motion, useReducedMotion } from "framer-motion";
import { AnimatedNumber } from "@/components/shared/animated-number";
import { cn } from "@/lib/utils";

export interface LiveKPIData {
  buildingLoadKw?: number;
  gridImportKw?: number;
  solarGenerationKw?: number;
  batterySocPct?: number;
  hvacPowerKw?: number;
  lightingPowerKw?: number;
  energyCostHourlyUSD?: number;
  monthlySavingsUSD?: number;
}

export interface KpiCardProps {
  label: string;
  numericValue?: number;
  rawValue?: string;
  prefix?: string;
  suffix?: string;
  decimals?: number;
  subtext: string;
  icon: LucideIcon;
  color: string;
  bg: string;
}

export function KpiCard({
  label,
  numericValue,
  rawValue,
  prefix,
  suffix,
  decimals = 0,
  subtext,
  icon: Icon,
  color,
  bg,
}: KpiCardProps) {
  const shouldReduceMotion = useReducedMotion();

  return (
    <motion.div
      whileHover={shouldReduceMotion ? undefined : { y: -2 }}
      transition={{ duration: 0.2 }}
      className="bg-white rounded-xl border border-[#E5E7EB] p-3.5 shadow-xs flex flex-col justify-between h-[105px] hover:border-gray-300 transition-all cursor-default"
    >
      <div className="flex items-center justify-between gap-1">
        <span className="text-[11px] font-semibold text-gray-500 truncate">{label}</span>
        <div className={cn("w-6 h-6 rounded-md flex items-center justify-center shrink-0", bg, color)}>
          <Icon className="w-3.5 h-3.5" />
        </div>
      </div>

      <div>
        <span className="text-[20px] font-bold text-gray-900 leading-none tracking-tight block truncate">
          {numericValue !== undefined ? (
            <AnimatedNumber value={numericValue} prefix={prefix} suffix={suffix} decimals={decimals} />
          ) : (
            rawValue
          )}
        </span>
        <span className="text-[10px] font-medium text-gray-400 mt-1 block truncate">{subtext}</span>
      </div>
    </motion.div>
  );
}
