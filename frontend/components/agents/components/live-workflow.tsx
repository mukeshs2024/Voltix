import React from 'react';
import { AgentWorkflowStep } from "@/types/agent-workbench";
import { CheckCircle2, Circle, Loader2 } from 'lucide-react';

export default function LiveWorkflow({ workflow }: { workflow: AgentWorkflowStep[] }) {
    return (
        <div className="bg-slate-900/50 border border-slate-800 rounded-xl p-6">
            <h3 className="text-sm font-medium text-slate-300 uppercase tracking-wider mb-6">Live Workflow</h3>
            
            <div className="flex flex-col md:flex-row gap-4 md:gap-0 justify-between relative">
                <div className="hidden md:block absolute top-4 left-4 right-4 h-px bg-slate-800 -z-10" />
                
                {workflow.map((step, i) => (
                    <div key={i} className="flex md:flex-col items-center md:items-center gap-4 md:gap-3 flex-1">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center border-2 bg-[#0a0f18] z-10 ${
                            step.state === 'done' ? 'border-emerald-500 text-emerald-500' :
                            step.state === 'active' ? 'border-blue-500 text-blue-500' :
                            'border-slate-700 text-slate-700'
                        }`}>
                            {step.state === 'done' ? <CheckCircle2 className="w-4 h-4" /> :
                             step.state === 'active' ? <Loader2 className="w-4 h-4 animate-spin" /> :
                             <Circle className="w-4 h-4" />}
                        </div>
                        <div className="text-left md:text-center">
                            <p className={`text-sm font-medium ${step.state === 'active' ? 'text-white' : 'text-slate-400'}`}>
                                {step.label}
                            </p>
                            <p className="text-xs text-slate-500 mt-1 max-w-[120px] hidden md:block mx-auto">
                                {step.detail}
                            </p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
