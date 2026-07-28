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
  MOCK_TRIGGERED_RULES,
  MOCK_RECOMMENDATIONS,
  MOCK_LIVE_ACTIVITY,
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
  ArrowLeft,
  RefreshCw,
  Activity,
  Brain,
  Clock,
  CheckCircle2,
  ChevronRight,
  Lightbulb,
  BarChart2,
  Terminal,
  GitBranch,
  TrendingUp,
  FileJson,
  Sparkles,
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
  { id: "developer", label: "Developer Mode", icon: FileJson },
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

function Bar({ value }: { value: number }) {
  return (
    <div className="h-2 rounded-full bg-[#F3F4F6] overflow-hidden">
      <div className="h-full rounded-full bg-[#111827]" style={{ width: `${value}%` }} />
    </div>
  );
}

export default function AgentDetailPage() {
  const params = useParams();
  const agentId = params?.id as string;
  const [activeTab, setActiveTab] = useState<TabId>("overview");

  const agent = MOCK_AGENTS.find((a) => a.id === agentId) ?? MOCK_AGENTS[0];

  const agentTelemetry = MOCK_AGENT_TELEMETRY.map((row) => ({
    time: row.time,
    value: row[agent.type as keyof typeof row] as number,
  }));

  const telemetryRows: Array<[string, React.ReactNode]> = [
    ["Current Occupancy", String(agent.outputJson.current_occupancy ?? 12)],
    ["Trend", "Stable"],
    ["Prediction", "15m: 13, 30m: 14, 60m: 15"],
    ["Activity Level", "Low"],
    ["Utilization", "Underutilized"],
    ["Business Rules Triggered", "Ghost booking guard, low utilization"],
  ];

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
                <span className="text-[#E5E7EB]">·</span>
                <span className="text-sm text-[#6B7280]">Scenario {agent.scenario}</span>
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
            { label: "Evaluation", value: `${agent.evaluationScore}%`, icon: Brain, color: "#3B82F6" },
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
                  <div className="space-y-3">
                    <div className="bg-[#FAFAFA] border border-[#E5E7EB] rounded-xl p-4">
                      <div className="text-sm font-semibold text-[#111827]">{agent.lastDecision}</div>
                    </div>
                    <div className="bg-[#F8FAFC] border border-[#E5E7EB] rounded-xl p-4 space-y-3">
                      <div>
                        <div className="text-[10px] font-bold text-[#6B7280] uppercase tracking-wider mb-2">Evidence</div>
                        <div className="space-y-1.5">
                          {agent.reasoningBlocks.evidence.map((item) => (
                            <div key={item} className="text-xs text-[#111827] flex items-start gap-2">
                              <span className="mt-1 w-1.5 h-1.5 rounded-full bg-[#6366F1] shrink-0" />
                              <span>{item}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                      <div>
                        <div className="text-[10px] font-bold text-[#6B7280] uppercase tracking-wider mb-2">Reasoning</div>
                        <div className="space-y-1.5">
                          {agent.reasoningBlocks.reasoning.map((item) => (
                            <div key={item} className="text-xs text-[#111827] flex items-start gap-2">
                              <Sparkles className="w-3 h-3 mt-0.5 text-[#22C55E] shrink-0" />
                              <span>{item}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
              <Card className="p-5">
                <CardHeader className="pb-3">
                  <CardTitle>Confidence Breakdown</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {agent.reasoningBlocks.confidence.map((metric) => (
                      <div key={metric.label}>
                        <div className="flex items-center justify-between text-[11px] text-[#111827] mb-1">
                          <span>{metric.label}</span>
                          <span className="font-semibold">{metric.value}%</span>
                        </div>
                        <Bar value={metric.value} />
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {/* TELEMETRY */}
          {activeTab === "telemetry" && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mt-4">
              <Card className="p-5">
                <CardHeader className="pb-3">
                  <CardTitle>Input Telemetry</CardTitle>
                  <span className="text-xs text-[#6B7280]">Telemetry snapshot for operator review</span>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {telemetryRows.map(([label, value]) => (
                      <div key={label} className="flex items-center justify-between gap-3 rounded-xl border border-[#E5E7EB] bg-[#FAFAFA] px-3 py-2">
                        <span className="text-xs text-[#6B7280]">{label}</span>
                        <span className="text-xs font-semibold text-[#111827] text-right">{String(value)}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card className="p-5">
                <CardHeader className="pb-3">
                  <CardTitle>Occupancy History</CardTitle>
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
            </div>
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
                      { step: 1, label: "Telemetry", detail: "Occupancy 12%, motion none, door events 0" },
                      { step: 2, label: "Occupancy Agent", detail: "Ghost booking guard triggered after 45 minutes of inactivity" },
                      { step: 3, label: "Supervisor", detail: "Recommendation accepted with 94% confidence" },
                      { step: 4, label: "Consensus", detail: "5/6 agents aligned on the same action" },
                      { step: 5, label: "Recommendation", detail: "HVAC reduction recommended for low utilization" },
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
                <CardTitle>Prediction Horizon</CardTitle>
                <span className="text-xs text-[#6B7280]">Occupancy forecast for the next 60 minutes</span>
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
                <CardTitle>Confidence Breakdown</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-3">
                    {agent.reasoningBlocks.confidence.map((metric) => (
                      <div key={metric.label}>
                        <div className="flex items-center justify-between text-[11px] text-[#111827] mb-1">
                          <span>{metric.label}</span>
                          <span className="font-semibold">{metric.value}%</span>
                        </div>
                        <Bar value={metric.value} />
                      </div>
                    ))}
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    {[
                      { label: "Current", value: `${agent.confidence}%` },
                      { label: "Average", value: "91%" },
                      { label: "Min (90 min)", value: "87%" },
                      { label: "Evaluation", value: `${agent.evaluationScore}%` },
                    ].map((s) => (
                      <div key={s.label} className="bg-[#FAFAFA] border border-[#E5E7EB] rounded-xl p-3 text-center">
                        <div className="text-lg font-bold text-[#111827]">{s.value}</div>
                        <div className="text-[10px] text-[#6B7280] uppercase tracking-wider mt-0.5">{s.label}</div>
                      </div>
                    ))}
                  </div>
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
                  {MOCK_LIVE_ACTIVITY.map((log, i) => (
                    <div key={i} className="flex gap-3">
                      <span className="text-[#6B7280] shrink-0">{log.time}</span>
                      <span className={cn(
                        "shrink-0 font-bold",
                        log.status === "success" ? "text-[#22C55E]" : log.status === "warning" ? "text-[#F59E0B]" : "text-[#93C5FD]"
                      )}>[{log.status.toUpperCase()}]</span>
                      <span className="text-[#E5E7EB]">{log.message}</span>
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

          {activeTab === "developer" && (
            <Card className="p-5 mt-4">
              <CardHeader className="pb-3">
                <CardTitle>Developer Mode</CardTitle>
                <span className="text-xs text-[#6B7280]">Raw output JSON for debugging and evaluation</span>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                  <div className="space-y-3">
                    <div className="bg-[#FAFAFA] border border-[#E5E7EB] rounded-xl p-4">
                      <div className="text-[10px] font-bold text-[#6B7280] uppercase tracking-wider mb-2">Output JSON</div>
                      <pre className="text-xs text-[#111827] overflow-auto whitespace-pre-wrap">{JSON.stringify(agent.outputJson, null, 2)}</pre>
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      {[
                        { label: "Execution Time", value: `${agent.latency}ms` },
                        { label: "Evaluation Score", value: `${agent.evaluationScore}%` },
                        { label: "History", value: `${agent.decisionsToday} decisions today` },
                        { label: "Scenario", value: agent.scenario },
                      ].map((item) => (
                        <div key={item.label} className="rounded-xl border border-[#E5E7EB] bg-[#FAFAFA] p-3">
                          <div className="text-[10px] font-bold text-[#6B7280] uppercase tracking-wider mb-1">{item.label}</div>
                          <div className="text-sm font-semibold text-[#111827]">{item.value}</div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-3">
                    <div className="bg-[#F8FAFC] border border-[#E5E7EB] rounded-xl p-4">
                      <div className="text-[10px] font-bold text-[#6B7280] uppercase tracking-wider mb-2">Triggered Rules</div>
                      <div className="space-y-2 text-xs text-[#111827]">
                        {agent.anomalyBadges.map((badge) => (
                          <div key={badge} className="flex items-center justify-between rounded-lg bg-white border border-[#E5E7EB] px-3 py-2">
                            <span>{badge}</span>
                            <Badge variant={badge === "Normal" ? "success" : badge === "Ghost Booking" ? "warning" : "neutral"}>{badge}</Badge>
                          </div>
                        ))}
                      </div>
                    </div>
                    <div className="bg-[#F8FAFC] border border-[#E5E7EB] rounded-xl p-4">
                      <div className="text-[10px] font-bold text-[#6B7280] uppercase tracking-wider mb-2">Live Activity</div>
                      <div className="space-y-2">
                        {MOCK_LIVE_ACTIVITY.map((item) => (
                          <div key={item.time} className="rounded-lg border border-[#E5E7EB] bg-white px-3 py-2">
                            <div className="flex items-center justify-between gap-3">
                              <span className="text-xs font-semibold text-[#111827]">{item.message}</span>
                              <span className="text-[10px] text-[#6B7280]">{item.time}</span>
                            </div>
                            <div className="text-[11px] text-[#6B7280] mt-1">{item.detail}</div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </motion.div>
      </SectionContainer>
    </PageContainer>
  );
}
