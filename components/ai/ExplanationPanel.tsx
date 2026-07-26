'use client';

import React from 'react';
import { Recommendation } from '@/types/recommendation';
import { Brain, Lightbulb, ShieldAlert, Cpu, ArrowRight } from 'lucide-react';

interface ExplanationPanelProps {
  recommendations: Recommendation[];
}

export const ExplanationPanel: React.FC<ExplanationPanelProps> = ({
  recommendations,
}) => {
  return (
    <div className="glass-card rounded-2xl p-6 border border-slate-800 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-slate-800 pb-4">
        <div className="flex items-center space-x-3">
          <div className="p-2.5 rounded-xl bg-violet-500/10 border border-violet-500/30 text-violet-400">
            <Brain className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-slate-100">
              AI Natural Language Explanation Engine
            </h3>
            <p className="text-xs text-slate-400">
              Deep reasoning and contextual rationale for recommended microgrid actions
            </p>
          </div>
        </div>

        <span className="text-xs font-mono px-3 py-1 rounded-full bg-violet-500/20 text-violet-300 border border-violet-500/30">
          MODEL: VOLTIX-LLM-v4.2
        </span>
      </div>

      {/* Main Rationale Narrative Box */}
      <div className="p-4 rounded-xl bg-slate-900/90 border border-slate-800 space-y-3">
        <div className="flex items-center gap-2 text-xs font-mono text-cyan-400 font-bold uppercase tracking-wider">
          <Lightbulb className="w-4 h-4 text-amber-400" /> Executive AI Rationale Summary
        </div>
        <p className="text-sm text-slate-200 leading-relaxed">
          The Voltix Predictive Model detected an impending <span className="text-amber-400 font-semibold">65% solar generation deficit</span> caused by localized cloud cover over the West Wing PV array between 11:00 AM and 02:00 PM. Unchecked, this drop would force the microgrid to import 55 kW of additional grid power during peak utility pricing ($0.45/kWh), incurring severe peak-demand penalty surcharges.
        </p>
        <p className="text-sm text-slate-300 leading-relaxed">
          To maintain grid stability without disrupting building operations, Voltix generated a balanced three-part strategy combining flexible load curtailment, smart asset throttling, and battery discharge.
        </p>
      </div>

      {/* Itemized Explanations */}
      <div className="space-y-4">
        <h4 className="text-xs font-mono font-bold text-slate-400 uppercase tracking-wider">
          Why Each Recommendation Exists
        </h4>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {recommendations.map((rec) => (
            <div
              key={rec.id}
              className="p-4 rounded-xl bg-slate-950/60 border border-slate-800/80 hover:border-cyan-500/30 transition flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between gap-2 mb-2">
                  <h5 className="text-sm font-bold text-slate-200">{rec.title}</h5>
                  <span className="text-xs font-mono font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded">
                    -{rec.savingsKw} kW
                  </span>
                </div>
                <p className="text-xs text-slate-300 leading-relaxed mb-3">
                  {rec.reason}
                </p>
              </div>

              <div className="pt-3 border-t border-slate-800/60 text-[11px] text-slate-400 font-mono flex items-center justify-between">
                <span>Confidence: {rec.confidence}%</span>
                <span className="text-cyan-400 font-semibold">{rec.category}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
