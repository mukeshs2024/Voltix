"use client";

import React, { useState, useEffect } from "react";
import { PageContainer, SectionContainer } from "@/components/shared/page-container";
import { MetricCard } from "@/components/shared/metric-card";
import { Zap, TrendingUp, Leaf, Activity } from "lucide-react";
// Dashboard Components
import { WelcomeHeader } from "@/components/dashboard/welcome-header";
import { EnergyChart } from "@/components/dashboard/energy-chart";
import { BuildingOverviewCard } from "@/components/dashboard/building-card";
import { WeatherCard } from "@/components/dashboard/weather-card";
import { AlertPreview } from "@/components/dashboard/alert-preview";
import { RecommendationPreview } from "@/components/dashboard/recommendation-preview";
import { QuickActions } from "@/components/dashboard/quick-actions";
import { ActivityTimeline } from "@/components/dashboard/activity-timeline";
import { DashboardSkeleton } from "@/components/dashboard/dashboard-skeleton";

import { Building, AlertItem, AIRecommendation } from "@/types";

// Mocked Data
const mockBuildings: Building[] = [
  { id: "1", name: "HQ Tower One", location: "San Francisco, CA", areaSqFt: 150000, occupancyRate: 85, energyScore: 94, status: "OPTIMAL", activeAlerts: 0, monthlySavingsUSD: 12500, co2ReductionTons: 45 },
  { id: "2", name: "Innovation Hub", location: "Austin, TX", areaSqFt: 85000, occupancyRate: 92, energyScore: 88, status: "OPTIMAL", activeAlerts: 1, monthlySavingsUSD: 8400, co2ReductionTons: 28 },
  { id: "3", name: "East Coast Plaza", location: "New York, NY", areaSqFt: 210000, occupancyRate: 78, energyScore: 72, status: "ATTENTION_REQUIRED", activeAlerts: 3, monthlySavingsUSD: 4100, co2ReductionTons: 12 },
  { id: "4", name: "Westside Data Center", location: "San Jose, CA", areaSqFt: 320000, occupancyRate: 100, energyScore: 85, status: "OPTIMAL", activeAlerts: 0, monthlySavingsUSD: 24000, co2ReductionTons: 90 },
];

const mockAlerts: AlertItem[] = [
  { id: "a1", buildingId: "3", buildingName: "East Coast Plaza", severity: "high", title: "HVAC Anomaly Detected", description: "Chiller 2 operating outside optimal parameters.", timestamp: "10 mins ago", status: "active", system: "HVAC" },
  { id: "a2", buildingId: "3", buildingName: "East Coast Plaza", severity: "medium", title: "Peak Demand Warning", description: "Approaching demand response threshold.", timestamp: "45 mins ago", status: "active", system: "Power" },
];

const mockRecommendations: AIRecommendation[] = [
  { id: "r1", buildingName: "HQ Tower One", title: "Pre-cool facility", impactUSD: 450, energySavingPct: 12, confidenceScore: 98, actionSummary: "Run chillers at 100% until 14:00 to offset peak demand pricing.", autoExecutable: true },
  { id: "r2", buildingName: "Innovation Hub", title: "Dim non-essential lighting", impactUSD: 120, energySavingPct: 4, confidenceScore: 92, actionSummary: "Reduce lighting by 30% in zones A and C due to low occupancy.", autoExecutable: true },
];

export default function DashboardPage() {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate data fetching
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1200);
    return () => clearTimeout(timer);
  }, []);

  if (isLoading) {
    return <DashboardSkeleton />;
  }

  return (
    <PageContainer>
      <SectionContainer>
        <WelcomeHeader />
      </SectionContainer>

      {/* KPI Cards Grid */}
      <SectionContainer className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <MetricCard
          title="Total Energy Draw"
          value="4.14 MW"
          trend="down"
          changePercent={14.2}
          subtitle="lower than baseline"
          icon={<Zap className="w-4 h-4 text-[#111827]" />}
          delay={0.1}
        />
        <MetricCard
          title="Monthly Cost Savings"
          value="$42,850"
          trend="up"
          changePercent={17.5}
          subtitle="vs previous cycle"
          icon={<TrendingUp className="w-4 h-4 text-[#22C55E]" />}
          delay={0.2}
        />
        <MetricCard
          title="Carbon Abatement"
          value="128.4 Tons"
          subtitle="Equiv. 5,400 trees"
          icon={<Leaf className="w-4 h-4 text-[#22C55E]" />}
          delay={0.3}
        />
        <MetricCard
          title="Facility Efficiency"
          value="88 / 100"
          subtitle="Top 5% Portfolio"
          icon={<Activity className="w-4 h-4 text-[#111827]" />}
          delay={0.4}
        />
      </SectionContainer>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
        <div className="xl:col-span-2 space-y-8">
          <SectionContainer>
            <EnergyChart />
          </SectionContainer>
          
          <SectionContainer>
            <BuildingOverviewCard buildings={mockBuildings} />
          </SectionContainer>
          
          <SectionContainer className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <RecommendationPreview recommendations={mockRecommendations} />
            <AlertPreview alerts={mockAlerts} />
          </SectionContainer>
        </div>
        
        <div className="space-y-8">
          <SectionContainer>
            <WeatherCard />
          </SectionContainer>
          
          <SectionContainer>
            <QuickActions />
          </SectionContainer>

          <SectionContainer>
            <ActivityTimeline />
          </SectionContainer>
        </div>
      </div>
    </PageContainer>
  );
}
