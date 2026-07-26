'use client';

import React, { useState } from 'react';
import { Recommendation } from '@/types/recommendation';
import { RecommendationCard } from './RecommendationCard';
import { Sparkles, CheckCheck, RotateCcw, Filter, Zap } from 'lucide-react';

interface RecommendationListProps {
  recommendations: Recommendation[];
  onToggleApprove: (id: string) => void;
  onApproveAll: () => void;
  onRejectAll: () => void;
}

export const RecommendationList: React.FC<RecommendationListProps> = ({
  recommendations,
  onToggleApprove,
  onApproveAll,
  onRejectAll,
}) => {
  const [filter, setFilter] = useState<'all' | 'approved' | 'pending'>('all');

  const filteredRecs = recommendations.filter((rec) => {
    if (filter === 'approved') return rec.approved;
    if (filter === 'pending') return !rec.approved;
    return true;
  });

  const totalActiveSavingsKw = recommendations
    .filter((r) => r.approved)
    .reduce((sum, r) => sum + r.savingsKw, 0);

  const totalPossibleSavingsKw = recommendations.reduce(
    (sum, r) => sum + r.savingsKw,
    0
  );

  return (
    <div className="space-y-6">
      {/* Header bar with total savings indicator and bulk actions */}
      <div className="glass-card rounded-2xl p-5 border border-slate-800 flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-bold text-slate-100 flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-cyan-400" /> AI Optimization Recommendations
            </h2>
            <span className="text-xs font-mono font-bold px-2.5 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
              {recommendations.length} Actions Available
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Review and dispatch automated load-shedding and battery dispatch controls.
          </p>
        </div>

        {/* Quick Stats & Controls */}
        <div className="flex items-center flex-wrap gap-3">
          <div className="bg-slate-900/90 px-4 py-2 rounded-xl border border-slate-800 flex items-center gap-2">
            <Zap className="w-4 h-4 text-emerald-400" />
            <div className="text-xs">
              <span className="text-slate-400">Approved Savings: </span>
              <span className="font-mono font-bold text-emerald-400">
                {totalActiveSavingsKw} / {totalPossibleSavingsKw} kW
              </span>
            </div>
          </div>

          <div className="flex items-center space-x-1 bg-slate-900 p-1 rounded-xl border border-slate-800">
            <button
              onClick={() => setFilter('all')}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition ${
                filter === 'all'
                  ? 'bg-cyan-500/20 text-cyan-300 font-bold border border-cyan-500/30'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              All ({recommendations.length})
            </button>
            <button
              onClick={() => setFilter('approved')}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition ${
                filter === 'approved'
                  ? 'bg-emerald-500/20 text-emerald-300 font-bold border border-emerald-500/30'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Approved ({recommendations.filter((r) => r.approved).length})
            </button>
            <button
              onClick={() => setFilter('pending')}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition ${
                filter === 'pending'
                  ? 'bg-amber-500/20 text-amber-300 font-bold border border-amber-500/30'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Pending ({recommendations.filter((r) => !r.approved).length})
            </button>
          </div>

          <button
            onClick={onApproveAll}
            className="px-3.5 py-2 rounded-xl text-xs font-bold bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 border border-emerald-500/40 transition flex items-center gap-1.5"
          >
            <CheckCheck className="w-4 h-4" /> Approve All
          </button>
        </div>
      </div>

      {/* Grid of Recommendation Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredRecs.map((rec) => (
          <RecommendationCard
            key={rec.id}
            recommendation={rec}
            onToggleApprove={onToggleApprove}
          />
        ))}
      </div>
    </div>
  );
};
