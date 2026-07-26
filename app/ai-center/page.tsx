'use client';

import React, { useState } from 'react';
import { useScenario } from '@/hooks/useScenario';
import { SCENARIO_LIST } from '@/data/scenario';
import { INITIAL_RECOMMENDATIONS } from '@/data/recommendation';
import { AIThinking } from '@/components/ai/AIThinking';
import { ExecutiveSummary } from '@/components/ai/ExecutiveSummary';
import { RecommendationList } from '@/components/ai/RecommendationList';
import { LiveCommandTerminal } from '@/components/ai/LiveCommandTerminal';
import { ExplanationPanel } from '@/components/ai/ExplanationPanel';
import { Timeline } from '@/components/ai/Timeline';
import { ImpactSummary } from '@/components/ai/ImpactSummary';
import { Recommendation } from '@/types/recommendation';
import { ScenarioType } from '@/types/dashboard';
import {
  Brain,
  Play,
  CheckCircle2,
  AlertTriangle,
  Sparkles,
  SlidersHorizontal,
  RefreshCw,
} from 'lucide-react';

export default function AICenterPage() {
  const { selectedScenario, setScenario } = useScenario();
  const [recommendations, setRecommendations] = useState<Recommendation[]>(
    INITIAL_RECOMMENDATIONS
  );
  const [thinkingKey, setThinkingKey] = useState<number>(0);
  const [aiThinkingCompleted, setAiThinkingCompleted] = useState<boolean>(true);

  // Current active scenario object
  const currentScenarioObj =
    SCENARIO_LIST.find((s) => s.id === selectedScenario) || SCENARIO_LIST[0];

  const handleScenarioChange = (newScenario: ScenarioType) => {
    setScenario(newScenario);
    setThinkingKey((prev) => prev + 1);
    setAiThinkingCompleted(false);
  };

  const handleToggleApprove = (id: string) => {
    setRecommendations((prev) =>
      prev.map((rec) => (rec.id === id ? { ...rec, approved: !rec.approved } : rec))
    );
  };

  const handleApproveAll = () => {
    setRecommendations((prev) =>
      prev.map((rec) => ({ ...rec, approved: true }))
    );
  };

  const handleRejectAll = () => {
    setRecommendations((prev) =>
      prev.map((rec) => ({ ...rec, approved: false }))
    );
  };

  const handleAnalyzeClick = () => {
    setThinkingKey((prev) => prev + 1);
    setAiThinkingCompleted(false);
  };

  return (
    <div className="space-y-8 pb-16">
      {/* Top Banner / Scenario Selector Header */}
      <div className="glass-card rounded-2xl p-6 border border-slate-800 flex flex-wrap items-center justify-between gap-6 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="p-2 rounded-xl bg-cyan-500/20 text-cyan-400 border border-cyan-500/30">
              <Brain className="w-6 h-6" />
            </span>
            <h1 className="text-2xl font-extrabold text-slate-100 tracking-tight">
              Voltix AI Decision Center
            </h1>
          </div>
          <p className="text-xs text-slate-400">
            Autonomous microgrid forecasting, load-shedding recommendations, & execution timeline
          </p>
        </div>

        {/* Scenario Selector Pill Buttons */}
        <div className="flex items-center flex-wrap gap-2">
          <div className="text-xs font-mono text-slate-400 flex items-center gap-1.5 mr-1">
            <SlidersHorizontal className="w-3.5 h-3.5" /> Scenario:
          </div>

          {SCENARIO_LIST.map((sc) => (
            <button
              key={sc.id}
              onClick={() => handleScenarioChange(sc.id)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                selectedScenario === sc.id
                  ? 'bg-gradient-to-r from-cyan-500 to-emerald-500 text-slate-950 shadow-md shadow-cyan-500/20'
                  : 'bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-800'
              }`}
            >
              {sc.id === 'cloud-cover' && <span>☁️</span>}
              {sc.id === 'heat-wave' && <span>🔥</span>}
              {sc.id === 'peak-hour' && <span>⚡</span>}
              {sc.id === 'price-spike' && <span>📈</span>}
              {sc.id === 'normal' && <span>🌿</span>}
              {sc.title}
            </button>
          ))}

          <button
            onClick={handleAnalyzeClick}
            className="ml-2 px-4 py-2 rounded-xl text-xs font-extrabold bg-cyan-500 hover:bg-cyan-400 text-slate-950 transition flex items-center gap-1.5 shadow-lg shadow-cyan-500/30"
          >
            <Play className="w-3.5 h-3.5 fill-current" /> Analyze
          </button>
        </div>
      </div>

      {/* Selected Scenario Callout */}
      <div className="p-4 rounded-xl bg-slate-900/90 border border-cyan-500/30 flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-amber-500/10 text-amber-400 border border-amber-500/20">
            <AlertTriangle className="w-5 h-5" />
          </div>
          <div>
            <div className="text-xs font-mono text-cyan-400 font-bold uppercase">
              ACTIVE SCENARIO: {currentScenarioObj.title}
            </div>
            <p className="text-xs text-slate-300 mt-0.5">
              {currentScenarioObj.description}
            </p>
          </div>
        </div>
        <div className="text-right font-mono text-xs hidden sm:block">
          <div className="text-rose-400 font-bold">Solar Yield Impact: {currentScenarioObj.solarImpactPct}%</div>
          <div className="text-slate-400">Peak Demand Offset: {currentScenarioObj.demandImpactKw} kW</div>
        </div>
      </div>

      {/* SECTION 1: AI Thinking Animation */}
      <AIThinking
        key={thinkingKey}
        onComplete={() => setAiThinkingCompleted(true)}
        autoStart={true}
      />

      {/* SECTION 1.5: Executive Summary */}
      {aiThinkingCompleted && (
        <ExecutiveSummary />
      )}

      {/* SECTION 2: Recommendations List & Approval Controls */}
      <RecommendationList
        recommendations={recommendations}
        onToggleApprove={handleToggleApprove}
        onApproveAll={handleApproveAll}
        onRejectAll={handleRejectAll}
      />

      {/* SECTION 2.5: Live Command Terminal (Shows on approval) */}
      <LiveCommandTerminal active={recommendations.some(r => r.approved)} />

      {/* SECTION 3: Natural Language AI Explanation Panel */}
      <ExplanationPanel recommendations={recommendations} />

      {/* SECTION 4: Impact Summary (Before: 220kW -> After: 165kW) */}
      <ImpactSummary recommendations={recommendations} baselineDemandKw={220} />

      {/* SECTION 5: Decision Lifecycle Timeline */}
      <Timeline />
    </div>
  );
}
