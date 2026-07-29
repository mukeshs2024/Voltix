"use client";

import React from "react";
import { Building2 } from "lucide-react";
import { PowerFlow, PowerFlowProps } from "@/components/dashboard/live/power-flow";
import { cn } from "@/lib/utils";

export interface DigitalTwinPanelProps extends PowerFlowProps {
  broadcasting?: boolean;
}

export function DigitalTwinPanel({
  buildingName = "HQ Tower One",
  solarKw = 450,
  batteryKw = 120,
  gridKw = 930,
  loadKw = 1380,
  broadcasting = false,
}: DigitalTwinPanelProps) {
  const zones = [
    { name: "Lobby & Entrance", temp: "22.1°C", occ: "85%", status: "Optimal", color: "bg-emerald-500" },
    { name: "Executive Suite", temp: "21.8°C", occ: "40%", status: "Optimal", color: "bg-emerald-500" },
    { name: "Server Room A", temp: "19.5°C", occ: "5%", status: "Cooling Max", color: "bg-blue-500" },
    { name: "Open Workspace B", temp: "23.4°C", occ: "92%", status: "High Demand", color: "bg-amber-500" },
  ];

  const distribution = [
    { label: "HVAC", pct: 45, color: "bg-sky-500" },
    { label: "Lighting", pct: 15, color: "bg-yellow-500" },
    { label: "Equipment", pct: 25, color: "bg-indigo-500" },
    { label: "Plug & Misc", pct: 15, color: "bg-purple-500" },
  ];

  return (
    <div className={cn("bg-white rounded-xl border p-5 shadow-xs flex flex-col justify-between h-full relative overflow-hidden", broadcasting ? "border-blue-400" : "border-[#E5E7EB]")}>
      
      {/* Broadcast Overlay Animation */}
      {broadcasting && (
        <div className="absolute inset-0 pointer-events-none overflow-hidden z-10 rounded-xl">
          <div className="absolute inset-0 bg-blue-500/10 animate-pulse" />
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-blue-500 to-transparent opacity-70 animate-[slide_2s_linear_infinite]" />
          <style dangerouslySetInnerHTML={{__html: `
            @keyframes slide {
              0% { transform: translateY(-100%); }
              100% { transform: translateY(1000px); }
            }
          `}} />
        </div>
      )}

      {/* Panel Title */}
      <div className="flex items-center justify-between gap-2 mb-4 pb-3 border-b border-gray-100 relative z-20">
        <div className="flex items-center gap-2">
          <div className={cn("w-7 h-7 rounded-lg flex items-center justify-center text-white transition-colors duration-500", broadcasting ? "bg-blue-600 shadow-[0_0_15px_rgba(37,99,235,0.8)]" : "bg-gray-900")}>
            <Building2 className={cn("w-4 h-4", broadcasting ? "text-white animate-pulse" : "text-blue-400")} />
          </div>
          <div>
            <h3 className="text-[15px] font-bold text-gray-900 leading-none">Digital Twin & Power Flow</h3>
            <span className="text-[11px] text-gray-500 font-medium">
              {broadcasting ? (
                <span className="text-blue-600 font-bold animate-pulse">Broadcasting State...</span>
              ) : "Real-time Building Physics State"}
            </span>
          </div>
        </div>
        <span className={cn(
          "text-[11px] font-semibold px-2 py-0.5 rounded-full transition-colors",
          broadcasting ? "text-blue-700 bg-blue-50 border-blue-200" : "text-emerald-700 bg-emerald-50 border-emerald-200"
        )}>
          Twin Sync Active
        </span>
      </div>

      {/* SVG Power Flow Component */}
      <PowerFlow
        buildingName={buildingName}
        solarKw={solarKw}
        batteryKw={batteryKw}
        gridKw={gridKw}
        loadKw={loadKw}
      />

      {/* Zone Status Grid */}
      <div className="mb-4">
        <span className="text-[12px] font-bold text-gray-900 block mb-2">Zone Thermal & Occupancy Status</span>
        <div className="grid grid-cols-2 gap-2">
          {zones.map((zone, idx) => (
            <div key={idx} className="bg-gray-50 rounded-lg border border-gray-200 p-2.5 flex items-center justify-between">
              <div className="min-w-0">
                <span className="text-[12px] font-medium text-gray-900 block truncate">{zone.name}</span>
                <span className="text-[10px] text-gray-500">
                  {zone.temp} • Occ {zone.occ}
                </span>
              </div>
              <div className="flex items-center gap-1">
                <span className={cn("w-2 h-2 rounded-full", zone.color)} />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Energy Distribution Bar */}
      <div>
        <div className="flex justify-between items-center text-[12px] font-bold text-gray-900 mb-1.5">
          <span>System Energy Distribution</span>
          <span className="text-gray-500 font-normal">100% Load</span>
        </div>
        <div className="w-full h-3 bg-gray-100 rounded-full overflow-hidden flex">
          {distribution.map((item, idx) => (
            <div
              key={idx}
              className={cn("h-full", item.color)}
              style={{ width: `${item.pct}%` }}
              title={`${item.label}: ${item.pct}%`}
            />
          ))}
        </div>
        <div className="flex items-center justify-between text-[10px] text-gray-500 mt-1.5">
          {distribution.map((item, idx) => (
            <div key={idx} className="flex items-center gap-1">
              <span className={cn("w-2 h-2 rounded-full", item.color)} />
              <span>{item.label} ({item.pct}%)</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
