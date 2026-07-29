"use client";

import React from "react";
import { Cpu, ShieldCheck, Zap } from "lucide-react";
import { motion } from "framer-motion";
import { BootStep, BootStepStatus } from "@/components/simulation/boot-step";

export interface BootStepItem {
  id: string;
  label: string;
  status: BootStepStatus;
  detail?: string;
}

export const MANDATORY_BOOT_STEPS: Omit<BootStepItem, "status">[] = [
  { id: "building_profile", label: "Loading Building Profile", detail: "Normalizing floor plans & thermal zones" },
  { id: "digital_twin", label: "Creating Digital Twin", detail: "Initializing physics state & boundary models" },
  { id: "virtual_sensors", label: "Starting Virtual Sensors", detail: "Connecting 120+ telemetry telemetry streams" },
  { id: "ai_agents", label: "Initializing AI Agents", detail: "Spawning 10 autonomous optimization agents" },
  { id: "consensus_engine", label: "Connecting Consensus Engine", detail: "Establishing multi-agent voting protocol" },
  { id: "starting_simulation", label: "Starting Simulation", detail: "Executing Digital Twin scenario runtime" },
];

interface BootSequenceScreenProps {
  steps?: BootStepItem[];
  title?: string;
  subtitle?: string;
  scenarioName?: string;
  onComplete?: () => void;
}

export function BootSequenceScreen({
  steps,
  title = "Initializing Autonomous Engine",
  subtitle = "Executing Digital Twin startup protocol driven by backend physics engine.",
  scenarioName,
  onComplete,
}: BootSequenceScreenProps) {
  const [currentStepIdx, setCurrentStepIdx] = React.useState(0);

  // If steps are passed from backend/parent, use them; otherwise default to mandatory 6 steps
  const activeSteps: BootStepItem[] = steps ?? MANDATORY_BOOT_STEPS.map((s, idx) => ({
    ...s,
    status: idx < currentStepIdx ? "completed" : idx === currentStepIdx ? "active" : "pending",
  }));

  React.useEffect(() => {
    if (currentStepIdx >= activeSteps.length) {
      const timeout = setTimeout(() => onComplete?.(), 600);
      return () => clearTimeout(timeout);
    }
    const timeout = setTimeout(() => {
      setCurrentStepIdx(s => s + 1);
    }, 700); // 700ms per step
    return () => clearTimeout(timeout);
  }, [currentStepIdx, activeSteps.length, onComplete]);

  const completedCount = activeSteps.filter((s) => s.status === "completed").length;
  const totalCount = activeSteps.length;
  const progressPercent = Math.round((completedCount / totalCount) * 100);

  return (
    <div className="min-h-[600px] w-full bg-gray-50/50 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="w-full max-w-xl bg-white rounded-2xl border border-[#E5E7EB] shadow-sm p-6 md:p-8"
      >
        {/* Header */}
        <div className="flex items-start justify-between gap-4 mb-6 pb-6 border-b border-gray-100">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-blue-50 text-blue-700 border border-blue-100">
                <Cpu className="w-3.5 h-3.5" /> Boot Sequence
              </span>
              {scenarioName && (
                <span className="text-[12px] font-semibold text-gray-700 bg-gray-100 px-2.5 py-0.5 rounded-full">
                  {scenarioName}
                </span>
              )}
            </div>
            <h2 className="text-[20px] font-bold text-gray-900 tracking-tight">{title}</h2>
            <p className="text-[13px] text-gray-500 leading-normal">{subtitle}</p>
          </div>

          <div className="w-10 h-10 rounded-xl bg-gray-900 flex items-center justify-center text-white shrink-0 shadow-sm">
            <Zap className="w-5 h-5 text-blue-400" />
          </div>
        </div>

        {/* Animated Progress Bar */}
        <div className="mb-6 space-y-2">
          <div className="flex justify-between items-center text-[12px] font-semibold">
            <span className="text-gray-700">System Initialization</span>
            <span className="text-blue-600 font-bold">{progressPercent}%</span>
          </div>

          <div className="h-2 w-full bg-gray-100 rounded-full overflow-hidden">
            <motion.div
              className="h-full bg-blue-600 rounded-full"
              initial={{ width: "0%" }}
              animate={{ width: `${progressPercent}%` }}
              transition={{ duration: 0.4, ease: "easeInOut" }}
            />
          </div>
        </div>

        {/* 6 Mandatory Boot Steps List */}
        <div className="space-y-2.5 mb-6">
          {activeSteps.map((step, idx) => (
            <BootStep
              key={step.id || idx}
              label={step.label}
              status={step.status}
              detail={step.detail}
              stepNumber={idx + 1}
            />
          ))}
        </div>

        {/* Footer Status */}
        <div className="pt-4 border-t border-gray-100 flex items-center justify-between text-[12px] text-gray-500">
          <div className="flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            <span>Encrypted Consensus Protocol</span>
          </div>
          <span>
            {completedCount} of {totalCount} Steps Completed
          </span>
        </div>
      </motion.div>
    </div>
  );
}
