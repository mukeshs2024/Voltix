'use client';

import React from 'react';
import { Recommendation } from '@/types/recommendation';
import {
  TrendingDown,
  Zap,
  Leaf,
  DollarSign,
  BarChart2,
  ArrowDownRight,
  ShieldCheck,
} from 'lucide-react';

interface ImpactSummaryProps {
  recommendations: Recommendation[];
  baselineDemandKw?: number;
}

export const ImpactSummary: React.FC<ImpactSummaryProps> = ({
  recommendations,
  baselineDemandKw = 220,
}) => {
  // Calculate savings dynamically based on approved recommendations
  const totalApprovedSavingsKw = recommendations
    .filter((r) => r.approved)
    .reduce((sum, r) => sum + r.savingsKw, 0);

  const totalApprovedCostSavings = recommendations
    .filter((r) => r.approved)
    .reduce((sum, r) => sum + r.estimatedCostSavings, 0);

  const totalApprovedCarbonSavings = recommendations
    .filter((r) => r.approved)
    .reduce((sum, r) => sum + r.estimatedCarbonSavings, 0);

  const afterDemandKw = Math.max(0, baselineDemandKw - totalApprovedSavingsKw);
  const peakReductionPct = Math.round(
    (totalApprovedSavingsKw / baselineDemandKw) * 100
  );

  return (
    <div className="glass-card rounded-2xl p-6 border border-slate-800 space-y-6 relative overflow-hidden">
      {/* Glow Effect */}
      <div className="absolute top-0 right-0 w-80 h-80 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

      {/* Header */}
      <div className="flex items-center justify-between border-b border-slate-800 pb-4">
        <div>
          <h3 className="text-lg font-bold text-slate-100 flex items-center gap-2">
            <BarChart2 className="w-5 h-5 text-emerald-400" /> AI Optimization Impact Summary
          </h3>
          <p className="text-xs text-slate-400 mt-0.5">
            Real-time power curtailment, environmental offset, and financial savings
          </p>
        </div>
        <div className="flex items-center gap-1.5 text-xs font-mono text-emerald-400 bg-emerald-500/10 px-3 py-1.5 rounded-full border border-emerald-500/20">
          <ShieldCheck className="w-4 h-4" /> Live Verification
        </div>
      </div>

      {/* Top Main Comparison: Before vs After Demand */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Before Demand */}
        <div className="p-5 rounded-2xl bg-slate-900/90 border border-slate-800 flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono text-slate-400 uppercase">
              Baseline Demand (Before)
            </span>
            <span className="text-xs font-bold text-rose-400 bg-rose-500/10 px-2 py-0.5 rounded">
              Un-optimized
            </span>
          </div>
          <div className="mt-3">
            <div className="text-3xl font-extrabold text-slate-100 font-mono">
              {baselineDemandKw}{' '}
              <span className="text-sm font-normal text-slate-400">kW</span>
            </div>
            <p className="text-[11px] text-slate-400 mt-1">
              Unhedged peak demand load during solar drop
            </p>
          </div>
        </div>

        {/* Arrow / Reduction Badge */}
        <div className="p-5 rounded-2xl bg-gradient-to-br from-cyan-950/60 to-emerald-950/60 border border-cyan-500/30 flex flex-col items-center justify-center text-center">
          <div className="w-10 h-10 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center mb-2 animate-bounce">
            <ArrowDownRight className="w-6 h-6" />
          </div>
          <span className="text-2xl font-black text-emerald-400 font-mono">
            -{totalApprovedSavingsKw} kW
          </span>
          <span className="text-xs text-cyan-300 font-semibold mt-0.5">
            {peakReductionPct}% Peak Demand Reduction
          </span>
        </div>

        {/* After Demand */}
        <div className="p-5 rounded-2xl bg-slate-900/90 border border-emerald-500/40 flex flex-col justify-between shadow-lg shadow-emerald-500/10">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono text-slate-400 uppercase">
              Optimized Demand (After)
            </span>
            <span className="text-xs font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/30">
              AI Optimized
            </span>
          </div>
          <div className="mt-3">
            <div className="text-3xl font-extrabold text-emerald-400 font-mono">
              {afterDemandKw}{' '}
              <span className="text-sm font-normal text-slate-400">kW</span>
            </div>
            <p className="text-[11px] text-slate-300 mt-1">
              Safe load limit maintained below tariff threshold
            </p>
          </div>
        </div>
      </div>

      {/* Secondary Metrics: Carbon, Money, Peak Reduction */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
        {/* Carbon Offset */}
        <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800 flex items-center gap-3">
          <div className="p-3 rounded-xl bg-teal-500/10 text-teal-400 border border-teal-500/20">
            <Leaf className="w-5 h-5" />
          </div>
          <div>
            <div className="text-[11px] font-mono text-slate-400 uppercase">
              Carbon Emissions Saved
            </div>
            <div className="text-lg font-bold text-teal-300 font-mono">
              {totalApprovedCarbonSavings.toFixed(1)} kg CO₂ / hr
            </div>
            <div className="text-[10px] text-slate-400">
              Avoided fossil peaking generator dispatch
            </div>
          </div>
        </div>

        {/* Cost Savings */}
        <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800 flex items-center gap-3">
          <div className="p-3 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
            <DollarSign className="w-5 h-5" />
          </div>
          <div>
            <div className="text-[11px] font-mono text-slate-400 uppercase">
              Financial Savings Rate
            </div>
            <div className="text-lg font-bold text-emerald-400 font-mono">
              ${totalApprovedCostSavings.toFixed(2)} / hr
            </div>
            <div className="text-[10px] text-slate-400">
              Peak tariff surcharge reduction
            </div>
          </div>
        </div>

        {/* Peak Reduction */}
        <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800 flex items-center gap-3">
          <div className="p-3 rounded-xl bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
            <TrendingDown className="w-5 h-5" />
          </div>
          <div>
            <div className="text-[11px] font-mono text-slate-400 uppercase">
              Total Demand Curtailment
            </div>
            <div className="text-lg font-bold text-cyan-300 font-mono">
              {peakReductionPct}% Reduction
            </div>
            <div className="text-[10px] text-slate-400">
              Grid headroom maintained
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
