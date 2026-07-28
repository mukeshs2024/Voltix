import React from "react";

export type SeverityType = "critical" | "high" | "medium" | "low";

interface SeverityBadgeProps {
  severity: SeverityType;
}

export function SeverityBadge({ severity }: SeverityBadgeProps) {
  const styles = {
    critical: "bg-[#FEF2F2] text-[#B91C1C] border-[#FCA5A5]",
    high: "bg-[#FFF7ED] text-[#C2410C] border-[#FDBA74]",
    medium: "bg-[#FEFCE8] text-[#A16207] border-[#FEF08A]",
    low: "bg-[#F3F4F6] text-[#374151] border-[#D1D5DB]"
  };
  
  return (
    <span className={`px-2.5 py-1 text-[10px] uppercase font-bold tracking-wider rounded-full border ${styles[severity]}`}>
      {severity}
    </span>
  );
}
