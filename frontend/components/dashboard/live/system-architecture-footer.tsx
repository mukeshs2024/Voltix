"use client";

import React from "react";
import { ArrowRight, Box, Cpu, Database, Network, Target, Settings, GitMerge, RotateCcw } from "lucide-react";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

export type ArchitectureModule = 
  | "scenario"
  | "sim_engine"
  | "sensors"
  | "twin_read"
  | "agents"
  | "consensus"
  | "optimization"
  | "twin_write"
  | "dashboard";

interface SystemArchitectureFooterProps {
  activeModule?: ArchitectureModule;
}

export function SystemArchitectureFooter({ activeModule = "scenario" }: SystemArchitectureFooterProps) {
  const modules: { id: ArchitectureModule; label: string; icon: React.ElementType }[] = [
    { id: "scenario", label: "Scenario", icon: Box },
    { id: "sim_engine", label: "Simulation Engine", icon: Cpu },
    { id: "sensors", label: "Sensor Engine", icon: Target },
    { id: "twin_read", label: "Digital Twin", icon: Database },
    { id: "agents", label: "Agent Network", icon: Network },
    { id: "consensus", label: "Consensus", icon: GitMerge },
    { id: "optimization", label: "Optimization Engine", icon: Settings },
    { id: "twin_write", label: "Digital Twin", icon: Database },
    { id: "dashboard", label: "Dashboard UI", icon: Box },
  ];

  return (
    <div className="bg-gray-900 rounded-xl border border-gray-800 p-4 shadow-lg text-white mt-5">
      <div className="flex items-center gap-2 mb-4 pb-2 border-b border-gray-800">
        <Network className="w-4 h-4 text-emerald-400" />
        <h3 className="text-[12px] font-bold text-gray-100 uppercase tracking-wider">System Architecture Active Flow</h3>
      </div>
      
      <div className="flex items-center justify-between px-2 pb-2">
        {modules.map((mod, i) => {
          const isActive = activeModule === mod.id;
          const Icon = mod.icon;
          return (
            <React.Fragment key={i}>
              <div className="flex flex-col items-center gap-2 relative z-10 w-24">
                <div className={cn(
                  "w-10 h-10 rounded-xl flex items-center justify-center transition-all duration-300 relative",
                  isActive ? "bg-emerald-500 text-white shadow-[0_0_15px_rgba(16,185,129,0.5)] scale-110" : "bg-gray-800 text-gray-400"
                )}>
                  <Icon className="w-5 h-5 relative z-10" />
                  {isActive && (
                    <span className="absolute inset-0 rounded-xl border-2 border-emerald-400 animate-ping opacity-50" />
                  )}
                </div>
                <span className={cn(
                  "text-[10px] font-bold text-center leading-tight transition-colors duration-300",
                  isActive ? "text-emerald-400" : "text-gray-500"
                )}>
                  {mod.label}
                </span>
              </div>
              
              {i < modules.length - 1 && (
                <div className="flex-1 h-0.5 bg-gray-800 relative mx-1">
                  {/* Arrow overlay */}
                  <ArrowRight className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-4 h-4 text-gray-700" />
                </div>
              )}
            </React.Fragment>
          );
        })}

        {/* Repeat icon at the end pointing back mentally */}
        <div className="flex-1 h-0.5 bg-gray-800 relative mx-1 border-t border-dashed border-gray-700">
          <RotateCcw className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-4 h-4 text-gray-700" />
        </div>
        
        <div className="flex flex-col items-center gap-2 relative z-10 w-20">
          <div className="w-10 h-10 rounded-xl bg-gray-800 text-gray-400 flex items-center justify-center">
             <RotateCcw className="w-5 h-5" />
          </div>
          <span className="text-[10px] font-bold text-gray-500 text-center leading-tight">
            Repeat
          </span>
        </div>
      </div>
    </div>
  );
}
