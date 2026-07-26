'use client';

import React, { useState, useEffect } from 'react';
import {
  CloudSun,
  Sun,
  Users,
  BatteryCharging,
  DollarSign,
  TrendingUp,
  Cpu,
  CheckCircle2,
  Play,
  RotateCcw,
  Sparkles,
} from 'lucide-react';

export interface ThinkingStep {
  id: number;
  label: string;
  subtext: string;
  icon: React.ComponentType<{ className?: string }>;
  detail: string;
}

const THINKING_STEPS: ThinkingStep[] = [
  {
    id: 1,
    label: 'Collect Weather',
    subtext: 'Scanning satellite & radar feed',
    icon: CloudSun,
    detail: 'Detected cumulus overcast cloud front moving South-West at 14 km/h.',
  },
  {
    id: 2,
    label: 'Collect Solar',
    subtext: 'Querying PV inverter telemetry',
    icon: Sun,
    detail: 'West Wing solar arrays (Zones A-D) reporting -65% irradiance dip.',
  },
  {
    id: 3,
    label: 'Collect Occupancy',
    subtext: 'PIR & BLE location telemetry',
    icon: Users,
    detail: 'Auditorium occupancy at 18%, Main Office Block at 84%.',
  },
  {
    id: 4,
    label: 'Collect Battery',
    subtext: 'Checking BESS State of Charge',
    icon: BatteryCharging,
    detail: 'LiFePO4 battery pack SOC at 82% (164 kWh available reserve).',
  },
  {
    id: 5,
    label: 'Collect Electricity Price',
    subtext: 'Checking utility TOU pricing',
    icon: DollarSign,
    detail: 'On-peak pricing active ($0.45/kWh). Demand charge threshold $18/kW.',
  },
  {
    id: 6,
    label: 'Forecast Ready',
    subtext: 'Synthesizing neural model output',
    icon: TrendingUp,
    detail: 'Predicted solar shortfall: 55 kW over 180 minute window.',
  },
  {
    id: 7,
    label: 'Optimization Running',
    subtext: 'Solving Mixed-Integer Linear Program',
    icon: Cpu,
    detail: 'Evaluating 1,024 load-shifting combinations & battery dispatch curves.',
  },
  {
    id: 8,
    label: 'Decision Generated',
    subtext: 'Optimal action plan compiled',
    icon: CheckCircle2,
    detail: 'Generated 3 high-impact recommendations saving 55 kW peak demand.',
  },
];

interface AIThinkingProps {
  onComplete?: () => void;
  autoStart?: boolean;
}

