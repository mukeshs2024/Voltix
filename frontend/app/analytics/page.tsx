"use client";

import React, { useState, useEffect } from "react";
import { PageContainer, SectionContainer } from "@/components/shared/page-container";
import { AnalyticsSkeleton } from "@/components/analytics/analytics-skeleton";
import { EnergyConsumptionChart } from "@/components/analytics/energy-consumption-chart";
import { SavingsBarChart } from "@/components/analytics/savings-bar-chart";
import { EfficiencyTrendChart } from "@/components/analytics/efficiency-trend-chart";
import { BuildingComparisonPie } from "@/components/analytics/building-comparison-pie";
import { HeatmapPlaceholder } from "@/components/analytics/heatmap-placeholder";
import { MetricCard } from "@/components/shared/metric-card";
import { Zap, TrendingUp, Leaf, Download, Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function AnalyticsPage() {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1200);
    return () => clearTimeout(timer);
  }, []);

  if (isLoading) {
    return <AnalyticsSkeleton />;
  }

  return (
    <PageContainer>
      {/* Page Header */}
      <SectionContainer>
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-2">
          <div>
            <h1 className="text-2xl font-bold text-[#111827] tracking-tight">Executive Analytics</h1>
            <p className="text-sm text-[#6B7280] mt-1">Portfolio-wide energy insights and AI optimization impact.</p>
          </div>
          
          <div className="flex items-center gap-3">
            <Button variant="outline" size="sm" className="h-9 gap-2 bg-white">
              <Calendar className="w-4 h-4 text-[#6B7280]" />
              <span>Last 12 Months</span>
            </Button>
            <Button variant="outline" size="sm" className="h-9 gap-2 bg-white">
              <Download className="w-4 h-4 text-[#6B7280]" />
              <span>Export Report</span>
            </Button>
          </div>
        </div>
      </SectionContainer>

      {/* KPI Cards */}
      <SectionContainer className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <MetricCard
          title="Total Energy Avoided"
          value="1.24 GWh"
          delay={0.1}
        />
        <MetricCard
          title="Total Cost Savings"
          value="$110,500"
          delay={0.2}
        />
        <MetricCard
          title="Carbon Avoided"
          value="840 Tons"
          delay={0.3}
        />
        <MetricCard
          title="AI Optimization Impact"
          value="+14.2%"
          delay={0.4}
        />
      </SectionContainer>

      {/* Main Charts */}
      <SectionContainer className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <EnergyConsumptionChart />
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <SavingsBarChart />
            <EfficiencyTrendChart />
          </div>
        </div>
        
        <div className="space-y-6">
          <BuildingComparisonPie />
          <HeatmapPlaceholder />
        </div>
      </SectionContainer>
    </PageContainer>
  );
}
