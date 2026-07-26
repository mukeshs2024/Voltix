import React from 'react';
import Link from 'next/link';
import { DigitalTwin } from '@/components/dashboard/DigitalTwin';
import { ArrowRight, CloudRain, ShieldCheck } from 'lucide-react';

export default function Home() {
  return (
    <div className="space-y-8 pb-16 pt-4">
      {/* Hero Section */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
        <div>
          <h1 className="text-4xl font-light tracking-tight text-zinc-100 mb-2">
            Good Morning, <span className="font-semibold">Mukesh</span>
          </h1>
          <div className="flex items-center gap-3 text-sm">
            <span className="flex items-center gap-1.5 text-emerald-500 bg-emerald-500/10 px-2.5 py-1 rounded-full border border-emerald-500/20">
              <ShieldCheck className="w-4 h-4" /> Campus Status: Healthy
            </span>
            <span className="text-zinc-500 font-mono">System fully operational</span>
          </div>
        </div>

        {/* AI Insight Card */}
        <div className="glass-card p-5 rounded-2xl w-full md:w-auto max-w-sm border-aiBlue/30 relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-32 h-32 bg-aiBlue/10 rounded-full blur-2xl group-hover:bg-aiBlue/20 transition-colors" />
          <div className="flex items-start gap-3 relative z-10">
            <div className="p-2 rounded-xl bg-zinc-900 border border-zinc-800">
              <CloudRain className="w-5 h-5 text-aiBlue" />
            </div>
            <div>
              <div className="text-xs font-semibold uppercase tracking-wider text-aiBlue mb-1">Voltix AI Insight</div>
              <p className="text-sm text-zinc-200">Cloud cover detected. Predicted solar reduction <span className="text-amber-500 font-bold">65%</span></p>
              
              <div className="mt-3 flex gap-4 text-xs font-mono text-zinc-400">
                <div>Savings: <span className="text-emerald-400">55 kW</span></div>
                <div>Cost Avoided: <span className="text-emerald-400">$36/hr</span></div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Actions */}
      <div className="flex gap-4">
        <Link 
          href="/ai-center"
          className="px-6 py-3 rounded-xl bg-zinc-100 hover:bg-white text-black font-semibold text-sm transition-all flex items-center gap-2 shadow-[0_0_20px_rgba(255,255,255,0.1)] hover:shadow-[0_0_30px_rgba(255,255,255,0.2)]"
        >
          Analyze Building <ArrowRight className="w-4 h-4" />
        </Link>
        <button className="px-6 py-3 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-zinc-300 font-medium text-sm border border-zinc-800 transition-all">
          View Detailed Reports
        </button>
      </div>

      {/* Digital Twin Section */}
      <div className="pt-4">
        <DigitalTwin />
      </div>
    </div>
  );
}
