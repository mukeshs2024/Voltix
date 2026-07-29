"use client";

import React from "react";

export interface StatusBadgeProps {
  status: "OPTIMAL" | "ATTENTION_REQUIRED" | "CRITICAL" | "IDLE" | "ACTIVE" | "OFFLINE";
  className?: string;
}

export function StatusBadge({ status, className }: StatusBadgeProps) {
  const map: Record<StatusBadgeProps["status"], { bg: string; text: string; label: string }> = {
    OPTIMAL: { bg: "bg-emerald-100", text: "text-emerald-700", label: "Optimal" },
    ATTENTION_REQUIRED: { bg: "bg-orange-100", text: "text-orange-700", label: "Attention" },
    CRITICAL: { bg: "bg-red-100", text: "text-red-700", label: "Critical" },
    OFFLINE: { bg: "bg-gray-100", text: "text-gray-700", label: "Offline" },
    IDLE: { bg: "bg-gray-100", text: "text-gray-700", label: "Idle" },
    ACTIVE: { bg: "bg-blue-100", text: "text-blue-700", label: "Active" },
  };

  const item = map[status] || { bg: "bg-gray-100", text: "text-gray-700", label: status };

  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold tracking-wide uppercase ${item.bg} ${item.text} ${className || ""}`}>
      {item.label}
    </span>
  );
}
