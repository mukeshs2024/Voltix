export type AgentStatus = "active" | "idle" | "warning" | "error";

export interface Agent {
  id: string;
  name: string;
  type: "occupancy" | "thermal" | "energy" | "equipment" | "safety" | "grid";
  status: AgentStatus;
  health: number;
  latency: number;
  confidence: number;
  lastDecision: string;
  reason: string;
  decisionsToday: number;
  uptime: string;
}

export interface SupervisorConsensus {
  status: "consensus" | "conflict" | "pending";
  participatingAgents: number;
  agreementScore: number;
  lastResolved: string;
  currentDecision: string;
}

export const MOCK_AGENTS: Agent[] = [
  {
    id: "occupancy",
    name: "Occupancy Agent",
    type: "occupancy",
    status: "active",
    health: 98,
    latency: 42,
    confidence: 94,
    lastDecision: "Reduced HVAC in Zone 3 (low occupancy)",
    reason: "Sensor data shows 12% occupancy in Zone 3 for 45 min",
    decisionsToday: 34,
    uptime: "99.8%",
  },
  {
    id: "thermal",
    name: "Thermal Agent",
    type: "thermal",
    status: "active",
    health: 95,
    latency: 38,
    confidence: 91,
    lastDecision: "Adjusted chiller setpoint to 18°C",
    reason: "Predicted heat load increase in 30 min based on weather forecast",
    decisionsToday: 21,
    uptime: "99.5%",
  },
  {
    id: "energy",
    name: "Energy Agent",
    type: "energy",
    status: "warning",
    health: 78,
    latency: 67,
    confidence: 82,
    lastDecision: "Deferred non-critical loads to off-peak",
    reason: "Grid tariff spike detected at 14:00–16:00 window",
    decisionsToday: 18,
    uptime: "97.2%",
  },
  {
    id: "equipment",
    name: "Equipment Agent",
    type: "equipment",
    status: "active",
    health: 92,
    latency: 55,
    confidence: 88,
    lastDecision: "Scheduled AHU-4 maintenance flag",
    reason: "Vibration anomaly detected on AHU-4 bearing sensor",
    decisionsToday: 9,
    uptime: "98.9%",
  },
  {
    id: "safety",
    name: "Safety Agent",
    type: "safety",
    status: "active",
    health: 100,
    latency: 22,
    confidence: 99,
    lastDecision: "All safety checks passed",
    reason: "Continuous monitoring — no anomalies detected",
    decisionsToday: 5,
    uptime: "100%",
  },
  {
    id: "grid",
    name: "Grid Agent",
    type: "grid",
    status: "active",
    health: 89,
    latency: 48,
    confidence: 86,
    lastDecision: "Activated demand response protocol DR-2",
    reason: "Utility signal received: grid stress event at 15:30",
    decisionsToday: 12,
    uptime: "99.1%",
  },
];

export const MOCK_CONSENSUS: SupervisorConsensus = {
  status: "consensus",
  participatingAgents: 6,
  agreementScore: 91,
  lastResolved: "2 min ago",
  currentDecision: "Maintain current optimization profile — no conflicts detected",
};

export const MOCK_DECISION_TIMELINE = [
  { time: "15:42", agent: "Occupancy", action: "Zone 3 HVAC reduced 40%", confidence: 94, status: "executed" },
  { time: "15:38", agent: "Grid", action: "DR-2 protocol activated", confidence: 86, status: "executed" },
  { time: "15:30", agent: "Energy", action: "Load deferral scheduled", confidence: 82, status: "executed" },
  { time: "15:22", agent: "Thermal", action: "Chiller setpoint 18°C", confidence: 91, status: "executed" },
  { time: "15:10", agent: "Equipment", action: "AHU-4 maintenance flag", confidence: 88, status: "pending" },
  { time: "14:55", agent: "Safety", action: "Routine check passed", confidence: 99, status: "executed" },
  { time: "14:40", agent: "Occupancy", action: "Zone 1 HVAC restored", confidence: 96, status: "executed" },
  { time: "14:20", agent: "Energy", action: "Peak demand alert issued", confidence: 79, status: "executed" },
];

export const MOCK_AGENT_TELEMETRY = [
  { time: "14:00", occupancy: 72, thermal: 68, energy: 81, equipment: 88, safety: 100, grid: 75 },
  { time: "14:10", occupancy: 75, thermal: 70, energy: 78, equipment: 87, safety: 100, grid: 78 },
  { time: "14:20", occupancy: 80, thermal: 74, energy: 74, equipment: 89, safety: 100, grid: 80 },
  { time: "14:30", occupancy: 85, thermal: 78, energy: 70, equipment: 90, safety: 100, grid: 82 },
  { time: "14:40", occupancy: 88, thermal: 80, energy: 68, equipment: 91, safety: 100, grid: 85 },
  { time: "14:50", occupancy: 90, thermal: 82, energy: 72, equipment: 92, safety: 100, grid: 84 },
  { time: "15:00", occupancy: 94, thermal: 85, energy: 75, equipment: 92, safety: 100, grid: 86 },
  { time: "15:10", occupancy: 94, thermal: 88, energy: 78, equipment: 92, safety: 100, grid: 86 },
  { time: "15:20", occupancy: 92, thermal: 90, energy: 80, equipment: 91, safety: 100, grid: 87 },
  { time: "15:30", occupancy: 94, thermal: 91, energy: 82, equipment: 92, safety: 100, grid: 86 },
  { time: "15:40", occupancy: 94, thermal: 91, energy: 82, equipment: 92, safety: 100, grid: 86 },
];

