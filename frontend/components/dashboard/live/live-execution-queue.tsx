"use client";

import React from "react";
import { Activity, Check, Circle, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";

export type PipelineStepId = 
  | "sensors_updated"
  | "twin_updated"
  | "occupancy_agent"
  | "hvac_agent"
  | "energy_agent"
  | "grid_agent"
  | "equipment_agent"
  | "consensus"
  | "optimization_applied"
  | "looping";

export interface QueueItem {
  id: PipelineStepId;
  label: string;
}

interface LiveExecutionQueueProps {
  activeStepId?: PipelineStepId;
  tick?: number;
}

const EXECUTION_STEPS: QueueItem[] = [
  { id: "sensors_updated", label: "Sensors Updated" },
  { id: "twin_updated", label: "Digital Twin Broadcast" },
  { id: "occupancy_agent", label: "Occupancy Agent" },
  { id: "hvac_agent", label: "HVAC Agent" },
  { id: "energy_agent", label: "Energy Agent" },
  { id: "grid_agent", label: "Grid Agent" },
  { id: "equipment_agent", label: "Equipment Agent" },
  { id: "consensus", label: "Consensus Engine" },
  { id: "optimization_applied", label: "Optimization Applied" },
];

export function LiveExecutionQueue({ activeStepId = "occupancy_agent", tick = 0 }: LiveExecutionQueueProps) {
  const activeIndex = EXECUTION_STEPS.findIndex(s => s.id === activeStepId);

  return (
    <div className="bg-white rounded-xl border border-[#E5E7EB] p-5 shadow-xs flex flex-col h-full">
      <div className="flex items-center justify-between gap-2 mb-4 pb-3 border-b border-gray-100">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-blue-50 flex items-center justify-center text-blue-600 border border-blue-100">
            <Activity className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-[15px] font-bold text-gray-900 leading-none">Live Execution Queue</h3>
            <span className="text-[11px] text-gray-500 font-medium">Tick #{tick}</span>
          </div>
        </div>
      </div>

      <div className="flex-1 flex flex-col overflow-y-auto pr-2 space-y-1.5" style={{ scrollbarWidth: "thin" }}>
        {EXECUTION_STEPS.map((step, idx) => {
          const isActive = idx === activeIndex;
          const isCompleted = idx < activeIndex || (activeIndex === -1 && activeStepId === "looping");

          return (
            <motion.div
              key={step.id}
              layout
              className={cn(
                "flex items-center gap-3 p-2.5 rounded-lg border transition-all duration-300",
                isActive ? "bg-blue-50 border-blue-200 shadow-sm" : 
                isCompleted ? "bg-gray-50/50 border-transparent" : "bg-white border-transparent opacity-60"
              )}
            >
              <div className="shrink-0">
                {isActive ? (
                  <Loader2 className="w-4 h-4 text-blue-500 animate-spin" />
                ) : isCompleted ? (
                  <Check className="w-4 h-4 text-emerald-500" />
                ) : (
                  <Circle className="w-4 h-4 text-gray-300" />
                )}
              </div>
              <div className="flex-1 min-w-0">
                <span className={cn(
                  "text-[13px] font-semibold block truncate transition-colors",
                  isActive ? "text-blue-900" : isCompleted ? "text-gray-600" : "text-gray-400"
                )}>
                  {step.label}
                </span>
                {isActive && (
                  <motion.div 
                    initial={{ width: "0%" }}
                    animate={{ width: "100%" }}
                    transition={{ duration: 1.5, repeat: Infinity }}
                    className="h-1 bg-blue-500/20 rounded-full mt-1 overflow-hidden"
                  >
                    <div className="h-full bg-blue-500 rounded-full w-[40%]" />
                  </motion.div>
                )}
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
