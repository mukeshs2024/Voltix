"use client";

import React from "react";
import { CheckCircle2, ShieldCheck, Sparkles, TrendingDown } from "lucide-react";
import { cn } from "@/lib/utils";

export interface ConsensusData {
  pendingRecommendationsCount?: number;
  acceptedPlanTitle?: string;
  acceptedPlanDetail?: string;
  optimizationSummary?: string;
  expectedSavingsPct?: number;
  expectedSavingsUSD?: number;
}

interface ConsensusPanelProps {
  data?: ConsensusData;
}

export function ConsensusPanel({ data }: ConsensusPanelProps) {
  const pendingCount = data?.pendingRecommendationsCount ?? 2;
  const planTitle = data?.acceptedPlanTitle ?? "Chiller Delta-T & Battery Arbitrage Plan #402";
  const planDetail = data?.acceptedPlanDetail ?? "Pre-cool zones A & B by 1.5°C before 09:30 AM, discharge 120 kW battery during peak tariff window.";
  const summary = data?.optimizationSummary ?? "All 10 agents reached 98% consensus agreement on HVAC setback and grid discharge.";
  const savingsPct = data?.expectedSavingsPct ?? 18.5;
  const savingsUSD = data?.expectedSavingsUSD ?? 450;

  return (
    <div className="bg-white rounded-xl border border-[#E5E7EB] p-5 shadow-xs flex flex-col justify-between h-full">
      {/* Header */}
      <div className="flex items-center justify-between gap-2 mb-4 pb-3 border-b border-gray-100">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-gray-900 flex items-center justify-center text-white">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
          </div>
          <div>
            <h3 className="text-[15px] font-bold text-gray-900 leading-none">Consensus Engine Panel</h3>
            <span className="text-[11px] text-gray-500 font-medium">Multi-Agent Voting & Governance</span>
          </div>
        </div>
        <span className="text-[11px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-full flex items-center gap-1">
          <CheckCircle2 className="w-3 h-3" /> Consensus Reached
        </span>
      </div>

      <div className="space-y-3">
        {/* Pending Recommendations Badge */}
        <div className="flex items-center justify-between bg-gray-50 p-2.5 rounded-lg border border-gray-200 text-[12px]">
          <span className="font-semibold text-gray-700">Pending Agent Proposals</span>
          <span className="font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded-md border border-blue-200">
            {pendingCount} Pending
          </span>
        </div>

        {/* Accepted Plan */}
        <div className="bg-emerald-50/50 p-3 rounded-lg border border-emerald-200">
          <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-700 block mb-0.5">
            Accepted Operations Plan
          </span>
          <h4 className="text-[13px] font-bold text-gray-900 leading-tight mb-1">{planTitle}</h4>
          <p className="text-[12px] text-gray-600 leading-normal">{planDetail}</p>
        </div>

        {/* Optimization Summary */}
        <div className="bg-gray-50 p-3 rounded-lg border border-gray-200">
          <span className="text-[10px] font-bold uppercase tracking-wider text-gray-500 block mb-0.5">
            Optimization Summary
          </span>
          <p className="text-[12px] text-gray-800 font-medium leading-normal">{summary}</p>
        </div>

        {/* Expected Savings Read-Only */}
        <div className="pt-2 border-t border-gray-100 flex items-center justify-between">
          <div>
            <span className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider block">Expected Savings</span>
            <span className="text-[18px] font-bold text-emerald-600 leading-none">
              ${savingsUSD.toLocaleString()} <span className="text-[12px] font-semibold text-gray-500">({savingsPct}%)</span>
            </span>
          </div>
          <div className="w-8 h-8 rounded-lg bg-emerald-50 border border-emerald-200 flex items-center justify-center text-emerald-600">
            <TrendingDown className="w-4 h-4" />
          </div>
        </div>
      </div>
    </div>
  );
}
