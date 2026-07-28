"use client";

import React from "react";
import { AlertDetail } from "@/components/alerts/alert-table";
import { AlertTriangle, Clock, MapPin, Wrench, ShieldAlert } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Drawer } from "@/components/shared/drawer";

interface AlertDrawerProps {
  alert: AlertDetail | null;
  isOpen: boolean;
  onClose: () => void;
}

export function AlertDrawer({ alert, isOpen, onClose }: AlertDrawerProps) {
  if (!alert) return null;

  const isCritical = alert.severity === 'critical';
  
  const headerIcon = <ShieldAlert className="w-5 h-5" />;
  const headerStyle = isCritical ? 'bg-[#FEF2F2]' : 'bg-[#FAFAFA]';
  const iconStyle = isCritical ? 'bg-[#EF4444] text-white border-none' : 'bg-white border border-[#E5E7EB] text-[#111827]';
  
  const titleContent = (
    <div>
      <div className="flex items-center gap-2 mb-1">
        <span className="text-[10px] uppercase font-bold tracking-wider text-[#6B7280]">Incident {alert.id}</span>
      </div>
      <span>{alert.title}</span>
    </div>
  );

  const footer = (
    <div className="flex flex-col gap-3 w-full">
      <Button variant="primary" className="w-full bg-[#111827] hover:bg-[#374151] text-white border-none">
        <Wrench className="w-4 h-4 mr-2" /> Dispatch Maintenance
      </Button>
      <Button variant="outline" className="w-full">
        Acknowledge & Mute
      </Button>
    </div>
  );

  return (
    <Drawer
      isOpen={isOpen}
      onClose={onClose}
      title={titleContent}
      headerIcon={headerIcon}
      headerStyle={headerStyle}
      iconStyle={iconStyle}
      footer={footer}
    >
      {/* Context */}
      <div className="space-y-4">
        <div className="flex items-center gap-3 text-sm text-[#4B5563]">
          <MapPin className="w-4 h-4 text-[#9CA3AF]" />
          <span className="font-medium text-[#111827]">{alert.building}</span>
        </div>
        <div className="flex items-center gap-3 text-sm text-[#4B5563]">
          <Clock className="w-4 h-4 text-[#9CA3AF]" />
          <span>Detected: {alert.timestamp}</span>
        </div>
      </div>

      {/* Description */}
      <div>
        <h3 className="text-xs font-bold text-[#6B7280] uppercase tracking-wider mb-2">Description</h3>
        <p className="text-sm text-[#374151] leading-relaxed bg-[#F9FAFB] p-4 rounded-xl border border-[#E5E7EB]">
          {alert.description}
        </p>
      </div>

      {/* AI Diagnosis */}
      <div>
        <h3 className="text-xs font-bold text-[#6B7280] uppercase tracking-wider mb-2 flex items-center gap-1.5">
          <AlertTriangle className="w-3.5 h-3.5" /> AI Root Cause Analysis
        </h3>
        <div className="p-4 rounded-xl border border-[#D1D5DB] bg-white shadow-sm space-y-3 text-sm">
          <div className="flex justify-between border-b border-[#E5E7EB] pb-2">
            <span className="text-[#6B7280]">Confidence</span>
            <span className="font-bold text-[#22C55E]">94%</span>
          </div>
          <p className="text-[#374151]">
            Telemetry suggests a mechanical failure in the secondary compressor array. Power draw spiked 40% above baseline exactly 2 minutes before temperature deviation occurred.
          </p>
        </div>
      </div>
    </Drawer>
  );
}
