"use client";

import React from "react";
import { Brain, Bot, ArrowRight } from "lucide-react";
import { AgentCard, AgentCardData } from "@/components/dashboard/live/agent-card";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";

interface AIAgentsPanelProps {
  agents?: AgentCardData[];
  communicating?: boolean;
}

const DEFAULT_AGENTS: AgentCardData[] = [
  {
    id: "hvac", name: "HVAC Agent", status: "Recommendation Ready", inputs: { "Indoor Temp": "23.4°C" }, observation: "Diverging setpoint.", reasoning: "Optimize cooling.", recommendation: "Increase setpoint +1.5°C.", expectedImpact: "Reduce peak 7%", confidence: 94, lastUpdated: "Just now"
  }
];

export function AIAgentsPanel({ agents = DEFAULT_AGENTS, communicating = false }: AIAgentsPanelProps) {
  // Define nodes for the communication network diagram
  const nodes = [
    { id: "twin", label: "Digital Twin", color: "text-blue-600 bg-blue-50 border-blue-200" },
    { id: "occ", label: "Occupancy", color: "text-purple-600 bg-purple-50 border-purple-200" },
    { id: "hvac", label: "HVAC", color: "text-sky-600 bg-sky-50 border-sky-200" },
    { id: "energy", label: "Energy", color: "text-amber-600 bg-amber-50 border-amber-200" },
    { id: "grid", label: "Grid", color: "text-orange-600 bg-orange-50 border-orange-200" },
    { id: "equip", label: "Equipment", color: "text-indigo-600 bg-indigo-50 border-indigo-200" },
    { id: "consensus", label: "Consensus", color: "text-emerald-600 bg-emerald-50 border-emerald-200" }
  ];

  return (
    <div className="bg-white rounded-xl border border-[#E5E7EB] p-5 shadow-xs flex flex-col justify-between h-full relative">
      {/* Header */}
      <div className="flex items-center justify-between gap-2 mb-4 pb-3 border-b border-gray-100 relative z-20">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-gray-900 flex items-center justify-center text-white">
            <Bot className="w-4 h-4 text-blue-400" />
          </div>
          <div>
            <h3 className="text-[15px] font-bold text-gray-900 leading-none">Autonomous AI Agents Panel</h3>
            <span className="text-[11px] text-gray-500 font-medium">Multi-Agent Intelligence Network</span>
          </div>
        </div>
        <span className={cn(
          "text-[11px] font-bold px-2.5 py-0.5 rounded-full transition-colors",
          communicating ? "text-emerald-700 bg-emerald-50 border border-emerald-200 animate-pulse" : "text-gray-700 bg-gray-100"
        )}>
          {communicating ? "Network Active" : `${agents.length} Active Agents`}
        </span>
      </div>

      {/* Communication Network Node Graph */}
      <div className="mb-4 bg-gray-50 rounded-lg border border-gray-200 p-3 relative overflow-hidden">
        <span className="text-[10px] font-bold text-gray-500 uppercase tracking-wider block mb-3">Agent Communication Network</span>
        <div className="flex items-center justify-between px-2 relative z-10">
          {nodes.map((node, i) => (
            <React.Fragment key={node.id}>
              {/* Node */}
              <div className={cn("px-2 py-1 rounded text-[10px] font-bold border whitespace-nowrap shadow-sm relative", node.color)}>
                {node.label}
                {communicating && <span className="absolute -inset-1 bg-current opacity-20 rounded animate-ping pointer-events-none" />}
              </div>
              
              {/* Edge */}
              {i < nodes.length - 1 && (
                <div className="flex-1 h-px mx-1 relative bg-gray-200 flex items-center justify-center">
                  <ArrowRight className="w-3 h-3 text-gray-300 absolute" />
                  {communicating && (
                    <motion.div 
                      initial={{ left: "0%" }}
                      animate={{ left: "100%" }}
                      transition={{ duration: 1, repeat: Infinity, delay: i * 0.2 }}
                      className="absolute w-2 h-2 rounded-full bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,1)] -translate-x-1/2" 
                    />
                  )}
                </div>
              )}
            </React.Fragment>
          ))}
        </div>
      </div>

      {/* Agents Cards Grid */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-3 flex-1 relative z-20">
        {agents.map((agent) => (
          <AgentCard key={agent.id} agent={agent} />
        ))}
      </div>
    </div>
  );
}
