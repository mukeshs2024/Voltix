'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Recommendation } from '@/types/recommendation';
import {
  Zap, CheckCircle, XCircle, AlertCircle, ShieldCheck, 
  ChevronDown, ChevronUp, Clock, Info
} from 'lucide-react';

interface RecommendationCardProps {
  recommendation: Recommendation;
  onToggleApprove: (id: string) => void;
}

export const RecommendationCard: React.FC<RecommendationCardProps> = ({
  recommendation,
  onToggleApprove,
}) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const {
    id, title, savingsKw, reason, priority, confidence,
    category, approved, estimatedCostSavings, estimatedCarbonSavings, targetAsset,
  } = recommendation;

  const priorityStyles = {
    high: 'text-rose-500 bg-rose-500/10 border-rose-500/20',
    medium: 'text-amber-500 bg-amber-500/10 border-amber-500/20',
    low: 'text-blue-500 bg-blue-500/10 border-blue-500/20',
  };

  return (
    <motion.div
      layout
      className={`glass-card rounded-2xl p-5 border transition-all duration-300 relative overflow-hidden flex flex-col ${
        approved
          ? 'border-emerald-500/30 bg-zinc-900/80 shadow-[0_0_20px_rgba(16,185,129,0.1)]'
          : 'border-zinc-800 bg-zinc-950/60 hover:bg-zinc-900/80'
      }`}
    >
      <div className="flex items-center justify-between gap-2 mb-3">
        <span className="text-[10px] font-bold uppercase tracking-wider text-zinc-500 px-2.5 py-1 rounded-md bg-zinc-900 border border-zinc-800">
          {category}
        </span>
        <span className={`text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full border ${priorityStyles[priority]}`}>
          {priority} Priority
        </span>
      </div>

      <div className="flex items-start justify-between gap-4 mb-4">
        <div>
          <h3 className="text-base font-semibold text-zinc-100 mb-1">{title}</h3>
          <p className="text-xs text-zinc-500">Target Asset: {targetAsset}</p>
        </div>
        <div className="inline-flex items-center gap-1.5 text-emerald-400 bg-emerald-500/10 px-3 py-1.5 rounded-lg border border-emerald-500/20 font-mono font-bold text-sm whitespace-nowrap">
          <Zap className="w-4 h-4" /> {savingsKw} kW
        </div>
      </div>

      <div className="grid grid-cols-4 gap-2 mb-4">
        <div className="bg-zinc-900/50 p-2 rounded-lg border border-zinc-800/50 text-center">
          <div className="text-[10px] text-zinc-500 uppercase">Confidence</div>
          <div className="text-xs font-semibold text-aiBlue flex items-center justify-center gap-1 mt-0.5">
            <ShieldCheck className="w-3 h-3" /> {confidence}%
          </div>
        </div>
        <div className="bg-zinc-900/50 p-2 rounded-lg border border-zinc-800/50 text-center">
          <div className="text-[10px] text-zinc-500 uppercase">Saved</div>
          <div className="text-xs font-semibold text-emerald-400 mt-0.5">
            +${estimatedCostSavings.toFixed(2)}/hr
          </div>
        </div>
        <div className="bg-zinc-900/50 p-2 rounded-lg border border-zinc-800/50 text-center">
          <div className="text-[10px] text-zinc-500 uppercase">Carbon</div>
          <div className="text-xs font-semibold text-teal-400 mt-0.5">
            -{estimatedCarbonSavings} kg
          </div>
        </div>
        <div className="bg-zinc-900/50 p-2 rounded-lg border border-zinc-800/50 text-center">
          <div className="text-[10px] text-zinc-500 uppercase">Time</div>
          <div className="text-xs font-semibold text-zinc-300 mt-0.5 flex items-center justify-center gap-1">
             <Clock className="w-3 h-3" /> &lt; 1s
          </div>
        </div>
      </div>

      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden"
          >
            <div className="bg-zinc-900/80 rounded-xl p-4 border border-zinc-800 mb-4">
              <div className="flex items-center gap-2 mb-2 text-xs font-semibold text-aiBlue uppercase tracking-wider">
                <Info className="w-4 h-4" /> AI Reasoning
              </div>
              <p className="text-sm text-zinc-300 leading-relaxed">
                {reason}
                <br /><br />
                <span className="text-zinc-500">Estimated Comfort Impact:</span> Minimal. Temperature expected to rise by 0.5°C over 2 hours, well within acceptable thresholds.
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="pt-4 border-t border-zinc-800 flex items-center justify-between mt-auto">
        <button 
          onClick={() => setIsExpanded(!isExpanded)}
          className="text-xs text-zinc-400 hover:text-zinc-200 flex items-center gap-1 transition-colors"
        >
          {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          {isExpanded ? 'Hide Details' : 'Explain More'}
        </button>

        <div className="flex gap-2">
          {approved && (
            <button
              onClick={() => onToggleApprove(id)}
              className="px-4 py-2 rounded-lg text-xs font-semibold bg-zinc-800 hover:bg-zinc-700 text-zinc-300 border border-zinc-700 transition-colors"
            >
              Modify
            </button>
          )}
          <button
            onClick={() => onToggleApprove(id)}
            className={`px-4 py-2 rounded-lg text-xs font-semibold transition-all flex items-center gap-2 ${
              approved
                ? 'bg-emerald-500/20 text-emerald-500 border border-emerald-500/30'
                : 'bg-zinc-100 hover:bg-white text-black shadow-[0_0_15px_rgba(255,255,255,0.1)]'
            }`}
          >
            {approved ? (
              <>
                <CheckCircle className="w-4 h-4" /> Approved
              </>
            ) : (
              'Approve Action'
            )}
          </button>
        </div>
      </div>
    </motion.div>
  );
};
