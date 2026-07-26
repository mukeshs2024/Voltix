export interface DemandPoint {
  time: string;
  baselineDemand: number;
  optimizedDemand: number;
  peakLimit: number;
}

export interface SolarPoint {
  time: string;
  clearSkySolar: number;
  actualSolar: number;
  cloudImpactDrop: number;
}

export interface BatteryPoint {
  time: string;
  socPct: number; // State of Charge 0-100%
  powerKw: number; // positive = discharge, negative = charge
  capacityKwh: number;
}

export interface CarbonPoint {
  time: string;
  baselineEmissions: number; // kg CO2
  optimizedEmissions: number; // kg CO2
  gridCarbonIntensity: number; // g CO2 / kWh
}

export interface CostPoint {
  time: string;
  tariffRateUsd: number; // $/kWh
  baselineCostUsd: number;
  optimizedCostUsd: number;
}
