"use client";

import React from "react";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { ArrowUpRight, ArrowDownRight } from "lucide-react";

export interface MetricCardProps {
  title: string;
  value: string | number;
  changePercent?: number;
  trend?: "up" | "down" | "neutral";
  subtitle?: string;
  icon?: React.ReactNode;
  className?: string;
}

export function MetricCard({
  title,
  value,
  changePercent,
  trend = "neutral",
  subtitle,
  icon,
  className,
}: MetricCardProps) {
  return (
    <Card hoverable className={cn("", className)}>
      <CardHeader>
        <span className="text-xs font-medium text-[#6B7280] uppercase tracking-wider">
          {title}
        </span>
        {icon && (
          <div className="p-2 bg-[#FAFAFA] rounded-xl border border-[#E5E7EB]">
            {icon}
          </div>
        )}
      </CardHeader>
      <CardContent>
        <div className="text-3xl font-bold text-[#111827] tracking-tight">{value}</div>
        {(changePercent !== undefined || subtitle) && (
          <div className="flex items-center gap-2 mt-2 text-xs font-medium">
            {changePercent !== undefined && (
              <span
                className={cn(
                  "flex items-center gap-1 font-semibold",
                  trend === "up" ? "text-[#22C55E]" : trend === "down" ? "text-[#EF4444]" : "text-[#6B7280]"
                )}
              >
                {trend === "up" ? (
                  <ArrowUpRight className="w-3.5 h-3.5" />
                ) : trend === "down" ? (
                  <ArrowDownRight className="w-3.5 h-3.5" />
                ) : null}
                {changePercent > 0 ? `+${changePercent}%` : `${changePercent}%`}
              </span>
            )}
            {subtitle && <span className="text-[#6B7280]">{subtitle}</span>}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
