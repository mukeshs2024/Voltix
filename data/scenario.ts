import { ScenarioInfo } from '@/types/dashboard';

export const SCENARIO_LIST: ScenarioInfo[] = [
  {
    id: 'cloud-cover',
    title: 'Cloud Cover Event',
    description: 'Sudden 65% drop in PV solar output expected between 11:00 AM - 02:00 PM due to heavy localized overcast over West Wing solar arrays.',
    severity: 'high',
    solarImpactPct: -65,
    demandImpactKw: 55,
  },
  {
    id: 'heat-wave',
    title: 'Heat Wave Peak HVAC Load',
    description: 'Ambient temperature spike to 39°C. Chiller loads surge by 40% creating potential grid peak demand penalty.',
    severity: 'critical',
    solarImpactPct: +10,
    demandImpactKw: 85,
  },
  {
    id: 'peak-hour',
    title: 'Grid Peak Hour Tariff',
    description: 'Utility peak pricing window ($0.48/kWh). Optimization shifts heavy flexible loads to off-peak battery reserves.',
    severity: 'medium',
    solarImpactPct: 0,
    demandImpactKw: 40,
  },
  {
    id: 'price-spike',
    title: 'Real-time Market Price Spike',
    description: 'Wholesale spot energy price spiked to $1.20/kWh due to regional generator trip. Discharge BESS immediately.',
    severity: 'critical',
    solarImpactPct: 0,
    demandImpactKw: 60,
  },
  {
    id: 'normal',
    title: 'Standard Grid Operations',
    description: 'Baseline grid operation with balanced solar generation, normal occupancy, and scheduled battery buffering.',
    severity: 'low',
    solarImpactPct: 0,
    demandImpactKw: 0,
  },
];
