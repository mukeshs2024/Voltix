"use client";

import React from "react";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { ArrowUpRight, ArrowDownRight } from "lucide-react";
import { motion } from "framer-motion";

export interface MetricCardProps {
  title: string;
  value: string | number;
  changePercent?: number;
  trend?: "up" | "down" | "neutral";
  subtitle?: string;
  icon?: React.ReactNode;
  className?: string;
  delay?: number;
}

export function MetricCard({
  title,
  value,
  changePercent,
  trend = "neutral",
  subtitle,
  icon,
  className,
  delay = 0,
}: MetricCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay }}
      whileHover={{ y: -4, scale: 1.01, transition: { type: "spring", stiffness: 400, damping: 25 } }}
    >
      <Card hoverable className={cn("h-full border-[#E5E7EB] hover:shadow-md transition-shadow", className)}>
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <span className="text-xs font-semibold text-[#6B7280] uppercase tracking-wider">
            {title}
          </span>
          {icon && (
            <div className="p-2 bg-[#FAFAFA] rounded-xl border border-[#E5E7EB] shadow-sm">
              {icon}
            </div>
          )}
        </CardHeader>
        <CardContent>
          <motion.div 
            className="text-3xl font-bold text-[#111827] tracking-tight"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: delay + 0.1 }}
          >
            {value}
          </motion.div>
          {(changePercent !== undefined || subtitle) && (
            <div className="flex items-center gap-2 mt-3 text-xs font-medium">
              {changePercent !== undefined && (
                <span
                  className={cn(
                    "flex items-center gap-1 font-semibold px-1.5 py-0.5 rounded-md",
                    trend === "up" ? "text-[#15803D] bg-[#22C55E]/10" : 
                    trend === "down" ? "text-[#B91C1C] bg-[#EF4444]/10" : 
                    "text-[#4B5563] bg-[#F3F4F6]"
                  )}
                >
                  {trend === "up" ? (
                    <ArrowUpRight className="w-3 h-3" />
                  ) : trend === "down" ? (
                    <ArrowDownRight className="w-3 h-3" />
                  ) : null}
                  {changePercent > 0 ? `+${changePercent}%` : `${changePercent}%`}
                </span>
              )}
              {subtitle && <span className="text-[#6B7280]">{subtitle}</span>}
            </div>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
}
