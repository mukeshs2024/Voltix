"use client";

import React from "react";
import { cn } from "@/lib/utils";

export interface BadgeProps {
  variant?: "success" | "warning" | "danger" | "neutral" | "accent";
  children: React.ReactNode;
  className?: string;
}

export function Badge({ variant = "neutral", children, className }: BadgeProps) {
  const variants = {
    success: "bg-[#22C55E]/10 text-[#15803D] border-[#22C55E]/20",
    accent: "bg-[#22C55E]/10 text-[#15803D] border-[#22C55E]/20",
    warning: "bg-[#F59E0B]/10 text-[#B45309] border-[#F59E0B]/20",
    danger: "bg-[#EF4444]/10 text-[#B91C1C] border-[#EF4444]/20",
    neutral: "bg-[#F3F4F6] text-[#4B5563] border-[#E5E7EB]",
  };

  return (
    <span
      className={cn(
        "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border transition-colors",
        variants[variant],
        className
      )}
    >
      {children}
    </span>
  );
}
