"use client";

import React from "react";
import { Sparkles, Info, Target, Zap, Database, Users, XCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";

export interface ExplainabilityData {
  decision: string;
  reasons: string[];
  dataUsed: string[];
  contributingAgents: string[];
  rejectedAlternatives: string[];
  confidence: number;
  expectedImpact: string;
}

interface AIExplainabilityPanelProps {
  data?: ExplainabilityData;
}

export function AIExplainabilityPanel({ data }: AIExplainabilityPanelProps) {
  return (
    <div className="bg-white rounded-xl border border-[#E5E7EB] p-5 shadow-xs flex flex-col justify-between h-full">
      {/* Header */}
      <div className="flex items-center justify-between gap-2 mb-4 pb-3 border-b border-gray-100">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-blue-50 flex items-center justify-center text-blue-600 border border-blue-100">
            <Sparkles className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-[15px] font-bold text-gray-900 leading-none">AI Explainability</h3>
            <span className="text-[11px] text-gray-500 font-medium">Transparent Neural Reasoning</span>
          </div>
        </div>
      </div>

      <div className="flex-1 flex flex-col relative min-h-[220px]">
        <AnimatePresence mode="popLayout">
          {data ? (
            <motion.div
              key="content"
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 10 }}
              className="flex-1 flex flex-col gap-3 overflow-y-auto pr-1"
              style={{ scrollbarWidth: "thin" }}
            >
              {/* Decision */}
              <div className="bg-blue-50/50 p-2.5 rounded-lg border border-blue-100">
                <span className="text-[10px] font-bold uppercase tracking-wider text-blue-800 flex items-center gap-1 mb-1">
                  <Target className="w-3 h-3" /> Selected Optimization
                </span>
                <span className="text-[13px] font-bold text-gray-900 leading-tight block mb-1.5">{data.decision}</span>
                <div className="flex items-center gap-1.5 text-[11px]">
                  <span className="font-semibold text-gray-500 uppercase">Expected Impact:</span>
                  <span className="font-bold text-emerald-600">{data.expectedImpact}</span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                {/* Because */}
                <div className="bg-gray-50 p-2.5 rounded-lg border border-gray-100">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-gray-600 flex items-center gap-1 mb-1.5">
                    <Info className="w-3 h-3" /> Core Drivers
                  </span>
                  <ul className="space-y-1.5">
                    {data.reasons.map((reason, idx) => (
                      <li key={idx} className="text-[11px] text-gray-700 leading-tight flex items-start gap-1.5">
                        <Zap className="w-3 h-3 text-amber-500 shrink-0" />
                        {reason}
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Rejected Alternatives */}
                <div className="bg-gray-50 p-2.5 rounded-lg border border-gray-100">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-gray-600 flex items-center gap-1 mb-1.5">
                    <XCircle className="w-3 h-3" /> Rejected Alternatives
                  </span>
                  <ul className="space-y-1.5">
                    {data.rejectedAlternatives.map((alt, idx) => (
                      <li key={idx} className="text-[11px] text-gray-700 leading-tight flex items-start gap-1.5 opacity-70">
                        <XCircle className="w-3 h-3 text-red-400 shrink-0" />
                        <span className="line-through">{alt}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                {/* Data Used */}
                <div className="bg-gray-50 p-2.5 rounded-lg border border-gray-100">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-gray-600 flex items-center gap-1 mb-1.5">
                    <Database className="w-3 h-3" /> Data Signals Used
                  </span>
                  <div className="flex flex-wrap gap-1">
                    {data.dataUsed.map((d, i) => (
                      <span key={i} className="text-[9px] font-bold bg-white border border-gray-200 px-1.5 py-0.5 rounded text-gray-600">
                        {d}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Contributing Agents */}
                <div className="bg-gray-50 p-2.5 rounded-lg border border-gray-100">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-gray-600 flex items-center gap-1 mb-1.5">
                    <Users className="w-3 h-3" /> Contributing Agents
                  </span>
                  <div className="flex flex-wrap gap-1">
                    {data.contributingAgents.map((a, i) => (
                      <span key={i} className="text-[9px] font-bold bg-blue-50 border border-blue-200 px-1.5 py-0.5 rounded text-blue-700">
                        {a}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between border-t border-gray-100 pt-2 text-[11px] mt-auto">
                <span className="font-semibold text-gray-500 uppercase tracking-wider">System Confidence</span>
                <span className="font-bold text-emerald-600">{data.confidence}%</span>
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="empty"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 flex items-center justify-center border-2 border-dashed border-gray-100 rounded-lg bg-gray-50/50"
            >
              <span className="text-xs text-gray-400 font-medium">Awaiting optimization decision...</span>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
