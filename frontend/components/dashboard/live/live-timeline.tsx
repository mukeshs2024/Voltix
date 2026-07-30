"use client";

import React, { useEffect, useRef } from "react";
import { Terminal } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import { cn } from "@/lib/utils";

export interface TimelineItem {
  id: string;
  timestamp: string;
  source: string;
  destination: string;
  event: string;
  status: "Delivered" | "Pending" | "Error" | "Broadcast";
}

interface LiveTimelineProps {
  events?: TimelineItem[];
}

export function LiveTimeline({ events = [] }: LiveTimelineProps) {
  const scrollRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom (newest items at the bottom now)
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [events]);

  return (
    <div className="bg-[#0D1117] rounded-xl border border-gray-800 p-5 shadow-xs flex flex-col justify-between h-full relative overflow-hidden group">
      {/* Header */}
      <div className="flex items-center justify-between gap-2 mb-3 pb-3 border-b border-gray-800">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-gray-800 flex items-center justify-center text-white">
            <Terminal className="w-4 h-4 text-emerald-400" />
          </div>
          <div>
            <h3 className="text-[15px] font-bold text-gray-100 leading-none">Live Event Message Bus</h3>
            <span className="text-[11px] text-gray-400 font-medium font-mono">system.event_stream</span>
          </div>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          <span className="text-[10px] font-bold text-emerald-500 uppercase tracking-wider font-mono">
            Live
          </span>
        </div>
      </div>

      {/* Grid Header */}
      <div className="grid grid-cols-[60px_1fr_1fr_2fr_60px] gap-2 px-1 mb-2 text-[10px] font-bold text-gray-500 uppercase tracking-wider border-b border-gray-800/50 pb-1">
        <span>Time</span>
        <span>Source</span>
        <span>Destination</span>
        <span>Message</span>
        <span className="text-right">Status</span>
      </div>

      {/* Scrollable Timeline List (Terminal Style) */}
      <div 
        ref={scrollRef}
        className="flex-1 overflow-y-auto max-h-[320px] pr-2 space-y-1.5 scroll-smooth font-mono text-[11px]"
        style={{ scrollbarWidth: "thin", scrollbarColor: "#374151 transparent" }}
      >
        <AnimatePresence initial={false}>
          {events.map((item) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              className="grid grid-cols-[60px_1fr_1fr_2fr_60px] gap-2 py-0.5 hover:bg-gray-800/50 rounded px-1 transition-colors items-start"
            >
              <span className="text-gray-500 shrink-0">{item.timestamp}</span>
              
              <span className="text-blue-400 truncate" title={item.source}>
                {item.source}
              </span>
              
              <span className="text-purple-400 truncate" title={item.destination}>
                {item.destination}
              </span>
              
              <span className="text-gray-300 truncate" title={item.event}>
                {item.event}
              </span>

              <span className={cn(
                "text-right",
                item.status === "Delivered" ? "text-emerald-400" :
                item.status === "Error" ? "text-red-400" :
                item.status === "Broadcast" ? "text-amber-400" :
                "text-gray-500"
              )}>
                {item.status}
              </span>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
      
      {/* Overlay gradient to fade out top items slightly */}
      <div className="absolute top-[60px] left-0 right-0 h-8 bg-gradient-to-b from-[#0D1117] to-transparent pointer-events-none" />
    </div>
  );
}
