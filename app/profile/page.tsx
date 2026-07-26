'use client';

import React from 'react';
import { User, Award, Zap, Leaf, CheckCircle2, TrendingUp } from 'lucide-react';

export default function ProfilePage() {
  return (
    <div className="max-w-4xl mx-auto pb-16 pt-4 space-y-8">
      <div className="glass-card p-8 rounded-2xl border border-zinc-800 flex flex-col md:flex-row items-center gap-8 relative overflow-hidden">
         <div className="absolute top-0 right-0 w-64 h-64 bg-aiBlue/10 rounded-full blur-3xl pointer-events-none" />
         
         <div className="w-32 h-32 rounded-full bg-zinc-900 border-2 border-zinc-800 flex items-center justify-center relative z-10 shadow-xl">
            <User className="w-12 h-12 text-zinc-500" />
            <div className="absolute bottom-1 right-1 w-6 h-6 bg-emerald-500 rounded-full border-2 border-black flex items-center justify-center">
               <CheckCircle2 className="w-3 h-3 text-white" />
            </div>
         </div>
         <div className="text-center md:text-left relative z-10">
            <h1 className="text-3xl font-bold text-zinc-100 mb-1">Mukesh</h1>
            <p className="text-zinc-400 font-mono text-sm mb-4">Senior Facility Manager • West Campus</p>
            <div className="flex flex-wrap items-center justify-center md:justify-start gap-2">
               <span className="px-3 py-1 bg-amber-500/10 text-amber-500 border border-amber-500/20 rounded-full text-xs font-semibold flex items-center gap-1">
                  <Award className="w-3 h-3" /> Top Optimizer Q2
               </span>
               <span className="px-3 py-1 bg-teal-500/10 text-teal-500 border border-teal-500/20 rounded-full text-xs font-semibold flex items-center gap-1">
                  <Leaf className="w-3 h-3" /> Carbon Hero
               </span>
            </div>
         </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
         {[
            { label: 'Energy Saved', value: '1.2 MWh', icon: Zap, color: 'text-aiBlue' },
            { label: 'Carbon Offset', value: '450 kg', icon: Leaf, color: 'text-teal-500' },
            { label: 'AI Approvals', value: '124', icon: CheckCircle2, color: 'text-emerald-500' },
            { label: 'Accuracy', value: '98.5%', icon: TrendingUp, color: 'text-rose-500' },
         ].map((stat, i) => (
            <div key={i} className="glass-card p-5 rounded-2xl border border-zinc-800 text-center">
               <stat.icon className={`w-6 h-6 mx-auto mb-3 ${stat.color}`} />
               <div className="text-2xl font-bold text-zinc-100 font-mono mb-1">{stat.value}</div>
               <div className="text-[10px] uppercase tracking-wider text-zinc-500 font-semibold">{stat.label}</div>
            </div>
         ))}
      </div>

      <div className="glass-card p-6 rounded-2xl border border-zinc-800">
         <h3 className="text-lg font-semibold text-zinc-100 mb-6">Recent Achievements</h3>
         <div className="space-y-4">
            {[
               { title: 'Peak Demand Master', desc: 'Successfully avoided 5 peak demand spikes in one month.', date: '2 days ago', color: 'bg-rose-500' },
               { title: 'Autonomous Operator', desc: 'Approved 50 AI recommendations with 0 overrides.', date: '1 week ago', color: 'bg-aiBlue' },
               { title: 'Grid Savior', desc: 'Shed 100kW during a critical grid stability event.', date: '3 weeks ago', color: 'bg-emerald-500' },
            ].map((ach, i) => (
               <div key={i} className="flex items-start gap-4 p-4 rounded-xl bg-zinc-900/50 border border-zinc-800/50 hover:bg-zinc-900 transition-colors">
                  <div className={`w-2 h-2 mt-2 rounded-full ${ach.color} shadow-[0_0_10px] shadow-current`} />
                  <div className="flex-1">
                     <div className="flex items-center justify-between mb-1">
                        <h4 className="text-sm font-semibold text-zinc-200">{ach.title}</h4>
                        <span className="text-xs text-zinc-500 font-mono">{ach.date}</span>
                     </div>
                     <p className="text-sm text-zinc-400">{ach.desc}</p>
                  </div>
               </div>
            ))}
         </div>
      </div>
    </div>
  );
}
