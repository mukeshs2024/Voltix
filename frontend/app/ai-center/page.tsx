"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { PageContainer, SectionContainer } from "@/components/shared/page-container";
import { PageHeader } from "@/components/shared/page-header";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  MOCK_AGENTS,
  MOCK_CONSENSUS,
  MOCK_DECISION_TIMELINE,
  MOCK_AGENT_TELEMETRY,
} from "@/components/ai/mock-data";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";
import {
  RefreshCw,
  Maximize2,
  ExternalLink,
  Users,
  Thermometer,
  Zap,
  Wrench,
  ShieldCheck,
  Activity,
  Brain,
  CheckCircle2,
  AlertTriangle,
  Clock,
  ChevronRight,
} from "lucide-react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

const AGENT_ICONS: Record<string, React.ElementType> = {
  occupancy: Users,
  thermal: Thermometer,
  energy: Zap,
  equipment: Wrench,
  safety: ShieldCheck,
  grid: Activity,
};

const AGENT_COLORS: Record<string, string> = {
  occupancy: "#6366F1",
  thermal: "#F59E0B",
  energy: "#22C55E",
  equipment: "#3B82F6",
  safety: "#10B981",
  grid: "#8B5CF6",
};

function StatusDot({ status }: { status: string }) {
  return (
    <span
      className={cn(
        "w-2 h-2 rounded-full shrink-0",
        status === "active" && "bg-[#22C55E] animate-pulse",
        status === "warning" && "bg-[#F59E0B] animate-pulse",
        status === "error" && "bg-[#EF4444] animate-pulse",
        status === "idle" && "bg-[#9CA3AF]"
      )}
    />
  );
}

