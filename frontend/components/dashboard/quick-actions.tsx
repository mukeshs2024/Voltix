"use client";

import React from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Zap, PowerOff, RotateCw, FileText } from "lucide-react";

export function QuickActions() {
  const actions = [
    { label: "Trigger Auto-Optimize", icon: Zap, variant: "primary" as const },
    { label: "Generate Report", icon: FileText, variant: "secondary" as const },
    { label: "Reset HVAC Config", icon: RotateCw, variant: "outline" as const },
    { label: "Emergency Grid Halt", icon: PowerOff, variant: "danger" as const },
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle>System Actions</CardTitle>
      </CardHeader>
      <CardContent className="grid grid-cols-2 gap-3">
        {actions.map((action, idx) => {
          const Icon = action.icon;
          return (
            <Button
              key={idx}
              variant={action.variant}
              className="w-full flex-col h-auto py-4 gap-2 items-center justify-center text-center shadow-none"
            >
              <Icon className="w-5 h-5 mb-1" />
              <span className="text-xs font-medium">{action.label}</span>
            </Button>
          );
        })}
      </CardContent>
    </Card>
  );
}
