"use client";

import React from "react";
import { CheckCircle2, Circle, ArrowDown, Play } from "lucide-react";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

export type PipelineStepId = 
  | "scenario_running"
  | "sensors_updated"
  | "twin_updated"
  | "agents_analyzing"
  | "agents_communicating"
  | "consensus"
  | "optimization_applied"
  | "looping";

export interface PipelineStep {
  id: PipelineStepId;
  label: string;
}

const PIPELINE_STEPS: PipelineStep[] = [
  { id: "scenario_running", label: "Scenario Running" },
  { id: "sensors_updated", label: "Sensor Simulation Updated" },
  { id: "twin_updated", label: "Digital Twin Broadcast" },
  { id: "agents_analyzing", label: "Agent Analysis" },
  { id: "agents_communicating", label: "Agent Communication" },
  { id: "consensus", label: "Consensus Negotiation" },
  { id: "optimization_applied", label: "Optimization Applied" },
  { id: "looping", label: "Cycle Complete" },
];

interface AIExecutionPipelineProps {
  activeStepId?: PipelineStepId;
  tick?: number;
}

export function AIExecutionPipeline({ activeStepId = "scenario_running", tick = 0 }: AIExecutionPipelineProps) {
  const activeIndex = PIPELINE_STEPS.findIndex(s => s.id === activeStepId);
  
  return (
    <div className="bg-white rounded-xl border border-[#E5E7EB] p-5 shadow-xs flex flex-col h-full overflow-hidden">
      <div className="flex items-center gap-2 mb-4">
        <Play className="w-5 h-5 text-blue-600" />
        <h3 className="font-semibold text-gray-900">AI Execution Pipeline</h3>
      </div>
      
      <div className="flex-1 overflow-y-auto pr-2 relative" style={{ scrollbarWidth: "none" }}>
        {/* Animated Background Line */}
        <div className="absolute left-3.5 top-2 bottom-6 w-0.5 bg-gray-100 z-0" />
        
        {PIPELINE_STEPS.map((step, idx) => {
          const isActive = idx === activeIndex;
          const isPast = idx < activeIndex;
          
          return (
            <div key={step.id} className="relative z-10 flex flex-col items-start mb-1">
              <div className="flex items-center gap-3 py-2 w-full">
                <div className={cn(
                  "relative flex items-center justify-center w-7 h-7 rounded-full bg-white border-2 transition-colors duration-500",
                  isActive ? "border-blue-500 shadow-[0_0_10px_rgba(59,130,246,0.5)]" : isPast ? "border-green-500" : "border-gray-200"
                )}>
                  {isPast ? (
                    <CheckCircle2 className="w-4 h-4 text-green-500" />
                  ) : isActive ? (
                    <motion.div
                      animate={{ scale: [1, 1.2, 1] }}
                      transition={{ repeat: Infinity, duration: 1.5 }}
                      className="w-2.5 h-2.5 bg-blue-500 rounded-full"
                    />
                  ) : (
                    <Circle className="w-2.5 h-2.5 text-gray-300" />
                  )}
                </div>
                
                <span className={cn(
                  "text-sm font-medium transition-colors duration-500",
                  isActive ? "text-blue-700" : isPast ? "text-gray-900" : "text-gray-400"
                )}>
                  {step.label}
                </span>
              </div>
              
              {/* Arrow downwards except last item */}
              {idx < PIPELINE_STEPS.length - 1 && (
                <div className="pl-[11px] py-1">
                  <ArrowDown className={cn(
                    "w-4 h-4 transition-colors duration-500",
                    isPast ? "text-green-400" : "text-gray-200"
                  )} />
                </div>
              )}
            </div>
          );
        })}
      </div>
      
      <div className="mt-4 pt-3 border-t border-gray-100 flex items-center justify-between text-xs text-gray-500">
        <span>Continuous Loop</span>
        <span>Tick #{tick}</span>
      </div>
    </div>
  );
}
