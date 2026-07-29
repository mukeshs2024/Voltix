"use client";

import React from "react";
import { Brain, Bot } from "lucide-react";
import { AgentCard, AgentCardData } from "@/components/dashboard/live/agent-card";

interface AIAgentsPanelProps {
  agents?: AgentCardData[];
}

const DEFAULT_AGENTS: AgentCardData[] = [
  {
    id: "hvac",
    name: "HVAC Agent",
    status: "Recommendation Ready",
    thought: "Analyzing chiller 2 delta-T compression curve against outdoor temperature surge.",
    confidence: 94,
    recommendation: "Increase chilled water setpoint by +1.5°C to reduce compressor kW.",
    lastUpdated: "Just now",
  },
  {
    id: "occupancy",
    name: "Occupancy Agent",
    status: "Analyzing",
    thought: "Detecting 85% occupancy surge in Lobby & Zone B. Predicting peak by 09:15 AM.",
    confidence: 91,
    recommendation: "Pre-cool Zone B conference rooms prior to scheduled 09:30 AM meetings.",
    lastUpdated: "12s ago",
  },
  {
    id: "grid",
    name: "Grid Agent",
    status: "Waiting Consensus",
    thought: "Utility demand tariff penalty active between 14:00 - 18:00 ($0.50/kWh).",
    confidence: 98,
    recommendation: "Dispatch 120 kW from Battery Storage to shave peak grid import.",
    lastUpdated: "5s ago",
  },
  {
    id: "equipment",
    name: "Equipment Agent",
    status: "Monitoring",
    thought: "Vibration FFT spectrum normal for Air Handling Unit 4. Health index 98%.",
    confidence: 96,
    recommendation: "Maintain standard maintenance cycle; zero anomalous harmonic frequency.",
    lastUpdated: "30s ago",
  },
];

export function AIAgentsPanel({ agents = DEFAULT_AGENTS }: AIAgentsPanelProps) {
  return (
    <div className="bg-white rounded-xl border border-[#E5E7EB] p-5 shadow-xs flex flex-col justify-between h-full">
      {/* Header */}
      <div className="flex items-center justify-between gap-2 mb-4 pb-3 border-b border-gray-100">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-gray-900 flex items-center justify-center text-white">
            <Bot className="w-4 h-4 text-blue-400" />
          </div>
          <div>
            <h3 className="text-[15px] font-bold text-gray-900 leading-none">Autonomous AI Agents Panel</h3>
            <span className="text-[11px] text-gray-500 font-medium">Multi-Agent Intelligence Network</span>
          </div>
        </div>
        <span className="text-[11px] font-bold text-gray-700 bg-gray-100 px-2.5 py-0.5 rounded-full">
          {agents.length} Active Agents
        </span>
      </div>

      {/* Agents Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 flex-1">
        {agents.map((agent) => (
          <AgentCard key={agent.id} agent={agent} />
        ))}
      </div>
    </div>
  );
}
