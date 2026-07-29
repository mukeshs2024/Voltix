"use client";

import React from "react";
import { Building2, Clock, Play, ShieldAlert, Sparkles, Zap } from "lucide-react";
import { SimulationScenario } from "@/lib/agent-workbench";
import { cn } from "@/lib/utils";

interface ScenarioCardProps {
  scenario: SimulationScenario;
  onStart: (scenario: SimulationScenario) => void;
  isStarting?: boolean;
}

export function ScenarioCard({ scenario, onStart, isStarting = false }: ScenarioCardProps) {
  const getDifficultyBadge = (difficulty: string) => {
    switch (difficulty) {
      case "Low":
        return "bg-emerald-50 text-emerald-700 border-emerald-200";
      case "Medium":
        return "bg-blue-50 text-blue-700 border-blue-200";
      case "High":
        return "bg-amber-50 text-amber-700 border-amber-200";
      case "Extreme":
        return "bg-red-50 text-red-700 border-red-200";
      default:
        return "bg-gray-50 text-gray-700 border-gray-200";
    }
  };

  return (
    <div className="bg-white rounded-xl border border-[#E5E7EB] p-5 shadow-xs hover:border-gray-300 transition-all flex flex-col justify-between h-full group">
      <div>
        {/* Card Header: Category & Difficulty */}
        <div className="flex items-center justify-between gap-2 mb-3">
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-gray-100 text-gray-700">
            <Zap className="w-3 h-3 text-blue-600" />
            {scenario.badge}
          </span>
          <span
            className={cn(
              "px-2.5 py-0.5 rounded-full text-[11px] font-semibold border",
              getDifficultyBadge(scenario.difficulty)
            )}
          >
            {scenario.difficulty} Difficulty
          </span>
        </div>

        {/* Title */}
        <h3 className="font-semibold text-gray-900 text-[16px] leading-snug tracking-tight mb-1.5 group-hover:text-blue-600 transition-colors">
          {scenario.name}
        </h3>

        {/* Description */}
        <p className="text-[13px] text-gray-500 leading-normal mb-4 line-clamp-2">
          {scenario.description}
        </p>
      </div>

      <div>
        {/* Metadata Details Grid */}
        <div className="pt-3 mb-4 border-t border-gray-100 grid grid-cols-2 gap-2 text-[12px] text-gray-600">
          <div className="flex items-center gap-1.5 truncate">
            <Building2 className="w-3.5 h-3.5 text-gray-400 shrink-0" />
            <span className="truncate">{scenario.buildingType}</span>
          </div>
          <div className="flex items-center gap-1.5 justify-end">
            <Clock className="w-3.5 h-3.5 text-gray-400 shrink-0" />
            <span>~{scenario.durationMinutes} mins</span>
          </div>
        </div>

        {/* Start Simulation Button */}
        <button
          onClick={() => onStart(scenario)}
          disabled={isStarting}
          className="w-full h-[38px] px-4 bg-[#111827] text-white text-[13px] font-medium rounded-lg hover:bg-gray-800 focus:outline-none transition-colors flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed shadow-xs"
        >
          {isStarting ? (
            <>
              <div className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              <span>Launching...</span>
            </>
          ) : (
            <>
              <Play className="w-3.5 h-3.5 fill-current" />
              <span>Start Simulation</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
}