function HealthBar({ value, color }: { value: number; color: string }) {
  return (
    <div className="w-full h-1.5 bg-[#F3F4F6] rounded-full overflow-hidden">
      <motion.div
        initial={{ width: 0 }}
        animate={{ width: `${value}%` }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="h-full rounded-full"
        style={{ backgroundColor: color }}
      />
    </div>
  );
}

export default function AICenterPage() {
  const [lastRefresh, setLastRefresh] = useState("Just now");
  const [expandedAgent, setExpandedAgent] = useState<string | null>(null);

  useEffect(() => {
    const interval = setInterval(() => {
      setLastRefresh(new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }));
    }, 30000);
    return () => clearInterval(interval);
  }, []);

  const handleRefresh = () => {
    setLastRefresh("Just now");
  };

  return (
    <PageContainer>
      <SectionContainer>
        <PageHeader
          title="AI Control Center"
          description="Real-time visibility into all autonomous agents, decisions, and system consensus."
          actions={
            <div className="flex gap-2">
              <Button variant="outline" size="sm" onClick={handleRefresh} className="bg-white gap-2 shadow-xs">
                <RefreshCw className="w-3.5 h-3.5" /> Refresh
              </Button>
              <Button variant="outline" size="sm" className="bg-white gap-2 shadow-xs">
                <Maximize2 className="w-3.5 h-3.5" /> Expand
              </Button>
            </div>
          }
        />
      </SectionContainer>

      {/* Supervisor Consensus Banner */}
      <SectionContainer>
        <Card className="border-[#E5E7EB] p-5">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-xl bg-[#111827] flex items-center justify-center shrink-0">
                <Brain className="w-5 h-5 text-[#22C55E]" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-sm font-bold text-[#111827]">Supervisor Consensus</span>
                  <Badge variant="success">
                    <CheckCircle2 className="w-3 h-3 mr-1" />
                    {MOCK_CONSENSUS.status}
                  </Badge>
                </div>
                <p className="text-xs text-[#6B7280] mt-0.5">{MOCK_CONSENSUS.currentDecision}</p>
              </div>
            </div>
            <div className="flex items-center gap-6 text-center">
              <div>
                <div className="text-xl font-bold text-[#111827]">{MOCK_CONSENSUS.participatingAgents}</div>
                <div className="text-[10px] text-[#6B7280] uppercase tracking-wider">Agents</div>
              </div>
              <div>
                <div className="text-xl font-bold text-[#111827]">{MOCK_CONSENSUS.agreementScore}%</div>
                <div className="text-[10px] text-[#6B7280] uppercase tracking-wider">Agreement</div>
              </div>
              <div>
                <div className="text-sm font-semibold text-[#111827]">{MOCK_CONSENSUS.lastResolved}</div>
                <div className="text-[10px] text-[#6B7280] uppercase tracking-wider">Last Resolved</div>
              </div>
            </div>
          </div>
        </Card>
      </SectionContainer>

      {/* Agent Cards Grid */}
      <SectionContainer>
        <div className="flex items-center justify-between mb-1">
          <h2 className="text-sm font-bold text-[#111827] uppercase tracking-wider">Agent Fleet</h2>
          <span className="text-xs text-[#6B7280]">Last updated: {lastRefresh}</span>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
          {MOCK_AGENTS.map((agent, i) => {
            const Icon = AGENT_ICONS[agent.type] || Activity;
            const color = AGENT_COLORS[agent.type];
            const isExpanded = expandedAgent === agent.id;
            return (
              <motion.div
                key={agent.id}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.06 }}
              >
                <Card className="p-5 hover:shadow-apple-hover transition-shadow cursor-pointer" onClick={() => setExpandedAgent(isExpanded ? null : agent.id)}>
                  {/* Card Header */}
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0" style={{ backgroundColor: `${color}15` }}>
                        <Icon className="w-4 h-4" style={{ color }} />
                      </div>
                      <div>
                        <div className="text-sm font-semibold text-[#111827]">{agent.name}</div>
                        <div className="flex items-center gap-1.5 mt-0.5">
                          <StatusDot status={agent.status} />
                          <span className="text-[10px] text-[#6B7280] capitalize">{agent.status}</span>
                        </div>
                      </div>
                    </div>
                    <Badge variant={agent.status === "warning" ? "warning" : agent.status === "error" ? "danger" : "success"}>
                      {agent.health}%
                    </Badge>
                  </div>

                  {/* Health Bar */}
                  <div className="mb-3">
                    <div className="flex justify-between text-[10px] text-[#6B7280] mb-1">
                      <span>Health</span>
                      <span>{agent.health}%</span>
                    </div>
                    <HealthBar value={agent.health} color={color} />
                  </div>

                  {/* Metrics Row */}
                  <div className="grid grid-cols-3 gap-2 mb-3">
                    <div className="bg-[#FAFAFA] border border-[#E5E7EB] rounded-xl p-2 text-center">
                      <div className="text-xs font-bold text-[#111827]">{agent.latency}ms</div>
                      <div className="text-[9px] text-[#6B7280] uppercase tracking-wider mt-0.5">Latency</div>
                    </div>
                    <div className="bg-[#FAFAFA] border border-[#E5E7EB] rounded-xl p-2 text-center">
                      <div className="text-xs font-bold text-[#111827]">{agent.confidence}%</div>
                      <div className="text-[9px] text-[#6B7280] uppercase tracking-wider mt-0.5">Confidence</div>
                    </div>
                    <div className="bg-[#FAFAFA] border border-[#E5E7EB] rounded-xl p-2 text-center">
                      <div className="text-xs font-bold text-[#111827]">{agent.decisionsToday}</div>
                      <div className="text-[9px] text-[#6B7280] uppercase tracking-wider mt-0.5">Decisions</div>
                    </div>
                  </div>

                  {/* Last Decision */}
                  <div className="bg-[#FAFAFA] border border-[#E5E7EB] rounded-xl p-3 mb-3">
                    <div className="text-[10px] font-bold text-[#6B7280] uppercase tracking-wider mb-1">Last Decision</div>
                    <div className="text-xs text-[#111827] font-medium leading-snug">{agent.lastDecision}</div>
                  </div>

                  {/* Expanded Reason */}
                  {isExpanded && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      className="bg-[#F0FDF4] border border-[#A7F3D0] rounded-xl p-3 mb-3"
                    >
                      <div className="text-[10px] font-bold text-[#065F46] uppercase tracking-wider mb-1">Reasoning</div>
                      <div className="text-xs text-[#047857] leading-snug">{agent.reason}</div>
                    </motion.div>
                  )}

                  {/* Footer */}
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] text-[#6B7280]">Uptime: {agent.uptime}</span>
                    <Link
                      href={`/agent/${agent.id}`}
                      onClick={(e) => e.stopPropagation()}
                      className="flex items-center gap-1 text-[10px] font-semibold text-[#111827] hover:text-[#374151] transition-colors"
                    >
                      View Details <ExternalLink className="w-3 h-3" />
                    </Link>
                  </div>
                </Card>
              </motion.div>
            );
          })}
        </div>
      </SectionContainer>

      {/* Confidence Chart + Decision Timeline */}
      <SectionContainer>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Confidence / Health Chart */}
          <div className="lg:col-span-2">
            <Card className="p-5">
              <CardHeader className="mb-4 pb-0">
                <CardTitle>Agent Confidence Over Time</CardTitle>
                <span className="text-xs text-[#6B7280]">Last 90 minutes</span>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={220}>
                  <LineChart data={MOCK_AGENT_TELEMETRY} margin={{ top: 4, right: 8, left: -20, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#F3F4F6" />
                    <XAxis dataKey="time" tick={{ fontSize: 10, fill: "#9CA3AF" }} />
                    <YAxis domain={[60, 100]} tick={{ fontSize: 10, fill: "#9CA3AF" }} />
                    <Tooltip
                      contentStyle={{ fontSize: 11, borderRadius: 12, border: "1px solid #E5E7EB", boxShadow: "0 4px 12px rgba(0,0,0,0.06)" }}
                    />
                    {Object.entries(AGENT_COLORS).map(([key, color]) => (
                      <Line key={key} type="monotone" dataKey={key} stroke={color} strokeWidth={2} dot={false} />
                    ))}
                  </LineChart>
                </ResponsiveContainer>
                <div className="flex flex-wrap gap-3 mt-3">
                  {Object.entries(AGENT_COLORS).map(([key, color]) => (
                    <div key={key} className="flex items-center gap-1.5">
                      <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: color }} />
                      <span className="text-[10px] text-[#6B7280] capitalize">{key}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Decision Timeline */}
          <div>
            <Card className="p-5 h-full">
              <CardHeader className="mb-4 pb-0">
                <CardTitle>Decision Timeline</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3 max-h-[280px] overflow-y-auto pr-1">
                  {MOCK_DECISION_TIMELINE.map((item, i) => (
                    <div key={i} className="flex gap-3 items-start">
                      <div className="flex flex-col items-center shrink-0">
                        <div className={cn(
                          "w-2 h-2 rounded-full mt-1",
                          item.status === "executed" ? "bg-[#22C55E]" : "bg-[#F59E0B]"
                        )} />
                        {i < MOCK_DECISION_TIMELINE.length - 1 && (
                          <div className="w-px h-6 bg-[#E5E7EB] mt-1" />
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between gap-2">
                          <span className="text-[10px] font-bold text-[#6B7280]">{item.time}</span>
                          <span className="text-[10px] text-[#9CA3AF]">{item.confidence}%</span>
                        </div>
                        <div className="text-xs font-medium text-[#111827] truncate">{item.action}</div>
                        <div className="text-[10px] text-[#6B7280]">{item.agent}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </SectionContainer>

      {/* System Health Summary */}
      <SectionContainer>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {[
            { label: "Avg Confidence", value: "90%", icon: Brain, color: "#6366F1" },
            { label: "Avg Latency", value: "45ms", icon: Clock, color: "#F59E0B" },
            { label: "Decisions Today", value: "99", icon: CheckCircle2, color: "#22C55E" },
            { label: "Active Warnings", value: "1", icon: AlertTriangle, color: "#EF4444" },
          ].map((m) => {
            const Icon = m.icon;
            return (
              <Card key={m.label} className="p-4">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0" style={{ backgroundColor: `${m.color}15` }}>
                    <Icon className="w-4 h-4" style={{ color: m.color }} />
                  </div>
                  <div>
                    <div className="text-xl font-bold text-[#111827]">{m.value}</div>
                    <div className="text-[10px] text-[#6B7280] uppercase tracking-wider">{m.label}</div>
                  </div>
                </div>
              </Card>
            );
          })}
        </div>
      </SectionContainer>
    </PageContainer>
  );
}