export const AIThinking: React.FC<AIThinkingProps> = ({
  onComplete,
  autoStart = true,
}) => {
  const [currentStepIndex, setCurrentStepIndex] = useState<number>(0);
  const [isRunning, setIsRunning] = useState<boolean>(autoStart);
  const [isCompleted, setIsCompleted] = useState<boolean>(false);
  const [stepSpeedMs, setStepSpeedMs] = useState<number>(1000);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (isRunning && currentStepIndex < THINKING_STEPS.length) {
      timer = setTimeout(() => {
        if (currentStepIndex === THINKING_STEPS.length - 1) {
          setIsRunning(false);
          setIsCompleted(true);
          if (onComplete) onComplete();
        } else {
          setCurrentStepIndex((prev) => prev + 1);
        }
      }, stepSpeedMs);
    }
    return () => clearTimeout(timer);
  }, [isRunning, currentStepIndex, stepSpeedMs, onComplete]);

  const handleRestart = () => {
    setCurrentStepIndex(0);
    setIsCompleted(false);
    setIsRunning(true);
  };

  const handleFastForward = () => {
    setCurrentStepIndex(THINKING_STEPS.length - 1);
    setIsRunning(false);
    setIsCompleted(true);
    if (onComplete) onComplete();
  };

  const activeStep = THINKING_STEPS[currentStepIndex];
  const progressPct = Math.round(
    ((currentStepIndex + 1) / THINKING_STEPS.length) * 100
  );

  return (
    <div className="glass-card rounded-2xl p-6 border border-cyan-500/20 shadow-2xl relative overflow-hidden">
      {/* Background ambient glow */}
      <div className="absolute -right-20 -top-20 w-64 h-64 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -left-20 -bottom-20 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

      {/* Header section */}
      <div className="flex flex-wrap items-center justify-between gap-4 mb-6 border-b border-slate-800/80 pb-4">
        <div className="flex items-center space-x-3">
          <div className="relative">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-cyan-500 to-blue-600 flex items-center justify-center text-slate-950 shadow-lg shadow-cyan-500/30">
              <Sparkles className="w-5 h-5 text-white animate-spin-slow" />
            </div>
            {isRunning && (
              <span className="absolute -top-1 -right-1 flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-3 w-3 bg-cyan-500" />
              </span>
            )}
          </div>
          <div>
            <h2 className="text-lg font-bold text-slate-100 flex items-center gap-2">
              Autonomous AI Thinking Workflow
              <span className="text-xs px-2.5 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 font-mono">
                {isCompleted ? 'OPTIMIZATION COMPLETE' : 'PROCESSING HYPOTHESES'}
              </span>
            </h2>
            <p className="text-xs text-slate-400">
              Simulating cloud-cover event impact across microgrid sub-assemblies
            </p>
          </div>
        </div>

        {/* Controls */}
        <div className="flex items-center space-x-2">
          <button
            onClick={handleRestart}
            className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 transition flex items-center gap-1.5"
            title="Re-run animation"
          >
            <RotateCcw className="w-3.5 h-3.5" /> Re-Analyze
          </button>
          {!isCompleted && (
            <button
              onClick={handleFastForward}
              className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-300 border border-cyan-500/40 transition flex items-center gap-1.5"
            >
              <Play className="w-3.5 h-3.5 fill-current" /> Instant Results
            </button>
          )}
        </div>
      </div>

      {/* Progress Bar */}
      <div className="mb-6">
        <div className="flex justify-between items-center text-xs font-mono text-slate-400 mb-1.5">
          <span>PIPELINE EXECUTION: STEP {currentStepIndex + 1} / {THINKING_STEPS.length}</span>
          <span className="text-cyan-400 font-bold">{progressPct}%</span>
        </div>
        <div className="w-full bg-slate-800/80 rounded-full h-2.5 p-0.5 border border-slate-700/50">
          <div
            className="bg-gradient-to-r from-cyan-500 via-blue-500 to-emerald-400 h-1.5 rounded-full transition-all duration-500 shadow-md shadow-cyan-500/50"
            style={{ width: `${progressPct}%` }}
          />
        </div>
      </div>

      {/* Workflow Horizontal Node Steps */}
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-2 mb-6">
        {THINKING_STEPS.map((step, idx) => {
          const IconComponent = step.icon;
          const isDone = idx < currentStepIndex || isCompleted;
          const isActive = idx === currentStepIndex && !isCompleted;

          return (
            <div
              key={step.id}
              onClick={() => {
                setCurrentStepIndex(idx);
                if (idx === THINKING_STEPS.length - 1) {
                  setIsCompleted(true);
                  if (onComplete) onComplete();
                }
              }}
              className={`p-2.5 rounded-xl border text-center cursor-pointer transition-all duration-300 flex flex-col items-center justify-between ${
                isActive
                  ? 'bg-cyan-950/60 border-cyan-400 shadow-lg shadow-cyan-500/20 scale-105 ring-2 ring-cyan-400/40'
                  : isDone
                  ? 'bg-slate-900/60 border-emerald-500/40 text-emerald-300'
                  : 'bg-slate-900/30 border-slate-800 text-slate-500 opacity-60'
              }`}
            >
              <div className="relative mb-2">
                <div
                  className={`w-7 h-7 rounded-lg flex items-center justify-center ${
                    isActive
                      ? 'bg-cyan-500 text-slate-950 font-bold animate-pulse'
                      : isDone
                      ? 'bg-emerald-500/20 text-emerald-400'
                      : 'bg-slate-800 text-slate-500'
                  }`}
                >
                  <IconComponent className="w-4 h-4" />
                </div>
              </div>
              <p className="text-[11px] font-semibold leading-tight line-clamp-1">
                {step.label}
              </p>
            </div>
          );
        })}
      </div>

      {/* Active step details callout */}
      <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 flex items-start gap-3">
        <div className="p-2.5 rounded-xl bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 mt-0.5">
          {React.createElement(activeStep.icon, { className: "w-5 h-5" })}
        </div>
        <div className="flex-1">
          <div className="flex items-center justify-between">
            <h4 className="text-sm font-bold text-cyan-300 flex items-center gap-2">
              {activeStep.label}
              <span className="text-[10px] text-slate-400 font-normal">
                ({activeStep.subtext})
              </span>
            </h4>
            <span className="text-[11px] font-mono text-emerald-400 flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
              Live Telemetry
            </span>
          </div>
          <p className="text-xs text-slate-300 mt-1 font-mono leading-relaxed">
            {activeStep.detail}
          </p>
        </div>
      </div>
    </div>
  );
};
