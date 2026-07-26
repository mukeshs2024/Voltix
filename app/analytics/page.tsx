'use client';

import React, { useState } from 'react';
import { DemandChart } from '@/components/charts/DemandChart';
import { SolarChart } from '@/components/charts/SolarChart';
import { BatteryChart } from '@/components/charts/BatteryChart';
import { CarbonChart } from '@/components/charts/CarbonChart';
import { CostChart } from '@/components/charts/CostChart';
import { MOCK_DASHBOARD_METRICS } from '@/data/dashboard';
import {
  BarChart3,
  Zap,
  Sun,
  BatteryCharging,
  Leaf,
  DollarSign,
  Calendar,
  Download,
  Filter,
} from 'lucide-react';

export default function AnalyticsPage() {
  const [activeTab, setActiveTab] = useState<'all' | 'demand' | 'solar' | 'battery' | 'carbon' | 'cost'>('all');
  const [timeRange, setTimeRange] = useState<'24h' | '7d' | '30d'>('24h');

  return (
    <div className="space-y-8 pb-16">
      {/* Header Banner */}
      <div className="glass-card rounded-2xl p-6 border border-slate-800 flex flex-wrap items-center justify-between gap-6 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="p-2 rounded-xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
              <BarChart3 className="w-6 h-6" />
            </span>
            <h1 className="text-2xl font-extrabold text-slate-100 tracking-tight">
              Voltix Microgrid Analytics
            </h1>
          </div>
          <p className="text-xs text-slate-400">
            Interactive multi-parameter telemetry charts: Demand, Solar, Battery, Carbon, & Cost
          </p>
        </div>

        {/* Controls */}
        <div className="flex items-center space-x-3">
          <div className="flex items-center space-x-1 bg-slate-900 p-1 rounded-xl border border-slate-800 text-xs">
            <button
              onClick={() => setTimeRange('24h')}
              className={`px-3 py-1.5 rounded-lg font-medium transition ${
                timeRange === '24h'
                  ? 'bg-emerald-500/20 text-emerald-300 font-bold border border-emerald-500/30'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              24 Hours
            </button>
            <button
              onClick={() => setTimeRange('7d')}
              className={`px-3 py-1.5 rounded-lg font-medium transition ${
                timeRange === '7d'
                  ? 'bg-emerald-500/20 text-emerald-300 font-bold border border-emerald-500/30'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              7 Days
            </button>
            <button
              onClick={() => setTimeRange('30d')}
              className={`px-3 py-1.5 rounded-lg font-medium transition ${
                timeRange === '30d'
                  ? 'bg-emerald-500/20 text-emerald-300 font-bold border border-emerald-500/30'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              30 Days
            </button>
          </div>

          <button
            onClick={() => alert('Exporting Analytics CSV Report...')}
            className="px-3.5 py-2 rounded-xl text-xs font-bold bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition flex items-center gap-1.5"
          >
            <Download className="w-3.5 h-3.5" /> Export Data
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        <div className="glass-card p-4 rounded-xl border border-slate-800 flex items-center gap-3">
          <div className="p-2.5 rounded-lg bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
            <Zap className="w-4 h-4" />
          </div>
          <div>
            <div className="text-[10px] font-mono text-slate-400 uppercase">Demand Peak</div>
            <div className="text-base font-bold text-cyan-300 font-mono">165 kW</div>
            <div className="text-[10px] text-emerald-400">-25% vs Baseline</div>
          </div>
        </div>

        <div className="glass-card p-4 rounded-xl border border-slate-800 flex items-center gap-3">
          <div className="p-2.5 rounded-lg bg-amber-500/10 text-amber-400 border border-amber-500/20">
            <Sun className="w-4 h-4" />
          </div>
          <div>
            <div className="text-[10px] font-mono text-slate-400 uppercase">Solar Output</div>
            <div className="text-base font-bold text-amber-300 font-mono">85 kW</div>
            <div className="text-[10px] text-slate-400">Cloud Dip Buffer</div>
          </div>
        </div>

        <div className="glass-card p-4 rounded-xl border border-slate-800 flex items-center gap-3">
          <div className="p-2.5 rounded-lg bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
            <BatteryCharging className="w-4 h-4" />
          </div>
          <div>
            <div className="text-[10px] font-mono text-slate-400 uppercase">BESS Reserve</div>
            <div className="text-base font-bold text-emerald-400 font-mono">82% SOC</div>
            <div className="text-[10px] text-emerald-400">Peak Discharging</div>
          </div>
        </div>

        <div className="glass-card p-4 rounded-xl border border-slate-800 flex items-center gap-3">
          <div className="p-2.5 rounded-lg bg-teal-500/10 text-teal-400 border border-teal-500/20">
            <Leaf className="w-4 h-4" />
          </div>
          <div>
            <div className="text-[10px] font-mono text-slate-400 uppercase">Carbon Rate</div>
            <div className="text-base font-bold text-teal-300 font-mono">184 g/kWh</div>
            <div className="text-[10px] text-teal-400">Eco Mode Active</div>
          </div>
        </div>

        <div className="glass-card p-4 rounded-xl border border-slate-800 flex items-center gap-3">
          <div className="p-2.5 rounded-lg bg-violet-500/10 text-violet-400 border border-violet-500/20">
            <DollarSign className="w-4 h-4" />
          </div>
          <div>
            <div className="text-[10px] font-mono text-slate-400 uppercase">Grid Tariff</div>
            <div className="text-base font-bold text-violet-300 font-mono">$0.36 / kWh</div>
            <div className="text-[10px] text-slate-400">Peak Window</div>
          </div>
        </div>
      </div>

      {/* View Filter Bar */}
      <div className="flex items-center space-x-1 bg-slate-900 p-1.5 rounded-xl border border-slate-800 w-fit">
        <button
          onClick={() => setActiveTab('all')}
          className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
            activeTab === 'all'
              ? 'bg-cyan-500/20 text-cyan-300 font-bold border border-cyan-500/30'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          All Charts (5)
        </button>
        <button
          onClick={() => setActiveTab('demand')}
          className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
            activeTab === 'demand'
              ? 'bg-cyan-500/20 text-cyan-300 font-bold border border-cyan-500/30'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          ⚡ Demand
        </button>
        <button
          onClick={() => setActiveTab('solar')}
          className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
            activeTab === 'solar'
              ? 'bg-amber-500/20 text-amber-300 font-bold border border-amber-500/30'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          ☀️ Solar
        </button>
        <button
          onClick={() => setActiveTab('battery')}
          className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
            activeTab === 'battery'
              ? 'bg-emerald-500/20 text-emerald-300 font-bold border border-emerald-500/30'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          🔋 Battery
        </button>
        <button
          onClick={() => setActiveTab('carbon')}
          className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
            activeTab === 'carbon'
              ? 'bg-teal-500/20 text-teal-300 font-bold border border-teal-500/30'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          🌿 Carbon
        </button>
        <button
          onClick={() => setActiveTab('cost')}
          className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
            activeTab === 'cost'
              ? 'bg-violet-500/20 text-violet-300 font-bold border border-violet-500/30'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          💵 Cost
        </button>
      </div>

      {/* Grid of Interactive Charts */}
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
