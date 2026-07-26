'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Activity, Zap, Users, ShieldCheck, ArrowUpRight, Battery, Sun, Cpu } from 'lucide-react';

interface Building {
  id: string;
  name: string;
  type: 'building' | 'solar' | 'battery' | 'ev';
  power: string;
  health: number;
  occupancy?: string;
  status: 'Healthy' | 'Warning' | 'Optimizing';
  aiInsight: string;
  prediction: string;
  icon: React.ReactNode;
}

const BUILDINGS: Building[] = [
  { id: 'b1', name: 'Library', type: 'building', power: '45 kW', health: 98, occupancy: '120/200', status: 'Healthy', aiInsight: 'Cooling optimized based on low occupancy.', prediction: 'Load expected to drop 10% in 1 hr.', icon: <Users className="w-5 h-5" /> },
  { id: 'b2', name: 'Computer Lab', type: 'building', power: '85 kW', health: 92, occupancy: '45/50', status: 'Optimizing', aiInsight: 'Shifting HVAC load to pre-cool before peak pricing.', prediction: 'Peak load at 2:00 PM.', icon: <Cpu className="w-5 h-5" /> },
  { id: 'b3', name: 'Auditorium', type: 'building', power: '15 kW', health: 99, occupancy: '0/500', status: 'Healthy', aiInsight: 'In deep energy-saving mode.', prediction: 'No event scheduled today.', icon: <Users className="w-5 h-5" /> },
  { id: 'b4', name: 'Cafeteria', type: 'building', power: '110 kW', health: 85, occupancy: '350/400', status: 'Warning', aiInsight: 'Refrigeration load unusually high.', prediction: 'Suggest maintenance check.', icon: <Users className="w-5 h-5" /> },
  { id: 's1', name: 'Solar Array', type: 'solar', power: '+220 kW', health: 100, status: 'Healthy', aiInsight: 'Generating at peak capacity.', prediction: 'Cloud cover arriving in 45 mins.', icon: <Sun className="w-5 h-5 text-amber-500" /> },
  { id: 'bat1', name: 'Main Battery', type: 'battery', power: '92% (Idle)', health: 100, status: 'Healthy', aiInsight: 'Holding charge for afternoon peak.', prediction: 'Discharge scheduled for 4:00 PM.', icon: <Battery className="w-5 h-5 text-emerald-500" /> },
];

export function DigitalTwin() {
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const selectedBuilding = BUILDINGS.find(b => b.id === selectedId);

  return (
    <div className="relative w-full h-[600px] rounded-2xl glass-card overflow-hidden flex bg-zinc-950/50">
      {/* Background Grid Pattern */}
      <div className="absolute inset-0 opacity-[0.03] pointer-events-none" style={{ backgroundImage: 'radial-gradient(circle at 1px 1px, white 1px, transparent 0)', backgroundSize: '40px 40px' }} />
      
      {/* Campus Map View (Left) */}
      <div className="flex-1 p-8 relative">
        <h2 className="text-xl font-medium tracking-tight mb-6 flex items-center gap-2">
          <Activity className="w-5 h-5 text-aiBlue" /> Live Digital Twin
        </h2>
        
        <div className="grid grid-cols-3 gap-6 h-full pb-12">
          {BUILDINGS.map((building) => (
            <motion.div
              key={building.id}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setSelectedId(building.id)}
              className={`p-5 rounded-xl cursor-pointer border transition-colors ${
                selectedId === building.id 
                  ? 'bg-zinc-900 border-aiBlue shadow-[0_0_20px_rgba(59,130,246,0.15)]' 
                  : 'bg-zinc-900/50 border-zinc-800 hover:border-zinc-700'
              }`}
            >
              <div className="flex justify-between items-start mb-4">
                <div className="p-2.5 rounded-lg bg-zinc-800">
                  {building.icon}
                </div>
                {building.status === 'Optimizing' && (
                  <span className="flex items-center gap-1 text-[10px] uppercase font-bold tracking-wider text-aiBlue bg-aiBlue/10 px-2 py-1 rounded">
                    <Zap className="w-3 h-3" /> Optimizing
                  </span>
                )}
                {building.status === 'Warning' && (
                  <span className="flex items-center gap-1 text-[10px] uppercase font-bold tracking-wider text-amber-500 bg-amber-500/10 px-2 py-1 rounded">
                    Warning
                  </span>
                )}
              </div>
              <div className="font-semibold text-zinc-200">{building.name}</div>
              <div className="text-2xl font-light text-white mt-1">{building.power}</div>
              <div className="text-xs text-zinc-500 mt-3 flex justify-between">
                <span>Health: {building.health}%</span>
                {building.occupancy && <span>Occ: {building.occupancy}</span>}
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Slide-out Details Panel (Right) */}
      <AnimatePresence>
        {selectedBuilding && (
          <motion.div
            initial={{ x: 300, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: 300, opacity: 0 }}
            className="w-80 bg-zinc-900 border-l border-zinc-800 p-6 flex flex-col shadow-2xl relative z-10"
          >
            <button 
              onClick={() => setSelectedId(null)}
              className="absolute top-4 right-4 text-zinc-500 hover:text-zinc-300"
            >
              ✕
            </button>
            <div className="flex items-center gap-3 mb-6 mt-2">
              <div className="p-2.5 rounded-lg bg-zinc-800 border border-zinc-700">
                {selectedBuilding.icon}
              </div>
              <div>
                <h3 className="font-semibold text-zinc-100">{selectedBuilding.name}</h3>
                <span className={`text-xs ${selectedBuilding.status === 'Optimizing' ? 'text-aiBlue' : selectedBuilding.status === 'Warning' ? 'text-amber-500' : 'text-emerald-500'}`}>
                  {selectedBuilding.status}
                </span>
              </div>
            </div>

            <div className="space-y-6">
              <div>
                <div className="text-xs text-zinc-500 mb-1 font-medium">Current Power</div>
                <div className="text-3xl font-light">{selectedBuilding.power}</div>
              </div>

              <div className="p-4 rounded-xl bg-zinc-950 border border-zinc-800/50">
                <div className="flex items-center gap-2 text-xs font-semibold tracking-wide text-aiBlue mb-2 uppercase">
                  <Activity className="w-3.5 h-3.5" /> AI Insight
                </div>
                <p className="text-sm text-zinc-300 leading-relaxed">
                  {selectedBuilding.aiInsight}
                </p>
              </div>

              <div className="p-4 rounded-xl bg-zinc-950 border border-zinc-800/50">
                <div className="flex items-center gap-2 text-xs font-semibold tracking-wide text-zinc-400 mb-2 uppercase">
                  <ArrowUpRight className="w-3.5 h-3.5" /> Prediction
                </div>
                <p className="text-sm text-zinc-300 leading-relaxed">
                  {selectedBuilding.prediction}
                </p>
              </div>

              {selectedBuilding.type === 'building' && (
                <div className="pt-4 border-t border-zinc-800">
                  <div className="flex justify-between text-sm mb-2">
                    <span className="text-zinc-500">Occupancy</span>
                    <span className="text-zinc-200">{selectedBuilding.occupancy}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-zinc-500">System Health</span>
                    <span className="text-zinc-200 flex items-center gap-1">
                      <ShieldCheck className="w-4 h-4 text-emerald-500" /> {selectedBuilding.health}%
                    </span>
                  </div>
                </div>
              )}
            </div>
            
            <div className="mt-auto">
               <button className="w-full py-2.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-200 text-sm font-medium transition-colors border border-zinc-700 hover:border-zinc-600">
                 View Historical Trend
               </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
