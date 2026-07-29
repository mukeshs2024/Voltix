"use client";

import React from "react";
import { Brain, Clock, Activity, Database, CheckCircle2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";

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
  inputs: Record<string, string | number>;
  observation: string;
  reasoning: string;
  recommendation: string;
  expectedImpact: string;
  confidence: number;
  lastUpdated: string;
  previousRecommendation?: string;
  reasonForChange?: string;
  previousConfidence?: number;
}

interface AgentCardProps {
  agent: AgentCardData;
}

export function AgentCard({ agent }: AgentCardProps) {
  const getStatusColor = (status: AgentStatusType) => {
    switch (status) {
      case "Monitoring": return "bg-gray-100 text-gray-700 border-gray-200";
      case "Receiving Data": return "bg-sky-50 text-sky-700 border-sky-200";
      case "Analyzing": return "bg-blue-50 text-blue-700 border-blue-200";
      case "Recommendation Ready": return "bg-emerald-50 text-emerald-700 border-emerald-200";
      case "Waiting Consensus": return "bg-purple-50 text-purple-700 border-purple-200";
      default: return "bg-gray-50 text-gray-700 border-gray-200";
    }
  };

  const isIdle = agent.status === "Monitoring" || agent.status === "Waiting Consensus";
  
  return (
    <div className={cn(
      "bg-white rounded-xl border p-4 shadow-xs flex flex-col h-full transition-all duration-500",
      isIdle ? "border-[#E5E7EB]" : "border-blue-300 shadow-[0_0_15px_rgba(59,130,246,0.15)]"
    )}>
      {/* Header: Agent Name & Status */}
      <div className="flex items-center justify-between gap-2 mb-3 pb-3 border-b border-gray-100">
        <div className="flex items-center gap-2">
          <div className={cn(
            "w-7 h-7 rounded-lg flex items-center justify-center text-white transition-colors duration-500 shrink-0",
            !isIdle ? "bg-blue-600" : "bg-gray-900"
          )}>
            <Brain className={cn("w-4 h-4", !isIdle ? "animate-pulse text-white" : "text-blue-400")} />
          </div>
          <h4 className="text-[14px] font-bold text-gray-900 leading-tight">{agent.name}</h4>
        </div>
        <div className={cn("px-2 py-1 rounded-full text-[10px] font-bold border whitespace-nowrap uppercase tracking-wider flex items-center gap-1.5 transition-colors", getStatusColor(agent.status))}>
          {!isIdle && <span className="w-1.5 h-1.5 rounded-full bg-current animate-ping" />}
          {agent.status}
        </div>
      </div>

      <div className="flex-1 flex flex-col gap-3">
        {/* INPUT DATA */}
        <div>
          <div className="flex items-center gap-1 mb-1.5">
            <Database className="w-3 h-3 text-gray-400" />
            <span className="text-[10px] font-bold text-gray-500 uppercase tracking-wider">Input Data</span>
          </div>
          <div className="bg-gray-50 rounded-lg border border-gray-100 p-2 grid grid-cols-2 gap-x-2 gap-y-1">
            {Object.entries(agent.inputs || {}).map(([key, val]) => (
              <div key={key} className="flex justify-between items-center text-[11px]">
                <span className="text-gray-500 truncate pr-1">{key}</span>
                <span className="font-semibold text-gray-900 truncate">{val}</span>
              </div>
            ))}
          </div>
        </div>

        {/* OUTPUTS: Animated reveal based on status */}
        <div className="flex-1 flex flex-col gap-2 relative">
          <AnimatePresence mode="popLayout">
            {agent.status !== "Monitoring" && agent.status !== "Receiving Data" && (
              <motion.div
                key="analysis"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-blue-50/50 rounded-lg border border-blue-100/50 p-2.5 flex flex-col gap-2"
              >
                <div>
                  <span className="text-[10px] font-bold text-blue-800 uppercase tracking-wider block mb-0.5">Observation</span>
                  <p className="text-[12px] text-gray-800 leading-tight">{agent.observation || "Analyzing data streams..."}</p>
                </div>
                <div>
                  <span className="text-[10px] font-bold text-blue-800 uppercase tracking-wider block mb-0.5">Reasoning</span>
                  <p className="text-[12px] text-gray-800 leading-tight">{agent.reasoning || "Running correlation..."}</p>
                </div>
              </motion.div>
            )}

            {(agent.status === "Recommendation Ready" || agent.status === "Waiting Consensus") && (
              <motion.div
                key="recommendation"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-emerald-50/50 rounded-lg border border-emerald-100/50 p-2.5"
              >
                {/* Memory Comparison Section */}
                {agent.previousRecommendation && (
                  <div className="mb-2 pb-2 border-b border-emerald-100/80">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-[9px] font-bold text-emerald-800/60 uppercase tracking-wider block">Previous Rec</span>
                      <span className="text-[9px] font-bold text-emerald-800/60">{agent.previousConfidence}%</span>
                    </div>
                    <p className="text-[11px] text-gray-500 leading-tight line-through opacity-70">{agent.previousRecommendation}</p>
                    <div className="mt-1.5 bg-white/60 p-1.5 rounded text-[10px] text-gray-700 italic border border-emerald-100/50">
                      <span className="font-bold mr-1">Shift Reason:</span>
                      {agent.reasonForChange}
                    </div>
                  </div>
                )}

                <div className="mb-1.5 flex items-center justify-between">
                  <span className="text-[10px] font-bold text-emerald-800 uppercase tracking-wider block">Current Plan</span>
                  <span className="text-[10px] font-bold text-emerald-700 bg-emerald-100 px-1.5 rounded">
                    {agent.confidence}% Conf
                  </span>
                </div>
                <p className="text-[13px] font-semibold text-gray-900 leading-tight mb-2">{agent.recommendation}</p>
                
                <div className="flex items-center justify-between text-[11px]">
                  <span className="font-semibold text-gray-500">Expected Impact:</span>
                  <span className="font-bold text-emerald-600">{agent.expectedImpact}</span>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Placeholder when idle */}
          {(agent.status === "Monitoring" || agent.status === "Receiving Data") && (
            <div className="flex-1 flex items-center justify-center border-2 border-dashed border-gray-100 rounded-lg bg-gray-50/50">
              <span className="text-xs text-gray-400 font-medium">
                {agent.status === "Receiving Data" ? "Receiving broadcast..." : "Awaiting anomalies..."}
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Footer: Confidence & Last Updated */}
      <div className="mt-3 pt-2 border-t border-gray-100 flex items-center justify-between text-[11px] text-gray-500">
        <div className="flex items-center gap-1">
          <span className="font-semibold text-gray-700">Confidence:</span>
          <div className="flex items-center gap-1.5">
            <span className="font-bold text-blue-600">{agent.confidence}%</span>
            <div className="w-12 h-1.5 bg-gray-100 rounded-full overflow-hidden">
              <div 
                className={cn("h-full transition-all duration-1000", agent.confidence > 90 ? "bg-emerald-500" : agent.confidence > 70 ? "bg-blue-500" : "bg-amber-500")} 
                style={{ width: `${agent.confidence}%` }}
              />
            </div>
          </div>
        </div>
        <div className="flex items-center gap-1 text-gray-400">
          <Clock className="w-3 h-3" />
          <span>{agent.lastUpdated}</span>
        </div>
      </div>
    </div>
  );
}
