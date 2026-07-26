'use client';

import React, { useState } from 'react';
import { Play, Settings2, CloudRain, Flame, BatteryWarning, TrendingUp, AlertTriangle } from 'lucide-react';
import { DemandChart } from '@/components/charts/DemandChart';

const SCENARIOS = [
  { id: 'cloud', name: 'Cloud Cover', icon: CloudRain, color: 'text-aiBlue' },
  { id: 'heat', name: 'Heat Wave', icon: Flame, color: 'text-rose-500' },
  { id: 'battery', name: 'Battery Failure', icon: BatteryWarning, color: 'text-amber-500' },
  { id: 'price', name: 'Price Spike', icon: TrendingUp, color: 'text-violet-500' },
  { id: 'ev', name: 'EV Peak Load', icon: AlertTriangle, color: 'text-emerald-500' },
];

export default function SimulatorPage() {
  const [activeScenario, setActiveScenario] = useState('cloud');
  const [isRunning, setIsRunning] = useState(false);
  const [hasRun, setHasRun] = useState(false);

  const handleSimulate = () => {
    setIsRunning(true);
    setTimeout(() => {
      setIsRunning(false);
      setHasRun(true);
    }, 2000);
  };

  return (
    <div className="space-y-8 pb-16 pt-4">
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div>
          <h1 className="text-3xl font-light tracking-tight text-zinc-100 flex items-center gap-3">
             <Settings2 className="w-8 h-8 text-aiBlue" /> Scenario Simulator
          </h1>
          <p className="text-sm text-zinc-400 mt-1">Simulate grid events and predict AI interventions.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="col-span-1 space-y-4">
          <div className="glass-card p-5 rounded-2xl border border-zinc-800">
            <h3 className="font-semibold text-zinc-100 mb-4 text-sm uppercase tracking-wider">Select Scenario</h3>
            <div className="space-y-2">
               {SCENARIOS.map(s => (
                  <button 
                    key={s.id} 
                    onClick={() => {setActiveScenario(s.id); setHasRun(false);}}
                    className={`w-full flex items-center gap-3 p-3 rounded-xl border transition-colors ${activeScenario === s.id ? 'bg-zinc-800 border-zinc-700' : 'bg-zinc-900 border-transparent hover:bg-zinc-800/50'}`}
                  >
                     <s.icon className={`w-5 h-5 ${s.color}`} />
                     <span className="text-sm font-medium text-zinc-200">{s.name}</span>
                  </button>
               ))}
            </div>
            <div className="mt-6">
               <button 
                  onClick={handleSimulate}
                  disabled={isRunning}
                  className="w-full py-3 bg-aiBlue hover:bg-blue-600 disabled:opacity-50 text-white rounded-xl text-sm font-semibold flex items-center justify-center gap-2 transition-colors shadow-lg shadow-aiBlue/20"
               >
                  {isRunning ? 'Running Simulation...' : <><Play className="w-4 h-4 fill-current" /> Run Simulation</>}
               </button>
            </div>
          </div>
        </div>

        <div className="col-span-2 space-y-6">
          <div className={`glass-card p-6 rounded-2xl border border-zinc-800 min-h-[400px] flex flex-col ${!hasRun ? 'items-center justify-center opacity-50' : ''}`}>
             {!hasRun ? (
                <div className="text-center">
                   <Settings2 className="w-12 h-12 text-zinc-600 mx-auto mb-4" />
                   <p className="text-zinc-500 font-medium">Select a scenario and run the simulation to see predictions.</p>
                </div>
             ) : (
                <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                   <div className="flex items-center justify-between">
                      <h3 className="font-semibold text-zinc-100 text-lg">Simulation Results</h3>
                      <span className="text-xs font-mono bg-emerald-500/10 text-emerald-500 px-3 py-1 rounded-full border border-emerald-500/20">Analysis Complete</span>
                   </div>
                   
                   <div className="grid grid-cols-3 gap-4">
                      <div className="bg-zinc-900 p-4 rounded-xl border border-zinc-800 text-center">
                         <div className="text-xs text-zinc-500 uppercase tracking-wider mb-1">Peak Demand</div>
                         <div className="text-xl font-semibold text-zinc-100">185 kW</div>
                      </div>
                      <div className="bg-zinc-900 p-4 rounded-xl border border-zinc-800 text-center">
                         <div className="text-xs text-zinc-500 uppercase tracking-wider mb-1">Est. Cost</div>
                         <div className="text-xl font-semibold text-zinc-100">$42/hr</div>
                      </div>
                      <div className="bg-zinc-900 p-4 rounded-xl border border-zinc-800 text-center">
                         <div className="text-xs text-zinc-500 uppercase tracking-wider mb-1">Carbon Output</div>
                         <div className="text-xl font-semibold text-zinc-100">192 kg</div>
                      </div>
                   </div>

                   <div>
                      <h4 className="text-sm font-semibold text-zinc-400 uppercase tracking-wider mb-4">Predicted Demand Curve</h4>
                      <div className="h-64">
                         <DemandChart />
                      </div>
                   </div>
                </div>
             )}
          </div>
        </div>
      </div>
    </div>
  );
}
