import {
  DemandPoint,
  SolarPoint,
  BatteryPoint,
  CarbonPoint,
  CostPoint,
} from '@/types/analytics';

// 24-hour time series dataset for Demand Chart
export const DEMAND_DATA: DemandPoint[] = [
  { time: '00:00', baselineDemand: 110, optimizedDemand: 105, peakLimit: 180 },
  { time: '02:00', baselineDemand: 95, optimizedDemand: 92, peakLimit: 180 },
  { time: '04:00', baselineDemand: 90, optimizedDemand: 90, peakLimit: 180 },
  { time: '06:00', baselineDemand: 120, optimizedDemand: 115, peakLimit: 180 },
  { time: '08:00', baselineDemand: 165, optimizedDemand: 150, peakLimit: 180 },
  { time: '10:00', baselineDemand: 195, optimizedDemand: 160, peakLimit: 180 },
  { time: '11:00', baselineDemand: 220, optimizedDemand: 165, peakLimit: 180 }, // Cloud cover spike baseline 220 -> 165
  { time: '12:00', baselineDemand: 215, optimizedDemand: 162, peakLimit: 180 },
  { time: '13:00', baselineDemand: 210, optimizedDemand: 160, peakLimit: 180 },
  { time: '14:00', baselineDemand: 190, optimizedDemand: 158, peakLimit: 180 },
  { time: '16:00', baselineDemand: 175, optimizedDemand: 155, peakLimit: 180 },
  { time: '18:00', baselineDemand: 150, optimizedDemand: 140, peakLimit: 180 },
  { time: '20:00', baselineDemand: 130, optimizedDemand: 125, peakLimit: 180 },
  { time: '22:00', baselineDemand: 115, optimizedDemand: 110, peakLimit: 180 },
];

// Solar Generation dataset highlighting cloud cover drop (11:00 - 14:00)
export const SOLAR_DATA: SolarPoint[] = [
  { time: '06:00', clearSkySolar: 15, actualSolar: 14, cloudImpactDrop: 1 },
  { time: '08:00', clearSkySolar: 45, actualSolar: 43, cloudImpactDrop: 2 },
  { time: '10:00', clearSkySolar: 80, actualSolar: 78, cloudImpactDrop: 2 },
  { time: '11:00', clearSkySolar: 95, actualSolar: 33, cloudImpactDrop: 62 }, // Severe drop
  { time: '12:00', clearSkySolar: 105, actualSolar: 37, cloudImpactDrop: 68 }, // Severe drop
  { time: '13:00', clearSkySolar: 100, actualSolar: 35, cloudImpactDrop: 65 }, // Severe drop
  { time: '14:00', clearSkySolar: 85, actualSolar: 75, cloudImpactDrop: 10 }, // Clearing
  { time: '16:00', clearSkySolar: 55, actualSolar: 53, cloudImpactDrop: 2 },
  { time: '18:00', clearSkySolar: 20, actualSolar: 19, cloudImpactDrop: 1 },
  { time: '20:00', clearSkySolar: 0, actualSolar: 0, cloudImpactDrop: 0 },
];

// Battery Energy Storage System (BESS) dataset
export const BATTERY_DATA: BatteryPoint[] = [
  { time: '00:00', socPct: 90, powerKw: -10, capacityKwh: 200 },
  { time: '04:00', socPct: 98, powerKw: -5, capacityKwh: 200 },
  { time: '08:00', socPct: 95, powerKw: 0, capacityKwh: 200 },
  { time: '11:00', socPct: 88, powerKw: 18, capacityKwh: 200 }, // Discharging 18 kW for AI rec
  { time: '12:00', socPct: 79, powerKw: 18, capacityKwh: 200 },
  { time: '13:00', socPct: 70, powerKw: 18, capacityKwh: 200 },
  { time: '14:00', socPct: 62, powerKw: 0, capacityKwh: 200 },
  { time: '16:00', socPct: 60, powerKw: -15, capacityKwh: 200 }, // Solar recharge
  { time: '20:00', socPct: 85, powerKw: 0, capacityKwh: 200 },
];

// Carbon Emissions dataset
export const CARBON_DATA: CarbonPoint[] = [
  { time: '00:00', baselineEmissions: 45, optimizedEmissions: 42, gridCarbonIntensity: 210 },
  { time: '06:00', baselineEmissions: 48, optimizedEmissions: 44, gridCarbonIntensity: 195 },
  { time: '11:00', baselineEmissions: 98, optimizedEmissions: 62, gridCarbonIntensity: 240 }, // Peak dirty grid avoidance
  { time: '12:00', baselineEmissions: 95, optimizedEmissions: 60, gridCarbonIntensity: 245 },
  { time: '13:00', baselineEmissions: 92, optimizedEmissions: 58, gridCarbonIntensity: 235 },
  { time: '18:00', baselineEmissions: 65, optimizedEmissions: 55, gridCarbonIntensity: 200 },
  { time: '22:00', baselineEmissions: 46, optimizedEmissions: 43, gridCarbonIntensity: 205 },
];

// Energy Cost dataset
export const COST_DATA: CostPoint[] = [
  { time: '00:00', tariffRateUsd: 0.15, baselineCostUsd: 16.5, optimizedCostUsd: 15.7 },
  { time: '06:00', tariffRateUsd: 0.22, baselineCostUsd: 26.4, optimizedCostUsd: 25.3 },
  { time: '11:00', tariffRateUsd: 0.45, baselineCostUsd: 99.0, optimizedCostUsd: 74.25 }, // High tariff peak saving!
  { time: '12:00', tariffRateUsd: 0.45, baselineCostUsd: 96.7, optimizedCostUsd: 72.9 },
  { time: '13:00', tariffRateUsd: 0.45, baselineCostUsd: 94.5, optimizedCostUsd: 72.0 },
  { time: '18:00', tariffRateUsd: 0.30, baselineCostUsd: 45.0, optimizedCostUsd: 42.0 },
  { time: '22:00', tariffRateUsd: 0.15, baselineCostUsd: 17.2, optimizedCostUsd: 16.5 },
];
