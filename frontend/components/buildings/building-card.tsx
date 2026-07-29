"use client";

import React from "react";
import { Building2 } from "lucide-react";
import { StatusBadge } from "@/components/shared/status-badge";
import { Building } from "@/types";
import { motion } from "framer-motion";

interface BuildingCardProps {
  building: Building;
  onClick: (building: Building) => void;
  index: number;
}

function MetricItem({ 
  label, 
  value, 
  unit, 
  centered = false 
}: { 
  label: string; 
  value: string | number; 
  unit?: string;
  centered?: boolean;
}) {
  return (
    <div className={`flex flex-col ${centered ? 'items-center text-center' : 'items-start text-left'}`}>
      <span className="text-[12px] font-medium text-gray-500 mb-1">{label}</span>
      <span className="text-[30px] leading-none font-bold text-gray-900 tracking-tight whitespace-nowrap">
        {value}
      </span>
      {unit && <span className="text-[12px] font-medium text-gray-500 mt-1">{unit}</span>}
    </div>
  );
}

export function BuildingCard({ building, onClick, index }: BuildingCardProps) {
  // Remove unnecessary decimals and add comma separation
  const energyKw = Math.round(building.areaSqFt * 0.012).toLocaleString();

  // Derive system status text from active alerts and overall status
  const systemStatus = building.status === "OPTIMAL" 
    ? "Healthy" 
    : building.status === "ATTENTION_REQUIRED" 
      ? "Warning" 
      : building.status === "CRITICAL" 
        ? "Critical" 
        : "Monitoring";
  
  const statusColor = building.status === "OPTIMAL" 
    ? "text-emerald-600" 
    : building.status === "ATTENTION_REQUIRED" 
      ? "text-orange-600" 
      : building.status === "CRITICAL" 
        ? "text-red-600" 
        : "text-gray-600";

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.05 }}
      whileHover={{ y: -2 }}
    >
      <div 
        className="bg-white rounded-[14px] border border-[#E5E7EB] shadow-sm cursor-pointer hover:border-gray-300 transition-all flex flex-col h-full"
        onClick={() => onClick(building)}
      >
        <div className="p-[20px] flex-1 flex flex-col">
          {/* Header */}
          <div className="flex justify-between items-start mb-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-gray-50 border border-gray-200 flex items-center justify-center shrink-0">
                <Building2 className="w-5 h-5 text-gray-600" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 text-[18px] leading-tight tracking-tight">{building.name}</h3>
                <p className="text-[14px] text-gray-500">{building.location}</p>
              </div>
            </div>
            <StatusBadge status={building.status} />
          </div>

          {/* Metrics */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-[20px] items-start mb-6">
            <MetricItem label="AI Score" value={building.energyScore} />
            <MetricItem label="Energy" value={energyKw} unit="kW" />
            <MetricItem label="Occupancy" value={`${building.occupancyRate}%`} />
            <MetricItem label="Alerts" value={building.activeAlerts} centered={true} />
          </div>

          {/* Bottom Section */}
          <div className="mt-auto pt-4 border-t border-gray-100 flex items-center justify-between">
            <div className="flex items-center gap-1.5">
              <div className={`w-2 h-2 rounded-full ${building.status === "OPTIMAL" ? "bg-emerald-500" : building.status === "ATTENTION_REQUIRED" ? "bg-orange-500" : building.status === "CRITICAL" ? "bg-red-500" : "bg-gray-400"}`} />
              <span className={`text-[12px] font-medium ${statusColor}`}>
                {systemStatus}
              </span>
            </div>
            <button
              className="h-[36px] px-3 flex items-center gap-1.5 bg-white border border-gray-200 rounded-md text-[13px] font-medium text-gray-700 hover:bg-gray-50 hover:text-gray-900 transition-colors focus:outline-none"
              onClick={(event) => {
                event.stopPropagation();
                onClick(building);
              }}
            >
              View Details <span className="text-gray-400">→</span>
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
