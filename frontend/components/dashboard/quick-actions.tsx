"use client";

import React, { useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Zap, PowerOff, RotateCw, FileText, Loader2 } from "lucide-react";
import { motion } from "framer-motion";

export function QuickActions() {
  const [loadingAction, setLoadingAction] = useState<number | null>(null);

  const handleAction = (idx: number) => {
    setLoadingAction(idx);
    setTimeout(() => {
      setLoadingAction(null);
    }, 1500);
  };

  const actions = [
    { label: "Trigger Auto-Optimize", icon: Zap, variant: "primary" as const, color: "text-white" },
    { label: "Generate Daily Report", icon: FileText, variant: "secondary" as const, color: "text-[#111827]" },
    { label: "Reset HVAC Config", icon: RotateCw, variant: "outline" as const, color: "text-[#4B5563]" },
    { label: "Emergency Grid Halt", icon: PowerOff, variant: "danger" as const, color: "text-white" },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.4 }}
    >
      <Card>
        <CardHeader>
          <CardTitle>System Actions</CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-2 gap-4">
          {actions.map((action, idx) => {
            const Icon = action.icon;
            const isLoading = loadingAction === idx;
            const isDisabled = loadingAction !== null && loadingAction !== idx;

            return (
              <Button
                key={idx}
                variant={action.variant}
                disabled={isDisabled}
                onClick={() => handleAction(idx)}
                className={`w-full flex-col h-auto py-5 gap-3 items-center justify-center text-center transition-all ${
                  action.variant === 'primary' ? 'bg-[#22C55E] hover:bg-[#16A34A] border-none shadow-sm' : ''
                }`}
              >
                {isLoading ? (
                  <Loader2 className={`w-5 h-5 animate-spin ${action.color}`} />
                ) : (
                  <Icon className={`w-5 h-5 ${action.color}`} />
                )}
                <span className={`text-xs font-semibold ${action.color}`}>{action.label}</span>
              </Button>
            );
          })}
        </CardContent>
      </Card>
    </motion.div>
  );
}
