"use client";

import React from "react";
import { LiveHeader } from "@/components/dashboard/live/live-header";
import { KPIGrid, LiveKPIData } from "@/components/dashboard/live/kpi-grid";
import { DigitalTwinPanel } from "@/components/dashboard/live/digital-twin-panel";
import { AIAgentsPanel } from "@/components/dashboard/live/agent-panel";
import { ConsensusPanel, ConsensusData } from "@/components/dashboard/live/consensus-panel";
import { ForecastPanel, ForecastDataPoint } from "@/components/dashboard/live/forecast-panel";
import { LiveTimeline, TimelineItem } from "@/components/dashboard/live/live-timeline";
import { PageContainer, SectionContainer } from "@/components/shared/page-container";

interface LiveDashboardProps {
  scenarioName?: string;
  status?: string;
  simulationTime?: string;
  kpiData?: LiveKPIData;
  consensusData?: ConsensusData;
  forecastData?: ForecastDataPoint[];
  timelineEvents?: TimelineItem[];
}

export function LiveDashboard({
  scenarioName = "Morning Office Rush",
  status = "RUNNING",
  simulationTime = "08:45 AM",
  kpiData,
  consensusData,
  forecastData,
  timelineEvents,
}: LiveDashboardProps) {
  return (
    <PageContainer>
      {/* 1. Header */}
      <SectionContainer>
        <LiveHeader
          scenarioName={scenarioName}
          status={status}
          simulationTime={simulationTime}
        />
      </SectionContainer>

      {/* 2. KPI Grid (8 Metrics) */}
      <SectionContainer>
        <KPIGrid data={kpiData} />
      </SectionContainer>

      {/* 3. Main Operational Panels Grid (Desktop 3-Column Layout) */}
      <SectionContainer className="grid grid-cols-1 lg:grid-cols-3 gap-5 items-stretch">
        {/* Column 1: Digital Twin & Power Flow */}
        <div className="lg:col-span-1">
          <DigitalTwinPanel
            buildingName={scenarioName}
            loadKw={kpiData?.buildingLoadKw}
            solarKw={kpiData?.solarGenerationKw}
            batteryKw={kpiData?.batterySocPct}
            gridKw={kpiData?.gridImportKw}
          />
        </div>

        {/* Column 2: AI Agents Panel */}
        <div className="lg:col-span-2">
          <AIAgentsPanel />
        </div>
      </SectionContainer>

      {/* 4. Second Grid: Consensus, Forecast, Timeline */}
      <SectionContainer className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5 items-stretch">
        <ConsensusPanel data={consensusData} />
        <ForecastPanel data={forecastData} />
        <LiveTimeline events={timelineEvents} />
      </SectionContainer>
    </PageContainer>
  );
}
