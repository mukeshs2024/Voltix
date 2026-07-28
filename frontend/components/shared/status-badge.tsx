"use client";

import React from "react";
import { Badge, BadgeProps } from "@/components/ui/badge";

export interface StatusBadgeProps {
  status: "OPTIMAL" | "ATTENTION_REQUIRED" | "CRITICAL" | "IDLE" | "ACTIVE";
  className?: string;
}

export function StatusBadge({ status, className }: StatusBadgeProps) {
  const map: Record<StatusBadgeProps["status"], { variant: BadgeProps["variant"]; label: string }> = {
    OPTIMAL: { variant: "success", label: "Optimal" },
    ATTENTION_REQUIRED: { variant: "warning", label: "Attention Required" },
    CRITICAL: { variant: "danger", label: "Critical" },
    IDLE: { variant: "neutral", label: "Idle" },
    ACTIVE: { variant: "accent", label: "Active" },
  };

  const item = map[status] || { variant: "neutral", label: status };

  return (
    <Badge variant={item.variant} className={className}>
      {item.label}
    </Badge>
  );
}
