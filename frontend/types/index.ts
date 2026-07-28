export interface Building {
  id: string;
  name: string;
  location: string;
  areaSqFt: number;
  occupancyRate: number;
  energyScore: number;
  status: "OPTIMAL" | "ATTENTION_REQUIRED" | "CRITICAL";
  activeAlerts: number;
  monthlySavingsUSD: number;
  co2ReductionTons: number;
}

export interface MetricCardData {
  title: string;
  value: string | number;
  changePercent: number;
  trend: "up" | "down" | "neutral";
  subtitle: string;
  unit?: string;
}

export interface AlertItem {
  id: string;
  buildingId: string;
  buildingName: string;
  severity: "low" | "medium" | "high" | "critical";
  title: string;
  description: string;
  timestamp: string;
  status: "active" | "acknowledged" | "resolved";
  system: "HVAC" | "Lighting" | "Power" | "Occupancy" | "Security";
}

export interface ScenarioNodeData {
  id: string;
  label: string;
  type: "trigger" | "condition" | "action";
  status: "idle" | "running" | "success" | "error";
  config: Record<string, unknown>;
}

export interface AIRecommendation {
  id: string;
  buildingName: string;
  title: string;
  impactUSD: number;
  energySavingPct: number;
  confidenceScore: number;
  actionSummary: string;
  autoExecutable: boolean;
}
