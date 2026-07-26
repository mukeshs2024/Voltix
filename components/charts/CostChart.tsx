'use client';

import React from 'react';
import {
  ResponsiveContainer,
  ComposedChart,
  Area,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from 'recharts';
import { COST_DATA } from '@/data/analytics';
import { DollarSign } from 'lucide-react';

interface CostChartProps {
  data?: typeof COST_DATA;
}

export const CostChart: React.FC<CostChartProps> = ({ data = COST_DATA }) => {
  return (
    <div className="glass-card rounded-2xl p-5 border border-slate-800 space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-base font-bold text-slate-100 flex items-center gap-2">
            <DollarSign className="w-4 h-4 text-emerald-400" /> Utility Tariff & Energy Cost Curve ($)
          </h3>
          <p className="text-xs text-slate-400">
            Real-time TOU pricing rate overlay with hourly energy cost savings
          </p>
        </div>
        <div className="flex items-center gap-3 text-xs font-mono">
          <span className="flex items-center gap-1 text-amber-400">
            <span className="w-2.5 h-2.5 rounded-full bg-amber-400 inline-block" /> TOU Rate ($/kWh)
          </span>
          <span className="flex items-center gap-1 text-emerald-400">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 inline-block" /> AI Cost Curve
          </span>
        </div>
      </div>

      <div className="h-72 w-full pt-2">
        <ResponsiveContainer width="100%" height="100%">
          <ComposedChart data={data} margin={{ top: 10, right: 20, left: 0, bottom: 0 }}>
            <defs>
              <linearGradient id="costGrad" x1="0" y1="0" x2="0" y2="1">
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
              unit=" $"
              domain={[0, 110]}
            />
            <YAxis
              yAxisId="right"
              orientation="right"
              stroke="#fbbf24"
              tick={{ fontSize: 11 }}
              unit=" $"
              domain={[0, 0.6]}
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
            <Line
              yAxisId="right"
              type="stepAfter"
              dataKey="tariffRateUsd"
              name="Utility TOU Tariff ($/kWh)"
              stroke="#fbbf24"
              strokeWidth={2}
              strokeDasharray="4 4"
            />
            <Area
              yAxisId="left"
              type="monotone"
              dataKey="optimizedCostUsd"
              name="AI Optimized Cost"
              stroke="#10b981"
              strokeWidth={2.5}
              fillOpacity={1}
              fill="url(#costGrad)"
            />
            <Line
              yAxisId="left"
              type="monotone"
              dataKey="baselineCostUsd"
              name="Baseline Cost"
              stroke="#f43f5e"
              strokeWidth={2}
            />
          </ComposedChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};
