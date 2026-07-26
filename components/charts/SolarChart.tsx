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
} from 'recharts';
import { SOLAR_DATA } from '@/data/analytics';
import { CloudSun } from 'lucide-react';

interface SolarChartProps {
  data?: typeof SOLAR_DATA;
}

export const SolarChart: React.FC<SolarChartProps> = ({
  data = SOLAR_DATA,
}) => {
  return (
    <div className="glass-card rounded-2xl p-5 border border-slate-800 space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-base font-bold text-slate-100 flex items-center gap-2">
            <CloudSun className="w-4 h-4 text-amber-400" /> Solar PV Generation & Cloud Impact (kW)
          </h3>
          <p className="text-xs text-slate-400">
            Clear Sky Forecast vs Cloud Cover Deficit (11:00 AM - 02:00 PM)
          </p>
        </div>
        <div className="flex items-center gap-3 text-xs font-mono">
          <span className="flex items-center gap-1 text-amber-400">
            <span className="w-2.5 h-2.5 rounded-full bg-amber-400 inline-block" /> Clear Forecast
          </span>
          <span className="flex items-center gap-1 text-cyan-400">
            <span className="w-2.5 h-2.5 rounded-full bg-cyan-400 inline-block" /> Actual Generation
          </span>
        </div>
      </div>

      <div className="h-72 w-full pt-2">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top: 10, right: 20, left: 0, bottom: 0 }}>
            <defs>
              <linearGradient id="clearSolarGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#fbbf24" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#fbbf24" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="actualSolarGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#06b6d4" stopOpacity={0.4} />
                <stop offset="95%" stopColor="#06b6d4" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
            <XAxis dataKey="time" stroke="#64748b" tick={{ fontSize: 11 }} />
            <YAxis stroke="#64748b" tick={{ fontSize: 11 }} unit=" kW" domain={[0, 120]} />
            <Tooltip
              contentStyle={{
                backgroundColor: '#0f172a',
                borderColor: '#334155',
                borderRadius: '0.75rem',
                color: '#f8fafc',
                fontSize: '12px',
              }}
            />
            <Area
              type="monotone"
              dataKey="clearSkySolar"
              name="Clear Sky Forecast"
              stroke="#fbbf24"
              strokeWidth={2}
              strokeDasharray="3 3"
              fillOpacity={1}
              fill="url(#clearSolarGrad)"
            />
            <Area
              type="monotone"
              dataKey="actualSolar"
              name="Actual Solar Yield"
              stroke="#06b6d4"
              strokeWidth={2.5}
              fillOpacity={1}
              fill="url(#actualSolarGrad)"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};
