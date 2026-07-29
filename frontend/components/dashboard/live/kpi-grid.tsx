"use client";

import React from "react";
import { Activity, BatteryCharging, DollarSign, Flame, Lightbulb, Sun, TrendingDown, Zap } from "lucide-react";
import { motion, useReducedMotion } from "framer-motion";
import { KpiCard, LiveKPIData } from "@/components/dashboard/live/kpi-card";
export type { LiveKPIData };

interface KPIGridProps {
  data?: LiveKPIData;
}

export function KPIGrid({ data }: KPIGridProps) {
  const shouldReduceMotion = useReducedMotion();

  const metrics = [
    {
      label: "Building Load",
      numericValue: data?.buildingLoadKw ?? 1380,
      suffix: " kW",
      subtext: "Total active demand",
      icon: Activity,
      color: "text-blue-600",
      bg: "bg-blue-50",
    },
    {
      label: "Grid Import",
      numericValue: data?.gridImportKw ?? 930,
      suffix: " kW",
      subtext: "Utility feed load",
      icon: Zap,
      color: "text-amber-600",
      bg: "bg-amber-50",
    },
    {
      label: "Solar",
      numericValue: data?.solarGenerationKw ?? 450,
      suffix: " kW",
      subtext: "Rooftop generation",
      icon: Sun,
      color: "text-emerald-600",
      bg: "bg-emerald-50",
    },
    {
      label: "Battery",
      numericValue: data?.batterySocPct ?? 78,
      suffix: "%",
      subtext: "Storage capacity",
      icon: BatteryCharging,
      color: "text-indigo-600",
      bg: "bg-indigo-50",
    },
    {
      label: "HVAC",
      numericValue: data?.hvacPowerKw ?? 620,
      suffix: " kW",
      subtext: "Thermal system draw",
      icon: Flame,
      color: "text-sky-600",
      bg: "bg-sky-50",
    },
    {
      label: "Lighting",
      numericValue: data?.lightingPowerKw ?? 140,
      suffix: " kW",
      subtext: "Fixture consumption",
      icon: Lightbulb,
      color: "text-yellow-600",
      bg: "bg-yellow-50",
    },
    {
      label: "Energy Cost",
      numericValue: data?.energyCostHourlyUSD ?? 165.6,
      prefix: "$",
      suffix: "/h",
      decimals: 2,
      subtext: "Current tariff rate",
      icon: DollarSign,
      color: "text-purple-600",
      bg: "bg-purple-50",
    },
    {
      label: "Savings",
      numericValue: data?.monthlySavingsUSD ?? 12500,
      prefix: "$",
      subtext: "AI optimized value",
      icon: TrendingDown,
      color: "text-emerald-600",
      bg: "bg-emerald-50",
    },
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: shouldReduceMotion ? 0 : 0.04,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: shouldReduceMotion ? 0 : 8 },
    show: { opacity: 1, y: 0, transition: { duration: 0.25 } },
  };

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="show"
      className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-3"
    >
      {metrics.map((item, idx) => (
        <motion.div key={idx} variants={itemVariants}>
          <KpiCard
            label={item.label}
            numericValue={item.numericValue}
            prefix={item.prefix}
            suffix={item.suffix}
            decimals={item.decimals}
            subtext={item.subtext}
            icon={item.icon}
            color={item.color}
            bg={item.bg}
          />
        </motion.div>
      ))}
    </motion.div>
  );
}
