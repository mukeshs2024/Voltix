import React from 'react';
import { AIDecisionBlock as DecisionType } from "@/types/agent-workbench";
import { BrainCircuit } from 'lucide-react';

export default function AiDecisionBlock({ decision }: { decision: DecisionType }) {
    return (
        <div className="bg-slate-900/50 border border-slate-800 rounded-xl p-6">
            <div className="flex items-center gap-2 mb-4">
                <BrainCircuit className="w-5 h-5 text-indigo-400" />
                <h3 className="text-sm font-medium text-slate-300 uppercase tracking-wider">AI Decision</h3>
            </div>
            
            <div className="p-4 bg-indigo-500/10 border border-indigo-500/20 rounded-lg mb-5">
                <p className="text-lg font-medium text-indigo-100">{decision.summary}</p>
            </div>

            <div className="space-y-4">
                <div>
                    <p className="text-xs text-slate-500 mb-1">Reasoning</p>
                    <p className="text-sm text-slate-300">{decision.reason}</p>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <p className="text-xs text-slate-500 mb-1">Priority</p>
                        <span className={`inline-block px-2 py-0.5 rounded text-xs font-medium ${
                            decision.priority === 'CRITICAL' || decision.priority === 'HIGH' 
                            ? 'bg-rose-500/20 text-rose-400 border border-rose-500/30'
                            : 'bg-slate-800 text-slate-300'
                        }`}>
                            {decision.priority}
                        </span>
                    </div>
                    <div>
                        <p className="text-xs text-slate-500 mb-1">Expected Impact</p>
                        <p className="text-sm text-slate-300">{decision.expected_impact}</p>
                    </div>
                </div>

                <div>
                    <p className="text-xs text-slate-500 mb-1">Business Impact</p>
                    <p className="text-sm text-slate-300">{decision.business_impact}</p>
                </div>
            </div>
        </div>
    );
}
