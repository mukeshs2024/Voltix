"use client";

import React, { useMemo, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { PageContainer, SectionContainer } from "@/components/shared/page-container";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { StatusBadge } from "@/components/shared/status-badge";
import { MetricCard } from "@/components/shared/metric-card";
import { DataTable } from "@/components/shared/data-table";
import { EmptyState } from "@/components/shared/empty-state";
import {
  Building2,
  ArrowLeft,
  Download,
  Gauge,
  Leaf,
  Thermometer,
  Wind,
  Bot,
  MapPinned,
  Layers3,
  Activity,
  ShieldCheck,
  RefreshCw,
  CircleCheckBig,
  PauseCircle,
  PlayCircle,
  CheckCheck,
  Sparkles,
} from "lucide-react";
import {
  BuildingEquipmentRow,
  BuildingRecommendation,
  BuildingAnomaly,
  BuildingAgentRecord,
  BuildingAlertRecord,
  BuildingZone,
  BuildingFloor,
  getBuildingDetail,
} from "@/data/buildings";
import { cn } from "@/lib/utils";

type SectionKey =
  | "overview"
  | "health"
  | "occupancy"
  | "comfort"
  | "carbon"
  | "confidence"
  | "twin"
  | "floors"
  | "zones"
  | "systems"
  | "telemetry"
  | "decisions"
  | "predictions"
  | "recommendations"
  | "equipment"
  | "history"
  | "anomalies"
  | "weather"
  | "alerts"
  | "agents";

const sectionLabels: Array<{ key: SectionKey; label: string }> = [
  { key: "overview", label: "Overview" },
  { key: "health", label: "Health" },
  { key: "occupancy", label: "Occupancy" },
  { key: "comfort", label: "Comfort" },
  { key: "carbon", label: "Carbon" },
  { key: "confidence", label: "AI Confidence" },
  { key: "twin", label: "Digital Twin" },
  { key: "floors", label: "Floor Navigation" },
  { key: "zones", label: "Zone Cards" },
  { key: "systems", label: "Systems" },
  { key: "telemetry", label: "Live Telemetry" },
  { key: "decisions", label: "AI + Supervisor" },
  { key: "predictions", label: "Prediction Timeline" },
  { key: "recommendations", label: "Recommendations" },
  { key: "equipment", label: "Equipment" },
  { key: "history", label: "History" },
  { key: "anomalies", label: "Anomalies" },
  { key: "weather", label: "Weather" },
  { key: "alerts", label: "Alerts" },
  { key: "agents", label: "AI Agents" },
];

function statusTone(status: string) {
  switch (status) {
    case "critical":
    case "service":
    case "paused":
    case "overridden":
      return "text-[#B91C1C] bg-[#EF4444]/10";
    case "watch":
    case "review":
      return "text-[#B45309] bg-[#F59E0B]/10";
    case "optimization":
    case "learning":
    case "syncing":
      return "text-[#1D4ED8] bg-[#DBEAFE]";
    case "applied":
    case "approved":
    case "online":
    case "stable":
      return "text-[#15803D] bg-[#22C55E]/10";
    default:
      return "text-[#4B5563] bg-[#F3F4F6]";
  }
}

export default function BuildingDetailPage() {
  const router = useRouter();
  const params = useParams<{ id?: string | string[] }>();
  const detail = useMemo(() => getBuildingDetail(params?.id), [params?.id]);

  const [activeSection, setActiveSection] = useState<SectionKey>("overview");
  const [selectedFloor, setSelectedFloor] = useState<BuildingFloor>(detail.floors[0]);
  const [selectedZone, setSelectedZone] = useState<BuildingZone>(detail.zonesByFloor[detail.floors[0].id][0]);
  const [currentDecisionState, setCurrentDecisionState] = useState(detail.currentDecision.state);
  const [supervisorDecisionState, setSupervisorDecisionState] = useState(detail.supervisorDecision.state);
  const [timelineWindow, setTimelineWindow] = useState<"1h" | "6h" | "24h">("6h");
  const [appliedRecommendations, setAppliedRecommendations] = useState<string[]>([]);
  const [visibleAlerts, setVisibleAlerts] = useState<BuildingAlertRecord[]>(detail.currentAlerts);
  const [selectedAnomaly, setSelectedAnomaly] = useState<BuildingAnomaly>(detail.anomalies[0]);
  const [weatherMode, setWeatherMode] = useState<"current" | "forecast">("current");
  const [agentStates, setAgentStates] = useState<BuildingAgentRecord[]>(detail.agents);
  const [simulationTick, setSimulationTick] = useState(0);

  function scrollToSection(section: SectionKey) {
    setActiveSection(section);
    document.getElementById(section)?.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  function exportSnapshot() {
    const payload = JSON.stringify(detail, null, 2);
    const blob = new Blob([payload], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = `${detail.name.toLowerCase().replace(/\s+/g, "-")}-snapshot.json`;
    document.body.appendChild(anchor);
    anchor.click();
    anchor.remove();
    URL.revokeObjectURL(url);
  }

  function cycleDecisionState() {
    setCurrentDecisionState((current) => (current === "ready" ? "executing" : current === "executing" ? "paused" : "ready"));
  }

  function updateSupervisorDecision() {
    setSupervisorDecisionState((current) => (current === "approved" ? "review" : current === "review" ? "overridden" : "approved"));
  }

  function acknowledgeAlert(alertId?: string) {
    if (alertId) {
      setVisibleAlerts((current) => current.filter((alert) => alert.id !== alertId));
      return;
    }

    setVisibleAlerts([]);
  }

  function applyRecommendation(recommendation: BuildingRecommendation) {
    setAppliedRecommendations((current) => (current.includes(recommendation.id) ? current : [...current, recommendation.id]));
  }

  function toggleAgent(agentId: string) {
    setAgentStates((current) =>
      current.map((agent) =>
        agent.id === agentId
          ? {
              ...agent,
              status: agent.status === "paused" ? "online" : "paused",
              lastAction: agent.status === "paused" ? "Resumed by supervisor" : "Paused for local review",
            }
          : agent
      )
    );
  }

  function refreshWeather() {
    setWeatherMode((current) => (current === "current" ? "forecast" : "current"));
  }

  function runSimulation() {
    setSimulationTick((current) => current + 1);
    setCurrentDecisionState("executing");
  }

  const activeZones = detail.zonesByFloor[selectedFloor.id] ?? [];

  const equipmentColumns = [
    {
      header: "Equipment",
      accessor: (row: BuildingEquipmentRow) => (
        <div>
          <div className="font-semibold text-[#111827]">{row.name}</div>
          <div className="text-xs text-[#6B7280]">{row.system}</div>
        </div>
      ),
    },
    {
      header: "Status",
      accessor: (row: BuildingEquipmentRow) => <span className={cn("inline-flex px-2.5 py-1 rounded-full text-xs font-medium", statusTone(row.status))}>{row.status}</span>,
    },
    {
      header: "Load",
      accessor: (row: BuildingEquipmentRow) => <span className="font-medium text-[#111827]">{row.loadKw} kW</span>,
    },
    {
      header: "Efficiency",
      accessor: (row: BuildingEquipmentRow) => <span className="font-medium text-[#111827]">{row.efficiency}%</span>,
    },
    {
      header: "Runtime",
      accessor: (row: BuildingEquipmentRow) => <span className="font-medium text-[#111827]">{row.runtimeHours} h</span>,
    },
    {
      header: "Last Service",
      accessor: (row: BuildingEquipmentRow) => <span className="text-[#6B7280]">{row.lastService}</span>,
    },
    {
      header: "Action",
      accessor: (row: BuildingEquipmentRow) => {
        void row;

        return (
        <div className="flex gap-2">
          <Button variant="outline" size="sm" className="bg-white" onClick={() => setSelectedAnomaly(detail.anomalies[0])}>
            Review
          </Button>
          <Button variant="ghost" size="sm" onClick={() => setCurrentDecisionState("paused")}>
            Isolate
          </Button>
        </div>
        );
      },
    },
  ];

  const displayedWeather = weatherMode === "current"
    ? detail.weather
    : {
        ...detail.weather,
        temperature: detail.weather.temperature + 2,
        condition: `${detail.weather.condition} with afternoon cooling`,
        forecast: "Forecast indicates stable occupancy and a light load reduction after 5 pm.",
      };

  if (!detail) {
    return (
      <PageContainer>
        <SectionContainer>
          <EmptyState
            icon={Building2}
            title="Building not available"
            description="The selected building could not be resolved from the mock portfolio."
            actionLabel="Return to Buildings"
            onAction={() => router.push("/buildings")}
          />
        </SectionContainer>
      </PageContainer>
    );
  }

  return (
    <PageContainer>
      <SectionContainer>
        <div className="flex flex-col gap-6">
          <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-6">
            <div className="space-y-4">
              <div className="flex items-center gap-3 flex-wrap">
                <Button variant="outline" size="sm" className="bg-white" onClick={() => router.push("/buildings")}>
                  <ArrowLeft className="w-4 h-4" />
                  Back to Grid
                </Button>
                <StatusBadge status={detail.status} />
                <Badge variant="neutral">{detail.location}</Badge>
              </div>
              <div>
                <h1 className="text-3xl font-bold tracking-tight text-[#111827]">{detail.name}</h1>
                <p className="text-sm text-[#6B7280] mt-2 max-w-2xl">{detail.digitalTwinSummary}</p>
              </div>
              <div className="flex flex-wrap gap-2">
                <Badge variant="success">AI Score {detail.aiScore}</Badge>
                <Badge variant="neutral">Health {detail.healthScore}</Badge>
                <Badge variant="neutral">Comfort {detail.comfortScore}</Badge>
                <Badge variant="warning">{detail.activeAlerts} live alerts</Badge>
              </div>
            </div>

            <div className="flex flex-wrap gap-2">
              <Button variant="outline" size="sm" className="bg-white" onClick={exportSnapshot}>
                <Download className="w-4 h-4" />
                Export Snapshot
              </Button>
              <Button variant="outline" size="sm" className="bg-white" onClick={runSimulation}>
                <RefreshCw className="w-4 h-4" />
                Run Simulation
              </Button>
              <Button variant="primary" size="sm" className="bg-[#111827] text-white border-none" onClick={() => acknowledgeAlert()}>
                <CheckCheck className="w-4 h-4" />
                Acknowledge Alerts
              </Button>
            </div>
          </div>

          <div className="rounded-[24px] border border-[#E5E7EB] bg-white p-4 shadow-apple overflow-x-auto">
            <div className="flex gap-2 min-w-max">
              {sectionLabels.map((section) => (
                <Button
                  key={section.key}
                  variant={activeSection === section.key ? "secondary" : "ghost"}
                  size="sm"
                  onClick={() => scrollToSection(section.key)}
                  className={cn(
                    "whitespace-nowrap",
                    activeSection === section.key ? "bg-[#111827] text-white hover:bg-[#111827]" : "bg-transparent"
                  )}
                >
                  {section.label}
                </Button>
              ))}
            </div>
          </div>
        </div>
      </SectionContainer>

      <SectionContainer id="overview">
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-5 gap-6">
          <MetricCard title="Building Overview" value={`${detail.floorCount} floors`} delay={0.05} />
          <MetricCard title="Health" value={detail.healthScore} delay={0.1} />
          <MetricCard title="Occupancy" value={`${detail.occupancyRate}%`} delay={0.15} />
          <MetricCard title="Comfort" value={detail.comfortScore} delay={0.2} />
          <MetricCard title="Carbon" value={`${detail.carbonTons} tons`} delay={0.25} />
        </div>
      </SectionContainer>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        <SectionContainer id="health" className="xl:col-span-2">
          <Card>
            <CardHeader>
              <div>
                <CardTitle>Health Snapshot</CardTitle>
                <CardDescription>Live AI score, health state, and control confidence.</CardDescription>
              </div>
              <Badge variant="neutral">Tick {simulationTick}</Badge>
            </CardHeader>
            <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="rounded-[18px] border border-[#E5E7EB] bg-[#FAFAFA] p-4">
                <div className="text-xs uppercase tracking-wider text-[#6B7280] font-semibold mb-2">AI Score</div>
                <div className="text-3xl font-bold text-[#111827]">{detail.aiScore}</div>
                <div className="mt-3 h-2 rounded-full bg-[#E5E7EB] overflow-hidden"><div className="h-full bg-[#111827] rounded-full" style={{ width: `${detail.aiScore}%` }} /></div>
              </div>
              <div className="rounded-[18px] border border-[#E5E7EB] bg-[#FAFAFA] p-4">
                <div className="text-xs uppercase tracking-wider text-[#6B7280] font-semibold mb-2">AI Confidence</div>
                <div className="text-3xl font-bold text-[#111827]">{detail.aiConfidence}%</div>
                <div className="mt-3 text-sm text-[#6B7280]">System confidence is strong enough for autonomous execution.</div>
              </div>
              <div className="rounded-[18px] border border-[#E5E7EB] bg-[#FAFAFA] p-4">
                <div className="text-xs uppercase tracking-wider text-[#6B7280] font-semibold mb-2">Digital Twin State</div>
                <div className="text-lg font-semibold text-[#111827]">{detail.digitalTwinSummary}</div>
                <Button variant="outline" size="sm" className="mt-4 bg-white" onClick={() => scrollToSection("twin")}>Open Twin</Button>
              </div>
            </CardContent>
          </Card>
        </SectionContainer>

        <SectionContainer id="occupancy">
          <Card>
            <CardHeader>
              <div>
                <CardTitle>Occupancy</CardTitle>
                <CardDescription>Floor-by-floor density and current load.</CardDescription>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {detail.floors.map((floor) => (
                <div key={floor.id} className="rounded-[18px] border border-[#E5E7EB] bg-[#FAFAFA] p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="font-semibold text-[#111827]">{floor.label}</div>
                      <div className="text-xs text-[#6B7280]">{floor.occupancy}% occupancy</div>
                    </div>
                    <Badge variant={floor.status === "stable" ? "success" : floor.status === "watch" ? "warning" : "accent"}>{floor.status}</Badge>
                  </div>
                  <div className="mt-3 h-2 rounded-full bg-[#E5E7EB] overflow-hidden"><div className="h-full bg-[#111827] rounded-full" style={{ width: `${floor.occupancy}%` }} /></div>
                </div>
              ))}
            </CardContent>
          </Card>
        </SectionContainer>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        <SectionContainer id="comfort">
          <Card>
            <CardHeader>
              <div>
                <CardTitle>Comfort</CardTitle>
                <CardDescription>Selected zone comfort, airflow, and humidity.</CardDescription>
              </div>
              <Badge variant="neutral">{selectedZone.name}</Badge>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-3 gap-3">
                <div className="rounded-[16px] bg-[#FAFAFA] border border-[#E5E7EB] p-3 text-center">
                  <div className="text-xs text-[#6B7280] uppercase font-semibold">Comfort</div>
                  <div className="text-2xl font-bold text-[#111827]">{selectedZone.comfort}</div>
                </div>
                <div className="rounded-[16px] bg-[#FAFAFA] border border-[#E5E7EB] p-3 text-center">
                  <div className="text-xs text-[#6B7280] uppercase font-semibold">Humidity</div>
                  <div className="text-2xl font-bold text-[#111827]">{selectedZone.humidity}%</div>
                </div>
                <div className="rounded-[16px] bg-[#FAFAFA] border border-[#E5E7EB] p-3 text-center">
                  <div className="text-xs text-[#6B7280] uppercase font-semibold">Airflow</div>
                  <div className="text-2xl font-bold text-[#111827]">{selectedZone.airflow}</div>
                </div>
              </div>
              <div className="flex gap-2 flex-wrap">
                <Button variant="outline" size="sm" className="bg-white" onClick={() => setSelectedZone(activeZones[0])}>Focus Zone 1</Button>
                <Button variant="outline" size="sm" className="bg-white" onClick={() => setSelectedZone(activeZones[1] ?? activeZones[0])}>Focus Zone 2</Button>
                <Button variant="outline" size="sm" className="bg-white" onClick={() => setSelectedZone(activeZones[2] ?? activeZones[0])}>Focus Zone 3</Button>
              </div>
            </CardContent>
          </Card>
        </SectionContainer>

        <SectionContainer id="carbon">
          <Card>
            <CardHeader>
              <div>
                <CardTitle>Carbon</CardTitle>
                <CardDescription>Emission avoidance and efficiency impact.</CardDescription>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="rounded-[20px] border border-[#E5E7EB] bg-[#FAFAFA] p-4">
                <div className="text-xs uppercase tracking-wider text-[#6B7280] font-semibold">Avoided emissions</div>
                <div className="text-4xl font-bold text-[#111827] mt-2">{detail.carbonTons} tons</div>
                <p className="text-sm text-[#6B7280] mt-3">The current control loop keeps carbon intensity below the portfolio median.</p>
              </div>
              <div className="flex items-center gap-3"><Leaf className="w-5 h-5 text-[#22C55E]" /><div><div className="text-sm font-semibold text-[#111827]">Optimized energy path</div><div className="text-xs text-[#6B7280]">Portion of load shifted off-peak by the AI planner.</div></div></div>
            </CardContent>
          </Card>
        </SectionContainer>

        <SectionContainer id="confidence">
          <Card>
            <CardHeader>
              <div>
                <CardTitle>AI Confidence</CardTitle>
                <CardDescription>Confidence state for the live control loop.</CardDescription>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="rounded-[20px] border border-[#E5E7EB] bg-[#FAFAFA] p-4">
                <div className="text-xs uppercase tracking-wider text-[#6B7280] font-semibold">Confidence</div>
                <div className="text-4xl font-bold text-[#111827] mt-2">{detail.aiConfidence}%</div>
                <div className="mt-3 h-2 rounded-full bg-[#E5E7EB] overflow-hidden"><div className="h-full bg-[#22C55E] rounded-full" style={{ width: `${detail.aiConfidence}%` }} /></div>
              </div>
              <Button variant="outline" size="sm" className="bg-white w-full" onClick={cycleDecisionState}>Cycle AI Decision State</Button>
            </CardContent>
          </Card>
        </SectionContainer>
      </div>

      <SectionContainer id="twin">
        <Card>
          <CardHeader>
            <div>
              <CardTitle>Digital Twin</CardTitle>
              <CardDescription>Spatial model, active floor, and a live mock control surface.</CardDescription>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" className="bg-white" onClick={refreshWeather}><Sparkles className="w-4 h-4" />Refresh Model</Button>
              <Button variant="outline" size="sm" className="bg-white" onClick={() => scrollToSection("floors")}><MapPinned className="w-4 h-4" />Jump to Floors</Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2 rounded-[24px] border border-[#E5E7EB] bg-[#FAFAFA] p-6 min-h-[320px] relative overflow-hidden">
                <div className="absolute inset-0 opacity-40" style={{ backgroundImage: "linear-gradient(rgba(17,24,39,0.08) 1px, transparent 1px), linear-gradient(90deg, rgba(17,24,39,0.08) 1px, transparent 1px)", backgroundSize: "32px 32px" }} />
                <div className="relative z-10 flex flex-col h-full justify-between">
                  <div className="flex items-center justify-between">
                    <div><div className="text-sm font-semibold text-[#111827]">{selectedFloor.label}</div><div className="text-xs text-[#6B7280]">{selectedZone.name} is currently highlighted in the twin.</div></div>
                    <Badge variant="neutral">Live</Badge>
                  </div>
                  <div className="grid grid-cols-2 gap-4 mt-8">
                    <div className="rounded-[18px] border border-[#E5E7EB] bg-white/90 p-4"><div className="text-xs uppercase font-semibold tracking-wider text-[#6B7280]">Control loop</div><div className="text-2xl font-bold text-[#111827] mt-2">{currentDecisionState}</div><p className="text-sm text-[#6B7280] mt-2">The model is adjusting temperature, load, and airflow together.</p></div>
                    <div className="rounded-[18px] border border-[#E5E7EB] bg-white/90 p-4"><div className="text-xs uppercase font-semibold tracking-wider text-[#6B7280]">Supervisor status</div><div className="text-2xl font-bold text-[#111827] mt-2">{supervisorDecisionState}</div><p className="text-sm text-[#6B7280] mt-2">The operator trail stays synchronized with the autonomous decision.</p></div>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <div className="rounded-[20px] border border-[#E5E7EB] p-4 bg-white"><div className="text-xs uppercase tracking-wider text-[#6B7280] font-semibold">Selected Zone</div><div className="text-xl font-semibold text-[#111827] mt-1">{selectedZone.name}</div><div className="text-sm text-[#6B7280] mt-2">{selectedZone.comfort}% comfort · {selectedZone.temperature}°F · {selectedZone.airflow} airflow</div></div>
                <div className="rounded-[20px] border border-[#E5E7EB] p-4 bg-white"><div className="text-xs uppercase tracking-wider text-[#6B7280] font-semibold">Selected Floor</div><div className="text-xl font-semibold text-[#111827] mt-1">{selectedFloor.label}</div><div className="text-sm text-[#6B7280] mt-2">{selectedFloor.occupancy}% occupancy and a {selectedFloor.status} operating state.</div></div>
              </div>
            </div>
          </CardContent>
        </Card>
      </SectionContainer>

      <SectionContainer id="floors">
        <Card>
          <CardHeader>
            <div><CardTitle>Floor Navigation</CardTitle><CardDescription>Select a floor to refresh the connected zones below.</CardDescription></div>
          </CardHeader>
          <CardContent className="flex flex-wrap gap-2">
            {detail.floors.map((floor) => (
              <Button key={floor.id} variant={selectedFloor.id === floor.id ? "primary" : "outline"} size="sm" className={selectedFloor.id === floor.id ? "bg-[#111827] text-white border-none" : "bg-white"} onClick={() => { setSelectedFloor(floor); setSelectedZone(detail.zonesByFloor[floor.id][0]); }}>
                {floor.label}
              </Button>
            ))}
          </CardContent>
        </Card>
      </SectionContainer>

      <SectionContainer id="zones">
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {activeZones.map((zone) => (
            <Card key={zone.id} className={cn("transition-all", selectedZone.id === zone.id && "border-[#111827] shadow-md")}>
              <CardHeader>
                <div><CardTitle>{zone.name}</CardTitle><CardDescription>{selectedFloor.label}</CardDescription></div>
                <Badge variant={zone.status === "stable" ? "success" : zone.status === "watch" ? "warning" : "accent"}>{zone.status}</Badge>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="grid grid-cols-2 gap-3 text-sm">
                  <div className="rounded-[16px] border border-[#E5E7EB] p-3"><div className="text-xs text-[#6B7280] uppercase font-semibold">Occupancy</div><div className="text-lg font-semibold text-[#111827]">{zone.occupancy}%</div></div>
                  <div className="rounded-[16px] border border-[#E5E7EB] p-3"><div className="text-xs text-[#6B7280] uppercase font-semibold">Temperature</div><div className="text-lg font-semibold text-[#111827]">{zone.temperature}°F</div></div>
                  <div className="rounded-[16px] border border-[#E5E7EB] p-3"><div className="text-xs text-[#6B7280] uppercase font-semibold">Humidity</div><div className="text-lg font-semibold text-[#111827]">{zone.humidity}%</div></div>
                  <div className="rounded-[16px] border border-[#E5E7EB] p-3"><div className="text-xs text-[#6B7280] uppercase font-semibold">Comfort</div><div className="text-lg font-semibold text-[#111827]">{zone.comfort}</div></div>
                </div>
                <Button variant="outline" size="sm" className="w-full bg-white" onClick={() => setSelectedZone(zone)}>Focus Zone</Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </SectionContainer>

      <SectionContainer id="systems">
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
          {[
            { label: "HVAC", icon: Wind, value: `${Math.round(detail.energyKw * 0.48)} kW`, delta: "Pre-cool ready" },
            { label: "Lighting", icon: Sparkles, value: `${Math.round(detail.energyKw * 0.14)} kW`, delta: "Adaptive dimming active" },
            { label: "Equipment", icon: Gauge, value: `${Math.round(detail.energyKw * 0.31)} kW`, delta: "Rotational balance mode" },
            { label: "Occupancy", icon: Bot, value: `${detail.occupancyRate}%`, delta: "Badge and sensor maps aligned" },
          ].map((system) => {
            const Icon = system.icon;

            return (
              <Card key={system.label}>
                <CardContent className="p-5">
                  <div className="flex items-start justify-between gap-4">
                    <div><div className="text-xs uppercase tracking-wider text-[#6B7280] font-semibold">{system.label}</div><div className="text-2xl font-bold text-[#111827] mt-2">{system.value}</div><div className="text-sm text-[#6B7280] mt-1">{system.delta}</div></div>
                    <div className="p-3 rounded-[16px] border border-[#E5E7EB] bg-[#FAFAFA]"><Icon className="w-5 h-5 text-[#111827]" /></div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </SectionContainer>

      <SectionContainer id="telemetry">
        <Card>
          <CardHeader>
            <div><CardTitle>Live Telemetry</CardTitle><CardDescription>Occupancy, energy, comfort, and carbon over the day.</CardDescription></div>
            <div className="flex gap-2">{(["1h", "6h", "24h"] as const).map((window) => (<Button key={window} variant={timelineWindow === window ? "secondary" : "outline"} size="sm" className="bg-white" onClick={() => setTimelineWindow(window)}>{window}</Button>))}</div>
          </CardHeader>
          <CardContent className="grid grid-cols-1 md:grid-cols-5 gap-4">
            {detail.telemetry.map((telemetry, index) => (
              <motion.div key={`${telemetry.time}-${index}`} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.05 }} className="rounded-[18px] border border-[#E5E7EB] bg-[#FAFAFA] p-4">
                <div className="text-xs uppercase tracking-wider text-[#6B7280] font-semibold">{telemetry.time}</div>
                <div className="mt-3 space-y-2 text-sm">
                  <div className="flex items-center justify-between"><span className="text-[#6B7280]">Occupancy</span><span className="font-semibold text-[#111827]">{telemetry.occupancy}%</span></div>
                  <div className="flex items-center justify-between"><span className="text-[#6B7280]">Energy</span><span className="font-semibold text-[#111827]">{telemetry.energyKw} kW</span></div>
                  <div className="flex items-center justify-between"><span className="text-[#6B7280]">Comfort</span><span className="font-semibold text-[#111827]">{telemetry.comfort}</span></div>
                  <div className="flex items-center justify-between"><span className="text-[#6B7280]">Carbon</span><span className="font-semibold text-[#111827]">{telemetry.carbon}</span></div>
                </div>
              </motion.div>
            ))}
          </CardContent>
        </Card>
      </SectionContainer>

      <SectionContainer id="decisions">
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <div><CardTitle>Current AI Decision</CardTitle><CardDescription>{detail.currentDecision.rationale}</CardDescription></div>
              <Badge variant="neutral">{currentDecisionState}</Badge>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="text-lg font-semibold text-[#111827]">{detail.currentDecision.label}</div>
              <div className="flex flex-wrap gap-2">
                <Button variant="primary" size="sm" className="bg-[#111827] text-white border-none" onClick={cycleDecisionState}><PlayCircle className="w-4 h-4" />Run</Button>
                <Button variant="outline" size="sm" className="bg-white" onClick={() => setCurrentDecisionState("paused")}><PauseCircle className="w-4 h-4" />Pause</Button>
                <Button variant="outline" size="sm" className="bg-white" onClick={() => setCurrentDecisionState("ready")}><CircleCheckBig className="w-4 h-4" />Reset</Button>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <div><CardTitle>Supervisor Decision</CardTitle><CardDescription>{detail.supervisorDecision.rationale}</CardDescription></div>
              <Badge variant="neutral">{supervisorDecisionState}</Badge>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="text-lg font-semibold text-[#111827]">{detail.supervisorDecision.label}</div>
              <div className="flex flex-wrap gap-2">
                <Button variant="primary" size="sm" className="bg-[#111827] text-white border-none" onClick={updateSupervisorDecision}><ShieldCheck className="w-4 h-4" />Advance</Button>
                <Button variant="outline" size="sm" className="bg-white" onClick={() => setSupervisorDecisionState("approved")}>Approve</Button>
                <Button variant="outline" size="sm" className="bg-white" onClick={() => setSupervisorDecisionState("review")}>Review</Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </SectionContainer>

      <SectionContainer id="predictions">
        <Card>
          <CardHeader>
            <div><CardTitle>Prediction Timeline</CardTitle><CardDescription>Short-horizon forecasts used by the control loop.</CardDescription></div>
            <Badge variant="neutral">{timelineWindow}</Badge>
          </CardHeader>
          <CardContent className="grid grid-cols-1 md:grid-cols-5 gap-4">
            {detail.predictionTimeline.map((point) => (
              <div key={point.time} className="rounded-[18px] border border-[#E5E7EB] bg-[#FAFAFA] p-4">
                <div className="text-xs uppercase tracking-wider text-[#6B7280] font-semibold">{point.time}</div>
                <div className="text-xl font-bold text-[#111827] mt-2">{point.value}</div>
                <div className="text-sm text-[#6B7280]">{point.label}</div>
                <div className={cn("text-xs font-semibold mt-2", point.delta >= 0 ? "text-[#15803D]" : "text-[#B91C1C]")}>{point.delta >= 0 ? "+" : ""}{point.delta}</div>
              </div>
            ))}
          </CardContent>
        </Card>
      </SectionContainer>

      <SectionContainer id="recommendations">
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
          {detail.recommendations.map((recommendation) => {
            const applied = appliedRecommendations.includes(recommendation.id);
            const status = applied ? "applied" : recommendation.status;

            return (
              <Card key={recommendation.id} className={cn(applied && "border-[#111827]") }>
                <CardHeader>
                  <div><CardTitle>{recommendation.title}</CardTitle><CardDescription>{recommendation.summary}</CardDescription></div>
                  <Badge variant={status === "applied" ? "success" : status === "queued" ? "warning" : "neutral"}>{status}</Badge>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between text-sm"><span className="text-[#6B7280]">Impact</span><span className="font-semibold text-[#111827]">${recommendation.impactUSD}</span></div>
                  <div className="flex items-center justify-between text-sm"><span className="text-[#6B7280]">Confidence</span><span className="font-semibold text-[#111827]">{recommendation.confidence}%</span></div>
                  <Button variant={applied ? "secondary" : "primary"} size="sm" className={applied ? "bg-[#F3F4F6] text-[#111827]" : "bg-[#111827] text-white border-none"} onClick={() => applyRecommendation(recommendation)}>{applied ? "Applied" : recommendation.action}</Button>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </SectionContainer>

      <SectionContainer id="equipment">
        <Card>
          <CardHeader>
            <div><CardTitle>Equipment Table</CardTitle><CardDescription>Operational devices and the actions available from this screen.</CardDescription></div>
          </CardHeader>
          <CardContent>
            <DataTable data={detail.equipment} columns={equipmentColumns} onRowClick={() => setSelectedAnomaly(detail.anomalies[0])} />
          </CardContent>
        </Card>
      </SectionContainer>

      <SectionContainer id="history">
        <Card>
          <CardHeader>
            <div><CardTitle>History Timeline</CardTitle><CardDescription>Recent automation events and supervisor touchpoints.</CardDescription></div>
          </CardHeader>
          <CardContent className="space-y-4">
            {detail.history.map((event, index) => (
              <div key={event.id} className="flex gap-4">
                <div className="flex flex-col items-center"><div className="w-3 h-3 rounded-full bg-[#111827]" />{index !== detail.history.length - 1 && <div className="w-px flex-1 bg-[#E5E7EB]" />}</div>
                <div className="pb-6">
                  <div className="flex items-center gap-2 flex-wrap"><div className="font-semibold text-[#111827]">{event.title}</div><Badge variant={event.status === "resolved" ? "success" : event.status === "active" ? "warning" : "neutral"}>{event.status}</Badge><span className="text-xs text-[#6B7280]">{event.time}</span></div>
                  <p className="text-sm text-[#6B7280] mt-1">{event.detail}</p>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </SectionContainer>

      <SectionContainer id="anomalies">
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <div><CardTitle>Anomalies</CardTitle><CardDescription>Active deviations available for review.</CardDescription></div>
            </CardHeader>
            <CardContent className="space-y-3">
              {detail.anomalies.map((anomaly) => (
                <button key={anomaly.id} onClick={() => setSelectedAnomaly(anomaly)} className={cn("w-full text-left rounded-[18px] border p-4 transition-colors", selectedAnomaly.id === anomaly.id ? "border-[#111827] bg-[#FAFAFA]" : "border-[#E5E7EB] hover:bg-[#FAFAFA]") }>
                  <div className="flex items-center justify-between gap-4"><div><div className="font-semibold text-[#111827]">{anomaly.title}</div><div className="text-sm text-[#6B7280] mt-1">{anomaly.detail}</div></div><Badge variant={anomaly.severity === "high" ? "danger" : anomaly.severity === "medium" ? "warning" : "neutral"}>{anomaly.severity}</Badge></div>
                  <div className="text-xs text-[#6B7280] mt-3">{anomaly.system} · {anomaly.time}</div>
                </button>
              ))}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <div><CardTitle>Selected Anomaly</CardTitle><CardDescription>{selectedAnomaly.system} review context</CardDescription></div>
              <Button variant="outline" size="sm" className="bg-white" onClick={() => acknowledgeAlert(visibleAlerts[0]?.id)}>Review alert</Button>
            </CardHeader>
            <CardContent>
              <div className="rounded-[20px] border border-[#E5E7EB] bg-[#FAFAFA] p-4">
                <div className="font-semibold text-[#111827]">{selectedAnomaly.title}</div>
                <p className="text-sm text-[#6B7280] mt-2">{selectedAnomaly.detail}</p>
                <div className="mt-4 flex items-center gap-2 flex-wrap"><Badge variant={selectedAnomaly.severity === "high" ? "danger" : selectedAnomaly.severity === "medium" ? "warning" : "neutral"}>{selectedAnomaly.severity}</Badge><Badge variant="neutral">{selectedAnomaly.time}</Badge></div>
              </div>
            </CardContent>
          </Card>
        </div>
      </SectionContainer>

      <SectionContainer id="weather">
        <Card>
          <CardHeader>
            <div><CardTitle>Weather</CardTitle><CardDescription>Outdoor conditions feeding the control strategy.</CardDescription></div>
            <Button variant="outline" size="sm" className="bg-white" onClick={refreshWeather}><RefreshCw className="w-4 h-4" />Toggle View</Button>
          </CardHeader>
          <CardContent className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="rounded-[18px] border border-[#E5E7EB] p-4 bg-[#FAFAFA]"><div className="text-xs uppercase tracking-wider text-[#6B7280] font-semibold">Temperature</div><div className="text-3xl font-bold text-[#111827] mt-2">{displayedWeather.temperature}°F</div></div>
            <div className="rounded-[18px] border border-[#E5E7EB] p-4 bg-[#FAFAFA]"><div className="text-xs uppercase tracking-wider text-[#6B7280] font-semibold">Condition</div><div className="text-xl font-semibold text-[#111827] mt-2">{displayedWeather.condition}</div></div>
            <div className="rounded-[18px] border border-[#E5E7EB] p-4 bg-[#FAFAFA]"><div className="text-xs uppercase tracking-wider text-[#6B7280] font-semibold">Humidity</div><div className="text-3xl font-bold text-[#111827] mt-2">{displayedWeather.humidity}%</div></div>
            <div className="rounded-[18px] border border-[#E5E7EB] p-4 bg-[#FAFAFA]"><div className="text-xs uppercase tracking-wider text-[#6B7280] font-semibold">Wind</div><div className="text-xl font-semibold text-[#111827] mt-2">{displayedWeather.wind}</div><div className="text-sm text-[#6B7280] mt-2">{displayedWeather.forecast}</div></div>
          </CardContent>
        </Card>
      </SectionContainer>

      <SectionContainer id="alerts">
        <Card>
          <CardHeader>
            <div><CardTitle>Current Alerts</CardTitle><CardDescription>Mock live incidents tied to this building.</CardDescription></div>
            <Button variant="outline" size="sm" className="bg-white" onClick={() => acknowledgeAlert()}>Clear All</Button>
          </CardHeader>
          <CardContent className="space-y-3">
            {visibleAlerts.length === 0 ? (
              <EmptyState icon={CircleCheckBig} title="No current alerts" description="All active alerts have been acknowledged in this session." />
            ) : (
              visibleAlerts.map((alert) => (
                <div key={alert.id} className="rounded-[18px] border border-[#E5E7EB] p-4 flex items-center justify-between gap-4">
                  <div>
                    <div className="flex items-center gap-2 flex-wrap"><div className="font-semibold text-[#111827]">{alert.title}</div><Badge variant={alert.severity === "critical" ? "danger" : alert.severity === "high" ? "warning" : "neutral"}>{alert.severity}</Badge><Badge variant="neutral">{alert.source}</Badge></div>
                    <div className="text-sm text-[#6B7280] mt-1">{alert.timestamp}</div>
                  </div>
                  <Button variant="outline" size="sm" className="bg-white" onClick={() => acknowledgeAlert(alert.id)}>Acknowledge</Button>
                </div>
              ))
            )}
          </CardContent>
        </Card>
      </SectionContainer>

      <SectionContainer id="agents">
        <Card>
          <CardHeader>
            <div><CardTitle>Connected AI Agents</CardTitle><CardDescription>Every agent shown here is controllable from the page.</CardDescription></div>
          </CardHeader>
          <CardContent className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
            {agentStates.map((agent) => (
              <div key={agent.id} className="rounded-[20px] border border-[#E5E7EB] p-4 bg-[#FAFAFA]">
                <div className="flex items-start justify-between gap-3"><div><div className="font-semibold text-[#111827]">{agent.name}</div><div className="text-xs text-[#6B7280] mt-1">{agent.role}</div></div><Badge variant={agent.status === "online" ? "success" : agent.status === "learning" ? "warning" : "neutral"}>{agent.status}</Badge></div>
                <div className="text-sm text-[#6B7280] mt-3">Confidence {agent.confidence}%</div>
                <div className="text-xs text-[#6B7280] mt-1">{agent.lastAction}</div>
                <div className="flex gap-2 mt-4">
                  <Button variant="outline" size="sm" className="bg-white flex-1" onClick={() => toggleAgent(agent.id)}>{agent.status === "paused" ? "Resume" : "Pause"}</Button>
                  <Button variant="ghost" size="sm" onClick={() => setSimulationTick((current) => current + 1)}>Ping</Button>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </SectionContainer>
    </PageContainer>
  );
}
