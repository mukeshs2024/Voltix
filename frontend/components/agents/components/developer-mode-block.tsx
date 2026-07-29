import React, { useState } from 'react';
import { AgentDeveloperMetadata } from "@/types/agent-workbench";
import { Code, Terminal } from 'lucide-react';

export default function DeveloperModeBlock({ metadata }: { metadata: AgentDeveloperMetadata }) {
    const [open, setOpen] = useState(false);
    
    if (!metadata) return null;

    return (
        <div className="bg-black/50 border border-slate-800 rounded-xl overflow-hidden">
            <button 
                onClick={() => setOpen(!open)}
                className="w-full flex items-center justify-between p-4 hover:bg-slate-900/80 transition-colors"
            >
                <div className="flex items-center gap-2">
                    <Terminal className="w-4 h-4 text-emerald-500" />
                    <span className="text-sm font-mono text-emerald-500">Developer Diagnostics</span>
                </div>
                <div className="flex gap-4 text-xs font-mono text-slate-500">
                    <span>{metadata.execution_time_ms}ms</span>
                    <span>{metadata.token_usage} tokens</span>
                </div>
            </button>
            
            {open && (
                <div className="p-4 border-t border-slate-800 bg-[#05080f]">
                    <div className="mb-4">
                        <p className="text-xs text-slate-500 uppercase tracking-wider mb-2">Adapter Source</p>
                        <code className="text-xs text-blue-400 bg-blue-500/10 px-2 py-1 rounded">{metadata.source}</code>
                    </div>
                    
                    <div className="grid grid-cols-1 gap-4">
                        <div>
                            <div className="flex justify-between items-center mb-2">
                                <p className="text-xs text-slate-500 uppercase tracking-wider">Raw AI Response</p>
                                <Code className="w-3 h-3 text-slate-600" />
                            </div>
                            <pre className="text-xs text-slate-300 bg-[#0a0f18] p-3 rounded overflow-x-auto border border-slate-800">
                                {JSON.stringify(metadata.raw_ai_response, null, 2)}
                            </pre>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
