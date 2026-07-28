"use client";

import React, { useState, useCallback, useEffect, useRef } from "react";
import { PageContainer, SectionContainer } from "@/components/shared/page-container";
import { PageHeader } from "@/components/shared/page-header";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  SIMULATION_SCENARIOS,
  SIMULATION_STEPS,
  SIMULATION_TELEMETRY,
} from "@/components/ai/mock-data";
import {
  ReactFlow,
  Background,
  Controls,
  MiniMap,
  addEdge,
  useNodesState,
  useEdgesState,
  type Connection,
  type Node,
  type Edge,
  BackgroundVariant,
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";
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
  Play,
  Pause,
  RotateCcw,
  ChevronRight,
  Zap,
  CheckCircle2,
  Clock,
  AlertTriangle,
  Gauge,
  BookOpen,
  FlaskConical,
  Brain,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

// ─── React Flow initial graph ────────────────────────────────────────────────
const INITIAL_NODES: Node[] = [
  {
    id: "trigger",
    type: "default",
    position: { x: 80, y: 60 },
    data: { label: "🔔 Occupancy < 30%" },
    style: { background: "#EEF2FF", border: "1.5px solid #C7D2FE", borderRadius: 12, fontSize: 12, fontWeight: 600, color: "#4338CA", padding: "10px 16px" },
  },
  {
    id: "condition",
    type: "default",
    position: { x: 80, y: 180 },
    data: { label: "⚡ Peak Tariff Window?" },
    style: { background: "#FFFBEB", border: "1.5px solid #FDE68A", borderRadius: 12, fontSize: 12, fontWeight: 600, color: "#B45309", padding: "10px 16px" },
  },
  {
    id: "action-hvac",
    type: "default",
    position: { x: -60, y: 300 },
    data: { label: "❄️ Reduce HVAC +2°C" },
    style: { background: "#ECFDF5", border: "1.5px solid #A7F3D0", borderRadius: 12, fontSize: 12, fontWeight: 600, color: "#065F46", padding: "10px 16px" },
  },
  {
    id: "action-lights",
    type: "default",
    position: { x: 220, y: 300 },
    data: { label: "💡 Dim Lighting 40%" },
    style: { background: "#ECFDF5", border: "1.5px solid #A7F3D0", borderRadius: 12, fontSize: 12, fontWeight: 600, color: "#065F46", padding: "10px 16px" },
  },
  {
    id: "supervisor",
    type: "default",
    position: { x: 80, y: 420 },
    data: { label: "🧠 Supervisor Consensus" },
    style: { background: "#F9FAFB", border: "1.5px solid #E5E7EB", borderRadius: 12, fontSize: 12, fontWeight: 600, color: "#111827", padding: "10px 16px" },
  },
];

const INITIAL_EDGES: Edge[] = [
  { id: "e1", source: "trigger", target: "condition", animated: false, style: { stroke: "#C7D2FE", strokeWidth: 2 } },
  { id: "e2", source: "condition", target: "action-hvac", label: "YES", animated: false, style: { stroke: "#A7F3D0", strokeWidth: 2 } },
  { id: "e3", source: "condition", target: "action-lights", label: "YES", animated: false, style: { stroke: "#A7F3D0", strokeWidth: 2 } },
  { id: "e4", source: "action-hvac", target: "supervisor", animated: false, style: { stroke: "#E5E7EB", strokeWidth: 2 } },
  { id: "e5", source: "action-lights", target: "supervisor", animated: false, style: { stroke: "#E5E7EB", strokeWidth: 2 } },
];

type SimStatus = "idle" | "running" | "paused" | "done";

const SPEED_OPTIONS = [0.5, 1, 2, 4];

export default function SimulationStudioPage() {
  const [nodes, setNodes, onNodesChange] = useNodesState(INITIAL_NODES);
  const [edges, setEdges, onEdgesChange] = useEdgesState(INITIAL_EDGES);
  const [selectedScenario, setSelectedScenario] = useState(SIMULATION_SCENARIOS[0]);
  const [simStatus, setSimStatus] = useState<SimStatus>("idle");
  const [currentStep, setCurrentStep] = useState(0);
  const [speed, setSpeed] = useState(1);
  const [logs, setLogs] = useState<string[]>(["[System] Simulation Studio ready."]);
  const [activeTab, setActiveTab] = useState<"library" | "canvas">("canvas");
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const steps = SIMULATION_STEPS;

  const addLog = (msg: string) =>
    setLogs((prev) => [...prev, `[${new Date().toLocaleTimeString()}] ${msg}`]);

  const animateEdges = useCallback((active: boolean) => {
    setEdges((eds) => eds.map((e) => ({ ...e, animated: active })));
  }, [setEdges]);

  const highlightNode = useCallback((stepIdx: number) => {
    const nodeIds = ["trigger", "condition", "action-hvac", "supervisor", "supervisor", "supervisor", "supervisor"];
    const activeId = nodeIds[stepIdx] ?? null;
    setNodes((nds) =>
      nds.map((n) => ({
        ...n,
        style: {
          ...n.style,
          boxShadow: n.id === activeId ? "0 0 0 3px #22C55E" : "none",
        },
      }))
    );
  }, [setNodes]);

  const runStep = useCallback((step: number) => {
    if (step >= steps.length) {
      setSimStatus("done");
      animateEdges(false);
      addLog("Simulation completed successfully.");
      return;
    }
    const s = steps[step];
    addLog(`Step ${s.step}: ${s.label} — Agent: ${s.agent}`);
    highlightNode(step);
    setCurrentStep(step + 1);
  }, [steps, animateEdges, highlightNode]);

  useEffect(() => {
    if (simStatus === "running") {
      animateEdges(true);
      intervalRef.current = setInterval(() => {
        setCurrentStep((prev) => {
          const next = prev;
          if (next >= steps.length) {
            setSimStatus("done");
            animateEdges(false);
            if (intervalRef.current) clearInterval(intervalRef.current);
            return prev;
          }
          runStep(next);
          return next + 1;
        });
      }, 1200 / speed);
    } else {
      if (intervalRef.current) clearInterval(intervalRef.current);
      animateEdges(false);
    }
    return () => { if (intervalRef.current) clearInterval(intervalRef.current); };
  }, [simStatus, speed, runStep, steps.length, animateEdges]);

  const handlePlay = () => {
    if (simStatus === "done" || simStatus === "idle") {
      setCurrentStep(0);
      setLogs(["[System] Simulation started."]);
    }
    setSimStatus("running");
  };

  const handlePause = () => setSimStatus("paused");

  const handleReset = () => {
    setSimStatus("idle");
    setCurrentStep(0);
    setLogs(["[System] Simulation reset."]);
    animateEdges(false);
    setNodes((nds) => nds.map((n) => ({ ...n, style: { ...n.style, boxShadow: "none" } })));
  };

  const onConnect = useCallback(
    (connection: Connection) => setEdges((eds) => addEdge(connection, eds)),
    [setEdges]
  );

  return (
    <PageContainer>
      <SectionContainer>
        <PageHeader
          title="AI Simulation Studio"
          description="Design, simulate, and validate autonomous building optimization scenarios."
          actions={
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-1 bg-white border border-[#E5E7EB] rounded-xl px-2 py-1 shadow-xs">
                <span className="text-[10px] text-[#6B7280] font-semibold mr-1">Speed</span>
                {SPEED_OPTIONS.map((s) => (
                  <button
                    key={s}
                    onClick={() => setSpeed(s)}
                    className={cn(
                      "px-2 py-0.5 rounded-lg text-xs font-bold transition-colors",
                      speed === s ? "bg-[#111827] text-white" : "text-[#6B7280] hover:text-[#111827]"
                    )}
                  >
                    {s}x
                  </button>
                ))}
              </div>
              <Button variant="outline" size="sm" onClick={handleReset} className="bg-white gap-1.5 shadow-xs">
                <RotateCcw className="w-3.5 h-3.5" /> Reset
              </Button>
              {simStatus === "running" ? (
                <Button variant="outline" size="sm" onClick={handlePause} className="bg-white gap-1.5 shadow-xs">
                  <Pause className="w-3.5 h-3.5" /> Pause
                </Button>
              ) : (
                <Button variant="primary" size="sm" onClick={handlePlay} className="gap-1.5">
                  <Play className="w-3.5 h-3.5" />
                  {simStatus === "paused" ? "Resume" : "Run"}
                </Button>
              )}
            </div>
          }
        />
      </SectionContainer>

      {/* Status Bar */}
      <SectionContainer>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {[
            {
              label: "Status",
              value: simStatus === "idle" ? "Ready" : simStatus === "running" ? "Running" : simStatus === "paused" ? "Paused" : "Complete",
              icon: Gauge,
              color: simStatus === "running" ? "#22C55E" : simStatus === "done" ? "#6366F1" : simStatus === "paused" ? "#F59E0B" : "#9CA3AF",
            },
            { label: "Current Step", value: `${currentStep} / ${steps.length}`, icon: ChevronRight, color: "#3B82F6" },
            { label: "Scenario", value: selectedScenario.name.split(" ").slice(0, 2).join(" "), icon: FlaskConical, color: "#8B5CF6" },
            { label: "Speed", value: `${speed}x`, icon: Zap, color: "#F59E0B" },
          ].map((m) => {
            const Icon = m.icon;
            return (
              <Card key={m.label} className="p-4">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-xl flex items-center justify-center shrink-0" style={{ backgroundColor: `${m.color}15` }}>
                    <Icon className="w-4 h-4" style={{ color: m.color }} />
                  </div>
                  <div>
                    <div className="text-sm font-bold text-[#111827] truncate">{m.value}</div>
                    <div className="text-[10px] text-[#6B7280] uppercase tracking-wider">{m.label}</div>
                  </div>
                </div>
              </Card>
            );
          })}
        </div>
      </SectionContainer>

      {/* Main Layout */}
      <SectionContainer>
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">

          {/* Left: Scenario Library + Timeline */}
          <div className="flex flex-col gap-4">
            {/* Tab Toggle */}
            <div className="flex gap-1 bg-[#F3F4F6] rounded-xl p-1">
              {(["library", "canvas"] as const).map((t) => (
                <button
                  key={t}
                  onClick={() => setActiveTab(t)}
                  className={cn(
                    "flex-1 text-xs font-semibold py-1.5 rounded-lg transition-colors capitalize",
                    activeTab === t ? "bg-white text-[#111827] shadow-xs" : "text-[#6B7280]"
                  )}
                >
                  {t === "library" ? "Library" : "Steps"}
                </button>
              ))}
            </div>

            {activeTab === "library" ? (
              <div className="space-y-2">
                {SIMULATION_SCENARIOS.map((sc) => (
                  <button
                    key={sc.id}
                    onClick={() => setSelectedScenario(sc)}
                    className={cn(
                      "w-full text-left p-3 rounded-xl border transition-all",
                      selectedScenario.id === sc.id
                        ? "border-[#111827] bg-[#FAFAFA] shadow-xs"
                        : "border-[#E5E7EB] bg-white hover:bg-[#FAFAFA]"
                    )}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="text-xs font-semibold text-[#111827] leading-snug">{sc.name}</div>
                      <Badge variant={sc.result === "success" ? "success" : "warning"} className="shrink-0 text-[9px]">
                        {sc.result}
                      </Badge>
                    </div>
                    <div className="text-[10px] text-[#6B7280] mt-1 leading-snug line-clamp-2">{sc.description}</div>
                    <div className="flex items-center gap-2 mt-2">
                      {sc.tags.map((tag) => (
                        <span key={tag} className="text-[9px] bg-[#F3F4F6] text-[#6B7280] px-1.5 py-0.5 rounded-md font-medium">{tag}</span>
                      ))}
                    </div>
                    <div className="text-[10px] text-[#9CA3AF] mt-1.5">Last run: {sc.lastRun} · {sc.savings}</div>
                  </button>
                ))}
              </div>
            ) : (
              /* Step Timeline */
              <Card className="p-4">
                <div className="text-[10px] font-bold text-[#6B7280] uppercase tracking-wider mb-3">Simulation Steps</div>
                <div className="space-y-2">
                  {steps.map((s, i) => {
                    const isDone = i < currentStep;
                    const isActive = i === currentStep - 1 && simStatus === "running";
                    return (
                      <div key={s.step} className="flex gap-3 items-center">
                        <div className={cn(
                          "w-5 h-5 rounded-full flex items-center justify-center shrink-0 text-[9px] font-bold",
                          isDone ? "bg-[#22C55E] text-white" : isActive ? "bg-[#3B82F6] text-white animate-pulse" : "bg-[#F3F4F6] text-[#9CA3AF]"
                        )}>
                          {isDone ? <CheckCircle2 className="w-3 h-3" /> : s.step}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className={cn("text-xs font-medium truncate", isDone ? "text-[#111827]" : "text-[#9CA3AF]")}>{s.label}</div>
                          <div className="text-[9px] text-[#9CA3AF]">{s.agent}</div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </Card>
            )}

            {/* AI Decisions Log */}
            <Card className="p-4 flex-1">
              <div className="text-[10px] font-bold text-[#6B7280] uppercase tracking-wider mb-2 flex items-center gap-1.5">
                <Brain className="w-3 h-3" /> AI Decisions
              </div>
              <div className="bg-[#111827] rounded-xl p-3 font-mono text-[9px] space-y-1 max-h-[160px] overflow-y-auto">
                {logs.map((log, i) => (
                  <div key={i} className="text-[#A3E635] leading-relaxed">{log}</div>
                ))}
              </div>
            </Card>
          </div>

          {/* Center: React Flow Canvas */}
          <div className="lg:col-span-2 flex flex-col gap-4">
            <Card className="p-0 overflow-hidden" style={{ height: 420 }}>
              <ReactFlow
                nodes={nodes}
                edges={edges}
                onNodesChange={onNodesChange}
                onEdgesChange={onEdgesChange}
                onConnect={onConnect}
                fitView
                attributionPosition="bottom-right"
              >
                <Background variant={BackgroundVariant.Dots} gap={20} size={1} color="#E5E7EB" />
                <Controls showInteractive={false} />
                <MiniMap nodeStrokeWidth={2} zoomable pannable style={{ background: "#FAFAFA", border: "1px solid #E5E7EB", borderRadius: 8 }} />
              </ReactFlow>
            </Card>

            {/* Telemetry Chart */}
            <Card className="p-5">
              <CardHeader className="pb-3">
                <CardTitle>Simulation Telemetry</CardTitle>
                <span className="text-xs text-[#6B7280]">Power (kW) · Temperature (°C) · Occupancy (%)</span>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={160}>
                  <LineChart data={SIMULATION_TELEMETRY} margin={{ top: 4, right: 8, left: -20, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#F3F4F6" />
                    <XAxis dataKey="t" tick={{ fontSize: 10, fill: "#9CA3AF" }} />
                    <YAxis tick={{ fontSize: 10, fill: "#9CA3AF" }} />
                    <Tooltip contentStyle={{ fontSize: 11, borderRadius: 12, border: "1px solid #E5E7EB" }} />
                    <Line type="monotone" dataKey="power" stroke="#3B82F6" strokeWidth={2} dot={false} name="Power kW" />
                    <Line type="monotone" dataKey="occupancy" stroke="#6366F1" strokeWidth={2} dot={false} name="Occupancy %" />
                    <Line type="monotone" dataKey="temp" stroke="#F59E0B" strokeWidth={2} dot={false} name="Temp °C" />
                  </LineChart>
                </ResponsiveContainer>
                <div className="flex gap-4 mt-2">
                  {[["Power kW", "#3B82F6"], ["Occupancy %", "#6366F1"], ["Temp °C", "#F59E0B"]].map(([label, color]) => (
                    <div key={label} className="flex items-center gap-1.5">
                      <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: color }} />
                      <span className="text-[10px] text-[#6B7280]">{label}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right: Scenario Details */}
          <div className="flex flex-col gap-4">
            <Card className="p-4">
              <div className="text-[10px] font-bold text-[#6B7280] uppercase tracking-wider mb-3 flex items-center gap-1.5">
                <BookOpen className="w-3 h-3" /> Scenario Details
              </div>
              <div className="space-y-3">
                <div>
                  <div className="text-sm font-bold text-[#111827]">{selectedScenario.name}</div>
                  <div className="text-xs text-[#6B7280] mt-1 leading-relaxed">{selectedScenario.description}</div>
                </div>
                <div className="h-px bg-[#E5E7EB]" />
                <div className="grid grid-cols-2 gap-2">
                  <div className="bg-[#FAFAFA] border border-[#E5E7EB] rounded-xl p-2.5 text-center">
                    <div className="text-sm font-bold text-[#111827]">{selectedScenario.savings}</div>
                    <div className="text-[9px] text-[#6B7280] uppercase tracking-wider mt-0.5">Savings</div>
                  </div>
                  <div className="bg-[#FAFAFA] border border-[#E5E7EB] rounded-xl p-2.5 text-center">
                    <Badge variant={selectedScenario.result === "success" ? "success" : "warning"}>
                      {selectedScenario.result}
                    </Badge>
                    <div className="text-[9px] text-[#6B7280] uppercase tracking-wider mt-1">Last Result</div>
                  </div>
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {selectedScenario.tags.map((tag) => (
                    <span key={tag} className="text-[10px] bg-[#EEF2FF] text-[#4338CA] px-2 py-0.5 rounded-full font-medium">{tag}</span>
                  ))}
                </div>
              </div>
            </Card>

            {/* Simulation Progress */}
            <Card className="p-4">
              <div className="text-[10px] font-bold text-[#6B7280] uppercase tracking-wider mb-3">Progress</div>
              <div className="mb-2 flex justify-between text-xs">
                <span className="text-[#6B7280]">Steps completed</span>
                <span className="font-bold text-[#111827]">{currentStep}/{steps.length}</span>
              </div>
              <div className="w-full h-2 bg-[#F3F4F6] rounded-full overflow-hidden">
                <motion.div
                  className="h-full bg-[#22C55E] rounded-full"
                  animate={{ width: `${(currentStep / steps.length) * 100}%` }}
                  transition={{ duration: 0.4 }}
                />
              </div>
              {simStatus === "done" && (
                <motion.div
                  initial={{ opacity: 0, y: 4 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mt-3 p-3 bg-[#F0FDF4] border border-[#A7F3D0] rounded-xl"
                >
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-[#22C55E]" />
                    <span className="text-xs font-semibold text-[#065F46]">Simulation complete</span>
                  </div>
                  <div className="text-[10px] text-[#047857] mt-1">Estimated savings: {selectedScenario.savings}</div>
                </motion.div>
              )}
            </Card>

            {/* Playback Controls (mobile-friendly duplicate) */}
            <Card className="p-4">
              <div className="text-[10px] font-bold text-[#6B7280] uppercase tracking-wider mb-3">Playback</div>
              <div className="flex gap-2">
                <Button
                  variant={simStatus === "running" ? "outline" : "primary"}
                  size="sm"
                  className="flex-1 gap-1.5"
                  onClick={simStatus === "running" ? handlePause : handlePlay}
                >
                  {simStatus === "running" ? <><Pause className="w-3.5 h-3.5" /> Pause</> : <><Play className="w-3.5 h-3.5" /> {simStatus === "paused" ? "Resume" : "Run"}</>}
                </Button>
                <Button variant="outline" size="sm" onClick={handleReset} className="bg-white">
                  <RotateCcw className="w-3.5 h-3.5" />
                </Button>
              </div>
            </Card>
          </div>
        </div>
      </SectionContainer>
    </PageContainer>
  );
}
