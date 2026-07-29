"use client";

import React, { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft, Building2, ChevronRight, Filter, FlaskConical, RefreshCw, Search, Sparkles } from "lucide-react";

import {
  SimulationScenario,
  fetchScenariosMetadata,
  resolveBackendUrl,
} from "@/lib/agent-workbench";
import { ScenarioCard } from "@/components/scenarios/scenario-card";
import { ScenarioSkeletonGrid } from "@/components/scenarios/scenario-skeleton";
import { PageContainer, SectionContainer } from "@/components/shared/page-container";

interface SimulationInputPageProps {
  onStartSimulation?: (scenario: SimulationScenario, speed: number) => void;
}

export default function SimulationInputPage({ onStartSimulation }: SimulationInputPageProps = {}) {
  const router = useRouter();
  const [scenarios, setScenarios] = useState<SimulationScenario[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedBuildingType, setSelectedBuildingType] = useState<string>("all");
  const [startingScenarioId, setStartingScenarioId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;
    async function loadScenarios() {
      setIsLoading(true);
      setError(null);
      const data = await fetchScenariosMetadata();
      if (isMounted) {
        setScenarios(data);
        setIsLoading(false);
      }
    }
    loadScenarios();
    return () => {
      isMounted = false;
    };
  }, []);

  // Extract unique building types dynamically from metadata
  const buildingTypes = useMemo(() => {
    const types = new Set<string>();
    scenarios.forEach((s) => {
      if (s.buildingType) types.add(s.buildingType);
    });
    return Array.from(types);
  }, [scenarios]);

  // Filtered scenarios based on search and building type
  const filteredScenarios = useMemo(() => {
    return scenarios.filter((s) => {
      const matchesSearch =
        s.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        s.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        s.badge.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesType =
        selectedBuildingType === "all" || s.buildingType === selectedBuildingType;

      return matchesSearch && matchesType;
    });
  }, [scenarios, searchTerm, selectedBuildingType]);

  const handleStartSimulation = async (scenario: SimulationScenario, speed: number) => {
    setStartingScenarioId(scenario.id);
    setError(null);

    if (onStartSimulation) {
      onStartSimulation(scenario, speed);
      return;
    }

    // Fallback if not injected
    try {
      const res = await fetch(`${resolveBackendUrl()}/api/v1/simulation/session`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          scenario_id: scenario.id,
          scenario_name: scenario.name,
          building_id: "BLD-001",
        }),
      });

      if (!res.ok) {
        throw new Error("Failed to initialize Digital Twin scenario session");
      }

      router.push("/ai-center");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to run simulation.");
      setStartingScenarioId(null);
    }
  };

  return (
    <PageContainer>
      {/* Navigation Breadcrumb */}
      <SectionContainer>
        <div className="flex items-center gap-2 text-[13px] text-gray-500 mb-1">
          <Link href="/ai-center" className="hover:text-gray-900 transition-colors flex items-center gap-1">
            <ArrowLeft className="w-3.5 h-3.5" /> AI Control Center
          </Link>
          <ChevronRight className="w-3.5 h-3.5 text-gray-300" />
          <span className="font-semibold text-gray-900">Scenario Center</span>
        </div>

        {/* Enterprise Title Header */}
        <div className="bg-white rounded-xl border border-[#E5E7EB] p-6 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-blue-50 text-blue-700 border border-blue-100">
              <FlaskConical className="w-3.5 h-3.5" /> Digital Twin Studio
            </div>
            <h1 className="text-[24px] font-bold tracking-tight text-gray-900">Scenario Center</h1>
            <p className="text-[14px] text-gray-500 max-w-2xl leading-normal">
              Execute full-building operational scenarios to evaluate real-time telemetry and trigger simultaneous multi-agent AI responses.
            </p>
          </div>
        </div>
      </SectionContainer>

      {/* Filter & Search Toolbar */}
      <SectionContainer>
        <div className="bg-white rounded-xl border border-[#E5E7EB] p-4 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-4">
          {/* Search Toolbar */}
          <div className="relative w-full sm:w-[360px]">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search scenarios by name or description..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full h-[40px] bg-white border border-gray-200 rounded-lg pl-9 pr-4 text-[14px] text-gray-900 placeholder-gray-400 focus:outline-none focus:border-gray-400 focus:ring-1 focus:ring-gray-400 transition-all shadow-xs"
            />
          </div>

          {/* Building Type Filter */}
          <div className="flex items-center gap-3 w-full sm:w-auto overflow-x-auto pb-1 sm:pb-0">
            <div className="flex items-center gap-1.5 text-[13px] text-gray-500 font-medium whitespace-nowrap">
              <Filter className="w-3.5 h-3.5" />
              <span>Building Type:</span>
            </div>
            <select
              value={selectedBuildingType}
              onChange={(e) => setSelectedBuildingType(e.target.value)}
              className="h-[40px] bg-white border border-gray-200 rounded-lg px-3 text-[13px] font-medium text-gray-800 focus:outline-none focus:border-gray-400 focus:ring-1 focus:ring-gray-400 cursor-pointer shadow-xs"
            >
              <option value="all">All Building Types ({scenarios.length})</option>
              {buildingTypes.map((type) => (
                <option key={type} value={type}>
                  {type}
                </option>
              ))}
            </select>

            {(searchTerm || selectedBuildingType !== "all") && (
              <button
                onClick={() => {
                  setSearchTerm("");
                  setSelectedBuildingType("all");
                }}
                className="h-[40px] px-3 text-[13px] text-gray-600 hover:text-gray-900 font-medium hover:bg-gray-100 rounded-lg transition-colors whitespace-nowrap flex items-center gap-1"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                Reset
              </button>
            )}
          </div>
        </div>
      </SectionContainer>

      {/* Error Alert if simulation initialization fails */}
      {error && (
        <SectionContainer>
          <div className="p-4 rounded-xl border border-red-200 bg-red-50 text-[14px] text-red-700 flex items-center justify-between">
            <span>{error}</span>
            <button onClick={() => setError(null)} className="text-red-500 font-bold hover:text-red-800">
              Dismiss
            </button>
          </div>
        </SectionContainer>
      )}

      {/* Scenario Cards Grid / Loading / Empty State */}
      <SectionContainer>
        {isLoading ? (
          <ScenarioSkeletonGrid count={6} />
        ) : filteredScenarios.length === 0 ? (
          /* Empty State */
          <div className="bg-white rounded-xl border border-gray-200 border-dashed p-12 text-center flex flex-col items-center justify-center">
            <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center text-gray-400 mb-3">
              <FlaskConical className="w-6 h-6" />
            </div>
            <h3 className="text-[16px] font-semibold text-gray-900 mb-1">No scenarios found</h3>
            <p className="text-[14px] text-gray-500 max-w-sm mb-4">
              We couldn't find any operational scenarios matching your search or building filter.
            </p>
            <button
              onClick={() => {
                setSearchTerm("");
                setSelectedBuildingType("all");
              }}
              className="h-[36px] px-4 bg-gray-900 text-white rounded-lg text-[13px] font-medium hover:bg-gray-800 transition-colors"
            >
              Clear Filters
            </button>
          </div>
        ) : (
          /* Cards Grid */
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5 items-stretch">
            {filteredScenarios.map((scenario) => (
              <ScenarioCard
                key={scenario.id}
                scenario={scenario}
                onStart={handleStartSimulation}
                isStarting={startingScenarioId === scenario.id}
              />
            ))}
          </div>
        )}
      </SectionContainer>
    </PageContainer>
  );
}
