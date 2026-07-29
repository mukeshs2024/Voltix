import React from 'react';
import { RecommendationCard } from "@/types/agent-workbench";
import { ArrowRight } from 'lucide-react';

export default function RecommendationsBlock({ recommendations }: { recommendations: RecommendationCard[] }) {
    if (!recommendations || recommendations.length === 0) return null;
    
    return (
        <div className="bg-slate-900/50 border border-slate-800 rounded-xl p-6">
            <h3 className="text-sm font-medium text-slate-300 uppercase tracking-wider mb-4">Actionable Recommendations</h3>
            
            <div className="space-y-3">
                {recommendations.map((rec, i) => (
                    <div key={i} className="group relative p-4 bg-slate-800/40 rounded-lg border border-slate-700/50 hover:border-blue-500/50 hover:bg-slate-800/80 transition-colors cursor-pointer">
                        <div className="flex justify-between items-start">
                            <div>
                                <h4 className="text-sm font-medium text-white mb-1 group-hover:text-blue-400 transition-colors">{rec.title}</h4>
                                <p className="text-xs text-slate-400">{rec.description}</p>
                            </div>
                            <ArrowRight className="w-4 h-4 text-slate-600 group-hover:text-blue-400 transition-colors" />
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
