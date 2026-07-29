"use client";

import React from "react";
import { Brain, CheckCircle2, Clock, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";

export type AgentStatusType =
  | "Monitoring"
  | "Receiving Data"
  | "Analyzing"
  | "Recommendation Ready"
  | "Waiting Consensus";

export interface AgentCardData {
  id: string;
  name: string;
  status: AgentStatusType;
  thought: string;
  confidence: number;
  recommendation: string;
  lastUpdated: string;
  accentColor?: string;
}

interface AgentCardProps {
  agent: AgentCardData;
}

export function AgentCard({ agent }: AgentCardProps) {
  const getStatusBadge = (status: AgentStatusType) => {
    switch (status) {
      case "Monitoring":
        return "bg-gray-100 text-gray-700 border-gray-200";
      case "Receiving Data":
        return "bg-sky-50 text-sky-700 border-sky-200";
      case "Analyzing":
        return "bg-blue-50 text-blue-700 border-blue-200";
      case "Recommendation Ready":
        return "bg-emerald-50 text-emerald-700 border-emerald-200";
      case "Waiting Consensus":
        return "bg-purple-50 text-purple-700 border-purple-200";
      default:
        return "bg-gray-50 text-gray-700 border-gray-200";
    }
  };

  return (
    <div className="bg-white rounded-xl border border-[#E5E7EB] p-4 shadow-xs hover:border-gray-300 transition-all flex flex-col justify-between h-full">
      <div>
        {/* Header: Agent Name & Status */}
        <div className="flex items-center justify-between gap-2 mb-2 pb-2 border-b border-gray-100">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-md bg-gray-900 flex items-center justify-center text-white shrink-0">
              <Brain className="w-3.5 h-3.5 text-blue-400" />
            </div>
            <h4 className="text-[14px] font-bold text-gray-900 leading-tight">{agent.name}</h4>
          </div>
          <span className={cn("px-2 py-0.5 rounded-full text-[10px] font-semibold border whitespace-nowrap", getStatusBadge(agent.status))}>
            {agent.status}
          </span>
        </div>

        {/* Current Thought */}
        <div className="mb-3">
          <span className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider block mb-0.5">Current Thought</span>
          <p className="text-[12px] text-gray-700 font-medium leading-tight line-clamp-2">{agent.thought}</p>
        </div>

        {/* Recommendation */}
        <div className="mb-3 bg-gray-50 p-2.5 rounded-lg border border-gray-200">
          <span className="text-[10px] font-bold text-gray-500 uppercase tracking-wider block mb-0.5">Recommendation</span>
          <p className="text-[12px] text-gray-900 font-semibold leading-tight line-clamp-2">{agent.recommendation}</p>
        </div>
      </div>

      {/* Footer: Confidence & Last Updated */}
      <div className="pt-2 border-t border-gray-100 flex items-center justify-between text-[11px] text-gray-500">
        <div className="flex items-center gap-1">
          <span className="font-semibold text-gray-700">Confidence:</span>
          <span className="font-bold text-blue-600">{agent.confidence}%</span>
        </div>
        <div className="flex items-center gap-1 text-gray-400">
          <Clock className="w-3 h-3" />
          <span>{agent.lastUpdated}</span>
        </div>
      </div>
    </div>
  );
}
