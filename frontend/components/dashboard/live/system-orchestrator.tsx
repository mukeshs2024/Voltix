"use client";

import React from "react";
import { ServerCog, Activity, Cpu, MessageSquare, Zap, BarChart } from "lucide-react";

interface SystemOrchestratorProps {
  tick: number;
  phase: string;
  runningAgents: number;
  messagesExchanged: number;
  recommendations: number;
  consensusIteration: number;
  optimizationCycle: number;
  avgDecisionTime?: string;
  currentFps?: number;
  twinVersion?: string;
}

export function SystemOrchestratorCard({
  tick,
  phase,
  runningAgents,
  messagesExchanged,
  recommendations,
  consensusIteration,
  optimizationCycle,
  avgDecisionTime = "1.2s",
  currentFps = 60,
  twinVersion = "v4.2.14"
}: SystemOrchestratorProps) {
  return (
    <div className="bg-gray-900 rounded-xl border border-gray-800 p-4 shadow-lg text-white mb-5 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute top-0 right-0 p-8 opacity-5">
        <ServerCog className="w-32 h-32" />
      </div>

      <div className="relative z-10">
        <div className="flex items-center gap-2 mb-4 pb-3 border-b border-gray-800">
          <ServerCog className="w-5 h-5 text-blue-400" />
          <h3 className="text-[14px] font-bold text-gray-100">Autonomous Orchestrator</h3>
          <span className="ml-auto flex items-center gap-1.5 text-[10px] font-bold text-emerald-400 uppercase tracking-wider bg-emerald-400/10 px-2 py-0.5 rounded-full">
            <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-pulse" />
            Online
          </span>
        </div>

        <div className="grid grid-cols-2 gap-x-4 gap-y-3">
          <div>
            <span className="text-[10px] text-gray-500 font-semibold uppercase block mb-0.5">Current Tick</span>
            <div className="flex items-center gap-1.5">
              <Activity className="w-3 h-3 text-blue-400" />
              <span className="text-[13px] font-mono font-bold text-gray-200">{tick}</span>
            </div>
          </div>
          <div>
            <span className="text-[10px] text-gray-500 font-semibold uppercase block mb-0.5">Current Phase</span>
            <span className="text-[12px] font-bold text-blue-300 truncate block">{phase}</span>
          </div>
          <div>
            <span className="text-[10px] text-gray-500 font-semibold uppercase block mb-0.5">Running Agents</span>
            <div className="flex items-center gap-1.5">
              <Cpu className="w-3 h-3 text-amber-400" />
              <span className="text-[13px] font-mono font-bold text-gray-200">{runningAgents}</span>
            </div>
          </div>
          <div>
            <span className="text-[10px] text-gray-500 font-semibold uppercase block mb-0.5">Messages Exchanged</span>
            <div className="flex items-center gap-1.5">
              <MessageSquare className="w-3 h-3 text-purple-400" />
              <span className="text-[13px] font-mono font-bold text-gray-200">{messagesExchanged}</span>
            </div>
          </div>
          <div>
            <span className="text-[10px] text-gray-500 font-semibold uppercase block mb-0.5">Consensus Round</span>
            <div className="flex items-center gap-1.5">
              <BarChart className="w-3 h-3 text-emerald-400" />
              <span className="text-[13px] font-mono font-bold text-gray-200">#{consensusIteration}</span>
            </div>
          </div>
          <div>
            <span className="text-[10px] text-gray-500 font-semibold uppercase block mb-0.5">Opt. Cycle</span>
            <div className="flex items-center gap-1.5">
              <Zap className="w-3 h-3 text-yellow-400" />
              <span className="text-[13px] font-mono font-bold text-gray-200">{optimizationCycle}</span>
            </div>
          </div>
        </div>

        {/* Extra Telemetry */}
        <div className="mt-4 pt-3 border-t border-gray-800 grid grid-cols-3 gap-2">
          <div>
            <span className="text-[9px] text-gray-500 font-semibold uppercase block">Avg Decision Time</span>
            <span className="text-[11px] font-mono font-bold text-gray-300">{avgDecisionTime}</span>
          </div>
          <div>
            <span className="text-[9px] text-gray-500 font-semibold uppercase block">Current FPS</span>
            <span className="text-[11px] font-mono font-bold text-emerald-400">{currentFps}</span>
          </div>
          <div>
            <span className="text-[9px] text-gray-500 font-semibold uppercase block">Twin Version</span>
            <span className="text-[11px] font-mono font-bold text-blue-300">{twinVersion}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
