"use client";

import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { AgentSimulationResponseUnion } from "@/types/agent-workbench";
import EquipmentDashboard from "./dashboards/equipment-dashboard";
import SafetyDashboard from "./dashboards/safety-dashboard";
import GridDashboard from "./dashboards/grid-dashboard";
import AgentHeader from "./components/agent-header";
import ScenarioPanel from "./components/scenario-panel";
import LiveWorkflow from "./components/live-workflow";
import AiDecisionBlock from "./components/ai-decision-block";
import RecommendationsBlock from "./components/recommendations-block";
import ExecutionTimeline from "./components/execution-timeline";
import DeveloperModeBlock from "./components/developer-mode-block";
import { ArrowLeft, Activity } from "lucide-react";

export default function AgentWorkbenchPage() {
    const params = useParams();
    const router = useRouter();
    const agentId = params.id as string;
    
    const searchParams = new URLSearchParams(typeof window !== "undefined" ? window.location.search : "");
    const sessionId = searchParams.get("session") || "latest";
    
    const [data, setData] = useState<AgentSimulationResponseUnion | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const load = async () => {
            try {
                // If it's latest, we fetch latest session id first, or we can use the backend /latest endpoint.
                // Actually the backend endpoint is /session/{session_id}/{agent_id}
                const res = await fetch(`http://localhost:8000/api/v1/simulation/session/${sessionId}/${agentId}`, {
                    headers: {
                        'Authorization': `Bearer temp`
                    }
                });
                
                if (res.ok) {
                    const result = await res.json();
                    setData(result);
                } else {
                    console.error("Failed to load agent session data");
                }
            } catch (e) {
                console.error("Error fetching agent data", e);
            } finally {
                setLoading(false);
            }
        };
        load();
    }, [agentId, sessionId]);

    if (loading) {
        return <div className="p-8 text-slate-400">Loading Agent Command Center...</div>;
    }

    if (!data) {
        return (
            <div className="flex-1 p-8 bg-[#0a0f18] flex flex-col items-center justify-center text-slate-400 gap-6">
                <div className="w-16 h-16 rounded-full bg-slate-800/50 flex items-center justify-center border border-slate-700/50">
                    <Activity className="w-8 h-8 text-slate-500" />
                </div>
                <div className="text-center max-w-md">
                    <h2 className="text-xl font-semibold text-white mb-2">No Session Data</h2>
                    <p className="text-sm">There is no active session data found for the {agentId} agent. Please run a Digital Twin scenario first.</p>
                </div>
                <div className="flex items-center gap-4 mt-4">
                    <button 
                        onClick={() => router.push("/ai-center")}
                        className="px-4 py-2 bg-slate-800 rounded hover:bg-slate-700 transition-colors text-sm"
                    >
                        Back to AI Center
                    </button>
                    <button 
                        onClick={() => router.push("/simulation-input")}
                        className="px-6 py-2 bg-blue-600 text-white font-semibold rounded hover:bg-blue-500 transition-colors shadow-lg shadow-blue-500/20 text-sm"
                    >
                        Go to Scenario Center
                    </button>
                </div>
            </div>
        );
    }

    // Agent Specific Content Blocks
    const renderAgentSpecificData = () => {
        switch (agentId) {
            case "equipment": return <EquipmentDashboard data={data as any} />;
            case "safety": return <SafetyDashboard data={data as any} />;
            case "grid": return <GridDashboard data={data as any} />;
            default: return <div className="p-4 bg-slate-800/50 rounded border border-slate-700/50 text-slate-400">Generic Dashboard Placeholder</div>;
        }
    };

    return (
        <div className="flex-1 p-8 overflow-y-auto bg-[#0a0f18] text-slate-200">
            <div className="flex items-center justify-between mb-6">
                <button 
                    onClick={() => router.push("/ai-center")}
                    className="flex items-center gap-2 px-3 py-1.5 text-sm bg-slate-800/50 rounded border border-slate-700/50 hover:bg-slate-800 transition-colors"
                >
                    <ArrowLeft className="w-4 h-4" /> Back to AI Center
                </button>
            </div>

            <div className="max-w-6xl mx-auto space-y-6">
                <AgentHeader data={data} />
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="md:col-span-2 space-y-6">
                        <ScenarioPanel data={data} />
                        <LiveWorkflow workflow={data.workflow} />
                        {renderAgentSpecificData()}
                        <DeveloperModeBlock metadata={data.developer_metadata} />
                    </div>
                    
                    <div className="space-y-6">
                        <AiDecisionBlock decision={data.decision} />
                        <RecommendationsBlock recommendations={data.recommendations} />
                        <ExecutionTimeline timeline={data.timeline} />
                    </div>
                </div>
            </div>
        </div>
    );
}
