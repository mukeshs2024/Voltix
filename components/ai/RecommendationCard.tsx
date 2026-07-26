'use client';

import React from 'react';
import { Recommendation } from '@/types/recommendation';
import {
  Zap,
  CheckCircle,
  XCircle,
  AlertCircle,
  ShieldCheck,
  TrendingDown,
  ChevronRight,
} from 'lucide-react';

interface RecommendationCardProps {
  recommendation: Recommendation;
  onToggleApprove: (id: string) => void;
}

export const RecommendationCard: React.FC<RecommendationCardProps> = ({
  recommendation,
  onToggleApprove,
}) => {
  const {
    id,
    title,
    savingsKw,
    reason,
    priority,
    confidence,
    category,
    approved,
    estimatedCostSavings,
    estimatedCarbonSavings,
    targetAsset,
  } = recommendation;

  const priorityStyles = {
    high: 'bg-rose-500/10 text-rose-400 border-rose-500/30',
    medium: 'bg-amber-500/10 text-amber-400 border-amber-500/30',
    low: 'bg-cyan-500/10 text-cyan-400 border-cyan-500/30',
  };

  return (
    <div
      className={`glass-card rounded-2xl p-5 border transition-all duration-300 relative overflow-hidden flex flex-col justify-between ${
        approved
          ? 'border-emerald-500/40 bg-slate-900/80 shadow-lg shadow-emerald-500/10'
          : 'border-slate-800 bg-slate-950/60 opacity-75 hover:opacity-100'
      }`}
    >
      {/* Top Tag & Priority */}
      <div>
        <div className="flex items-center justify-between gap-2 mb-3">
          <span className="text-[11px] font-mono font-medium text-slate-400 px-2.5 py-1 rounded-md bg-slate-800/80 border border-slate-700">
            {category}
          </span>
          <div className="flex items-center gap-2">
            <span
              className={`text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full border ${priorityStyles[priority]}`}
            >
              {priority} Priority
            </span>
          </div>
        </div>

        {/* Title and Savings Banner */}
        <div className="flex items-start justify-between gap-3 mb-3">
          <div>
            <h3 className="text-lg font-bold text-slate-100 flex items-center gap-2">
              {title}
            </h3>
            <p className="text-xs text-slate-400 font-mono mt-0.5">
              Target: {targetAsset}
            </p>
          </div>
          <div className="text-right">
            <div className="inline-flex items-center gap-1 text-emerald-400 bg-emerald-500/10 px-3 py-1 rounded-xl border border-emerald-500/20 font-mono font-bold text-sm">
              <Zap className="w-4 h-4 fill-emerald-400 text-emerald-400" />
              {savingsKw} kW Saved
            </div>
          </div>
        </div>

        {/* Reason / AI Rationale */}
        <div className="bg-slate-900/90 rounded-xl p-3.5 border border-slate-800/80 mb-4">
          <p className="text-xs text-slate-300 leading-relaxed">
            <span className="font-semibold text-cyan-400 mr-1">AI Reason:</span>
            {reason}
          </p>
        </div>

        {/* Key Metrics: Confidence, Financial & Carbon Savings */}
        <div className="grid grid-cols-3 gap-2 mb-4">
          <div className="bg-slate-950/50 p-2.5 rounded-xl border border-slate-800/60 text-center">
            <div className="text-[10px] text-slate-400 uppercase font-mono">Confidence</div>
            <div className="text-sm font-bold text-cyan-300 font-mono flex items-center justify-center gap-1 mt-0.5">
              <ShieldCheck className="w-3.5 h-3.5 text-cyan-400" />
              {confidence}%
            </div>
          </div>

          <div className="bg-slate-950/50 p-2.5 rounded-xl border border-slate-800/60 text-center">
            <div className="text-[10px] text-slate-400 uppercase font-mono">Cost Saving</div>
            <div className="text-sm font-bold text-emerald-400 font-mono mt-0.5">
              +${estimatedCostSavings.toFixed(2)}/hr
            </div>
          </div>

          <div className="bg-slate-950/50 p-2.5 rounded-xl border border-slate-800/60 text-center">
            <div className="text-[10px] text-slate-400 uppercase font-mono">Carbon Saved</div>
            <div className="text-sm font-bold text-teal-300 font-mono mt-0.5">
              {estimatedCarbonSavings} kg/hr
            </div>
          </div>
        </div>
      </div>

      {/* Action Footer: Approval Toggle Button */}
      <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between">
        <div className="flex items-center gap-2">
          {approved ? (
            <span className="text-xs text-emerald-400 font-semibold flex items-center gap-1.5 bg-emerald-500/10 px-2.5 py-1 rounded-md border border-emerald-500/20">
              <CheckCircle className="w-4 h-4 text-emerald-400" /> Action Approved
            </span>
          ) : (
            <span className="text-xs text-slate-400 font-semibold flex items-center gap-1.5 bg-slate-800/60 px-2.5 py-1 rounded-md border border-slate-700">
              <AlertCircle className="w-4 h-4 text-amber-400" /> Pending Manager Review
            </span>
          )}
        </div>

        <button
          onClick={() => onToggleApprove(id)}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 shadow-md ${
            approved
              ? 'bg-slate-800 hover:bg-slate-700 text-rose-300 border border-rose-500/30'
              : 'bg-gradient-to-r from-cyan-500 to-emerald-500 hover:from-cyan-400 hover:to-emerald-400 text-slate-950 font-extrabold shadow-cyan-500/20'
          }`}
        >
          {approved ? (
            <>
              <XCircle className="w-4 h-4" /> Reject Action
            </>
          ) : (
            <>
              <CheckCircle className="w-4 h-4" /> Approve Action
            </>
          )}
        </button>
      </div>
    </div>
  );
};
