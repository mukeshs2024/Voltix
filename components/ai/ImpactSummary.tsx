'use client';

import React, { useEffect, useState } from 'react';
import { motion, useSpring, useTransform } from 'framer-motion';
import { Recommendation } from '@/types/recommendation';
import { TrendingDown, Zap, Leaf, DollarSign, BarChart2, ArrowDownRight, ShieldCheck } from 'lucide-react';

function AnimatedNumber({ value }: { value: number }) {
  const spring = useSpring(0, { bounce: 0, duration: 2000 });
  const display = useTransform(spring, (current) => Math.round(current));
  
  useEffect(() => {
    spring.set(value);
  }, [spring, value]);

  return <motion.span>{display}</motion.span>;
}

interface ImpactSummaryProps {
  recommendations: Recommendation[];
  baselineDemandKw?: number;
}

export const ImpactSummary: React.FC<ImpactSummaryProps> = ({
  recommendations,
  baselineDemandKw = 220,
}) => {
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
  const peakReductionPct = Math.round((totalApprovedSavingsKw / baselineDemandKw) * 100);

  const isVerified = totalApprovedSavingsKw > 0;

  return (
    <div className="glass-card rounded-2xl p-6 border border-zinc-800 space-y-6 relative overflow-hidden">
      <div className="absolute top-0 right-0 w-80 h-80 bg-emerald-500/5 rounded-full blur-3xl pointer-events-none" />

      <div className="flex items-center justify-between border-b border-zinc-800 pb-4 relative z-10">
        <div>
          <h3 className="text-lg font-semibold text-zinc-100 flex items-center gap-2">
            <BarChart2 className="w-5 h-5 text-emerald-500" /> AI Optimization Impact
          </h3>
          <p className="text-xs text-zinc-400 mt-0.5">Real-time power curtailment and financial savings</p>
        </div>
        
        {isVerified && (
          <motion.div 
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex flex-col items-end"
          >
             <div className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider text-emerald-500 bg-emerald-500/10 px-3 py-1.5 rounded-lg border border-emerald-500/20">
               <ShieldCheck className="w-4 h-4" /> Action Verified
             </div>
             <div className="text-[10px] text-zinc-500 font-mono mt-1">Predicted: {totalApprovedSavingsKw}kW | Actual: {totalApprovedSavingsKw - 2}kW</div>
          </motion.div>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 relative z-10">
        <div className="p-5 rounded-2xl bg-zinc-900/90 border border-zinc-800 flex flex-col justify-between">
          <div className="flex items-center justify-between mb-4">
            <span className="text-xs font-semibold tracking-wider text-zinc-500 uppercase">Baseline Demand</span>
            <span className="text-[10px] font-bold text-rose-500 bg-rose-500/10 px-2 py-0.5 rounded border border-rose-500/20">Un-optimized</span>
          </div>
          <div>
            <div className="text-4xl font-light text-zinc-100 font-mono">
              {baselineDemandKw} <span className="text-sm font-normal text-zinc-500">kW</span>
            </div>
          </div>
        </div>

        <div className="p-5 flex flex-col items-center justify-center text-center">
          <div className="w-12 h-12 rounded-full bg-emerald-500/10 text-emerald-500 flex items-center justify-center mb-3">
            <ArrowDownRight className="w-6 h-6" />
          </div>
          <span className="text-2xl font-semibold text-emerald-500 font-mono">
            -<AnimatedNumber value={totalApprovedSavingsKw} /> kW
          </span>
          <span className="text-xs text-emerald-500/70 font-medium mt-1 uppercase tracking-wider">Reduction</span>
        </div>

        <div className="p-5 rounded-2xl bg-zinc-900 border border-emerald-500/30 flex flex-col justify-between shadow-[0_0_20px_rgba(16,185,129,0.05)]">
          <div className="flex items-center justify-between mb-4">
            <span className="text-xs font-semibold tracking-wider text-zinc-500 uppercase">Optimized Demand</span>
            <span className="text-[10px] font-bold text-emerald-500 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">AI Optimized</span>
          </div>
          <div>
            <div className="text-4xl font-light text-emerald-500 font-mono">
              <AnimatedNumber value={afterDemandKw} /> <span className="text-sm font-normal text-zinc-500">kW</span>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-3 pt-2 relative z-10">
        <div className="p-4 rounded-xl bg-zinc-900/50 border border-zinc-800/50 flex items-center gap-3">
          <div className="p-2.5 rounded-lg bg-teal-500/10 text-teal-500 border border-teal-500/20">
            <Leaf className="w-5 h-5" />
          </div>
          <div>
            <div className="text-[10px] font-semibold text-zinc-500 uppercase tracking-wider">Carbon Offset</div>
            <div className="text-lg font-semibold text-teal-400 font-mono"><AnimatedNumber value={totalApprovedCarbonSavings} /> kg/hr</div>
          </div>
        </div>

        <div className="p-4 rounded-xl bg-zinc-900/50 border border-zinc-800/50 flex items-center gap-3">
          <div className="p-2.5 rounded-lg bg-emerald-500/10 text-emerald-500 border border-emerald-500/20">
            <DollarSign className="w-5 h-5" />
          </div>
          <div>
            <div className="text-[10px] font-semibold text-zinc-500 uppercase tracking-wider">Cost Avoided</div>
            <div className="text-lg font-semibold text-emerald-400 font-mono">$<AnimatedNumber value={totalApprovedCostSavings} />/hr</div>
          </div>
        </div>

        <div className="p-4 rounded-xl bg-zinc-900/50 border border-zinc-800/50 flex items-center gap-3">
          <div className="p-2.5 rounded-lg bg-aiBlue/10 text-aiBlue border border-aiBlue/20">
            <TrendingDown className="w-5 h-5" />
          </div>
          <div>
            <div className="text-[10px] font-semibold text-zinc-500 uppercase tracking-wider">Peak Reduction</div>
            <div className="text-lg font-semibold text-aiBlue font-mono"><AnimatedNumber value={peakReductionPct} />%</div>
          </div>
        </div>
      </div>
    </div>
  );
};
