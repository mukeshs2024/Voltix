"use client";

import React from "react";
import { AlertTriangle, CheckCircle2, Info } from "lucide-react";
import { motion, useReducedMotion } from "framer-motion";
import { TimelineItem as TimelineItemType } from "@/components/dashboard/live/live-timeline";

interface TimelineItemProps {
  item: TimelineItemType;
}

export function TimelineItemComponent({ item }: TimelineItemProps) {
  const shouldReduceMotion = useReducedMotion();

  const getStatusIcon = (status: TimelineItemType["status"]) => {
    switch (status) {
      case "Delivered":
      case "Broadcast":
        return <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />;
      case "Pending":
        return <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0" />;
      case "Error":
        return <AlertTriangle className="w-4 h-4 text-red-600 shrink-0" />;
      default:
        return <Info className="w-4 h-4 text-blue-600 shrink-0" />;
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: shouldReduceMotion ? 0 : -8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: shouldReduceMotion ? 0 : 8 }}
      transition={{ duration: 0.25 }}
      className="p-3 rounded-lg bg-gray-50 border border-gray-200 flex items-start gap-3 hover:bg-gray-100/80 transition-colors"
    >
      <div className="shrink-0 mt-0.5">{getStatusIcon(item.status)}</div>
      <div className="min-w-0 flex-1">
        <div className="flex items-center justify-between gap-2 mb-0.5">
          <span className="text-[12px] font-bold text-gray-900 truncate">{item.source}</span>
          <span className="text-[11px] text-gray-400 font-medium shrink-0">{item.timestamp}</span>
        </div>
        <p className="text-[12px] text-gray-600 leading-snug">{item.event}</p>
      </div>
    </motion.div>
  );
}
