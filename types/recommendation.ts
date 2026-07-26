export type PriorityType = "high" | "medium" | "low";

export interface Recommendation {
  id: string;
  title: string;
  savingsKw: number;
  reason: string;
  priority: PriorityType;
  confidence: number; // Percentage (e.g., 94)
  category: "EV Charging" | "HVAC Setback" | "BESS Discharge" | "Load Shifting" | "Grid Import";
  approved: boolean;
  estimatedCostSavings: number; // $ / hr
  estimatedCarbonSavings: number; // kg CO2 / hr
  actionDetails: string;
  targetAsset: string;
}

export interface ImpactSummaryData {
  beforeDemandKw: number;
  afterDemandKw: number;
  totalSavedKw: number;
  carbonSavedKg: number;
  moneySavedUsd: number;
  peakReductionPct: number;
}
