import { Building } from "@/types";

export interface BuildingPortfolioItem extends Building {
  aiScore: number;
  energyKw: number;
  comfortScore: number;
  healthScore: number;
  aiConfidence: number;
  carbonTons: number;
  floorCount: number;
}

export interface BuildingFloor {
  id: string;
  label: string;
  occupancy: number;
  temperature: number;
  status: "stable" | "watch" | "optimization";
}

export interface BuildingZone {
  id: string;
  name: string;
  floorId: string;
  occupancy: number;
  temperature: number;
  humidity: number;
  comfort: number;
  airflow: number;
  status: "stable" | "watch" | "optimization";
}

export interface BuildingTelemetryPoint {
  time: string;
  occupancy: number;
  energyKw: number;
  comfort: number;
  carbon: number;
}

export interface BuildingRecommendation {
  id: string;
  title: string;
  summary: string;
  impactUSD: number;
  confidence: number;
  status: "ready" | "queued" | "applied";
  action: string;
}

export interface BuildingEquipmentRow {
  id: string;
  name: string;
  system: string;
  status: "nominal" | "watch" | "service";
  loadKw: number;
  efficiency: number;
  runtimeHours: number;
  lastService: string;
}

export interface BuildingHistoryEvent {
  id: string;
  time: string;
  title: string;
  detail: string;
  status: "resolved" | "active" | "scheduled";
}

export interface BuildingAnomaly {
  id: string;
  title: string;
  detail: string;
  system: string;
  severity: "low" | "medium" | "high";
  time: string;
}

export interface BuildingAlertRecord {
  id: string;
  title: string;
  severity: "low" | "medium" | "high" | "critical";
  source: string;
  timestamp: string;
  status: "active" | "acknowledged";
}

export interface BuildingAgentRecord {
  id: string;
  name: string;
  role: string;
  status: "online" | "learning" | "syncing" | "paused";
  confidence: number;
  lastAction: string;
}

export interface BuildingDetail extends BuildingPortfolioItem {
  weather: {
    temperature: number;
    condition: string;
    humidity: number;
    wind: string;
    forecast: string;
  };
  floors: BuildingFloor[];
  zonesByFloor: Record<string, BuildingZone[]>;
  telemetry: BuildingTelemetryPoint[];
  currentDecision: {
    label: string;
    rationale: string;
    confidence: number;
    state: "ready" | "executing" | "paused";
  };
  supervisorDecision: {
    label: string;
    rationale: string;
    confidence: number;
    state: "approved" | "review" | "overridden";
  };
  predictionTimeline: Array<{
    time: string;
    label: string;
    value: number;
    delta: number;
  }>;
  recommendations: BuildingRecommendation[];
  equipment: BuildingEquipmentRow[];
  history: BuildingHistoryEvent[];
  anomalies: BuildingAnomaly[];
  currentAlerts: BuildingAlertRecord[];
  agents: BuildingAgentRecord[];
  digitalTwinSummary: string;
}

const BASE_BUILDINGS: Building[] = [
  { id: "1", name: "HQ Tower One", location: "San Francisco, CA", areaSqFt: 150000, occupancyRate: 85, energyScore: 94, status: "OPTIMAL", activeAlerts: 0, monthlySavingsUSD: 12500, co2ReductionTons: 45 },
  { id: "2", name: "Innovation Hub", location: "Austin, TX", areaSqFt: 85000, occupancyRate: 92, energyScore: 88, status: "OPTIMAL", activeAlerts: 1, monthlySavingsUSD: 8400, co2ReductionTons: 28 },
  { id: "3", name: "East Coast Plaza", location: "New York, NY", areaSqFt: 210000, occupancyRate: 78, energyScore: 72, status: "ATTENTION_REQUIRED", activeAlerts: 3, monthlySavingsUSD: 4100, co2ReductionTons: 12 },
  { id: "4", name: "Westside Data Center", location: "San Jose, CA", areaSqFt: 320000, occupancyRate: 100, energyScore: 85, status: "OPTIMAL", activeAlerts: 0, monthlySavingsUSD: 24000, co2ReductionTons: 90 },
  { id: "5", name: "London Office", location: "London, UK", areaSqFt: 65000, occupancyRate: 60, energyScore: 68, status: "CRITICAL", activeAlerts: 4, monthlySavingsUSD: 1200, co2ReductionTons: 5 },
  { id: "6", name: "Berlin Research Center", location: "Berlin, DE", areaSqFt: 110000, occupancyRate: 88, energyScore: 91, status: "OPTIMAL", activeAlerts: 0, monthlySavingsUSD: 9800, co2ReductionTons: 35 },
];

