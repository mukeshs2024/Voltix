"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { Sliders, Zap } from "lucide-react";

export function WelcomeHeader() {
  return (
    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
      <div>
        <h1 className="text-2xl font-bold text-[#111827] tracking-tight">Executive Dashboard</h1>
        <p className="text-sm text-[#6B7280] mt-1">
          Real-time autonomous facility optimization across 3 active campus nodes.
        </p>
      </div>
      <div className="flex items-center gap-3">
        <Button variant="secondary" size="sm">
          <Sliders className="w-4 h-4" />
          <span>Customize View</span>
        </Button>
        <Button variant="primary" size="sm">
          <Zap className="w-4 h-4 text-[#22C55E]" />
          <span>Auto-Optimize Grid</span>
        </Button>
      </div>
    </div>
  );
}
