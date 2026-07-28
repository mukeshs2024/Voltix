"use client";

import React from "react";
import { useDashboardStore } from "@/hooks/use-dashboard-store";
import { Button } from "@/components/ui/button";
import { Search, Bell, Sparkles } from "lucide-react";

export function Header() {
  const { selectedTimeframe, setTimeframe, toggleCopilotDrawer } = useDashboardStore();

  return (
    <header className="h-16 bg-[#FFFFFF] border-b border-[#E5E7EB] px-8 flex items-center justify-between sticky top-0 z-20 shadow-xs">
      {/* Search & Global Context */}
      <div className="flex items-center gap-4 flex-1 max-w-md">
        <div className="relative w-full">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-[#6B7280]" />
          <input
            type="text"
            placeholder="Search buildings, devices, scenarios..."
            className="w-full bg-[#FAFAFA] border border-[#E5E7EB] rounded-[12px] pl-9 pr-4 py-2 text-sm text-[#111827] placeholder-[#6B7280] focus:outline-none focus:border-[#111827] focus:ring-1 focus:ring-[#111827] transition-all"
          />
        </div>
      </div>

      {/* Action Toolbar */}
      <div className="flex items-center gap-3">
        {/* Timeframe Selector */}
        <div className="flex items-center bg-[#FAFAFA] border border-[#E5E7EB] rounded-[12px] p-1 gap-1">
          {(["24h", "7d", "30d", "1y"] as const).map((tf) => (
            <button
              key={tf}
              onClick={() => setTimeframe(tf)}
              className={`px-2.5 py-1 text-xs font-medium rounded-[8px] transition-colors ${
                selectedTimeframe === tf
                  ? "bg-[#111827] text-white"
                  : "text-[#6B7280] hover:text-[#111827]"
              }`}
            >
              {tf.toUpperCase()}
            </button>
          ))}
        </div>

        {/* AI Copilot Trigger */}
        <Button variant="outline" size="sm" onClick={toggleCopilotDrawer} className="gap-2">
          <Sparkles className="w-3.5 h-3.5 text-[#22C55E]" />
          <span>AI Assistant</span>
        </Button>

        {/* Notifications */}
        <button
          aria-label="View notifications"
          className="p-2 rounded-[12px] border border-[#E5E7EB] text-[#6B7280] hover:text-[#111827] hover:bg-[#FAFAFA] relative transition-colors"
        >
          <Bell className="w-4 h-4" />
          <span className="w-2 h-2 rounded-full bg-[#EF4444] absolute top-2 right-2 border-2 border-white" />
        </button>

        <div className="h-6 w-px bg-[#E5E7EB] mx-1" />

        {/* User Profile Avatar */}
        <div className="flex items-center gap-2.5 pl-1 cursor-pointer">
          <div className="w-8 h-8 rounded-full bg-[#111827] text-white flex items-center justify-center text-xs font-semibold">
            NK
          </div>
        </div>
      </div>
    </header>
  );
}
