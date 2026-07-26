'use client';

import React, { useState } from 'react';
import { DemandChart } from '@/components/charts/DemandChart';
import { SolarChart } from '@/components/charts/SolarChart';
import { BatteryChart } from '@/components/charts/BatteryChart';
import { CarbonChart } from '@/components/charts/CarbonChart';
import { CostChart } from '@/components/charts/CostChart';
import { BarChart3, Zap, Sun, BatteryCharging, Leaf, DollarSign, Download } from 'lucide-react';

export default function AnalyticsPage() {
  const [activeTab, setActiveTab] = useState<'all' | 'demand' | 'solar' | 'battery' | 'carbon' | 'cost'>('all');
  const [timeRange, setTimeRange] = useState<'24h' | '7d' | '30d'>('24h');

  return (
    <div className="space-y-8 pb-16 pt-4">
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div>
          <h1 className="text-3xl font-light tracking-tight text-zinc-100 flex items-center gap-3">
             <BarChart3 className="w-8 h-8 text-aiBlue" /> Voltix Analytics
          </h1>
          <p className="text-sm text-zinc-400 mt-1">
             Compare campus performance <span className="text-zinc-300 font-semibold">Without AI</span> vs <span className="text-emerald-400 font-semibold">With Voltix</span>
          </p>
        </div>
        
        <div className="flex items-center gap-3">
          <div className="flex items-center bg-zinc-900 p-1 rounded-xl border border-zinc-800 text-xs font-medium">
            {['24h', '7d', '30d'].map((range) => (
              <button
                key={range}
                onClick={() => setTimeRange(range as any)}
                className={`px-4 py-1.5 rounded-lg transition-colors ${timeRange === range ? 'bg-zinc-800 text-zinc-100' : 'text-zinc-500 hover:text-zinc-300'}`}
              >
                {range}
              </button>
            ))}
          </div>
          <button className="px-4 py-2 rounded-xl text-xs font-semibold bg-zinc-100 hover:bg-white text-black transition-colors flex items-center gap-2">
            <Download className="w-4 h-4" /> Export Report
          </button>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        {[
           { label: 'Demand Peak', value: '165 kW', sub: '-25% vs Without AI', icon: Zap, color: 'text-aiBlue' },
           { label: 'Solar Output', value: '85 kW', sub: 'Cloud Dip Buffer', icon: Sun, color: 'text-amber-500' },
           { label: 'BESS Reserve', value: '82% SOC', sub: 'Peak Discharging', icon: BatteryCharging, color: 'text-emerald-500' },
           { label: 'Carbon Rate', value: '184 g/kWh', sub: 'Eco Mode Active', icon: Leaf, color: 'text-teal-500' },
           { label: 'Grid Tariff', value: '$0.36 / kWh', sub: 'Peak Window Avoided', icon: DollarSign, color: 'text-violet-500' }
        ].map((kpi, idx) => (
           <div key={idx} className="glass-card p-4 rounded-xl border border-zinc-800 flex items-start gap-3 hover:border-zinc-700 transition-colors">
              <div className="p-2 rounded-lg bg-zinc-900 border border-zinc-800">
                 <kpi.icon className={`w-4 h-4 ${kpi.color}`} />
              </div>
              <div>
                 <div className="text-[10px] font-semibold text-zinc-500 uppercase tracking-wider">{kpi.label}</div>
                 <div className="text-base font-semibold text-zinc-100 mt-1">{kpi.value}</div>
                 <div className="text-[10px] text-emerald-500 font-medium mt-0.5">{kpi.sub}</div>
              </div>
           </div>
        ))}
      </div>

      <div className="flex flex-wrap items-center gap-2 bg-zinc-900/50 p-1.5 rounded-xl border border-zinc-800 w-fit">
        {[
           { id: 'all', label: 'All Charts' },
           { id: 'demand', label: '⚡ Demand' },
           { id: 'solar', label: '☀️ Solar' },
           { id: 'battery', label: '🔋 Battery' },
           { id: 'carbon', label: '🌿 Carbon' },
           { id: 'cost', label: '💵 Cost' }
        ].map(tab => (
           <button
             key={tab.id}
             onClick={() => setActiveTab(tab.id as any)}
             className={`px-4 py-2 rounded-lg text-xs font-semibold transition-colors ${activeTab === tab.id ? 'bg-zinc-800 text-zinc-100 border border-zinc-700' : 'text-zinc-500 hover:text-zinc-300 border border-transparent'}`}
           >
             {tab.label}
           </button>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {(activeTab === 'all' || activeTab === 'demand') && <DemandChart />}
        {(activeTab === 'all' || activeTab === 'solar') && <SolarChart />}
        {(activeTab === 'all' || activeTab === 'battery') && <BatteryChart />}
        {(activeTab === 'all' || activeTab === 'carbon') && <CarbonChart />}
        {(activeTab === 'all' || activeTab === 'cost') && <CostChart />}
      </div>
    </div>
  );
}
