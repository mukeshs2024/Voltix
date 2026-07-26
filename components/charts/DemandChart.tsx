'use client';

import React from 'react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ReferenceLine,
} from 'recharts';
import { DEMAND_DATA } from '@/data/analytics';
import { Zap } from 'lucide-react';

interface DemandChartProps {
  data?: typeof DEMAND_DATA;
}

export const DemandChart: React.FC<DemandChartProps> = ({
  data = DEMAND_DATA,
}) => {
  return (
    <div className="glass-card rounded-2xl p-5 border border-slate-800 space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-base font-bold text-slate-100 flex items-center gap-2">
            <Zap className="w-4 h-4 text-cyan-400" /> Facility Power Demand Profile (kW)
          </h3>
          <p className="text-xs text-slate-400">
            Comparing Unhedged Baseline Demand vs AI Optimized Demand curve
          </p>
        </div>
        <div className="flex items-center gap-3 text-xs font-mono">
          <span className="flex items-center gap-1 text-rose-400">
            <span className="w-2.5 h-2.5 rounded-full bg-rose-500 inline-block" /> Baseline
          </span>
          <span className="flex items-center gap-1 text-emerald-400">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 inline-block" /> AI Optimized
          </span>
        </div>
      </div>

      <div className="h-72 w-full pt-2">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top: 10, right: 20, left: 0, bottom: 0 }}>
            <defs>
              <linearGradient id="baselineGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#f43f5e" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#f43f5e" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="optimizedGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#10b981" stopOpacity={0.4} />
                <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
            <XAxis dataKey="time" stroke="#64748b" tick={{ fontSize: 11 }} />
            <YAxis stroke="#64748b" tick={{ fontSize: 11 }} unit=" kW" domain={[50, 250]} />
            <Tooltip
              contentStyle={{
                backgroundColor: '#0f172a',
                borderColor: '#334155',
                borderRadius: '0.75rem',
                color: '#f8fafc',
                fontSize: '12px',
              }}
            />
            <ReferenceLine
              y={180}
              label={{ value: 'Peak Demand Threshold (180 kW)', fill: '#fbbf24', fontSize: 10, position: 'top' }}
              stroke="#fbbf24"
              strokeDasharray="4 4"
            />
            <Area
              type="monotone"
              dataKey="baselineDemand"
              name="Un-optimized Demand"
              stroke="#f43f5e"
              strokeWidth={2}
              fillOpacity={1}
              fill="url(#baselineGrad)"
            />
            <Area
              type="monotone"
              dataKey="optimizedDemand"
              name="AI Optimized Demand"
              stroke="#10b981"
              strokeWidth={2.5}
              fillOpacity={1}
              fill="url(#optimizedGrad)"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};
