import React from 'react';
import { Activity, ShieldCheck, Zap } from 'lucide-react';
import { BaseAgentResponse } from "@/types/agent-workbench";

export default function AgentHeader({ data }: { data: BaseAgentResponse }) {
    return (
        <div className="bg-slate-900/50 border border-slate-800 rounded-xl p-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-blue-500/5 to-transparent pointer-events-none" />
            
            <div className="relative">
                <div className="flex items-center gap-3 mb-2">
                    <div className="w-10 h-10 rounded bg-blue-500/20 flex items-center justify-center border border-blue-500/30">
                        {data.agent_id === 'safety' ? <ShieldCheck className="text-blue-400 w-5 h-5"/> : 
                         data.agent_id === 'grid' ? <Zap className="text-amber-400 w-5 h-5"/> : 
                         <Activity className="text-emerald-400 w-5 h-5"/>}
                    </div>
                    <div>
                        <h1 className="text-2xl font-bold text-white tracking-tight">{data.agent_name}</h1>
                        <p className="text-slate-400 text-sm">{data.purpose}</p>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 relative">
                <div>
                    <p className="text-xs text-slate-500 uppercase tracking-wider mb-1">Status</p>
                    <div className="flex items-center gap-2 text-sm font-medium">
                        <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                        {data.status}
                    </div>
                </div>
                <div>
                    <p className="text-xs text-slate-500 uppercase tracking-wider mb-1">Execution Mode</p>
                    <p className="text-sm font-medium">{data.execution_mode}</p>
                </div>
                <div>
                    <p className="text-xs text-slate-500 uppercase tracking-wider mb-1">Health</p>
                    <p className="text-sm font-medium text-emerald-400">{data.health_percentage}%</p>
                </div>
                <div>
                    <p className="text-xs text-slate-500 uppercase tracking-wider mb-1">Last Exec</p>
                    <p className="text-sm font-medium">{data.last_execution}</p>
                </div>
            </div>
        </div>
    );
}
