'use client';

import React from 'react';
import {
  ResponsiveContainer,
  ComposedChart,
  Area,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from 'recharts';
import { BATTERY_DATA } from '@/data/analytics';
import { BatteryCharging } from 'lucide-react';

interface BatteryChartProps {
  data?: typeof BATTERY_DATA;
}

export const BatteryChart: React.FC<BatteryChartProps> = ({
  data = BATTERY_DATA,
}) => {
  return (
    <div className="glass-card rounded-2xl p-5 border border-slate-800 space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-base font-bold text-slate-100 flex items-center gap-2">
            <BatteryCharging className="w-4 h-4 text-emerald-400" /> BESS Battery Storage SOC & Dispatch
          </h3>
          <p className="text-xs text-slate-400">
            State of Charge (%) and Peak Shaving Discharge Rate (kW)
          </p>
        </div>
        <div className="flex items-center gap-3 text-xs font-mono">
          <span className="flex items-center gap-1 text-emerald-400">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 inline-block" /> SOC %
          </span>
          <span className="flex items-center gap-1 text-cyan-400">
            <span className="w-2.5 h-2.5 rounded-full bg-cyan-400 inline-block" /> Discharge (kW)
          </span>
        </div>
      </div>

      <div className="h-72 w-full pt-2">
        <ResponsiveContainer width="100%" height="100%">
          <ComposedChart data={data} margin={{ top: 10, right: 20, left: 0, bottom: 0 }}>
            <defs>
              <linearGradient id="socGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#10b981" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
            <XAxis dataKey="time" stroke="#64748b" tick={{ fontSize: 11 }} />
            <YAxis
              yAxisId="left"
              stroke="#10b981"
              tick={{ fontSize: 11 }}
              unit="%"
              domain={[0, 100]}
            />
            <YAxis
              yAxisId="right"
              orientation="right"
              stroke="#06b6d4"
              tick={{ fontSize: 11 }}
              unit=" kW"
              domain={[-20, 30]}
            />
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
              yAxisId="left"
              type="monotone"
              dataKey="socPct"
              name="State of Charge (SOC)"
              stroke="#10b981"
              strokeWidth={2.5}
              fillOpacity={1}
              fill="url(#socGrad)"
            />
            <Bar
              yAxisId="right"
              dataKey="powerKw"
              name="Discharge Power"
              fill="#06b6d4"
              radius={[4, 4, 0, 0]}
              barSize={18}
            />
          </ComposedChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};
