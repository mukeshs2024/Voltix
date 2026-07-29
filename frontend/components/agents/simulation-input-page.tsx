"use client";

import React, { useMemo, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { ArrowRight, Brain, CheckCircle2, ChevronRight } from "lucide-react";

import {
  AGENT_PROFILES,
  SIMULATION_SCENARIOS,
  getScenarioById,
  getSimulationStorageKey,
  runAgentSimulation,
  toNumericValue,
  type AgentId,
  type AgentSimulationInputPayload,
} from "@/lib/agent-workbench";
import { PageContainer, SectionContainer } from "@/components/shared/page-container";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

function isAgentId(value: string | null): value is AgentId {
  return value ? Object.keys(AGENT_PROFILES).includes(value) : false;
}

export default function SimulationInputPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const initialAgent = isAgentId(searchParams.get("agent")) ? searchParams.get("agent") as AgentId : "equipment";
  const [selectedAgent, setSelectedAgent] = useState<AgentId>(initialAgent);
  const [selectedScenarioId, setSelectedScenarioId] = useState(SIMULATION_SCENARIOS[0].id);
  const [values, setValues] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const selectedScenario = useMemo(() => getScenarioById(selectedScenarioId), [selectedScenarioId]);
  const agentProfile = AGENT_PROFILES[selectedAgent];

  // Initialize values when agent changes
  React.useEffect(() => {
     const newVals: Record<string, string> = {};
     agentProfile.simulationFields.forEach(field => {
        newVals[field.key] = selectedScenario.defaults[field.key]?.toString() || "0";
     });
     setValues(newVals);
  }, [selectedAgent, selectedScenario, agentProfile.simulationFields]);

  const handleSelectScenario = (scenarioId: string) => {
    setSelectedScenarioId(scenarioId);
  };

  const handleChange = (field: string, value: string) => {
    setValues((current) => ({ ...current, [field]: value }));
  };

  const handleRun = async () => {
    setLoading(true);
    setError(null);

    try {
      const telemetry: Record<string, number | string> = {};
      Object.keys(values).forEach(key => {
         telemetry[key] = toNumericValue(values[key]);
      });

      const payload: AgentSimulationInputPayload = {
        scenario_id: selectedScenario.id,
        scenario_name: selectedScenario.name,
        building_id: "BLD-001",
        agent_id: selectedAgent,
        building_data: telemetry,
        telemetry: telemetry,
        overrides: {
          selected_agent: selectedAgent,
          source: "simulation-input",
        },
      };

      const result = await runAgentSimulation(payload);
      sessionStorage.setItem(getSimulationStorageKey(selectedAgent), JSON.stringify(result));
      router.push(`/agent/${selectedAgent}`);
    } catch (runError) {
      setError(runError instanceof Error ? runError.message : "Failed to run agent simulation.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <PageContainer>
      <SectionContainer>
        <div className="flex items-center gap-3 text-sm text-[#6B7280]">
          <Link href="/ai-center" className="flex items-center gap-1.5 hover:text-[#111827]">
            <ArrowRight className="h-4 w-4 rotate-180" /> AI Control Center
          </Link>
          <ChevronRight className="h-3.5 w-3.5" />
          <span className="font-semibold text-[#111827]">Simulation Input</span>
        </div>

        <Card className="border-[#E5E7EB] p-6 mt-6">
          <div className="grid gap-6 lg:grid-cols-[1.25fr_0.75fr] lg:items-start">
            <div className="space-y-4">
              <div className="inline-flex items-center gap-2 rounded-full border border-[#E5E7EB] px-3 py-1 text-[10px] font-bold uppercase tracking-[0.2em] text-[#6B7280]">
                <Brain className="h-3.5 w-3.5" /> Agent specific simulation
              </div>
              <div>
                <h1 className="text-3xl font-bold tracking-tight text-[#111827]">Simulation Input</h1>
                <p className="mt-2 max-w-2xl text-sm text-[#6B7280]">
                  Configure domain-specific parameters for the selected agent.
                </p>
              </div>
            </div>
          </div>
        </Card>
      </SectionContainer>

      <SectionContainer>
        <div className="grid gap-6 xl:grid-cols-[0.9fr_1.1fr]">
          <Card className="p-5">
            <CardHeader className="pb-3">
              <CardTitle>Agent selection</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3 h-[400px] overflow-y-auto pr-2">
                {Object.values(AGENT_PROFILES).map((profile) => {
                  const active = selectedAgent === profile.id;
                  return (
                    <button
                      key={profile.id}
                      type="button"
                      onClick={() => setSelectedAgent(profile.id)}
                      className={cn(
                        "flex w-full items-start gap-3 rounded-2xl border p-4 text-left transition-all",
                        active ? "border-[#111827] bg-[#FAFAFA]" : "border-[#E5E7EB] bg-white hover:bg-[#FAFAFA]"
                      )}
                    >
                      <div className="flex h-10 w-10 items-center justify-center rounded-2xl" style={{ backgroundColor: profile.surface, color: profile.accent }}>
                        <Brain className="h-5 w-5" />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between gap-3">
                          <div className="text-sm font-semibold text-[#111827]">{profile.title}</div>
                          {active && <CheckCircle2 className="h-4 w-4 text-[#111827]" />}
                        </div>
                        <div className="text-xs text-[#6B7280]">{profile.summary}</div>
                      </div>
                    </button>
                  );
                })}
              </div>
            </CardContent>
          </Card>

          <Card className="p-5">
            <CardHeader className="pb-3">
              <CardTitle>Agent Parameters</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-2">
                {agentProfile.simulationFields.map((field) => (
                  <label key={field.key} className="space-y-2">
                    <div className="flex items-center justify-between text-[10px] font-bold uppercase tracking-wider text-[#6B7280]">
                      <span>{field.label}</span>
                      {field.unit && <span>{field.unit}</span>}
                    </div>
                    <Input
                      type={field.type}
                      value={values[field.key] || ""}
                      onChange={(event) => handleChange(field.key, event.target.value)}
                      className="h-11 rounded-xl border-[#E5E7EB] bg-white"
                    />
                  </label>
                ))}
              </div>

              {error && (
                <div className="mt-4 rounded-2xl border border-[#FCA5A5] bg-[#FEF2F2] p-4 text-sm text-[#B91C1C]">
                  {error}
                </div>
              )}

              <div className="mt-5 flex flex-wrap items-center gap-3">
                <Button onClick={handleRun} disabled={loading} className="gap-2">
                  {loading ? "Running agent..." : "Run Agent"}
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </SectionContainer>
    </PageContainer>
  );
}
