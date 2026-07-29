"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft, Zap, ShieldAlert, Thermometer, Settings, Users, ArrowRight } from "lucide-react";
import { PageContainer, SectionContainer } from "@/components/shared/page-container";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { SIMULATION_SCENARIOS, getSimulationStorageKey, runAgentSimulation, type AgentSimulationInputPayload } from "@/lib/agent-workbench";
import { cn } from "@/lib/utils";

export default function DigitalTwinPage() {
  const router = useRouter();
  const [selectedScenarioId, setSelectedScenarioId] = useState(SIMULATION_SCENARIOS[0]?.id || "");
  const [isSimulating, setIsSimulating] = useState(false);

  const scenario = SIMULATION_SCENARIOS.find(s => s.id === selectedScenarioId) || SIMULATION_SCENARIOS[0];

  const handleRunDigitalTwin = async (agentId: any) => {
    setIsSimulating(true);
    try {
        const telemetry: Record<string, number | string> = {};
        Object.keys(scenario.defaults).forEach(key => {
            telemetry[key] = scenario.defaults[key];
        });
        
        const payload: AgentSimulationInputPayload = {
            scenario_id: scenario.id,
            scenario_name: scenario.name,
            building_id: "BLD-TWIN-1",
            agent_id: agentId,
            building_data: telemetry,
            telemetry: telemetry,
            overrides: { source: "digital-twin" },
        };
        const result = await runAgentSimulation(payload);
        sessionStorage.setItem(getSimulationStorageKey(agentId), JSON.stringify(result));
        router.push(`/agent/${agentId}`);
    } catch (e) {
        console.error(e);
        alert("Failed to run agent simulation");
    } finally {
        setIsSimulating(false);
    }
  };

  return (
    <PageContainer>
      <SectionContainer>
        <div className="flex items-center gap-3 text-sm text-[#6B7280]">
          <Link href="/ai-center" className="flex items-center gap-1.5 hover:text-[#111827]">
            <ArrowLeft className="h-4 w-4" /> AI Control Center
          </Link>
          <ArrowRight className="h-3.5 w-3.5" />
          <span className="font-semibold text-[#111827]">Digital Twin Scenarios</span>
        </div>

        <div className="mt-6">
            <h1 className="text-4xl font-bold tracking-tight text-[#111827]">Digital Twin Control</h1>
            <p className="mt-2 max-w-2xl text-base text-[#6B7280]">
                Select a global building scenario. Watch how the environment changes and how individual agents react to the new reality.
            </p>
        </div>
      </SectionContainer>
      
      <SectionContainer>
        <div className="grid gap-6 lg:grid-cols-[1fr_250px]">
           <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {SIMULATION_SCENARIOS.map(s => (
                  <button 
                     key={s.id}
                     onClick={() => setSelectedScenarioId(s.id)}
                     className={cn("p-5 border rounded-2xl text-left transition-all", selectedScenarioId === s.id ? "bg-black text-white border-black" : "bg-white border-gray-200 hover:border-gray-400")}
                  >
                     <h3 className="text-lg font-bold">{s.name}</h3>
                     <p className={cn("text-xs mt-1", selectedScenarioId === s.id ? "text-gray-300" : "text-gray-500")}>{s.description}</p>
                     <div className="mt-4 pt-3 border-t border-gray-200/20 text-xs font-semibold uppercase tracking-wider">
                        {s.badge}
                     </div>
                  </button>
              ))}
           </div>
           
           <div className="space-y-4">
              <Card className="bg-gray-50 border-gray-200">
                  <CardHeader className="pb-3">
                     <CardTitle className="text-sm uppercase tracking-wider text-gray-500">Live Building State</CardTitle>
                  </CardHeader>
                  <CardContent>
                     <div className="space-y-3">
                        {Object.entries(scenario?.defaults || {}).map(([key, val]) => (
                            <div key={key} className="flex justify-between items-center text-sm">
                               <span className="text-gray-600 capitalize">{key.replace("_", " ")}</span>
                               <span className="font-bold text-gray-900">{val as React.ReactNode}</span>
                            </div>
                        ))}
                     </div>
                  </CardContent>
              </Card>
           </div>
        </div>
      </SectionContainer>
      
      <SectionContainer>
        <h2 className="text-2xl font-bold mb-6">Observe Agent Reactions</h2>
        <div className="grid md:grid-cols-3 gap-6">
           <Card className="hover:border-black transition-colors cursor-pointer" onClick={() => handleRunDigitalTwin("equipment")}>
              <CardContent className="p-6">
                  <div className="flex items-center gap-4 mb-4">
                     <div className="p-3 bg-[#F0FDFA] text-[#0F766E] rounded-xl"><Settings className="w-6 h-6" /></div>
                     <h3 className="text-xl font-bold">Equipment</h3>
                  </div>
                  <p className="text-sm text-gray-500 mb-4">See how the equipment agent diagnoses wear and schedules maintenance.</p>
                  <div className="text-sm font-semibold flex items-center gap-1 text-[#0F766E]">Run Agent <ArrowRight className="w-4 h-4"/></div>
              </CardContent>
           </Card>
           
           <Card className="hover:border-black transition-colors cursor-pointer" onClick={() => handleRunDigitalTwin("safety")}>
              <CardContent className="p-6">
                  <div className="flex items-center gap-4 mb-4">
                     <div className="p-3 bg-[#FEF2F2] text-[#B91C1C] rounded-xl"><ShieldAlert className="w-6 h-6" /></div>
                     <h3 className="text-xl font-bold">Safety</h3>
                  </div>
                  <p className="text-sm text-gray-500 mb-4">Observe hazard detection and evacuation protocols for this scenario.</p>
                  <div className="text-sm font-semibold flex items-center gap-1 text-[#B91C1C]">Run Agent <ArrowRight className="w-4 h-4"/></div>
              </CardContent>
           </Card>
           
           <Card className="hover:border-black transition-colors cursor-pointer" onClick={() => handleRunDigitalTwin("grid")}>
              <CardContent className="p-6">
                  <div className="flex items-center gap-4 mb-4">
                     <div className="p-3 bg-[#EFF6FF] text-[#1D4ED8] rounded-xl"><Zap className="w-6 h-6" /></div>
                     <h3 className="text-xl font-bold">Grid</h3>
                  </div>
                  <p className="text-sm text-gray-500 mb-4">Watch the grid agent dispatch batteries and shift loads for efficiency.</p>
                  <div className="text-sm font-semibold flex items-center gap-1 text-[#1D4ED8]">Run Agent <ArrowRight className="w-4 h-4"/></div>
              </CardContent>
           </Card>
        </div>
      </SectionContainer>
    </PageContainer>
  );
}
