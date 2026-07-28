"use client";

import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Building2, Activity, Zap, Users, ArrowRight } from "lucide-react";
import { StatusBadge } from "@/components/shared/status-badge";
import { Building } from "@/types";
import { motion } from "framer-motion";

interface BuildingCardProps {
  building: Building;
  onClick: (building: Building) => void;
  index: number;
}

export function BuildingCard({ building, onClick, index }: BuildingCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.05 }}
      whileHover={{ y: -4 }}
    >
      <Card 
        hoverable 
        className="h-full cursor-pointer overflow-hidden border-[#E5E7EB] hover:border-[#D1D5DB] transition-all"
        onClick={() => onClick(building)}
      >
        <CardContent className="p-0">
          <div className="p-5">
            <div className="flex justify-between items-start mb-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#F3F4F6] to-[#E5E7EB] border border-[#D1D5DB] flex items-center justify-center shrink-0 shadow-inner">
                  <Building2 className="w-6 h-6 text-[#4B5563]" />
                </div>
                <div>
                  <h3 className="font-bold text-[#111827] text-lg tracking-tight">{building.name}</h3>
                  <p className="text-sm text-[#6B7280] font-medium">{building.location}</p>
                </div>
              </div>
              <StatusBadge status={building.status} />
            </div>

            <div className="grid grid-cols-3 gap-4 py-4 border-y border-[#E5E7EB] bg-[#FAFAFA] -mx-5 px-5">
              <div className="flex flex-col">
                <span className="text-[10px] uppercase font-bold text-[#6B7280] flex items-center gap-1 mb-1">
                  <Activity className="w-3 h-3" /> Score
                </span>
                <span className="text-lg font-bold text-[#111827]">{building.energyScore}</span>
              </div>
              <div className="flex flex-col">
                <span className="text-[10px] uppercase font-bold text-[#6B7280] flex items-center gap-1 mb-1">
                  <Zap className="w-3 h-3" /> Load
                </span>
                <span className="text-lg font-bold text-[#111827]">
                  {(building.areaSqFt * 0.012).toFixed(1)} <span className="text-xs text-[#6B7280] font-medium">MW</span>
                </span>
              </div>
              <div className="flex flex-col">
                <span className="text-[10px] uppercase font-bold text-[#6B7280] flex items-center gap-1 mb-1">
                  <Users className="w-3 h-3" /> Occ.
                </span>
                <span className="text-lg font-bold text-[#111827]">{building.occupancyRate}%</span>
              </div>
            </div>

            <div className="pt-4 flex items-center justify-between">
              <div className="flex items-center gap-2">
                {building.activeAlerts > 0 ? (
                  <Badge variant="danger" className="text-[10px]">
                    {building.activeAlerts} Active Alerts
                  </Badge>
                ) : (
                  <Badge variant="success" className="text-[10px] bg-[#22C55E]/10 text-[#15803D]">
                    All Systems Nominal
                  </Badge>
                )}
              </div>
              <Button variant="ghost" size="sm" className="h-8 gap-1 text-[#4B5563] hover:text-[#111827]">
                View Details <ArrowRight className="w-3.5 h-3.5" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
