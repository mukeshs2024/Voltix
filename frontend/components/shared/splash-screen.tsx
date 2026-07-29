"use client";

import React, { useEffect, useState } from "react";
import { Zap, ShieldCheck, Cpu, ArrowRight } from "lucide-react";
import { motion, useReducedMotion } from "framer-motion";

interface SplashScreenProps {
  onEnter?: () => void;
}

export function SplashScreen({ onEnter }: SplashScreenProps) {
  const shouldReduceMotion = useReducedMotion();
  const [readinessStep, setReadinessStep] = useState(0);

  const steps = [
    "Verifying Autonomous Core Architecture...",
    "Connecting Real-Time Telemetry Bus...",
    "Synchronizing Multi-Agent Consensus Mesh...",
    "Ecosystem Initialization Ready",
  ];

  useEffect(() => {
    const timer1 = setTimeout(() => setReadinessStep(1), 600);
    const timer2 = setTimeout(() => setReadinessStep(2), 1200);
    const timer3 = setTimeout(() => setReadinessStep(3), 1800);
    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
      clearTimeout(timer3);
    };
  }, []);

  return (
    <div className="min-h-screen w-full bg-gray-900 flex items-center justify-center p-4 text-white">
      <motion.div
        initial={{ opacity: 0, scale: shouldReduceMotion ? 1 : 0.96 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.4 }}
        className="w-full max-w-lg bg-gray-800/90 border border-gray-700/80 rounded-2xl p-8 shadow-2xl backdrop-blur-md text-center flex flex-col items-center"
      >
        {/* Brand Logo */}
        <motion.div
          animate={shouldReduceMotion ? undefined : { scale: [1, 1.05, 1] }}
          transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
          className="w-16 h-16 rounded-2xl bg-blue-600 flex items-center justify-center text-white shadow-lg mb-4"
        >
          <Zap className="w-9 h-9" />
        </motion.div>

        {/* Title */}
        <h1 className="text-[28px] font-bold tracking-tight text-white mb-1">VOLTIX</h1>
        <p className="text-[13px] text-gray-400 font-medium uppercase tracking-widest mb-6">
          Autonomous Building Energy Optimization Platform
        </p>

        {/* Readiness Sequence */}
        <div className="w-full bg-gray-900/80 rounded-xl p-4 border border-gray-700/60 mb-6 text-left space-y-2">
          <div className="flex items-center justify-between text-[11px] font-semibold text-gray-400 mb-1">
            <span className="flex items-center gap-1.5">
              <Cpu className="w-3.5 h-3.5 text-blue-400" /> System Diagnostics
            </span>
            <span className="text-blue-400">{Math.min(100, (readinessStep + 1) * 25)}%</span>
          </div>

          <div className="h-1.5 w-full bg-gray-800 rounded-full overflow-hidden mb-3">
            <motion.div
              className="h-full bg-blue-500 rounded-full"
              initial={{ width: "0%" }}
              animate={{ width: `${Math.min(100, (readinessStep + 1) * 25)}%` }}
              transition={{ duration: 0.4 }}
            />
          </div>

          <p className="text-[12px] text-gray-300 font-mono transition-all">
            {steps[readinessStep]}
          </p>
        </div>

        {/* Action Button */}
        <button
          onClick={onEnter}
          className="w-full h-[44px] bg-blue-600 hover:bg-blue-500 text-white font-semibold text-[14px] rounded-xl transition-all flex items-center justify-center gap-2 shadow-lg shadow-blue-600/20 cursor-pointer"
        >
          <span>Launch Scenario Center</span>
          <ArrowRight className="w-4 h-4" />
        </button>

        <div className="flex items-center gap-1.5 text-[11px] text-gray-500 mt-4">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
          <span>Enterprise Read-Only Telemetry Layer Verified</span>
        </div>
      </motion.div>
    </div>
  );
}
