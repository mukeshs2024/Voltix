import React from 'react';
import { EquipmentAgentResponse } from "@/types/agent-workbench";
import { Cpu, Activity } from 'lucide-react';

export default function EquipmentDashboard({ data }: { data: EquipmentAgentResponse }) {
    return (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-slate-900/50 border border-slate-800 rounded-xl p-6">
                <div className="flex items-center gap-2 mb-4">
                    <Cpu className="w-5 h-5 text-slate-400" />
                    <h3 className="text-sm font-medium text-slate-300 uppercase tracking-wider">Sensor Telemetry</h3>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left">
                        <thead className="text-xs text-slate-500 uppercase border-b border-slate-800">
                            <tr>
                                <th className="pb-3 font-medium">Metric</th>
                                <th className="pb-3 font-medium text-right">Value</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-800/50">
                            {data.sensors?.map((s: any, i: number) => (
                                <tr key={i}>
                                    <td className="py-3 text-slate-300">{s.name}</td>
                                    <td className={`py-3 text-right font-medium ${s.status === 'critical' ? 'text-rose-400' : 'text-slate-200'}`}>
                                        {s.value}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            <div className="bg-slate-900/50 border border-slate-800 rounded-xl p-6">
                <div className="flex items-center gap-2 mb-4">
                    <Activity className="w-5 h-5 text-slate-400" />
                    <h3 className="text-sm font-medium text-slate-300 uppercase tracking-wider">Performance Analytics</h3>
                </div>
                <div className="grid grid-cols-2 gap-4">
                    {data.analytics && Object.entries(data.analytics).map(([key, val], i) => (
                        <div key={i} className="p-4 bg-slate-800/30 rounded-lg border border-slate-700/30">
                            <p className="text-xs text-slate-500 mb-1">{key}</p>
                            <p className="text-lg font-medium text-slate-200">{val as string}</p>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
