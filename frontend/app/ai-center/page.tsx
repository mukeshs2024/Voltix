"use client";

import React, { useEffect, useState } from "react";
import { LiveDashboard } from "@/components/dashboard/live/live-dashboard";
import SimulationInputPage from "@/components/agents/simulation-input-page";
import { BootSequenceScreen } from "@/components/simulation/boot-sequence-screen";
import { SimulationSummaryScreen } from "@/components/simulation/simulation-summary-screen";
import { SimulationScenario } from "@/lib/agent-workbench";
import { LiveKPIData } from "@/components/dashboard/live/kpi-grid";
import { ConsensusData, ConsensusVote } from "@/components/dashboard/live/consensus-panel";
import { TimelineItem } from "@/components/dashboard/live/live-timeline";
import { ForecastDataPoint } from "@/components/dashboard/live/forecast-panel";
import { AgentCardData } from "@/components/dashboard/live/agent-card";
import { PipelineStepId } from "@/components/dashboard/live/live-execution-queue";
import { ExplainabilityData } from "@/components/dashboard/live/ai-explainability-panel";
import { ArchitectureModule } from "@/components/dashboard/live/system-architecture-footer";

type ViewState = 'SCENARIO_SELECTION' | 'BOOT_SEQUENCE' | 'LIVE_SIMULATION' | 'SIMULATION_SUMMARY';

const BASELINE_KPI: LiveKPIData = {
  buildingLoadKw: 1380, gridImportKw: 930, solarGenerationKw: 450, batterySocPct: 82,
  hvacPowerKw: 620, lightingPowerKw: 140, energyCostHourlyUSD: 165.6, monthlySavingsUSD: 12500,
};

const TARGET_KPI: LiveKPIData = {
  buildingLoadKw: 1320, gridImportKw: 810, solarGenerationKw: 450, batterySocPct: 77.8,
  hvacPowerKw: 580, lightingPowerKw: 135, energyCostHourlyUSD: 135.0, monthlySavingsUSD: 14200,
};

const INITIAL_AGENTS: AgentCardData[] = [
  { id: "occupancy", name: "Occupancy Agent", status: "Monitoring", inputs: { "Zone Density": "85%", "Meeting Schedule": "Surge at 09:30" }, observation: "", reasoning: "", recommendation: "", expectedImpact: "", confidence: 0, lastUpdated: "Just now" },
  { id: "hvac", name: "HVAC Agent", status: "Monitoring", inputs: { "Occ Forecast": "Pending" }, observation: "", reasoning: "", recommendation: "", expectedImpact: "", confidence: 0, lastUpdated: "Just now" },
  { id: "energy", name: "Energy Agent", status: "Monitoring", inputs: { "Cooling Predict": "Pending" }, observation: "", reasoning: "", recommendation: "", expectedImpact: "", confidence: 0, lastUpdated: "Just now" },
  { id: "grid", name: "Grid Agent", status: "Monitoring", inputs: { "Demand Forecast": "Pending", "Grid Price": "$0.50/kWh" }, observation: "", reasoning: "", recommendation: "", expectedImpact: "", confidence: 0, lastUpdated: "Just now" },
  { id: "equipment", name: "Equipment Agent", status: "Monitoring", inputs: { "HVAC Strategy": "Pending" }, observation: "", reasoning: "", recommendation: "", expectedImpact: "", confidence: 0, lastUpdated: "Just now" }
];

