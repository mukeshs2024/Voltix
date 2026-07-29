"use client";

import React from "react";
import { CheckCircle2, ShieldCheck, TrendingDown, Clock, Activity } from "lucide-react";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";

export interface ConsensusVote {
  agentName: string;
  status: "Waiting" | "Pending" | "Requested Change" | "Modified" | "Approved";
}

export interface ConsensusData {
  status?: string;
  progress?: number;
  iteration?: number;
  votes?: ConsensusVote[];
  pendingRecommendationsCount?: number;
  acceptedPlanTitle?: string;
  acceptedPlanDetail?: string;
  optimizationSummary?: string;
  expectedSavingsPct?: number;
  expectedSavingsUSD?: number;
}

interface ConsensusPanelProps {
  data?: ConsensusData;
}

export function ConsensusPanel({ data }: ConsensusPanelProps) {
  const pendingCount = data?.pendingRecommendationsCount ?? 0;
  const progress = data?.progress ?? 0;
  const votes = data?.votes ?? [];
  const planTitle = data?.acceptedPlanTitle ?? "";
  const planDetail = data?.acceptedPlanDetail ?? "";
  const summary = data?.optimizationSummary ?? "";
  const savingsPct = data?.expectedSavingsPct ?? 0;
  const savingsUSD = data?.expectedSavingsUSD ?? 0;

  const isComplete = progress === 100;

  return (
    <div className={cn(
      "bg-white rounded-xl border p-5 shadow-xs flex flex-col justify-between h-full transition-colors duration-500",
      isComplete ? "border-emerald-300" : "border-[#E5E7EB]"
    )}>
      {/* Header */}
      <div className="flex items-center justify-between gap-2 mb-4 pb-3 border-b border-gray-100">
        <div className="flex items-center gap-2">
          <div className={cn(
            "w-7 h-7 rounded-lg flex items-center justify-center text-white transition-colors duration-500",
            isComplete ? "bg-emerald-500" : "bg-gray-900"
          )}>
            <ShieldCheck className={cn("w-4 h-4", isComplete ? "text-white" : "text-emerald-400")} />
          </div>
          <div>
            <h3 className="text-[15px] font-bold text-gray-900 leading-none">Consensus Engine Panel</h3>
            <span className="text-[11px] text-gray-500 font-medium">Multi-Agent Voting & Governance</span>
          </div>
        </div>
        <span className={cn(
          "text-[11px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1 transition-colors duration-500",
          isComplete ? "text-emerald-700 bg-emerald-50 border border-emerald-200" : "text-amber-700 bg-amber-50 border border-amber-200"
        )}>
          {isComplete ? <><CheckCircle2 className="w-3 h-3" /> Consensus Reached</> : <><Clock className="w-3 h-3 animate-spin" /> Negotiating</>}
        </span>
      </div>

      <div className="space-y-3 flex-1 flex flex-col">
        
        {/* Consensus Progress & Votes */}
        <div className="bg-gray-50 rounded-lg border border-gray-200 p-3">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[11px] font-bold text-gray-600 uppercase tracking-wider">
              {data?.iteration ? `Consensus Iteration ${data.iteration}` : "Consensus Progress"}
            </span>
            <span className="font-bold text-blue-600 text-[12px]">{progress}%</span>
          </div>
          <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden mb-3">
            <div 
              className={cn("h-full transition-all duration-500", isComplete ? "bg-emerald-500" : "bg-blue-500")}
              style={{ width: `${progress}%` }}
            />
          </div>
          
          <div className="grid grid-cols-2 gap-1.5">
            {votes.map((vote, i) => {
              let statusColor = "text-gray-400";
              if (vote.status === "Approved") statusColor = "text-emerald-600";
              else if (vote.status === "Pending") statusColor = "text-amber-500";
              else if (vote.status === "Requested Change") statusColor = "text-red-500";
              else if (vote.status === "Modified") statusColor = "text-blue-500";

              return (
                <div key={i} className="flex justify-between items-center bg-white border border-gray-100 rounded px-2 py-1 text-[10px]">
                  <span className="font-semibold text-gray-700 truncate">{vote.agentName}</span>
                  <span className={cn("font-bold", statusColor)}>
                    {vote.status}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Content Area (Switches based on progress) */}
        <div className="flex-1 min-h-[90px] relative">
          <AnimatePresence mode="popLayout">
            {isComplete ? (
              <motion.div
                key="plan"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="bg-emerald-50/50 p-3 rounded-lg border border-emerald-200 h-full"
              >
                <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-700 block mb-1">
                  Accepted Operations Plan
                </span>
                <h4 className="text-[13px] font-bold text-gray-900 leading-tight mb-1.5">{planTitle}</h4>
                <p className="text-[12px] text-gray-600 leading-normal whitespace-pre-wrap">{planDetail}</p>
              </motion.div>
            ) : (
              <motion.div
                key="negotiating"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="flex items-center justify-center h-full border-2 border-dashed border-gray-200 rounded-lg bg-gray-50/50 text-gray-400 text-xs font-medium"
              >
                Awaiting 100% consensus to formulate plan...
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Expected Savings Read-Only */}
        <div className="pt-3 border-t border-gray-100 flex items-center justify-between">
          <div>
            <span className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider block">Expected Savings</span>
            <span className="text-[18px] font-bold text-emerald-600 leading-none transition-all duration-500">
              ${savingsUSD.toLocaleString()} <span className="text-[12px] font-semibold text-gray-500">({savingsPct}%)</span>
            </span>
          </div>
          <div className="w-8 h-8 rounded-lg bg-emerald-50 border border-emerald-200 flex items-center justify-center text-emerald-600">
            <TrendingDown className="w-4 h-4" />
          </div>
        </div>
      </div>
    </div>
  );
}
