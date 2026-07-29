import React from 'react';
import { TimelineEvent } from "@/types/agent-workbench";

export default function ExecutionTimeline({ timeline }: { timeline: TimelineEvent[] }) {
    if (!timeline || timeline.length === 0) return null;
    
    return (
        <div className="bg-slate-900/50 border border-slate-800 rounded-xl p-6">
            <h3 className="text-sm font-medium text-slate-300 uppercase tracking-wider mb-6">Live Timeline</h3>
            
            <div className="relative pl-4 border-l border-slate-800 space-y-6">
                {timeline.map((event, i) => (
                    <div key={i} className="relative">
                        <div className={`absolute -left-[21px] top-1 w-2.5 h-2.5 rounded-full ring-4 ring-[#0a0f18] ${
                            event.is_active ? 'bg-blue-500 animate-pulse' : 'bg-slate-700'
                        }`} />
                        <div className="flex gap-4">
                            <span className="text-xs font-mono text-slate-500 mt-0.5 shrink-0">{event.time}</span>
                            <p className={`text-sm ${event.is_active ? 'text-white font-medium' : 'text-slate-400'}`}>
                                {event.message}
                            </p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
