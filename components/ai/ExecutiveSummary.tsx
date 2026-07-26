'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { FileText, ShieldCheck, Zap, DollarSign } from 'lucide-react';

export function ExecutiveSummary() {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="glass-card rounded-2xl p-6 border-l-4 border-l-aiBlue relative overflow-hidden"
    >
      <div className="absolute top-0 right-0 w-48 h-48 bg-aiBlue/5 rounded-full blur-3xl pointer-events-none" />
      
      <div className="flex items-start gap-4 relative z-10">
        <div className="p-3 rounded-xl bg-zinc-900 border border-zinc-800">
          <FileText className="w-6 h-6 text-aiBlue" />
        </div>
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-zinc-100 mb-1">Executive Summary</h3>
          <p className="text-sm text-zinc-300 leading-relaxed max-w-3xl mb-4">
            Cloud cover over the west campus will reduce solar generation by <span className="text-amber-500 font-medium">65%</span>. 
            Without intervention the campus would import an additional <span className="text-amber-500 font-medium">55 kW</span> from the grid during peak tariff hours. 
            Voltix identified three optimization opportunities with minimal operational impact.
          </p>
          
          <div className="flex flex-wrap gap-4 mt-2">
             <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-zinc-900 border border-zinc-800">
                <ShieldCheck className="w-4 h-4 text-emerald-500" />
                <span className="text-xs text-zinc-400">Confidence:</span>
                <span className="text-sm font-semibold text-zinc-200">96%</span>
             </div>
             <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-zinc-900 border border-zinc-800">
                <Zap className="w-4 h-4 text-emerald-500" />
                <span className="text-xs text-zinc-400">Estimated Load Saved:</span>
                <span className="text-sm font-semibold text-zinc-200">55 kW</span>
             </div>
             <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-zinc-900 border border-zinc-800">
                <DollarSign className="w-4 h-4 text-emerald-500" />
                <span className="text-xs text-zinc-400">Estimated Cost Avoided:</span>
                <span className="text-sm font-semibold text-zinc-200">$36/hr</span>
             </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
