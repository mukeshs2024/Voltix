"use client";

import React, { useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { PageContainer, SectionContainer } from "@/components/shared/page-container";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  MOCK_AGENTS,
  MOCK_AGENT_TELEMETRY,
  MOCK_AGENT_LOGS,
  MOCK_TRIGGERED_RULES,
  MOCK_RECOMMENDATIONS,
} from "@/components/ai/mock-data";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  AreaChart,
  Area,
} from "recharts";
import {
  ArrowLeft,
  RefreshCw,
  Activity,
  Brain,
  Clock,
  CheckCircle2,
  AlertTriangle,
  ChevronRight,
  Lightbulb,
  BookOpen,
  BarChart2,
  Terminal,
  GitBranch,
  TrendingUp,
} from "lucide-react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

const TABS = [
  { id: "overview", label: "Overview", icon: Activity },
  { id: "telemetry", label: "Telemetry", icon: BarChart2 },
  { id: "reasoning", label: "Reasoning", icon: Brain },
  { id: "predictions", label: "Predictions", icon: TrendingUp },
  { id: "confidence", label: "Confidence", icon: CheckCircle2 },
  { id: "logs", label: "Execution Logs", icon: Terminal },
  { id: "rules", label: "Triggered Rules", icon: GitBranch },
  { id: "recommendations", label: "Recommendations", icon: Lightbulb },
] as const;

type TabId = (typeof TABS)[number]["id"];

const PREDICTION_DATA = [
  { time: "Now", predicted: 94, actual: 94 },
  { time: "+10m", predicted: 91, actual: null },
  { time: "+20m", predicted: 88, actual: null },
  { time: "+30m", predicted: 85, actual: null },
  { time: "+40m", predicted: 83, actual: null },
  { time: "+50m", predicted: 86, actual: null },
  { time: "+60m", predicted: 89, actual: null },
];

const CONFIDENCE_HISTORY = [
  { time: "14:00", confidence: 88 },
  { time: "14:10", confidence: 90 },
  { time: "14:20", confidence: 87 },
  { time: "14:30", confidence: 91 },
  { time: "14:40", confidence: 93 },
  { time: "14:50", confidence: 92 },
  { time: "15:00", confidence: 94 },
  { time: "15:10", confidence: 94 },
  { time: "15:20", confidence: 92 },
  { time: "15:30", confidence: 94 },
  { time: "15:40", confidence: 94 },
];

