"use client";

import React, { useState, useEffect } from "react";
import { PageContainer, SectionContainer } from "@/components/shared/page-container";
import { MetricCard } from "@/components/shared/metric-card";
// Dashboard Components
import { WelcomeHeader } from "@/components/dashboard/welcome-header";
import { EnergyChart } from "@/components/dashboard/energy-chart";
import { BuildingOverviewCard } from "@/components/dashboard/building-card";
import { AlertPreview } from "@/components/dashboard/alert-preview";
import { RecommendationPreview } from "@/components/dashboard/recommendation-preview";
import { QuickActions } from "@/components/dashboard/quick-actions";
import { ActivityTimeline } from "@/components/dashboard/activity-timeline";
import { DashboardSkeleton } from "@/components/dashboard/dashboard-skeleton";

import { Building, AlertItem, AIRecommendation } from "@/types";
import {
  getRealDashboardOverview,
  getRealBuildings,
  getRealAlerts,
} from "@/lib/api-client";

export default function DashboardPage() {
  const [isLoading, setIsLoading] = useState(true);
  const [buildings, setBuildings] = useState<Building[]>([]);
  const [alerts, setAlerts] = useState<AlertItem[]>([]);
  const [recommendations, setRecommendations] = useState<AIRecommendation[]>([]);
  const [overviewMetrics, setOverviewMetrics] = useState({
    totalEnergy: "4.14 MW",
    monthlySavings: "$42,850",
    carbonReduction: "128.4 Tons",
    facilityEfficiency: "88 / 100",
  });

  useEffect(() => {
    let isMounted = true;

    async function loadRealData() {
      setIsLoading(true);

      const [overviewData, realBuildings, realAlerts] = await Promise.all([
        getRealDashboardOverview(),
        getRealBuildings(),
        getRealAlerts(),
      ]);

      if (isMounted) {
        if (overviewData) {
          setOverviewMetrics({
            totalEnergy: `${overviewData.total_energy_mw ?? 4.14} MW`,
            monthlySavings: `$${(overviewData.monthly_savings_usd ?? 42850).toLocaleString()}`,
            carbonReduction: `${overviewData.carbon_reduction_tons ?? 128.4} Tons`,
            facilityEfficiency: `${overviewData.average_efficiency_score ?? 88} / 100`,
          });
          if (overviewData.recommendations) {
            setRecommendations(overviewData.recommendations);
          }
        }

        if (realBuildings && realBuildings.length > 0) {
          setBuildings(realBuildings);
        }

        if (realAlerts && realAlerts.length > 0) {
          setAlerts(realAlerts);
        }

        setIsLoading(false);
      }
    }

    loadRealData();

    return () => {
      isMounted = false;
    };
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
          title="Total Energy"
          value={overviewMetrics.totalEnergy}
        />
        <MetricCard
          title="Monthly Savings"
          value={overviewMetrics.monthlySavings}
        />
        <MetricCard
          title="Carbon Reduction"
          value={overviewMetrics.carbonReduction}
        />
        <MetricCard
          title="Facility Efficiency"
          value={overviewMetrics.facilityEfficiency}
        />
      </SectionContainer>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        <div className="xl:col-span-2 space-y-6">
          <SectionContainer>
            <EnergyChart />
          </SectionContainer>
          
          <SectionContainer>
            <BuildingOverviewCard buildings={buildings} />
          </SectionContainer>
          
          <SectionContainer className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <RecommendationPreview recommendations={recommendations} />
            <AlertPreview alerts={alerts} />
          </SectionContainer>
        </div>
        
        <div className="space-y-6">
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
