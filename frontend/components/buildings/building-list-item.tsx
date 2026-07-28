"use client";

import React from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Building2, Activity, Zap, Users, MoreHorizontal } from "lucide-react";
import { StatusBadge } from "@/components/shared/status-badge";
import { Building } from "@/types";
import { motion } from "framer-motion";

interface BuildingListItemProps {
  building: Building;
  onClick: (building: Building) => void;
  index: number;
}

export function BuildingListItem({ building, onClick, index }: BuildingListItemProps) {
  return (
    <motion.div
      initial={{ opacity: 0, x: -15 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.3, delay: index * 0.03 }}
    >
      <div 
        onClick={() => onClick(building)}
        className="flex items-center justify-between p-4 bg-white border border-[#E5E7EB] rounded-[16px] hover:border-[#D1D5DB] hover:shadow-sm transition-all cursor-pointer group mb-3"
      >
        <div className="flex items-center gap-4 flex-1">
          <div className="w-10 h-10 rounded-lg bg-[#F3F4F6] border border-[#E5E7EB] flex items-center justify-center shrink-0">
            <Building2 className="w-5 h-5 text-[#6B7280]" />
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-[#111827] text-sm truncate">{building.name}</h3>
            <p className="text-xs text-[#6B7280] truncate">{building.location}</p>
          </div>
        </div>

        <div className="hidden md:flex items-center gap-8 flex-1 justify-center">
          <div className="flex flex-col items-center">
            <span className="text-[10px] uppercase font-bold text-[#6B7280] flex items-center gap-1 mb-0.5">
              <Activity className="w-3 h-3" /> Score
            </span>
            <span className="text-sm font-bold text-[#111827]">{building.energyScore}</span>
          </div>
          <div className="flex flex-col items-center">
            <span className="text-[10px] uppercase font-bold text-[#6B7280] flex items-center gap-1 mb-0.5">
              <Zap className="w-3 h-3" /> Load
            </span>
            <span className="text-sm font-bold text-[#111827]">
              {(building.areaSqFt * 0.012).toFixed(1)} <span className="text-[10px] text-[#6B7280]">MW</span>
            </span>
          </div>
          <div className="flex flex-col items-center">
            <span className="text-[10px] uppercase font-bold text-[#6B7280] flex items-center gap-1 mb-0.5">
              <Users className="w-3 h-3" /> Occ.
            </span>
            <span className="text-sm font-bold text-[#111827]">{building.occupancyRate}%</span>
          </div>
        </div>

        <div className="flex items-center justify-end gap-6 flex-1">
          <div className="hidden lg:block">
            {building.activeAlerts > 0 ? (
              <Badge variant="danger" className="text-[10px]">
                {building.activeAlerts} Alerts
              </Badge>
            ) : (
              <Badge variant="success" className="text-[10px] bg-[#22C55E]/10 text-[#15803D]">
                Nominal
              </Badge>
            )}
          </div>
          <StatusBadge status={building.status} />
          <Button variant="ghost" size="sm" className="h-8 w-8 p-0 text-[#6B7280] group-hover:text-[#111827]">
            <MoreHorizontal className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </motion.div>
  );
}