export default function AgentDetailPage() {
  const params = useParams();
  const agentId = params?.id as string;
  const [activeTab, setActiveTab] = useState<TabId>("overview");

  const agent = MOCK_AGENTS.find((a) => a.id === agentId) ?? MOCK_AGENTS[0];

  const agentTelemetry = MOCK_AGENT_TELEMETRY.map((row) => ({
    time: row.time,
    value: row[agent.type as keyof typeof row] as number,
  }));

  return (
    <PageContainer>
      <SectionContainer>
        {/* Back + Header */}
        <div className="flex items-center gap-3 mb-2">
          <Link href="/ai-center">
            <Button variant="ghost" size="sm" className="gap-1.5 text-[#6B7280]">
              <ArrowLeft className="w-4 h-4" /> AI Control Center
            </Button>
          </Link>
          <ChevronRight className="w-3.5 h-3.5 text-[#9CA3AF]" />
          <span className="text-sm font-semibold text-[#111827]">{agent.name}</span>
        </div>

        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-[#111827] flex items-center justify-center shrink-0">
              <Brain className="w-6 h-6 text-[#22C55E]" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-[#111827] tracking-tight">{agent.name}</h1>
              <div className="flex items-center gap-2 mt-1">
                <span className={cn(
                  "w-2 h-2 rounded-full",
                  agent.status === "active" ? "bg-[#22C55E] animate-pulse" : "bg-[#F59E0B] animate-pulse"
                )} />
                <span className="text-sm text-[#6B7280] capitalize">{agent.status}</span>
                <span className="text-[#E5E7EB]">·</span>
                <span className="text-sm text-[#6B7280]">Uptime {agent.uptime}</span>
              </div>
            </div>
          </div>
          <Button variant="outline" size="sm" className="bg-white gap-2 shadow-xs">
            <RefreshCw className="w-3.5 h-3.5" /> Refresh
          </Button>
        </div>
      </SectionContainer>

      {/* Stat Strip */}
      <SectionContainer>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {[
            { label: "Health", value: `${agent.health}%`, icon: Activity, color: "#22C55E" },
            { label: "Latency", value: `${agent.latency}ms`, icon: Clock, color: "#F59E0B" },
            { label: "Confidence", value: `${agent.confidence}%`, icon: CheckCircle2, color: "#6366F1" },
            { label: "Decisions Today", value: agent.decisionsToday, icon: Brain, color: "#3B82F6" },
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

      {/* Tabs */}
      <SectionContainer>
        <div className="flex gap-1 overflow-x-auto pb-1 border-b border-[#E5E7EB]">
          {TABS.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={cn(
                  "flex items-center gap-1.5 px-3 py-2 text-xs font-semibold rounded-t-lg whitespace-nowrap transition-colors",
                  activeTab === tab.id
                    ? "text-[#111827] border-b-2 border-[#111827] -mb-px bg-white"
                    : "text-[#6B7280] hover:text-[#111827]"
                )}
              >
                <Icon className="w-3.5 h-3.5" />
                {tab.label}
              </button>
            );
          })}
        </div>

        <motion.div key={activeTab} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.2 }}>
          {/* OVERVIEW */}
          {activeTab === "overview" && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-4">
              <Card className="p-5">
                <CardHeader className="pb-3">
                  <CardTitle>Last Decision</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="bg-[#FAFAFA] border border-[#E5E7EB] rounded-xl p-4 mb-3">
                    <div className="text-sm font-semibold text-[#111827]">{agent.lastDecision}</div>
                  </div>
                  <div className="bg-[#F0FDF4] border border-[#A7F3D0] rounded-xl p-4">
                    <div className="text-[10px] font-bold text-[#065F46] uppercase tracking-wider mb-1">Reasoning</div>
                    <div className="text-xs text-[#047857] leading-relaxed">{agent.reason}</div>
                  </div>
                </CardContent>
              </Card>
              <Card className="p-5">
                <CardHeader className="pb-3">
                  <CardTitle>Agent Health History</CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={180}>
                    <AreaChart data={agentTelemetry} margin={{ top: 4, right: 8, left: -20, bottom: 0 }}>
                      <defs>
                        <linearGradient id="healthGrad" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#22C55E" stopOpacity={0.15} />
                          <stop offset="95%" stopColor="#22C55E" stopOpacity={0} />
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" stroke="#F3F4F6" />
                      <XAxis dataKey="time" tick={{ fontSize: 10, fill: "#9CA3AF" }} />
                      <YAxis domain={[60, 100]} tick={{ fontSize: 10, fill: "#9CA3AF" }} />
                      <Tooltip contentStyle={{ fontSize: 11, borderRadius: 12, border: "1px solid #E5E7EB" }} />
                      <Area type="monotone" dataKey="value" stroke="#22C55E" strokeWidth={2} fill="url(#healthGrad)" />
                    </AreaChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </div>
          )}

          {/* TELEMETRY */}
          {activeTab === "telemetry" && (
            <Card className="p-5 mt-4">
              <CardHeader className="pb-3">
                <CardTitle>Agent Telemetry — Confidence Score</CardTitle>
                <span className="text-xs text-[#6B7280]">Last 90 minutes</span>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={280}>
                  <LineChart data={agentTelemetry} margin={{ top: 4, right: 8, left: -20, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#F3F4F6" />
                    <XAxis dataKey="time" tick={{ fontSize: 10, fill: "#9CA3AF" }} />
                    <YAxis domain={[60, 100]} tick={{ fontSize: 10, fill: "#9CA3AF" }} />
                    <Tooltip contentStyle={{ fontSize: 11, borderRadius: 12, border: "1px solid #E5E7EB" }} />
                    <Line type="monotone" dataKey="value" stroke="#6366F1" strokeWidth={2.5} dot={{ r: 3, fill: "#6366F1" }} />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          )}

          {/* REASONING */}
          {activeTab === "reasoning" && (
            <div className="mt-4 space-y-4">
              <Card className="p-5">
                <CardHeader className="pb-3">
                  <CardTitle>Decision Reasoning Chain</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {[
                      { step: 1, label: "Sensor Data Ingestion", detail: "12 sensors aggregated — occupancy, CO2, temperature, motion" },
                      { step: 2, label: "Pattern Recognition", detail: "Historical match found: similar low-occupancy event 3 days ago at 15:30" },
                      { step: 3, label: "Model Inference", detail: "Occupancy model output: Zone 3 = 12% (threshold: 30%)" },
                      { step: 4, label: "Rule Evaluation", detail: "Rule OCC_LOW_ZONE_HVAC_REDUCE triggered — conditions met" },
                      { step: 5, label: "Supervisor Consensus", detail: "5/6 agents agreed — consensus achieved in 340ms" },
                      { step: 6, label: "Decision Dispatch", detail: "HVAC Zone 3 reduction command sent — acknowledged by BMS" },
                    ].map((item) => (
                      <div key={item.step} className="flex gap-4 items-start">
                        <div className="w-6 h-6 rounded-full bg-[#111827] text-white text-[10px] font-bold flex items-center justify-center shrink-0 mt-0.5">
                          {item.step}
                        </div>
                        <div className="flex-1 bg-[#FAFAFA] border border-[#E5E7EB] rounded-xl p-3">
                          <div className="text-xs font-semibold text-[#111827]">{item.label}</div>
                          <div className="text-[11px] text-[#6B7280] mt-0.5">{item.detail}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {/* PREDICTIONS */}
          {activeTab === "predictions" && (
            <Card className="p-5 mt-4">
              <CardHeader className="pb-3">
                <CardTitle>60-Minute Confidence Forecast</CardTitle>
                <span className="text-xs text-[#6B7280]">Predicted vs actual confidence score</span>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={260}>
                  <LineChart data={PREDICTION_DATA} margin={{ top: 4, right: 8, left: -20, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#F3F4F6" />
                    <XAxis dataKey="time" tick={{ fontSize: 10, fill: "#9CA3AF" }} />
                    <YAxis domain={[70, 100]} tick={{ fontSize: 10, fill: "#9CA3AF" }} />
                    <Tooltip contentStyle={{ fontSize: 11, borderRadius: 12, border: "1px solid #E5E7EB" }} />
                    <Line type="monotone" dataKey="actual" stroke="#22C55E" strokeWidth={2.5} dot={{ r: 3 }} name="Actual" />
                    <Line type="monotone" dataKey="predicted" stroke="#6366F1" strokeWidth={2} strokeDasharray="5 3" dot={false} name="Predicted" />
                  </LineChart>
                </ResponsiveContainer>
                <div className="flex gap-4 mt-3">
                  <div className="flex items-center gap-1.5"><span className="w-3 h-0.5 bg-[#22C55E] inline-block" /><span className="text-[10px] text-[#6B7280]">Actual</span></div>
                  <div className="flex items-center gap-1.5"><span className="w-3 h-0.5 bg-[#6366F1] inline-block border-dashed" /><span className="text-[10px] text-[#6B7280]">Predicted</span></div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* CONFIDENCE */}
          {activeTab === "confidence" && (
            <Card className="p-5 mt-4">
              <CardHeader className="pb-3">
                <CardTitle>Confidence Score History</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={260}>
                  <AreaChart data={CONFIDENCE_HISTORY} margin={{ top: 4, right: 8, left: -20, bottom: 0 }}>
                    <defs>
                      <linearGradient id="confGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#6366F1" stopOpacity={0.15} />
                        <stop offset="95%" stopColor="#6366F1" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#F3F4F6" />
                    <XAxis dataKey="time" tick={{ fontSize: 10, fill: "#9CA3AF" }} />
                    <YAxis domain={[70, 100]} tick={{ fontSize: 10, fill: "#9CA3AF" }} />
                    <Tooltip contentStyle={{ fontSize: 11, borderRadius: 12, border: "1px solid #E5E7EB" }} />
                    <Area type="monotone" dataKey="confidence" stroke="#6366F1" strokeWidth={2.5} fill="url(#confGrad)" />
                  </AreaChart>
                </ResponsiveContainer>
                <div className="grid grid-cols-3 gap-3 mt-4">
                  {[
                    { label: "Current", value: `${agent.confidence}%` },
                    { label: "Average", value: "91%" },
                    { label: "Min (90 min)", value: "87%" },
                  ].map((s) => (
                    <div key={s.label} className="bg-[#FAFAFA] border border-[#E5E7EB] rounded-xl p-3 text-center">
                      <div className="text-lg font-bold text-[#111827]">{s.value}</div>
                      <div className="text-[10px] text-[#6B7280] uppercase tracking-wider mt-0.5">{s.label}</div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* EXECUTION LOGS */}
          {activeTab === "logs" && (
            <Card className="p-5 mt-4">
              <CardHeader className="pb-3">
                <CardTitle>Execution Logs</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="bg-[#111827] rounded-xl p-4 font-mono text-xs space-y-1.5 max-h-[360px] overflow-y-auto">
                  {MOCK_AGENT_LOGS.map((log, i) => (
                    <div key={i} className="flex gap-3">
                      <span className="text-[#6B7280] shrink-0">{log.ts}</span>
                      <span className={cn(
                        "shrink-0 font-bold",
                        log.level === "INFO" ? "text-[#22C55E]" : "text-[#F59E0B]"
                      )}>[{log.level}]</span>
                      <span className="text-[#E5E7EB]">{log.msg}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* TRIGGERED RULES */}
          {activeTab === "rules" && (
            <div className="mt-4 space-y-3">
              {MOCK_TRIGGERED_RULES.map((rule) => (
                <Card key={rule.id} className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-[#EEF2FF] flex items-center justify-center shrink-0">
                        <GitBranch className="w-4 h-4 text-[#6366F1]" />
                      </div>
                      <div>
                        <div className="text-sm font-semibold text-[#111827]">{rule.name}</div>
                        <div className="text-[10px] text-[#6B7280] font-mono mt-0.5">{rule.id}</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <Badge variant={rule.priority === "high" ? "danger" : rule.priority === "medium" ? "warning" : "neutral"}>
                        {rule.priority}
                      </Badge>
                      <span className="text-xs text-[#6B7280]">{rule.triggered}</span>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          )}

          {/* RECOMMENDATIONS */}
          {activeTab === "recommendations" && (
            <div className="mt-4 space-y-3">
              {MOCK_RECOMMENDATIONS.map((rec) => (
                <Card key={rec.id} className="p-4 hover:shadow-apple-hover transition-shadow">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex items-start gap-3">
                      <div className="w-8 h-8 rounded-lg bg-[#FFFBEB] flex items-center justify-center shrink-0 mt-0.5">
                        <Lightbulb className="w-4 h-4 text-[#F59E0B]" />
                      </div>
                      <div>
                        <div className="text-sm font-semibold text-[#111827]">{rec.title}</div>
                        <div className="flex items-center gap-2 mt-1">
                          <span className="text-xs text-[#22C55E] font-semibold">{rec.impact}</span>
                          <span className="text-[#E5E7EB]">·</span>
                          <span className="text-xs text-[#6B7280]">{rec.confidence}% confidence</span>
                        </div>
                      </div>
                    </div>
                    <Badge variant={rec.priority === "high" ? "danger" : "warning"}>{rec.priority}</Badge>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </motion.div>
      </SectionContainer>
    </PageContainer>
  );
}
