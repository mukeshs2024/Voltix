import React from 'react';
import { BaseAgentResponse } from "@/types/agent-workbench";
import { AlertCircle } from 'lucide-react';

export default function ScenarioPanel({ data }: { data: BaseAgentResponse }) {
    const isCritical = data.scenario_id !== "normal-operations";
    
    return (
        <div className={`border rounded-xl p-5 flex items-start gap-4 ${
            isCritical ? 'bg-amber-950/20 border-amber-900/50' : 'bg-slate-900/50 border-slate-800'
        }`}>
            <AlertCircle className={`w-5 h-5 mt-0.5 ${isCritical ? 'text-amber-500' : 'text-slate-500'}`} />
            <div>
                <h3 className="text-sm font-medium text-white mb-1">Active Scenario Context</h3>
                <p className={`text-sm ${isCritical ? 'text-amber-200/80' : 'text-slate-400'}`}>
                    Building is currently in <strong>{data.scenario_name}</strong> mode. 
                    This agent is optimizing local decisions based on the active building-wide scenario parameters.
                </p>
            </div>
        </div>
    );
}