const floorTemplates = ["Basement", "Level 1", "Level 2", "Level 3", "Executive Level"];
const zoneNames = ["Lobby Core", "North Wing", "South Wing", "Conference Suite", "Operations Hub", "Collaboration Deck"];
const equipmentTemplates = [
  { name: "Primary Chiller Plant", system: "HVAC" },
  { name: "Air Handling Units", system: "HVAC" },
  { name: "Lighting Backbone", system: "Lighting" },
  { name: "Battery Storage", system: "Energy" },
  { name: "BMS Gateway", system: "Controls" },
  { name: "Occupancy Sensors", system: "Occupancy" },
];

function clamp(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, value));
}

function buildBuildingDetail(building: Building, index: number): BuildingDetail {
  const aiScore = clamp(building.energyScore + 2 + (index % 3) * 2, 62, 99);
  const energyKw = Math.round((building.areaSqFt / 58) * (1 - (building.energyScore - 60) / 220));
  const comfortScore = clamp(90 - index * 2 + (building.occupancyRate > 90 ? -3 : 2), 68, 98);
  const healthScore = clamp(Math.round((aiScore + comfortScore + (100 - building.activeAlerts * 6)) / 3), 64, 99);
  const aiConfidence = clamp(aiScore + 1 - (building.status === "CRITICAL" ? 6 : 0), 81, 99);
  const carbonTons = clamp(Math.round(building.co2ReductionTons + building.energyScore / 2), 8, 120);
  const floorCount = 3 + (index % 3);
  const floors: BuildingFloor[] = Array.from({ length: floorCount }, (_, floorIndex) => ({
    id: `floor-${index}-${floorIndex}`,
    label: floorTemplates[floorIndex] ?? `Level ${floorIndex + 1}`,
    occupancy: clamp(building.occupancyRate - floorIndex * 5 + index * 2, 24, 100),
    temperature: clamp(70 - floorIndex + (building.status === "CRITICAL" ? 2 : 0), 66, 76),
    status: floorIndex === 0 ? "stable" : floorIndex === 1 ? "watch" : "optimization",
  }));

  const zonesByFloor = Object.fromEntries(
    floors.map((floor, floorIndex) => [
      floor.id,
      Array.from({ length: 3 }, (_, zoneIndex) => ({
        id: `${floor.id}-zone-${zoneIndex}`,
        name: zoneNames[(floorIndex + zoneIndex) % zoneNames.length],
        floorId: floor.id,
        occupancy: clamp(building.occupancyRate - zoneIndex * 8 + floorIndex * 4, 18, 100),
        temperature: clamp(69 + floorIndex + zoneIndex, 66, 76),
        humidity: clamp(42 + floorIndex * 3 + zoneIndex * 2, 34, 58),
        comfort: clamp(comfortScore - zoneIndex * 3 + floorIndex, 58, 99),
        airflow: clamp(82 - zoneIndex * 4 + floorIndex * 2, 54, 99),
        status: zoneIndex === 0 ? "stable" : zoneIndex === 1 ? "watch" : "optimization",
      })),
    ])
  ) as Record<string, BuildingZone[]>;

  const telemetry: BuildingTelemetryPoint[] = [
    { time: "06:00", occupancy: clamp(building.occupancyRate - 18, 12, 100), energyKw: Math.round(energyKw * 0.72), comfort: comfortScore - 5, carbon: carbonTons - 7 },
    { time: "09:00", occupancy: clamp(building.occupancyRate - 6, 12, 100), energyKw: Math.round(energyKw * 0.84), comfort: comfortScore - 2, carbon: carbonTons - 4 },
    { time: "12:00", occupancy: building.occupancyRate, energyKw, comfort: comfortScore, carbon: carbonTons },
    { time: "15:00", occupancy: clamp(building.occupancyRate + 4, 12, 100), energyKw: Math.round(energyKw * 1.07), comfort: comfortScore + 1, carbon: carbonTons + 2 },
    { time: "18:00", occupancy: clamp(building.occupancyRate - 11, 12, 100), energyKw: Math.round(energyKw * 0.78), comfort: comfortScore - 3, carbon: carbonTons - 3 },
  ];

  const predictionTimeline = [
    { time: "+1h", label: "Occupancy", value: clamp(building.occupancyRate + 2, 12, 100), delta: 2 },
    { time: "+2h", label: "Energy", value: clamp(energyKw - 18, 120, 9800), delta: -18 },
    { time: "+3h", label: "Comfort", value: clamp(comfortScore + 1, 60, 99), delta: 1 },
    { time: "+4h", label: "Carbon", value: clamp(carbonTons - 2, 8, 120), delta: -2 },
    { time: "+6h", label: "AI Confidence", value: aiConfidence, delta: 0 },
  ];

  const currentAlerts: BuildingAlertRecord[] = Array.from({ length: Math.max(building.activeAlerts, 1) }, (_, alertIndex) => ({
    id: `${building.id}-alert-${alertIndex}`,
    title: alertIndex === 0 && building.activeAlerts === 0 ? "All systems clear" : `${zoneNames[alertIndex % zoneNames.length]} drift`,
    severity: alertIndex === 0 && building.activeAlerts === 0 ? "low" : alertIndex === 0 ? "critical" : alertIndex === 1 ? "high" : "medium",
    source: ["HVAC", "Lighting", "Power", "Occupancy"][alertIndex % 4],
    timestamp: `${5 + alertIndex * 12} mins ago`,
    status: building.activeAlerts === 0 ? "acknowledged" : "active",
  }));

  return {
    ...building,
    aiScore,
    energyKw,
    comfortScore,
    healthScore,
    aiConfidence,
    carbonTons,
    floorCount,
    weather: {
      temperature: 71 + index,
      condition: index % 2 === 0 ? "Partly cloudy" : "Bright and dry",
      humidity: 38 + index * 3,
      wind: `${8 + index} mph`,
      forecast: index % 3 === 0 ? "Cooling trend in the afternoon" : "Stable operating envelope expected",
    },
    floors,
    zonesByFloor,
    telemetry,
    currentDecision: {
      label: building.status === "CRITICAL" ? "Trigger pre-cool and isolate hotspot" : "Maintain optimized control loop",
      rationale: building.status === "CRITICAL" ? "Two zones are drifting above the comfort band." : "Portfolio signals remain within the target operating window.",
      confidence: aiConfidence,
      state: building.status === "CRITICAL" ? "executing" : "ready",
    },
    supervisorDecision: {
      label: building.status === "CRITICAL" ? "Escalate to operator review" : "Approve autonomous execution",
      rationale: building.status === "CRITICAL" ? "Needs human validation before the next override." : "Action is safe and auditable at the current confidence level.",
      confidence: clamp(aiConfidence - 4, 75, 98),
      state: building.status === "CRITICAL" ? "review" : "approved",
    },
    predictionTimeline,
    recommendations: [
      {
        id: `${building.id}-rec-1`,
        title: "Precondition the occupied core",
        summary: "Shift the thermal setpoint earlier to flatten the 3 pm peak.",
        impactUSD: Math.round(building.monthlySavingsUSD * 0.15),
        confidence: clamp(aiConfidence - 2, 82, 99),
        status: "ready",
        action: "Apply thermal shift",
      },
      {
        id: `${building.id}-rec-2`,
        title: "Reduce non-critical lighting",
        summary: "Trim secondary lighting loops in zones with below-average occupancy.",
        impactUSD: Math.round(building.monthlySavingsUSD * 0.09),
        confidence: clamp(aiConfidence - 1, 82, 99),
        status: building.activeAlerts > 0 ? "queued" : "ready",
        action: "Dimming profile",
      },
      {
        id: `${building.id}-rec-3`,
        title: "Balance equipment duty cycles",
        summary: "Rotate the lead unit to level runtime and avoid a localized wear pattern.",
        impactUSD: Math.round(building.monthlySavingsUSD * 0.07),
        confidence: clamp(aiConfidence - 3, 80, 99),
        status: "ready",
        action: "Balance load",
      },
    ],
    equipment: equipmentTemplates.map((equipment, equipmentIndex) => ({
      id: `${building.id}-eq-${equipmentIndex}`,
      name: equipment.name,
      system: equipment.system,
      status: equipmentIndex === 0 && building.status === "CRITICAL" ? "service" : equipmentIndex === 2 ? "watch" : "nominal",
      loadKw: Math.round(energyKw * (0.08 + equipmentIndex * 0.03)),
      efficiency: clamp(91 - equipmentIndex * 2 + (building.status === "OPTIMAL" ? 2 : 0), 70, 99),
      runtimeHours: 12 + equipmentIndex * 4 + index * 2,
      lastService: `${12 + equipmentIndex * 5} days ago`,
    })),
    history: [
      { id: `${building.id}-hist-1`, time: "08:00", title: "Night setback completed", detail: "Schedules reset without operator intervention.", status: "resolved" },
      { id: `${building.id}-hist-2`, time: "11:20", title: "Occupancy ramp detected", detail: "The AI increased ventilation before the meeting block.", status: "resolved" },
      { id: `${building.id}-hist-3`, time: "13:05", title: "Cooling forecast updated", detail: "Model extended the pre-cool window by 20 minutes.", status: "active" },
      { id: `${building.id}-hist-4`, time: "15:00", title: "Supervisor review logged", detail: "Manual review captured for audit traceability.", status: "scheduled" },
    ],
    anomalies: [
      { id: `${building.id}-anom-1`, title: "Zone temperature drift", detail: "Minor thermal variance in the north wing.", system: "HVAC", severity: building.status === "CRITICAL" ? "high" : "medium", time: "14 mins ago" },
      { id: `${building.id}-anom-2`, title: "Fan speed mismatch", detail: "Lead fan response trails the expected curve by 4%.", system: "HVAC", severity: "low", time: "1 hour ago" },
      { id: `${building.id}-anom-3`, title: "Occupancy variance", detail: "Badge traffic and sensor traffic are now aligned.", system: "Occupancy", severity: "low", time: "3 hours ago" },
    ],
    currentAlerts,
    agents: [
      { id: `${building.id}-agent-1`, name: "Energy Forecaster", role: "Thermal prediction", status: "online", confidence: clamp(aiConfidence, 85, 99), lastAction: "Updated the hourly load curve" },
      { id: `${building.id}-agent-2`, name: "Occupancy Sentinel", role: "People-flow modeling", status: "learning", confidence: clamp(aiConfidence - 3, 82, 98), lastAction: "Refined zone correlation weights" },
      { id: `${building.id}-agent-3`, name: "Comfort Guard", role: "Indoor air quality", status: "syncing", confidence: clamp(aiConfidence - 1, 84, 99), lastAction: "Pulled the latest temperature trace" },
      { id: `${building.id}-agent-4`, name: "Supervisor", role: "Human-in-the-loop review", status: building.status === "CRITICAL" ? "paused" : "online", confidence: clamp(aiConfidence - 5, 79, 96), lastAction: "Queued the next decision packet" },
    ],
    digitalTwinSummary: `${floorCount} active floors, ${Object.keys(zonesByFloor).length * 3} modeled zones, and live telemetry aligned to the last 15-minute control loop.`,
  };
}

export const BUILDING_DETAILS: BuildingDetail[] = BASE_BUILDINGS.map((building, index) => buildBuildingDetail(building, index));

export function getBuildingDetail(id?: string | string[]) {
  const resolvedId = Array.isArray(id) ? id[0] : id;
  return BUILDING_DETAILS.find((building) => building.id === resolvedId) ?? BUILDING_DETAILS[0];
}
