"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft, Zap, ShieldAlert, Thermostat, Settings, Users, ArrowRight, Play, Loader2 } from "lucide-react";
import { PageContainer, SectionContainer } from "@/components/shared/page-container";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { SIMULATION_SCENARIOS, getSimulationStorageKey, runDigitalTwin } from "@/lib/agent-workbench";
import { cn } from "@/lib/utils";

export default function DigitalTwinPage() {
  const router = useRouter();
  const [selectedScenarioId, setSelectedScenarioId] = useState(SIMULATION_SCENARIOS[0]?.id || "");
  const [isSimulating, setIsSimulating] = useState(false);

  const scenario = SIMULATION_SCENARIOS.find(s => s.id === selectedScenarioId) || SIMULATION_SCENARIOS[0];

  const handleRunDigitalTwin = async () => {
    setIsSimulating(true);
    try {
        const telemetry: Record<string, number | string> = {};
        Object.keys(scenario.defaults).forEach(key => {
            telemetry[key] = scenario.defaults[key];
        });
        
        const payload = {
            scenario_id: scenario.id,
            scenario_name: scenario.name,
            building_id: "BLD-TWIN-1",
            telemetry: telemetry,
        };
        const result = await runDigitalTwin(payload);
        sessionStorage.setItem(getSimulationStorageKey(), result.session_id);
        router.push(`/ai-center`);
    } catch (e) {
        console.error(e);
        alert("Failed to run digital twin simulation");
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

        <div className="mt-6 flex flex-col md:flex-row md:items-start justify-between gap-6">
            <div>
                <h1 className="text-4xl font-bold tracking-tight text-[#111827]">Digital Twin Control</h1>
                <p className="mt-2 max-w-2xl text-base text-[#6B7280]">
                    Select a global building scenario. Watch how the environment changes and how all agents react in parallel to the new reality.
                </p>
            </div>
            
            <Button 
                onClick={handleRunDigitalTwin} 
                disabled={isSimulating}
                size="lg"
                className="bg-[#111827] text-white hover:bg-black w-full md:w-auto flex items-center gap-2 font-bold shadow-xl rounded-xl px-8 h-14"
            >
                {isSimulating ? <Loader2 className="w-5 h-5 animate-spin" /> : <Play className="w-5 h-5" fill="currentColor" />}
                {isSimulating ? "Simulating Ecosystem..." : "Run Digital Twin"}
            </Button>
        </div>
      </SectionContainer>
      
      <SectionContainer>
        <div className="grid gap-6 lg:grid-cols-[1fr_250px]">
           <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4">
              {SIMULATION_SCENARIOS.map(s => (
                  <button 
                     key={s.id}
                     onClick={() => setSelectedScenarioId(s.id)}
                     className={cn("p-4 border rounded-2xl text-left transition-all", selectedScenarioId === s.id ? "bg-black text-white border-black shadow-lg" : "bg-white border-gray-200 hover:border-gray-400 hover:shadow-md")}
                  >
                     <h3 className="text-sm font-bold leading-tight">{s.name}</h3>
                     <p className={cn("text-xs mt-2 line-clamp-2", selectedScenarioId === s.id ? "text-gray-300" : "text-gray-500")}>{s.description}</p>
                     <div className="mt-3 pt-3 border-t border-gray-200/20 text-[10px] font-semibold uppercase tracking-wider flex items-center justify-between">
                        <span>{s.badge}</span>
                        {selectedScenarioId === s.id && <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />}
                     </div>
                  </button>
              ))}
           </div>
           
           <div className="space-y-4">
              <Card className="bg-gray-50 border-gray-200 shadow-none">
                  <CardHeader className="pb-3">
                     <CardTitle className="text-[10px] uppercase font-bold tracking-wider text-gray-500">Live Building State</CardTitle>
                  </CardHeader>
                  <CardContent>
                     <div className="space-y-3">
                        {Object.entries(scenario?.defaults || {}).map(([key, val]) => (
                            <div key={key} className="flex justify-between items-center text-xs">
                                <span className="text-gray-600 capitalize">{key.replace(/_/g, " ")}</span>
                                <span className="font-bold text-gray-900">{val as React.ReactNode}</span>
                            </div>
                        ))}
                     </div>
                  </CardContent>
              </Card>
           </div>
        </div>
      </SectionContainer>
    </PageContainer>
  );
}
