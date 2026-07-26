'use client';

import React, { useState } from 'react';
import {
  Cloud,
  TrendingUp,
  Sliders,
  FileCheck,
  CheckCircle,
  Clock,
  ArrowRight,
} from 'lucide-react';

export interface TimelineNode {
  id: string;
  title: string;
  subtitle: string;
  timestamp: string;
  status: 'completed' | 'active' | 'pending';
  icon: React.ComponentType<{ className?: string }>;
  details: string;
}

const DEFAULT_TIMELINE: TimelineNode[] = [
  {
    id: 'cloud-cover',
    title: 'Cloud Cover',
    subtitle: 'Overcast Event Triggered',
    timestamp: '11:00 AM',
    status: 'completed',
    icon: Cloud,
    details: 'Satellite weather feed detected sudden cloud front causing 65% drop in solar irradiance over West Wing.',
  },
  {
    id: 'prediction',
    title: 'Prediction',
    subtitle: 'Solar Yield Forecasting',
    timestamp: '11:01 AM',
    status: 'completed',
    icon: TrendingUp,
    details: 'AI Neural model calculated projected 55 kW power deficit across peak tariff hours (11:00 AM - 02:00 PM).',
  },
  {
    id: 'optimization',
    title: 'Optimization',
    subtitle: 'MILP Load Solver',
    timestamp: '11:02 AM',
    status: 'completed',
    icon: Sliders,
    details: 'Mixed-Integer Linear Optimizer evaluated 1,024 load-shifting combinations to minimize grid cost.',
  },
  {
    id: 'recommendation',
    title: 'Recommendation',
    subtitle: 'Action Plan Generated',
    timestamp: '11:02 AM',
    status: 'completed',
    icon: FileCheck,
    details: 'Compiled 3 high-impact actions: Delay EV charging (22kW), Reduce Auditorium HVAC (15kW), Use Battery (18kW).',
  },
  {
    id: 'approval',
    title: 'Approval',
    subtitle: 'Manager Dispatch Sync',
    timestamp: '11:03 AM',
    status: 'completed',
    icon: CheckCircle,
    details: 'Facility operator approved actions. Signal dispatched to Modbus/OCPP gateways.',
  },
];

export const Timeline: React.FC = () => {
  const [selectedNode, setSelectedNode] = useState<TimelineNode>(
    DEFAULT_TIMELINE[3]
  );

  return (
    <div className="glass-card rounded-2xl p-6 border border-slate-800 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-slate-800 pb-4">
        <div>
          <h3 className="text-lg font-bold text-slate-100 flex items-center gap-2">
            <Clock className="w-5 h-5 text-cyan-400" /> AI Execution & Decision Timeline
          </h3>
          <p className="text-xs text-slate-400 mt-0.5">
            Step-by-step lifecycle from weather detection to automated load dispatch
          </p>
        </div>
        <span className="text-xs font-mono px-3 py-1 rounded-full bg-slate-800 text-slate-300 border border-slate-700">
          EVENT CYCLE: #CC-2026-07
        </span>
      </div>

      {/* Horizontal Pipeline Steps */}
      <div className="relative py-4">
        {/* Connecting line */}
        <div className="absolute top-1/2 left-4 right-4 h-0.5 bg-slate-800 -translate-y-1/2 z-0" />

        <div className="relative z-10 grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-5 gap-4">
          {DEFAULT_TIMELINE.map((node, index) => {
            const IconComp = node.icon;
            const isSelected = selectedNode.id === node.id;

            return (
              <div
                key={node.id}
                onClick={() => setSelectedNode(node)}
                className={`p-4 rounded-xl border cursor-pointer transition-all duration-300 flex flex-col items-center text-center ${
                  isSelected
                    ? 'bg-slate-900 border-cyan-400 shadow-lg shadow-cyan-500/20 scale-105 ring-2 ring-cyan-400/30'
                    : 'bg-slate-950/80 border-slate-800/80 hover:border-slate-700'
                }`}
              >
                <div
                  className={`w-10 h-10 rounded-xl flex items-center justify-center mb-3 shadow-md ${
                    isSelected
                      ? 'bg-gradient-to-tr from-cyan-500 to-emerald-400 text-slate-950 font-bold'
                      : 'bg-slate-800 text-cyan-400 border border-slate-700'
                  }`}
                >
                  <IconComp className="w-5 h-5" />
                </div>

                <span className="text-[10px] font-mono text-slate-400 mb-1">
                  {node.timestamp}
                </span>

                <h4 className="text-sm font-bold text-slate-100 mb-0.5">
                  {node.title}
                </h4>

                <p className="text-[11px] text-slate-400 leading-tight line-clamp-1">
                  {node.subtitle}
                </p>

                <div className="mt-3">
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                    ✓ Executed
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Selected Node Details Drawer */}
      <div className="p-4 rounded-xl bg-slate-900/90 border border-slate-800 flex items-start gap-3">
        <div className="p-2.5 rounded-xl bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 mt-0.5">
          {React.createElement(selectedNode.icon, { className: 'w-5 h-5' })}
        </div>
        <div>
          <div className="flex items-center gap-2">
            <h4 className="text-sm font-bold text-cyan-300">
              Stage Details: {selectedNode.title}
            </h4>
            <span className="text-xs text-slate-400 font-mono">
              ({selectedNode.timestamp})
            </span>
          </div>
          <p className="text-xs text-slate-300 mt-1 font-mono leading-relaxed">
            {selectedNode.details}
          </p>
        </div>
      </div>
    </div>
  );
};
