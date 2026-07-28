"use client";

import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Sliders, Zap, MapPin } from "lucide-react";
import { motion } from "framer-motion";

export function WelcomeHeader() {
  const [dateStr, setDateStr] = useState("");

  useEffect(() => {
    requestAnimationFrame(() => {
      setDateStr(
        new Intl.DateTimeFormat("en-US", {
          weekday: "long",
          month: "long",
          day: "numeric",
        }).format(new Date())
      );
    });
  }, []);

  // Determine greeting based on time of day
  const hour = new Date().getHours();
  const greeting = hour < 12 ? "Good Morning" : hour < 18 ? "Good Afternoon" : "Good Evening";

  return (
    <motion.div 
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="flex flex-col md:flex-row md:items-end justify-between gap-6 bg-white border border-[#E5E7EB] rounded-[24px] p-6 shadow-sm"
    >
      <div>
        <div className="flex items-center gap-3 mb-2">
          <span className="text-xs font-semibold uppercase tracking-wider text-[#6B7280]">
            {dateStr}
          </span>
          <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-[#22C55E]/10 border border-[#22C55E]/20">
            <span className="w-1.5 h-1.5 rounded-full bg-[#22C55E] animate-pulse" />
            <span className="text-[10px] font-semibold text-[#15803D]">System Healthy</span>
          </div>
        </div>
        <h1 className="text-3xl font-bold text-[#111827] tracking-tight">
          {greeting}, Naveen.
        </h1>
        <p className="text-sm text-[#4B5563] mt-2 flex items-center gap-2">
          <MapPin className="w-4 h-4 text-[#6B7280]" />
          <span>Real-time autonomous facility optimization active across <strong>3</strong> campus nodes.</span>
        </p>
      </div>
      <div className="flex items-center gap-3">
        <Button variant="secondary" size="sm" className="shadow-xs">
          <Sliders className="w-4 h-4" />
          <span>Customize View</span>
        </Button>
        <Button variant="primary" size="sm" className="shadow-xs bg-[#22C55E] hover:bg-[#16A34A] focus:ring-[#22C55E] text-white border-none">
          <Zap className="w-4 h-4" />
          <span>Auto-Optimize Grid</span>
        </Button>
      </div>
    </motion.div>
  );
}
