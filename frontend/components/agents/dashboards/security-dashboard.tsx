import React from "react";
import { AgentSimulationResponse, getAgentProfile } from "@/lib/agent-workbench";

export default function SecurityDashboard({ runResult }: { runResult: AgentSimulationResponse }) {
  const profile = getAgentProfile("security");
  return (
    <div className="space-y-6">
      <div className="grid gap-6 lg:grid-cols-2">
        <div className="p-5 border rounded-xl bg-white shadow-sm">
          <h2 className="text-xl font-bold mb-4">{profile.chartLabel}</h2>
          <p className="text-sm text-gray-500">{profile.chartHint}</p>
          <div className="h-64 flex items-center justify-center bg-gray-50 mt-4 rounded-lg">
             [Domain Specific Chart for Security]
          </div>
        </div>
        <div className="p-5 border rounded-xl bg-white shadow-sm">
          <h2 className="text-xl font-bold mb-4">Workflow Actions</h2>
          <div className="space-y-3">
             {runResult.workflow?.map((step: any, idx: number) => (
                <div key={idx} className="p-3 bg-gray-50 border rounded-lg flex justify-between items-center">
                   <div>
                      <div className="font-semibold text-sm">{step.label}</div>
                      <div className="text-xs text-gray-500">{step.detail}</div>
                   </div>
                   <div className="text-xs font-bold uppercase tracking-wider text-gray-400">{step.state}</div>
                </div>
             ))}
          </div>
        </div>
      </div>
      
      <div className="p-5 border rounded-xl bg-white shadow-sm">
          <h2 className="text-xl font-bold mb-4">Agent Specific Data DTO Payload</h2>
          <pre className="bg-gray-900 text-gray-100 p-4 rounded-lg text-xs overflow-auto">
            {JSON.stringify(runResult, null, 2)}
          </pre>
      </div>
    </div>
  );
}
