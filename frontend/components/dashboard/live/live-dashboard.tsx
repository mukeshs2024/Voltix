"use client";

import React from "react";
import { LiveHeader } from "@/components/dashboard/live/live-header";
import { KPIGrid, LiveKPIData } from "@/components/dashboard/live/kpi-grid";
import { DigitalTwinPanel } from "@/components/dashboard/live/digital-twin-panel";
import { AIAgentsPanel } from "@/components/dashboard/live/agent-panel";
import { ConsensusPanel, ConsensusData } from "@/components/dashboard/live/consensus-panel";
import { ForecastPanel, ForecastDataPoint } from "@/components/dashboard/live/forecast-panel";
import { LiveTimeline, TimelineItem } from "@/components/dashboard/live/live-timeline";
import { AgentCardData } from "@/components/dashboard/live/agent-card";
import { PageContainer, SectionContainer } from "@/components/shared/page-container";
import { LiveExecutionQueue, PipelineStepId } from "@/components/dashboard/live/live-execution-queue";
import { SystemOrchestratorCard } from "@/components/dashboard/live/system-orchestrator";
import { AIExplainabilityPanel, ExplainabilityData } from "@/components/dashboard/live/ai-explainability-panel";
import { SystemArchitectureFooter, ArchitectureModule } from "@/components/dashboard/live/system-architecture-footer";

interface LiveDashboardProps {
  scenarioName?: string;
  status?: string;
  simulationTime?: string;
  kpiData?: LiveKPIData;
  consensusData?: ConsensusData;
  forecastData?: ForecastDataPoint[];
  timelineEvents?: TimelineItem[];
  agents?: AgentCardData[];
  explainabilityData?: ExplainabilityData;
  orchestratorData?: {
    phase: string;
    runningAgents: number;
    messagesExchanged: number;
    recommendations: number;
    consensusIteration: number;
    optimizationCycle: number;
  };
  activePipelineStep?: PipelineStepId;
  activeArchModule?: ArchitectureModule;
  tick?: number;
  communicating?: boolean;
  broadcasting?: boolean;
  speed?: number;
  onPlay?: () => void;
  onPause?: () => void;
  onReset?: () => void;
  onSpeedChange?: (speed: number) => void;
  elapsedSeconds?: number;
}

export function LiveDashboard({
  scenarioName = "Morning Office Rush",
  status = "RUNNING",
  simulationTime = "08:45 AM",
  kpiData,
  consensusData,
  forecastData,
  timelineEvents,
  agents,
  explainabilityData,
  orchestratorData,
  activePipelineStep,
  activeArchModule,
  tick,
  communicating,
  broadcasting,
  speed,
  onPlay,
  onPause,
  onReset,
  onSpeedChange,
  elapsedSeconds,
}: LiveDashboardProps) {
  return (
    <PageContainer>
      {/* 1. Header */}
      <SectionContainer>
        <LiveHeader
          scenarioName={scenarioName}
          status={status}
          simulationTime={simulationTime}
          speed={speed}
          onPlay={onPlay}
          onPause={onPause}
          onReset={onReset}
          onSpeedChange={onSpeedChange}
          elapsedSeconds={elapsedSeconds}
        />
      </SectionContainer>

      {/* 2. KPI Grid (8 Metrics) */}
      <SectionContainer>
        <KPIGrid data={kpiData} />
      </SectionContainer>

      {/* 3. Main Operational Panels Grid (Desktop 4-Column Layout) */}
      <SectionContainer className="grid grid-cols-1 lg:grid-cols-4 gap-5 items-stretch">
        
        {/* Column 1: Live Execution Queue & System Orchestrator */}
        <div className="lg:col-span-1 flex flex-col h-full">
          {orchestratorData && (
            <SystemOrchestratorCard
              tick={tick || 0}
              phase={orchestratorData.phase}
              runningAgents={orchestratorData.runningAgents}
              messagesExchanged={orchestratorData.messagesExchanged}
              recommendations={orchestratorData.recommendations}
              consensusIteration={orchestratorData.consensusIteration}
              optimizationCycle={orchestratorData.optimizationCycle}
            />
          )}
          <div className="flex-1 min-h-[350px]">
            <LiveExecutionQueue activeStepId={activePipelineStep} tick={tick} />
          </div>
        </div>

        {/* Column 2: Digital Twin & Power Flow */}
        <div className="lg:col-span-1">
          <DigitalTwinPanel
            buildingName={scenarioName}
            loadKw={kpiData?.buildingLoadKw}
            solarKw={kpiData?.solarGenerationKw}
            batteryKw={kpiData?.batterySocPct}
            gridKw={kpiData?.gridImportKw}
            broadcasting={broadcasting}
          />
        </div>

        {/* Column 3 & 4: AI Agents Panel */}
        <div className="lg:col-span-2">
          <AIAgentsPanel agents={agents} communicating={communicating} />
        </div>
      </SectionContainer>

      {/* 4. Second Grid: Consensus, Explainability, Forecast, Timeline */}
      <SectionContainer className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-5 items-stretch">
        <ConsensusPanel data={consensusData} />
        <AIExplainabilityPanel data={explainabilityData} />
        <ForecastPanel data={forecastData} />
        <LiveTimeline events={timelineEvents} />
      </SectionContainer>
      
      {/* 5. System Architecture Flow Footer */}
      <SectionContainer className="pb-8">
        <SystemArchitectureFooter activeModule={activeArchModule} />
      </SectionContainer>
    </PageContainer>
  );
}
