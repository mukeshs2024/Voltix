'use client';

import React, { useState } from 'react';
import { Settings, ShieldCheck, Bell, Sliders, Cpu, Save } from 'lucide-react';

export default function SettingsPage() {
  const [autoApprove, setAutoApprove] = useState(false);
  const [confidence, setConfidence] = useState(90);

  return (
    <div className="max-w-4xl mx-auto pb-16 pt-4 space-y-8">
      <div>
        <h1 className="text-3xl font-light tracking-tight text-zinc-100 flex items-center gap-3 mb-2">
           <Settings className="w-8 h-8 text-aiBlue" /> Preferences
        </h1>
        <p className="text-sm text-zinc-400">Manage Voltix AI behavior, automation thresholds, and notifications.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
        <div className="col-span-1 space-y-2">
           {['AI Automation', 'Energy Targets', 'Notifications', 'System Integration'].map((tab, i) => (
             <button key={i} className={`w-full text-left px-4 py-2.5 rounded-lg text-sm font-medium transition-colors ${i === 0 ? 'bg-zinc-800 text-zinc-100' : 'text-zinc-500 hover:bg-zinc-900 hover:text-zinc-300'}`}>
                {tab}
             </button>
           ))}
        </div>

        <div className="col-span-3 space-y-6">
           <div className="glass-card p-6 rounded-2xl border border-zinc-800">
              <div className="flex items-center gap-2 mb-6 text-zinc-100 font-semibold">
                 <Cpu className="w-5 h-5 text-aiBlue" /> AI Automation Settings
              </div>
              
              <div className="space-y-8">
                 <div className="flex items-center justify-between">
                    <div>
                       <h4 className="text-sm font-semibold text-zinc-200">Automatic Approval Mode</h4>
                       <p className="text-xs text-zinc-500 mt-1">Allow Voltix to execute actions without manual manager review if confidence is high.</p>
                    </div>
                    <button 
                       onClick={() => setAutoApprove(!autoApprove)}
                       className={`w-12 h-6 rounded-full relative transition-colors ${autoApprove ? 'bg-emerald-500' : 'bg-zinc-700'}`}
                    >
                       <span className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-transform ${autoApprove ? 'left-7' : 'left-1'}`} />
                    </button>
                 </div>

                 <div className="pt-6 border-t border-zinc-800">
                    <div className="flex items-center justify-between mb-4">
                       <div>
                          <h4 className="text-sm font-semibold text-zinc-200 flex items-center gap-2">
                             Confidence Threshold <span className="text-xs font-mono text-aiBlue bg-aiBlue/10 px-2 py-0.5 rounded">{confidence}%</span>
                          </h4>
                          <p className="text-xs text-zinc-500 mt-1">Minimum AI confidence required to suggest or execute an action.</p>
                       </div>
                    </div>
                    <input 
                       type="range" 
                       min="70" 
                       max="99" 
                       value={confidence} 
                       onChange={(e) => setConfidence(parseInt(e.target.value))}
                       className="w-full accent-aiBlue h-2 bg-zinc-800 rounded-lg appearance-none cursor-pointer"
                    />
                    <div className="flex justify-between text-xs font-mono text-zinc-500 mt-2">
                       <span>70% (Aggressive)</span>
                       <span>99% (Conservative)</span>
                    </div>
                 </div>
              </div>
           </div>

           <div className="glass-card p-6 rounded-2xl border border-zinc-800">
              <div className="flex items-center gap-2 mb-6 text-zinc-100 font-semibold">
                 <ShieldCheck className="w-5 h-5 text-emerald-500" /> Operating Constraints
              </div>
              <div className="space-y-4">
                 <div className="grid grid-cols-2 gap-4">
                    <div>
                       <label className="text-xs text-zinc-500 uppercase tracking-wider mb-2 block">Max Temp Deviation</label>
                       <select className="w-full bg-zinc-900 border border-zinc-800 rounded-lg px-3 py-2 text-sm text-zinc-300 focus:outline-none focus:border-aiBlue">
                          <option>±0.5°C</option>
                          <option>±1.0°C</option>
                          <option>±1.5°C</option>
                       </select>
                    </div>
                    <div>
                       <label className="text-xs text-zinc-500 uppercase tracking-wider mb-2 block">Min Battery Reserve</label>
                       <select className="w-full bg-zinc-900 border border-zinc-800 rounded-lg px-3 py-2 text-sm text-zinc-300 focus:outline-none focus:border-aiBlue">
                          <option>20%</option>
                          <option>30%</option>
                          <option>40%</option>
                       </select>
                    </div>
                 </div>
              </div>
           </div>
           
           <div className="flex justify-end pt-4">
              <button className="px-6 py-2.5 bg-zinc-100 hover:bg-white text-black rounded-lg text-sm font-semibold flex items-center gap-2 transition-colors">
                 <Save className="w-4 h-4" /> Save Preferences
              </button>
           </div>
        </div>
      </div>
    </div>
  );
}
