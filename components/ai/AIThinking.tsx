'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  CloudSun, Sun, Users, BatteryCharging, DollarSign, TrendingUp, Cpu, CheckCircle2, Play, RotateCcw, Sparkles, Clock, ShieldCheck
} from 'lucide-react';

export interface ThinkingStep {
  id: number;
  label: string;
  subtext: string;
  icon: React.ComponentType<{ className?: string }>;
  detail: string;
  confidence: number;
  executionTime: string;
}

const THINKING_STEPS: ThinkingStep[] = [
  { id: 1, label: 'Collect Weather', subtext: 'Scanning satellite feed', icon: CloudSun, detail: 'Detected cumulus overcast cloud front moving South-West.', confidence: 98, executionTime: '1.2s' },
  { id: 2, label: 'Collect Solar', subtext: 'Querying PV inverter', icon: Sun, detail: 'West Wing solar arrays reporting -65% irradiance dip.', confidence: 99, executionTime: '0.4s' },
  { id: 3, label: 'Collect Occupancy', subtext: 'BLE location telemetry', icon: Users, detail: 'Auditorium occupancy at 18%, Main Office at 84%.', confidence: 95, executionTime: '0.8s' },
  { id: 4, label: 'Collect Battery', subtext: 'Checking BESS SOC', icon: BatteryCharging, detail: 'LiFePO4 battery pack SOC at 82% (164 kWh available).', confidence: 100, executionTime: '0.3s' },
  { id: 5, label: 'Collect Price', subtext: 'Checking TOU pricing', icon: DollarSign, detail: 'On-peak pricing active ($0.45/kWh).', confidence: 100, executionTime: '0.2s' },
  { id: 6, label: 'Forecast Ready', subtext: 'Synthesizing output', icon: TrendingUp, detail: 'Predicted solar shortfall: 55 kW over 180 min window.', confidence: 94, executionTime: '2.1s' },
  { id: 7, label: 'Optimization', subtext: 'Solving MILP', icon: Cpu, detail: 'Evaluating 1,024 load-shifting combinations.', confidence: 97, executionTime: '4.5s' },
  { id: 8, label: 'Decision Ready', subtext: 'Action plan compiled', icon: CheckCircle2, detail: 'Generated 3 high-impact recommendations saving 55 kW.', confidence: 96, executionTime: '0.1s' },
];

interface AIThinkingProps {
  onComplete?: () => void;
  autoStart?: boolean;
}

export const AIThinking: React.FC<AIThinkingProps> = ({ onComplete, autoStart = true }) => {
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [isRunning, setIsRunning] = useState(autoStart);
  const [isCompleted, setIsCompleted] = useState(false);

  useEffect(() => {
    if (!isRunning) return;
    
    if (currentStepIndex >= THINKING_STEPS.length) {
      setIsRunning(false);
      setIsCompleted(true);
      if (onComplete) onComplete();
      return;
    }

    const timer = setTimeout(() => {
      setCurrentStepIndex(prev => prev + 1);
    }, 1500);
    
    return () => clearTimeout(timer);
  }, [isRunning, currentStepIndex, onComplete]);

  const activeStep = THINKING_STEPS[Math.min(currentStepIndex, THINKING_STEPS.length - 1)];

  return (
    <div className="glass-card p-6 relative overflow-hidden group">
      <div className="absolute top-0 right-0 w-64 h-64 bg-aiBlue/5 rounded-full blur-3xl pointer-events-none group-hover:bg-aiBlue/10 transition-colors" />
      
      <div className="flex items-center justify-between mb-8 relative z-10">
        <div className="flex items-center gap-4">
          <div className="relative">
            <div className="w-12 h-12 rounded-xl bg-zinc-900 border border-zinc-800 flex items-center justify-center shadow-lg">
              <Sparkles className={`w-6 h-6 ${isRunning ? 'text-aiBlue animate-pulse' : 'text-emerald-500'}`} />
            </div>
          </div>
          <div>
            <h2 className="text-xl font-semibold tracking-tight text-zinc-100 flex items-center gap-3">
              AI Reasoning Engine
              <span className={`text-[10px] px-2 py-0.5 rounded-full uppercase tracking-wider font-bold ${isCompleted ? 'bg-emerald-500/10 text-emerald-500 border border-emerald-500/20' : 'bg-aiBlue/10 text-aiBlue border border-aiBlue/20'}`}>
                {isCompleted ? 'Analysis Complete' : 'Processing Hypothesis'}
              </span>
            </h2>
            <p className="text-sm text-zinc-500 mt-1">Simulating campus-wide impact of cloud cover event.</p>
          </div>
        </div>
        
        <div className="flex gap-2">
           <button onClick={() => { setCurrentStepIndex(0); setIsCompleted(false); setIsRunning(true); }} className="p-2 rounded-lg bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-zinc-400 hover:text-zinc-200 transition-colors">
              <RotateCcw className="w-4 h-4" />
           </button>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-3 mb-8 relative z-10">
        {THINKING_STEPS.map((step, idx) => {
          const isDone = idx < currentStepIndex || isCompleted;
          const isActive = idx === currentStepIndex && !isCompleted;
          const Icon = step.icon;

          return (
            <motion.div
              key={step.id}
              className={`p-3 rounded-xl border flex flex-col items-center text-center transition-all ${
                isActive ? 'bg-aiBlue/10 border-aiBlue shadow-[0_0_15px_rgba(59,130,246,0.15)] scale-105' : 
                isDone ? 'bg-zinc-900/50 border-emerald-500/30' : 'bg-zinc-900/30 border-zinc-800/50 opacity-50'
              }`}
            >
               <div className={`w-8 h-8 rounded-lg flex items-center justify-center mb-2 ${isActive ? 'bg-aiBlue text-white' : isDone ? 'bg-emerald-500/10 text-emerald-500' : 'bg-zinc-800 text-zinc-500'}`}>
                 <Icon className="w-4 h-4" />
               </div>
               <div className={`text-[10px] font-semibold uppercase tracking-wider line-clamp-1 ${isActive ? 'text-aiBlue' : isDone ? 'text-emerald-500' : 'text-zinc-500'}`}>
                 {step.label}
               </div>
            </motion.div>
          );
        })}
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={activeStep.id}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          className="p-5 rounded-xl bg-zinc-900/80 border border-zinc-800 flex items-start gap-4"
        >
           <div className={`p-3 rounded-xl ${isCompleted ? 'bg-emerald-500/10 text-emerald-500' : 'bg-aiBlue/10 text-aiBlue'}`}>
              <activeStep.icon className="w-6 h-6" />
           </div>
           <div className="flex-1">
              <div className="flex justify-between items-start mb-2">
                 <div>
                    <h4 className="font-semibold text-zinc-100">{activeStep.label}</h4>
                    <div className="text-xs text-zinc-500">{activeStep.subtext}</div>
                 </div>
                 <div className="flex gap-4 text-xs font-mono">
                    <span className="flex items-center gap-1.5 text-zinc-400">
                      <Clock className="w-3.5 h-3.5" /> {activeStep.executionTime}
                    </span>
                    <span className="flex items-center gap-1.5 text-emerald-500">
                      <ShieldCheck className="w-3.5 h-3.5" /> {activeStep.confidence}%
                    </span>
                 </div>
              </div>
              <p className="text-sm text-zinc-300">
                 {activeStep.detail}
              </p>
           </div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
};
