export type ScenarioType =
  | "normal"
  | "cloud-cover"
  | "heat-wave"
  | "peak-hour"
  | "price-spike";

export interface ScenarioInfo {
  id: ScenarioType;
  title: string;
  description: string;
  severity: "low" | "medium" | "high" | "critical";
  solarImpactPct: number;
  demandImpactKw: number;
}
