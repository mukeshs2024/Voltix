"use client";

import React from "react";
import { CheckCircle2, DollarSign, Leaf, RefreshCw, ShieldCheck, Zap } from "lucide-react";
import { motion, useReducedMotion } from "framer-motion";
import { AnimatedNumber } from "@/components/shared/animated-number";

export interface SimulationSummaryData {
  scenarioName?: string;
  initialEnergyKwh?: number;
  optimizedEnergyKwh?: number;
  energySavedPct?: number;
  costSavedUSD?: number;
  co2AvoidedTons?: number;
  executedRecommendationsCount?: number;
  recommendationsSummary?: string[];
}

interface SimulationSummaryScreenProps {
  data?: SimulationSummaryData;
  onReturnToScenarios?: () => void;
  onReRunScenario?: () => void;
}

export function SimulationSummaryScreen({
  data,
  onReturnToScenarios,
  onReRunScenario,
}: SimulationSummaryScreenProps) {
  const shouldReduceMotion = useReducedMotion();

  const scenarioName = data?.scenarioName ?? "Morning Office Rush";
  const initialKwh = data?.initialEnergyKwh ?? 1650;
  const optimizedKwh = data?.optimizedEnergyKwh ?? 1345;
  const savedPct = data?.energySavedPct ?? 18.5;
  const costSavedUSD = data?.costSavedUSD ?? 450;
  const co2Avoided = data?.co2AvoidedTons ?? 2.8;
  const recommendationsCount = data?.executedRecommendationsCount ?? 4;
  const summaryItems = data?.recommendationsSummary ?? [
    "Increased chilled water setpoint by +1.5°C to reduce compressor draw.",
    "Pre-cooled Zone B conference spaces prior to 09:30 AM occupancy surge.",
    "Discharged 120 kW battery capacity during peak utility tariff pricing.",
    "Dimmed non-essential lighting perimeter zones by 25%.",
  ];

  return (
    <div className="min-h-screen w-full bg-gray-50 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: shouldReduceMotion ? 0 : 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35 }}
        className="w-full max-w-2xl bg-white rounded-2xl border border-[#E5E7EB] shadow-md p-6 md:p-8"
      >
        {/* Header */}
        <div className="flex items-start justify-between gap-4 mb-6 pb-4 border-b border-gray-100">
          <div className="space-y-1">
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
              <CheckCircle2 className="w-3.5 h-3.5" /> Simulation Completed
            </div>
            <h1 className="text-[22px] font-bold tracking-tight text-gray-900">
              Simulation Summary: {scenarioName}
            </h1>
            <p className="text-[13px] text-gray-500">
              Digital Twin multi-agent execution completed. All optimizations logged to history.
            </p>
          </div>
          <div className="w-10 h-10 rounded-xl bg-gray-900 flex items-center justify-center text-white shrink-0 shadow-xs">
            <Zap className="w-5 h-5 text-emerald-400" />
          </div>
        </div>

        {/* Core KPI Results Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
          {/* Energy Saved */}
          <div className="bg-emerald-50/50 p-4 rounded-xl border border-emerald-200 text-left">
            <span className="text-[11px] font-semibold text-emerald-700 uppercase tracking-wider block mb-1">
              Energy Optimized
            </span>
            <span className="text-[24px] font-bold text-gray-900 block leading-none mb-1">
              <AnimatedNumber value={savedPct} suffix="%" decimals={1} />
            </span>
            <span className="text-[11px] font-medium text-emerald-600">
              {initialKwh} → {optimizedKwh} kWh
            </span>
          </div>

          {/* Cost Savings */}
          <div className="bg-blue-50/50 p-4 rounded-xl border border-blue-200 text-left">
            <span className="text-[11px] font-semibold text-blue-700 uppercase tracking-wider block mb-1">
              Financial Savings
            </span>
            <span className="text-[24px] font-bold text-gray-900 block leading-none mb-1">
              <AnimatedNumber value={costSavedUSD} prefix="$" />
            </span>
            <span className="text-[11px] font-medium text-blue-600">Peak tariff arbitrage</span>
          </div>

          {/* CO2 Avoided */}
          <div className="bg-green-50/50 p-4 rounded-xl border border-green-200 text-left">
            <span className="text-[11px] font-semibold text-green-700 uppercase tracking-wider block mb-1">
              Carbon Avoided
            </span>
            <span className="text-[24px] font-bold text-gray-900 block leading-none mb-1">
              <AnimatedNumber value={co2Avoided} suffix=" Tons" decimals={1} />
            </span>
            <span className="text-[11px] font-medium text-green-600">Clean energy reduction</span>
          </div>
        </div>

        {/* Executed Recommendations List */}
        <div className="mb-6">
          <div className="flex items-center justify-between gap-2 mb-3">
            <h3 className="text-[14px] font-bold text-gray-900">
              Executed Multi-Agent Actions ({recommendationsCount})
            </h3>
            <span className="text-[11px] font-semibold text-gray-500 bg-gray-100 px-2 py-0.5 rounded-full">
              Read-Only Audit Trail
            </span>
          </div>
          <div className="space-y-2 bg-gray-50 p-3 rounded-xl border border-gray-200 max-h-[180px] overflow-y-auto">
            {summaryItems.map((item, idx) => (
              <div key={idx} className="flex items-start gap-2 text-[12px] text-gray-700">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                <span>{item}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center gap-3 pt-4 border-t border-gray-100">
          <button
            onClick={onReturnToScenarios}
            className="w-full sm:w-1/2 h-[40px] bg-[#111827] text-white text-[13px] font-medium rounded-lg hover:bg-gray-800 transition-colors shadow-xs"
          >
            Return to Scenario Center
          </button>
          <button
            onClick={onReRunScenario}
            className="w-full sm:w-1/2 h-[40px] bg-white border border-gray-200 text-gray-700 text-[13px] font-medium rounded-lg hover:bg-gray-50 transition-colors flex items-center justify-center gap-1.5 shadow-xs"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            Re-run Scenario
          </button>
        </div>
      </motion.div>
    </div>
  );
}
