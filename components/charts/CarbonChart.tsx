'use client';

import React from 'react';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from 'recharts';
import { CARBON_DATA } from '@/data/analytics';
import { Leaf } from 'lucide-react';

interface CarbonChartProps {
  data?: typeof CARBON_DATA;
}

export const CarbonChart: React.FC<CarbonChartProps> = ({
  data = CARBON_DATA,
}) => {
  return (
    <div className="glass-card rounded-2xl p-5 border border-slate-800 space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-base font-bold text-slate-100 flex items-center gap-2">
            <Leaf className="w-4 h-4 text-teal-400" /> Carbon Intensity & Hourly Offsets
          </h3>
          <p className="text-xs text-slate-400">
            Comparing Un-optimized CO₂ footprint vs AI Optimized microgrid emissions (kg CO₂/hr)
          </p>
        </div>
        <div className="flex items-center gap-3 text-xs font-mono">
          <span className="flex items-center gap-1 text-rose-400">
            <span className="w-2.5 h-2.5 rounded-full bg-rose-400 inline-block" /> Baseline
          </span>
          <span className="flex items-center gap-1 text-teal-300">
            <span className="w-2.5 h-2.5 rounded-full bg-teal-300 inline-block" /> Optimized
          </span>
        </div>
      </div>

      <div className="h-72 w-full pt-2">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data} margin={{ top: 10, right: 20, left: 0, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
            <XAxis dataKey="time" stroke="#64748b" tick={{ fontSize: 11 }} />
            <YAxis stroke="#64748b" tick={{ fontSize: 11 }} unit=" kg" domain={[20, 110]} />
            <Tooltip
              contentStyle={{
                backgroundColor: '#0f172a',
                borderColor: '#334155',
                borderRadius: '0.75rem',
                color: '#f8fafc',
                fontSize: '12px',
              }}
            />
            <Line
              type="monotone"
              dataKey="baselineEmissions"
              name="Baseline Emissions"
              stroke="#f43f5e"
              strokeWidth={2}
              dot={{ r: 3 }}
            />
            <Line
              type="monotone"
              dataKey="optimizedEmissions"
              name="AI Optimized Emissions"
              stroke="#5eead4"
              strokeWidth={3}
              dot={{ r: 4, fill: '#5eead4' }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};
