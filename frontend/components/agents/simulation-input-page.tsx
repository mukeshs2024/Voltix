"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowRight, Brain, CheckCircle2, ChevronRight, Play } from "lucide-react";

import { SIMULATION_SCENARIOS } from "@/lib/agent-workbench";
import { PageContainer, SectionContainer } from "@/components/shared/page-container";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";

export default function SimulationInputPage() {
  const router = useRouter();
  const [selectedScenarioId, setSelectedScenarioId] = useState(SIMULATION_SCENARIOS[0].id);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleRun = async () => {
    setLoading(true);
    setError(null);

    const scenario = SIMULATION_SCENARIOS.find(s => s.id === selectedScenarioId);

    try {
      const res = await fetch("http://localhost:8000/api/v1/simulation/session", {
          method: "POST",
          headers: {
              'Content-Type': 'application/json',
              'Authorization': 'Bearer temp'
          },
          body: JSON.stringify({
              scenario_id: scenario?.id,
              scenario_name: scenario?.name,
              building_id: "BLD-001"
          })
      });
      
      if (!res.ok) {
          throw new Error("Failed to execute Digital Twin scenario");
      }

      router.push(`/ai-center`);
    } catch (runError) {
      setError(runError instanceof Error ? runError.message : "Failed to run simulation.");
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
          <span className="font-semibold text-[#111827]">Digital Twin Scenario Center</span>
        </div>

        <Card className="border-[#E5E7EB] p-6 mt-6">
          <div className="grid gap-6 lg:grid-cols-[1.25fr_0.75fr] lg:items-start">
            <div className="space-y-4">
              <div className="inline-flex items-center gap-2 rounded-full border border-[#E5E7EB] px-3 py-1 text-[10px] font-bold uppercase tracking-[0.2em] text-[#6B7280]">
                <Brain className="h-3.5 w-3.5" /> Full Building Simulation
              </div>
              <div>
                <h1 className="text-3xl font-bold tracking-tight text-[#111827]">Scenario Center</h1>
                <p className="mt-2 max-w-2xl text-sm text-[#6B7280]">
                  Execute a Digital Twin scenario to automatically generate randomized telemetry and run all 10 AI Agents simultaneously.
                </p>
              </div>
            </div>
          </div>
        </Card>
      </SectionContainer>

      <SectionContainer>
        <div className="grid gap-6 xl:grid-cols-2">
          <Card className="p-5">
            <CardHeader className="pb-3">
              <CardTitle>Global Scenarios</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3 h-[400px] overflow-y-auto pr-2">
                {SIMULATION_SCENARIOS.map((scenario) => {
                  const active = selectedScenarioId === scenario.id;
                  return (
                    <button
                      key={scenario.id}
                      type="button"
                      onClick={() => setSelectedScenarioId(scenario.id)}
                      className={cn(
                        "flex w-full items-start gap-3 rounded-2xl border p-4 text-left transition-all",
                        active ? "border-[#111827] bg-[#FAFAFA]" : "border-[#E5E7EB] bg-white hover:bg-[#FAFAFA]"
                      )}
                    >
                      <div className="flex-1">
                        <div className="flex items-center justify-between gap-3">
                          <div className="text-sm font-semibold text-[#111827]">{scenario.name}</div>
                          {active && <CheckCircle2 className="h-4 w-4 text-[#111827]" />}
                        </div>
                        <div className="text-xs text-[#6B7280]">{scenario.description}</div>
                      </div>
                    </button>
                  );
                })}
              </div>
            </CardContent>
          </Card>

          <Card className="p-5 flex flex-col justify-center items-center text-center">
             <div className="w-16 h-16 rounded-full bg-blue-50 flex items-center justify-center mb-6">
                <Play className="w-8 h-8 text-blue-600 ml-1" />
             </div>
             <h3 className="text-xl font-bold text-[#111827] mb-2">Execute Global Scenario</h3>
             <p className="text-sm text-[#6B7280] mb-8 max-w-sm">
                This will trigger all AI agents to analyze the building state for the selected scenario simultaneously.
             </p>
             
              {error && (
                <div className="mb-4 rounded-2xl border border-[#FCA5A5] bg-[#FEF2F2] p-4 text-sm text-[#B91C1C]">
                  {error}
                </div>
              )}

             <Button onClick={handleRun} disabled={loading} size="lg" className="w-full max-w-sm bg-blue-600 hover:bg-blue-500 shadow-lg shadow-blue-500/20 text-white">
                {loading ? "Running 10 Agents..." : "Run Digital Twin Scenario"}
             </Button>
          </Card>
        </div>
      </SectionContainer>
    </PageContainer>
  );
}
