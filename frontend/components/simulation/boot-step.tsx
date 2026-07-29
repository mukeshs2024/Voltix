"use client";

import React from "react";
import { CheckCircle2, Circle, AlertCircle, Loader2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

export type BootStepStatus = "pending" | "active" | "completed" | "failed";

export interface BootStepProps {
  label: string;
  status: BootStepStatus;
  detail?: string;
  stepNumber?: number;
}

export function BootStep({ label, status, detail, stepNumber }: BootStepProps) {
  return (
    <div
      className={cn(
        "flex items-center justify-between p-3.5 rounded-xl border transition-all duration-200",
        status === "completed" && "bg-emerald-50/40 border-emerald-200/60 text-gray-900",
        status === "active" && "bg-blue-50/50 border-blue-200 text-blue-900 shadow-xs",
        status === "pending" && "bg-white border-gray-100 text-gray-400 opacity-70",
        status === "failed" && "bg-red-50/50 border-red-200 text-red-900"
      )}
    >
      <div className="flex items-center gap-3 min-w-0">
        {/* Status Icon */}
        <div className="shrink-0 flex items-center justify-center">
          <AnimatePresence mode="wait">
            {status === "completed" && (
              <motion.div
                key="completed"
                initial={{ scale: 0.5, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.5, opacity: 0 }}
                transition={{ duration: 0.2 }}
              >
                <CheckCircle2 className="w-5 h-5 text-emerald-600 fill-emerald-100" />
              </motion.div>
            )}

            {status === "active" && (
              <motion.div
                key="active"
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.8, opacity: 0 }}
                transition={{ duration: 0.2 }}
              >
                <Loader2 className="w-5 h-5 text-blue-600 animate-spin" />
              </motion.div>
            )}

            {status === "pending" && (
              <motion.div
                key="pending"
                initial={{ opacity: 0.5 }}
                animate={{ opacity: 1 }}
              >
                <Circle className="w-5 h-5 text-gray-300 stroke-[1.5]" />
              </motion.div>
            )}

            {status === "failed" && (
              <motion.div
                key="failed"
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
              >
                <AlertCircle className="w-5 h-5 text-red-600" />
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Step Label & Detail */}
        <div className="min-w-0 flex flex-col">
          <span
            className={cn(
              "text-[14px] leading-tight tracking-tight",
              status === "completed" && "font-semibold text-gray-900",
              status === "active" && "font-semibold text-blue-900",
              status === "pending" && "font-medium text-gray-400",
              status === "failed" && "font-semibold text-red-900"
            )}
          >
            {label}
          </span>
          {detail && (
            <span className="text-[12px] text-gray-500 mt-0.5 truncate">{detail}</span>
          )}
        </div>
      </div>

      {/* Right Badge */}
      <div className="shrink-0 ml-3">
        {status === "completed" && (
          <span className="text-[11px] font-semibold text-emerald-700 bg-emerald-100/70 px-2 py-0.5 rounded-md">
            Done
          </span>
        )}
        {status === "active" && (
          <span className="text-[11px] font-semibold text-blue-700 bg-blue-100/70 px-2 py-0.5 rounded-md animate-pulse">
            Processing...
          </span>
        )}
        {status === "pending" && stepNumber && (
          <span className="text-[11px] font-medium text-gray-400">
            Step {stepNumber}
          </span>
        )}
      </div>
    </div>
  );
}
