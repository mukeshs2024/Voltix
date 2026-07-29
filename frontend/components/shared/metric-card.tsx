"use client";

import React from "react";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

export interface MetricCardProps {
  title: string;
  value: string | number;
  className?: string;
  delay?: number;
}

export function MetricCard({
  title,
  value,
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
        </CardContent>
      </Card>
    </motion.div>
  );
}