export const MOCK_AGENT_LOGS = [
  { ts: "15:42:11", level: "INFO", msg: "Decision executed: Zone 3 HVAC reduced 40%" },
  { ts: "15:41:58", level: "INFO", msg: "Confidence threshold met: 94% > 80% minimum" },
  { ts: "15:41:45", level: "DEBUG", msg: "Sensor fusion complete: 12 sensors aggregated" },
  { ts: "15:40:30", level: "INFO", msg: "Occupancy model inference: Zone 3 = 12%" },
  { ts: "15:39:10", level: "DEBUG", msg: "Historical pattern match: similar event 3 days ago" },
  { ts: "15:38:00", level: "INFO", msg: "Rule triggered: OCC_LOW_ZONE_HVAC_REDUCE" },
  { ts: "15:37:45", level: "DEBUG", msg: "Supervisor consensus requested" },
  { ts: "15:37:30", level: "INFO", msg: "Consensus achieved: 5/6 agents agree" },
];

export const MOCK_TRIGGERED_RULES = [
  { id: "OCC_LOW_ZONE_HVAC_REDUCE", name: "Low Occupancy HVAC Reduction", priority: "high", triggered: "15:38" },
  { id: "OCC_PEAK_RESTORE", name: "Peak Hour Occupancy Restore", priority: "medium", triggered: "14:40" },
  { id: "OCC_THRESHOLD_ALERT", name: "Occupancy Threshold Alert", priority: "low", triggered: "13:22" },
];

export const MOCK_RECOMMENDATIONS = [
  { id: "r1", title: "Pre-cool Zone 2 before 16:00 peak", impact: "Save 180 kWh", confidence: 87, priority: "high" },
  { id: "r2", title: "Extend Zone 3 HVAC reduction by 30 min", impact: "Save 45 kWh", confidence: 92, priority: "medium" },
  { id: "r3", title: "Schedule AHU-4 inspection this week", impact: "Prevent downtime", confidence: 78, priority: "medium" },
];

export const SIMULATION_SCENARIOS = [
  {
    id: "s1",
    name: "Peak Demand Shaving",
    description: "Reduce peak load by 15% during 14:00–18:00 tariff window",
    tags: ["energy", "grid"],
    lastRun: "2 days ago",
    result: "success",
    savings: "320 kWh",
  },
  {
    id: "s2",
    name: "Overnight Setback",
    description: "Reduce HVAC setpoints by 3°C during unoccupied hours",
    tags: ["thermal", "occupancy"],
    lastRun: "1 week ago",
    result: "success",
    savings: "540 kWh",
  },
  {
    id: "s3",
    name: "Emergency DR Response",
    description: "Simulate grid emergency demand response event",
    tags: ["grid", "safety"],
    lastRun: "3 days ago",
    result: "warning",
    savings: "210 kWh",
  },
  {
    id: "s4",
    name: "Equipment Failure Cascade",
    description: "Test system resilience when AHU-4 goes offline",
    tags: ["equipment", "safety"],
    lastRun: "5 days ago",
    result: "success",
    savings: "N/A",
  },
];

export const SIMULATION_STEPS = [
  { step: 1, label: "Initialize sensors", agent: "System", status: "done" as const },
  { step: 2, label: "Occupancy model inference", agent: "Occupancy", status: "done" as const },
  { step: 3, label: "Thermal load prediction", agent: "Thermal", status: "done" as const },
  { step: 4, label: "Energy tariff evaluation", agent: "Energy", status: "active" as const },
  { step: 5, label: "Grid signal processing", agent: "Grid", status: "pending" as const },
  { step: 6, label: "Supervisor consensus", agent: "Supervisor", status: "pending" as const },
  { step: 7, label: "Decision dispatch", agent: "System", status: "pending" as const },
];

export const SIMULATION_TELEMETRY = [
  { t: "T+0s", temp: 22.1, occupancy: 68, power: 420, co2: 410 },
  { t: "T+10s", temp: 22.3, occupancy: 70, power: 415, co2: 408 },
  { t: "T+20s", temp: 22.5, occupancy: 72, power: 408, co2: 405 },
  { t: "T+30s", temp: 22.4, occupancy: 71, power: 395, co2: 400 },
  { t: "T+40s", temp: 22.2, occupancy: 69, power: 380, co2: 395 },
  { t: "T+50s", temp: 22.0, occupancy: 68, power: 365, co2: 390 },
  { t: "T+60s", temp: 21.8, occupancy: 67, power: 350, co2: 385 },
];
