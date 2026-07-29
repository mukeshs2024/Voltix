"use client";

import React from "react";
import { Clock } from "lucide-react";
import { AnimatePresence } from "framer-motion";
import { TimelineItemComponent } from "@/components/dashboard/live/timeline-item";

export interface TimelineItem {
  id: string;
  timestamp: string;
  source: string;
  event: string;
  status: "completed" | "info" | "warning" | "error";
}

interface LiveTimelineProps {
  events?: TimelineItem[];
}

const DEFAULT_EVENTS: TimelineItem[] = [
  {
    id: "e1",
    timestamp: "08:45:12 AM",
    source: "Consensus Engine",
    event: "Multi-agent consensus achieved on Chiller Delta-T optimization plan #402.",
    status: "completed",
  },
  {
    id: "e2",
    timestamp: "08:44:50 AM",
    source: "HVAC Agent",
    event: "Proposed +1.5°C chilled water setpoint increase due to outdoor heat delta.",
    status: "info",
  },
  {
    id: "e3",
    timestamp: "08:42:10 AM",
    source: "Occupancy Agent",
    event: "Lobby occupancy surge detected (85% zone density). Pre-cooling initiated.",
    status: "warning",
  },
  {
    id: "e4",
    timestamp: "08:38:00 AM",
    source: "Grid Agent",
    event: "Peak tariff window alert: utility rate increased to $0.50/kWh.",
    status: "info",
  },
  {
    id: "e5",
    timestamp: "08:30:00 AM",
    source: "Digital Twin",
    event: "Morning Rush scenario telemetry initialization completed for 10 agents.",
    status: "completed",
  },
];

export function LiveTimeline({ events = DEFAULT_EVENTS }: LiveTimelineProps) {
  return (
    <div className="bg-white rounded-xl border border-[#E5E7EB] p-5 shadow-xs flex flex-col justify-between h-full">
      {/* Header */}
      <div className="flex items-center justify-between gap-2 mb-4 pb-3 border-b border-gray-100">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-gray-900 flex items-center justify-center text-white">
            <Clock className="w-4 h-4 text-blue-400" />
          </div>
          <div>
            <h3 className="text-[15px] font-bold text-gray-900 leading-none">Decision & Event Timeline</h3>
            <span className="text-[11px] text-gray-500 font-medium">Chronological Multi-Agent Activity</span>
          </div>
        </div>
        <span className="text-[11px] font-bold text-gray-700 bg-gray-100 px-2.5 py-0.5 rounded-full">
          Newest Top
        </span>
      </div>

      {/* Scrollable Timeline List */}
      <div className="flex-1 overflow-y-auto max-h-[320px] pr-1 space-y-2.5">
        <AnimatePresence initial={false}>
          {events.map((item) => (
            <TimelineItemComponent key={item.id} item={item} />
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
}