export default function AICenterPage() {
  const [viewState, setViewState] = useState<ViewState>('SCENARIO_SELECTION');
  const [scenario, setScenario] = useState<SimulationScenario | null>(null);
  
  const [isPlaying, setIsPlaying] = useState(false);
  const [speed, setSpeed] = useState(1);
  const [tick, setTick] = useState(0);
  const [elapsedSeconds, setElapsedSeconds] = useState(0);

  const [kpis, setKpis] = useState<LiveKPIData>(BASELINE_KPI);
  const [agents, setAgents] = useState<AgentCardData[]>(INITIAL_AGENTS);
  const [consensus, setConsensus] = useState<ConsensusData>({ progress: 0, iteration: 1, votes: [], pendingRecommendationsCount: 0 });
  const [timeline, setTimeline] = useState<TimelineItem[]>([]);
  const [forecast, setForecast] = useState<ForecastDataPoint[]>([{ time: "08:00 AM", predicted: 1380, optimized: 1380 }]);
  
  const [activePipelineStep, setActivePipelineStep] = useState<PipelineStepId>("sensors_updated");
  const [activeArchModule, setActiveArchModule] = useState<ArchitectureModule>("sim_engine");
  const [explainabilityData, setExplainabilityData] = useState<ExplainabilityData | undefined>();
  const [broadcasting, setBroadcasting] = useState(false);
  const [communicating, setCommunicating] = useState(false);

  // Global orchestrator stats
  const [optCycles, setOptCycles] = useState(18);
  const [msgExchanged, setMsgExchanged] = useState(27);

  const handleStartSimulation = (selectedScenario: SimulationScenario, selectedSpeed: number) => {
    setScenario(selectedScenario);
    setSpeed(selectedSpeed);
    setViewState('BOOT_SEQUENCE');
  };

  const handleBootComplete = () => {
    setViewState('LIVE_SIMULATION');
    setIsPlaying(true);
    setTimeline([{ id: "init", timestamp: "08:00 AM", source: "System Orchestrator", destination: "Engine", event: "Simulation Started. Boot complete.", status: "Delivered" }]);
  };

  const formatSimTime = (t: number) => {
    const mins = 8 * 60 + Math.floor(t / 2);
    const h = Math.floor(mins / 60);
    const m = mins % 60;
    return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')} AM`;
  };

  const interpolateKpi = (current: number, target: number, step: number) => {
    if (Math.abs(target - current) < step) return target;
    return current + (target > current ? step : -step);
  };

  // 40-Tick Infinite Loop
  useEffect(() => {
    if (!isPlaying || viewState !== 'LIVE_SIMULATION') return;
    const intervalMs = 1200 / speed;
    const interval = setInterval(() => {
      setTick(t => {
        const nextTick = t + 1;
        if (nextTick > 40) {
          setOptCycles(c => c + 1);
          return 1;
        }
        return nextTick;
      });
      setElapsedSeconds(prev => prev + 1.2);
    }, intervalMs);
    return () => clearInterval(interval);
  }, [isPlaying, speed, viewState]);

  // Orchestrator Engine State Machine
  useEffect(() => {
    if (tick === 0 || viewState !== 'LIVE_SIMULATION') return;
    const time = formatSimTime(elapsedSeconds);
    const log = (source: string, destination: string, event: string, status: TimelineItem["status"] = "Delivered") => {
      setTimeline(prev => [...prev, { id: `${tick}-${Date.now()}`, timestamp: time, source, destination, event, status }].slice(-60));
      setMsgExchanged(m => m + 1);
    };

    // 1. Sensors & Twin Broadcast
    if (tick === 1) {
      setActivePipelineStep("sensors_updated");
      setActiveArchModule("sensors");
      log("Sensor Engine", "Digital Twin", "Telemetry aggregation cycle started.", "Delivered");
      setBroadcasting(false);
      setCommunicating(false);
      setConsensus({ progress: 0, iteration: 1, votes: [], pendingRecommendationsCount: 0 });
      setExplainabilityData(undefined);
    }
    
    if (tick === 3) {
      setActivePipelineStep("twin_updated");
      setActiveArchModule("twin_read");
      setBroadcasting(true);
      log("Digital Twin", "Agent Network", "State updated. Broadcasting to all agents.", "Broadcast");
    }

    // 2. Sequential Agent Execution (Dependency Chain)
    if (tick === 5) {
      setActivePipelineStep("occupancy_agent");
      setActiveArchModule("agents");
      setBroadcasting(false);
      setAgents(prev => {
        let occ = { ...prev[0], status: "Analyzing" as const, observation: "Detecting 85% occupancy surge in Lobby & Zone B." };
        return [occ, ...prev.slice(1)];
      });
      log("Digital Twin", "Occupancy Agent", "Received zone telemetry. Analyzing...", "Delivered");
    }
    if (tick === 7) {
      setAgents(prev => {
        let occ = { ...prev[0], status: "Recommendation Ready" as const, reasoning: "Predicting thermal load peak by 09:15 AM due to dense scheduling.", recommendation: "Forecast: High load at 09:30 AM.", expectedImpact: "Early Warning", confidence: 91 };
        let hvac = { ...prev[1], inputs: { ...prev[1].inputs, "Occ Forecast": "High Load at 09:30" } };
        return [occ, hvac, ...prev.slice(2)];
      });
      log("Occupancy Agent", "HVAC Agent", "Occupancy Forecast generated.", "Delivered");
    }

    if (tick === 9) {
      setActivePipelineStep("hvac_agent");
      setAgents(prev => {
        let hvac = { ...prev[1], status: "Analyzing" as const, observation: "Occupancy forecast indicates thermal threshold breach in 30 mins." };
        return [prev[0], hvac, ...prev.slice(2)];
      });
      log("Occupancy Agent", "HVAC Agent", "Received Occ Forecast. Updating cooling model...", "Delivered");
    }
    if (tick === 11) {
      setAgents(prev => {
        let hvac = { ...prev[1], status: "Recommendation Ready" as const, reasoning: "Chiller 2 delta-T compression curve optimal for pre-cooling.", recommendation: "Pre-cool Zone B. Setpoint -1.5°C.", expectedImpact: "Avoid thermal penalty", confidence: 94, previousRecommendation: "Maintain setpoint.", previousConfidence: 85, reasonForChange: "Occupancy surge detected." };
        let energy = { ...prev[2], inputs: { ...prev[2].inputs, "Cooling Predict": "Pre-cool (-1.5°C)" } };
        return [prev[0], hvac, energy, prev[3], prev[4]];
      });
      log("HVAC Agent", "Energy Agent", "Cooling Prediction generated.", "Delivered");
    }

    if (tick === 13) {
      setActivePipelineStep("energy_agent");
      setAgents(prev => {
        let energy = { ...prev[2], status: "Analyzing" as const, observation: "Pre-cooling will spike load by +150kW." };
        return [prev[0], prev[1], energy, prev[3], prev[4]];
      });
      log("HVAC Agent", "Energy Agent", "Received Cooling Prediction. Estimating Building Demand.", "Delivered");
    }
    if (tick === 15) {
      setAgents(prev => {
        let energy = { ...prev[2], status: "Recommendation Ready" as const, reasoning: "Building demand will exceed 1400kW peak threshold.", recommendation: "Forecast: Peak Demand at 1450kW.", expectedImpact: "Grid Alert", confidence: 96 };
        let grid = { ...prev[3], inputs: { ...prev[3].inputs, "Demand Forecast": "1450kW Peak" } };
        return [prev[0], prev[1], energy, grid, prev[4]];
      });
      log("Energy Agent", "Grid Agent", "Peak Demand Forecast generated.", "Delivered");
    }

    if (tick === 17) {
      setActivePipelineStep("grid_agent");
      setAgents(prev => {
        let grid = { ...prev[3], status: "Analyzing" as const, observation: "Peak demand aligns with $0.50/kWh tariff window." };
        return [prev[0], prev[1], prev[2], grid, prev[4]];
      });
      log("Energy Agent", "Grid Agent", "Received Peak Forecast. Calculating Battery Dispatch.", "Delivered");
    }
    if (tick === 19) {
      setAgents(prev => {
        let grid = { ...prev[3], status: "Recommendation Ready" as const, reasoning: "Battery arbitrage highly profitable at current spot price.", recommendation: "Dispatch 120kW Battery.", expectedImpact: "Save $145/hr", confidence: 98, previousRecommendation: "Dispatch 80kW Battery.", previousConfidence: 91, reasonForChange: "Load forecast increased by +50kW." };
        let equip = { ...prev[4], inputs: { ...prev[4].inputs, "HVAC Strategy": "Pre-cool Active" } };
        return [prev[0], prev[1], prev[2], grid, equip];
      });
      log("Grid Agent", "Consensus Engine", "Battery Strategy Generated.", "Delivered");
    }

    if (tick === 21) {
      setActivePipelineStep("equipment_agent");
      setAgents(prev => {
        let equip = { ...prev[4], status: "Recommendation Ready" as const, observation: "Pre-cooling forces Chiller 2 to 90% load.", reasoning: "Vibration FFT remains nominal.", recommendation: "Approve HVAC Strategy.", expectedImpact: "N/A", confidence: 99 };
        return [prev[0], prev[1], prev[2], prev[3], equip];
      });
      log("Equipment Agent", "Consensus Engine", "Equipment Health Verified.", "Delivered");
    }

    // 3. Multi-Round Consensus Negotiation
    if (tick === 23) {
      setActivePipelineStep("consensus");
      setActiveArchModule("consensus");
      setCommunicating(true);
      log("Agent Network", "Consensus Engine", "Received all outputs. Starting Iteration 1.", "Pending");
      setAgents(prev => prev.map(a => ({ ...a, status: "Waiting Consensus" })));
      setConsensus({
        progress: 33, iteration: 1, pendingRecommendationsCount: 5,
        votes: [
          { agentName: "Occupancy", status: "Approved" },
          { agentName: "HVAC", status: "Approved" },
          { agentName: "Energy", status: "Requested Change" },
          { agentName: "Grid", status: "Pending" },
          { agentName: "Equipment", status: "Approved" },
        ]
      });
    }

    if (tick === 26) {
      log("Energy Agent", "Consensus Engine", "Requested HVAC modification to avoid hard peak. Iteration 2.", "Pending");
      setConsensus(prev => ({
        ...prev, progress: 66, iteration: 2,
        votes: [
          { agentName: "Occupancy", status: "Approved" },
          { agentName: "HVAC", status: "Modified" },
          { agentName: "Energy", status: "Approved" },
          { agentName: "Grid", status: "Approved" },
          { agentName: "Equipment", status: "Approved" },
        ]
      }));
    }

    if (tick === 29) {
      setCommunicating(false);
      log("Consensus Engine", "Optimization Engine", "100% Consensus Reached (Iteration 3).", "Delivered");
      setConsensus({
        progress: 100, iteration: 3, pendingRecommendationsCount: 0,
        acceptedPlanTitle: "Global Optimization: Pre-cool + Arbitrage",
        acceptedPlanDetail: "1. Modified Pre-cool Zone B (-1.0°C)\n2. Dispatch 120kW Battery\n3. Shed non-critical lighting (-5kW)",
        optimizationSummary: "Consensus reached across thermal, grid, and capacity constraints.",
        expectedSavingsPct: 18.5, expectedSavingsUSD: 450,
        votes: [
          { agentName: "Occupancy", status: "Approved" },
          { agentName: "HVAC", status: "Approved" },
          { agentName: "Energy", status: "Approved" },
          { agentName: "Grid", status: "Approved" },
          { agentName: "Equipment", status: "Approved" },
        ]
      });
      setExplainabilityData({
        decision: "Dispatch 120kW Battery & Apply -1.0°C Pre-cool",
        reasons: [
          "Occupancy surge predicting +150kW HVAC load",
          "Grid tariff peaking at $0.50/kWh in 30 mins",
          "Energy Agent modified HVAC request to prevent grid penalty"
        ],
        dataUsed: ["Real-time Occupancy", "Grid API Tariff", "Digital Twin Thermal Model"],
        contributingAgents: ["Occupancy", "HVAC", "Energy", "Grid"],
        rejectedAlternatives: [
          "Run HVAC at standard setpoint (High Cost Penalty)",
          "Dispatch only 80kW Battery (Insufficient Demand Shave)"
        ],
        confidence: 97,
        expectedImpact: "Save $450/day. Comfort Maintained."
      });
    }

    // 4. Optimization Applied & Feedback Loop
    if (tick === 32) {
      setActivePipelineStep("optimization_applied");
      setActiveArchModule("optimization");
      log("Optimization Engine", "System Actuators", "Applying optimization plan...", "Delivered");
      setAgents(prev => prev.map(a => ({ ...a, status: "Monitoring" })));
    }

    if (tick === 34) {
      setActiveArchModule("twin_write");
      log("System Actuators", "Digital Twin", "Building state modified. Updating Twin.", "Delivered");
    }

    // Apply KPI transitions smoothly
    setKpis(prev => {
      if (tick >= 32) {
        return {
          buildingLoadKw: interpolateKpi(prev.buildingLoadKw ?? BASELINE_KPI.buildingLoadKw!, TARGET_KPI.buildingLoadKw!, 4),
          gridImportKw: interpolateKpi(prev.gridImportKw ?? BASELINE_KPI.gridImportKw!, TARGET_KPI.gridImportKw!, 6),
          solarGenerationKw: prev.solarGenerationKw,
          batterySocPct: Number(interpolateKpi(prev.batterySocPct ?? BASELINE_KPI.batterySocPct!, TARGET_KPI.batterySocPct!, 0.1).toFixed(1)),
          hvacPowerKw: interpolateKpi(prev.hvacPowerKw ?? BASELINE_KPI.hvacPowerKw!, TARGET_KPI.hvacPowerKw!, 2.5),
          lightingPowerKw: interpolateKpi(prev.lightingPowerKw ?? BASELINE_KPI.lightingPowerKw!, TARGET_KPI.lightingPowerKw!, 1.5),
          energyCostHourlyUSD: Number(interpolateKpi(prev.energyCostHourlyUSD ?? BASELINE_KPI.energyCostHourlyUSD!, TARGET_KPI.energyCostHourlyUSD!, 1.5).toFixed(1)),
          monthlySavingsUSD: interpolateKpi(prev.monthlySavingsUSD ?? BASELINE_KPI.monthlySavingsUSD!, TARGET_KPI.monthlySavingsUSD!, 40),
        };
      } else {
        const jitter = (Math.random() - 0.5) * 5;
        return { ...prev, buildingLoadKw: Math.round(BASELINE_KPI.buildingLoadKw! + jitter), gridImportKw: Math.round(BASELINE_KPI.gridImportKw! + jitter) };
      }
    });

    if (tick === 38) {
      setActivePipelineStep("looping");
      setActiveArchModule("dashboard");
      log("Digital Twin", "Dashboard UI", "Twin updated. Awaiting next cycle...", "Delivered");
    }

    // Forecast updates
    if (tick % 5 === 0) {
      setForecast(prev => {
        const baseline = 1380 + Math.sin(tick / 5) * 50;
        const optimized = tick >= 32 ? baseline - 80 : baseline;
        return [...prev, { time: formatSimTime(elapsedSeconds), predicted: Math.round(baseline), optimized: Math.round(optimized) }].slice(-20);
      });
    }

  }, [tick, elapsedSeconds, viewState]);

  if (viewState === 'SCENARIO_SELECTION') return <SimulationInputPage onStartSimulation={handleStartSimulation} />;
  if (viewState === 'BOOT_SEQUENCE') return <BootSequenceScreen scenarioName={scenario?.name} onComplete={handleBootComplete} />;
  
  if (viewState === 'SIMULATION_SUMMARY') {
    return (
      <SimulationSummaryScreen 
        data={{
          scenarioName: scenario?.name || "Optimization Scenario",
          initialEnergyKwh: 4500, optimizedEnergyKwh: 3800, energySavedPct: 15.5,
          costSavedUSD: 42.5, co2AvoidedTons: 1.2, executedRecommendationsCount: 4,
          recommendationsSummary: ["Pre-cooled Zone B", "Increased Chiller 2 delta-T", "Dispatched 120kW from battery"]
        }}
        onReturnToScenarios={() => setViewState('SCENARIO_SELECTION')}
        onReRunScenario={() => {
          setTick(0); setElapsedSeconds(0); setKpis(BASELINE_KPI); setAgents(INITIAL_AGENTS);
          setConsensus({ progress: 0, iteration: 1, votes: [], pendingRecommendationsCount: 0 });
          setTimeline([{ id: "init", timestamp: "08:00 AM", event: "Simulation Restarted", source: "System", destination: "Engine", status: "Delivered" }]);
          setForecast([{ time: "08:00 AM", predicted: 1380, optimized: 1380 }]);
          setViewState('LIVE_SIMULATION'); setIsPlaying(true);
        }}
      />
    );
  }

  // Derive orchestrator phase name for the widget
  const getPhaseName = () => {
    if (tick < 3) return "Telemetry Aggregation";
    if (tick < 6) return "Digital Twin Broadcast";
    if (tick < 23) return "Agent Analysis & Forecasting";
    if (tick < 32) return "Consensus Negotiation";
    if (tick < 38) return "Optimization Dispatch";
    return "Feedback Loop";
  };

  const activeAgentsCount = agents.filter(a => a.status !== "Monitoring" && a.status !== "Waiting Consensus").length || (tick >= 23 ? 5 : 0);

  return (
    <LiveDashboard
      scenarioName={scenario?.name || "Morning Office Rush"}
      status={isPlaying ? "RUNNING" : "PAUSED"}
      simulationTime={formatSimTime(elapsedSeconds)}
      kpiData={kpis}
      agents={agents}
      consensusData={consensus}
      forecastData={forecast}
      timelineEvents={timeline}
      explainabilityData={explainabilityData}
      activePipelineStep={activePipelineStep}
      activeArchModule={activeArchModule}
      orchestratorData={{
        phase: getPhaseName(),
        runningAgents: activeAgentsCount,
        messagesExchanged: msgExchanged,
        recommendations: 5,
        consensusIteration: consensus.iteration || 1,
        optimizationCycle: optCycles,
      }}
      broadcasting={broadcasting}
      communicating={communicating}
      speed={speed}
      elapsedSeconds={elapsedSeconds}
      onPlay={() => setIsPlaying(true)}
      onPause={() => setIsPlaying(false)}
      onReset={() => {
        setTick(0); setElapsedSeconds(0); setKpis(BASELINE_KPI); setAgents(INITIAL_AGENTS);
        setConsensus({ progress: 0, iteration: 1, votes: [], pendingRecommendationsCount: 0 });
        setTimeline([{ id: "init", timestamp: "08:00 AM", event: "System reset.", source: "System", destination: "Engine", status: "Delivered" }]);
        setForecast([{ time: "08:00 AM", predicted: 1380, optimized: 1380 }]);
        setIsPlaying(true);
      }}
      onSpeedChange={(s) => setSpeed(s)}
    />
  );
}
