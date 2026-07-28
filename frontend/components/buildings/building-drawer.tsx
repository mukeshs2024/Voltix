"use client";

import React from "react";
import { Building } from "@/types";
import { Building2, MapPin, Activity, Zap, Users, AlertTriangle, Fan, Lightbulb, Battery, Cpu } from "lucide-react";
import { Button } from "@/components/ui/button";
import { StatusBadge } from "@/components/shared/status-badge";
import { Drawer } from "@/components/shared/drawer";

interface BuildingDrawerProps {
  building: Building | null;
  isOpen: boolean;
  onClose: () => void;
}

export function BuildingDrawer({ building, isOpen, onClose }: BuildingDrawerProps) {
  if (!building) return null;

  const headerIcon = <Building2 className="w-6 h-6 text-[#111827]" />;
  
  const titleContent = (
    <div>
      <h2 className="text-lg font-bold text-[#111827]">{building.name}</h2>
      <p className="text-sm text-[#6B7280] flex items-center gap-1 mt-0.5 font-normal">
        <MapPin className="w-3.5 h-3.5" />
        {building.location}
      </p>
    </div>
  );

  const footer = (
    <>
      <Button variant="outline" className="flex-1">Download Report</Button>
      <Button variant="primary" className="flex-1 bg-[#111827] hover:bg-[#374151] text-white border-none">
        <Zap className="w-4 h-4 mr-2" /> Optimize
      </Button>
    </>
  );

  return (
    <Drawer
      isOpen={isOpen}
      onClose={onClose}
      title={titleContent}
      headerIcon={headerIcon}
      footer={footer}
    >
      {/* Quick Stats */}
      <div>
        <h3 className="text-xs font-bold text-[#6B7280] uppercase tracking-wider mb-4">Core Metrics</h3>
        <div className="grid grid-cols-2 gap-4">
          <div className="p-4 rounded-xl border border-[#E5E7EB] bg-[#FAFAFA]">
            <div className="flex items-center gap-2 mb-2">
              <Activity className="w-4 h-4 text-[#6B7280]" />
              <span className="text-xs font-semibold text-[#6B7280]">Health Score</span>
            </div>
            <div className="text-2xl font-bold text-[#111827]">{building.energyScore}/100</div>
          </div>
          <div className="p-4 rounded-xl border border-[#E5E7EB] bg-[#FAFAFA]">
            <div className="flex items-center gap-2 mb-2">
              <Zap className="w-4 h-4 text-[#6B7280]" />
              <span className="text-xs font-semibold text-[#6B7280]">Current Load</span>
            </div>
            <div className="text-2xl font-bold text-[#111827]">{(building.areaSqFt * 0.012).toFixed(1)} MW</div>
          </div>
          <div className="p-4 rounded-xl border border-[#E5E7EB] bg-[#FAFAFA]">
            <div className="flex items-center gap-2 mb-2">
              <Users className="w-4 h-4 text-[#6B7280]" />
              <span className="text-xs font-semibold text-[#6B7280]">Occupancy</span>
            </div>
            <div className="text-2xl font-bold text-[#111827]">{building.occupancyRate}%</div>
          </div>
          <div className="p-4 rounded-xl border border-[#E5E7EB] bg-[#FAFAFA] flex flex-col justify-center">
            <span className="text-xs font-semibold text-[#6B7280] mb-2">System Status</span>
            <div>
              <StatusBadge status={building.status} />
            </div>
          </div>
        </div>
      </div>

      {/* Map Placeholder */}
      <div>
        <h3 className="text-xs font-bold text-[#6B7280] uppercase tracking-wider mb-4">Floorplan View</h3>
        <div className="w-full h-48 bg-[#F3F4F6] rounded-xl border border-[#E5E7EB] relative overflow-hidden flex flex-col items-center justify-center">
          <div className="absolute inset-0 opacity-20" style={{ backgroundImage: 'radial-gradient(#6B7280 1px, transparent 1px)', backgroundSize: '16px 16px' }} />
          <MapPin className="w-8 h-8 text-[#9CA3AF] mb-2 z-10" />
          <span className="text-sm font-semibold text-[#9CA3AF] z-10">Map Integration Offline</span>
        </div>
      </div>

      {/* Equipment Status */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xs font-bold text-[#6B7280] uppercase tracking-wider">Equipment Status</h3>
          <span className="text-xs font-medium text-[#22C55E]">All Nominal</span>
        </div>
        <div className="space-y-3">
          {[
            { name: "HVAC Systems", icon: Fan, status: "Optimal", draw: "450 kW" },
            { name: "Lighting Control", icon: Lightbulb, status: "Optimal", draw: "120 kW" },
            { name: "Server Infrastructure", icon: Cpu, status: "Optimal", draw: "380 kW" },
            { name: "Battery Storage", icon: Battery, status: "Charging", draw: "-50 kW" }
          ].map((eq, i) => (
            <div key={i} className="flex items-center justify-between p-3 rounded-lg border border-[#E5E7EB] hover:bg-[#FAFAFA] transition-colors">
              <div className="flex items-center gap-3">
                <div className="p-1.5 bg-[#F3F4F6] rounded-md">
                  <eq.icon className="w-4 h-4 text-[#4B5563]" />
                </div>
                <span className="text-sm font-semibold text-[#111827]">{eq.name}</span>
              </div>
              <div className="flex flex-col items-end">
                <span className="text-xs font-semibold text-[#22C55E]">{eq.status}</span>
                <span className="text-[10px] text-[#6B7280]">{eq.draw}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Active Alerts */}
      {building.activeAlerts > 0 && (
        <div>
          <h3 className="text-xs font-bold text-[#EF4444] uppercase tracking-wider mb-4 flex items-center gap-1.5">
            <AlertTriangle className="w-3.5 h-3.5" /> 
            Active Incidents ({building.activeAlerts})
          </h3>
          <div className="p-4 rounded-xl border border-[#EF4444]/20 bg-[#EF4444]/5">
            <p className="text-sm text-[#B91C1C] font-medium">
              Action required. Check the Alerts dashboard for detailed incident reports regarding this facility.
            </p>
            <Button variant="danger" size="sm" className="mt-3 w-full">
              View Incidents
            </Button>
          </div>
        </div>
      )}
    </Drawer>
  );
}
