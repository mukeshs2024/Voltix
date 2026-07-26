'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Terminal, CheckCircle2, ChevronRight, Activity } from 'lucide-react';

interface LogEntry {
  id: string;
  time: string;
  message: string;
  status: 'pending' | 'success';
}

const EXECUTION_SEQUENCE = [
  { message: "Recommendation Approved", delay: 0 },
  { message: "Dispatching Command to HVAC Controller", delay: 800 },
  { message: "HVAC Setpoint Adjusted to 24°C", delay: 1500 },
  { message: "Battery Discharging at 20kW", delay: 2200 },
  { message: "Grid Load Reduced by 55kW", delay: 3000 },
  { message: "Optimization Active & Verified", delay: 3500 }
];

export function LiveCommandTerminal({ active = false }: { active?: boolean }) {
  const [logs, setLogs] = useState<LogEntry[]>([]);

  useEffect(() => {
    if (!active) {
      setLogs([]);
      return;
    }

    let timeouts: NodeJS.Timeout[] = [];
    const now = new Date();

    EXECUTION_SEQUENCE.forEach((step, index) => {
      const timeout = setTimeout(() => {
        const timeString = new Date(now.getTime() + step.delay).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
        setLogs(prev => [...prev, { id: `log-${index}`, time: timeString, message: step.message, status: 'success' }]);
      }, step.delay);
      timeouts.push(timeout);
    });

    return () => timeouts.forEach(clearTimeout);
  }, [active]);

  if (!active) return null;

  return (
    <motion.div 
      initial={{ opacity: 0, height: 0 }}
      animate={{ opacity: 1, height: 'auto' }}
      className="glass-card rounded-2xl overflow-hidden border border-zinc-800 font-mono text-xs mt-6"
    >
      <div className="bg-zinc-900 px-4 py-2 border-b border-zinc-800 flex items-center gap-2 text-zinc-400">
        <Terminal className="w-4 h-4 text-aiBlue" /> Live Execution Terminal
      </div>
      <div className="p-4 bg-zinc-950/50 min-h-[120px] max-h-[200px] overflow-y-auto space-y-2">
        <AnimatePresence>
          {logs.map((log) => (
            <motion.div 
              key={log.id}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              className="flex items-start gap-3"
            >
              <span className="text-zinc-500 whitespace-nowrap">[{log.time}]</span>
              <span className="text-aiBlue"><ChevronRight className="w-3 h-3 mt-0.5 inline" /></span>
              <span className="text-zinc-300">{log.message}</span>
              {log.status === 'success' && <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 ml-auto flex-shrink-0" />}
            </motion.div>
          ))}
          {logs.length < EXECUTION_SEQUENCE.length && logs.length > 0 && (
             <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex items-center gap-3 text-zinc-500 pt-1"
             >
                <span className="opacity-0">[{logs[0]?.time}]</span>
                <Activity className="w-3 h-3 animate-pulse text-zinc-400" />
                <span className="animate-pulse">Awaiting telemetry...</span>
             </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}
