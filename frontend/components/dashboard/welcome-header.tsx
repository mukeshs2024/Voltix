"use client";

import React from "react";
import { MapPin } from "lucide-react";
import { motion } from "framer-motion";

export function WelcomeHeader() {
  return (
    <motion.div 
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="flex flex-col md:flex-row md:items-end justify-between gap-6 bg-white border border-[#E5E7EB] rounded-voltix p-6 shadow-sm"
    >
      <div>
        <h1 className="text-3xl font-bold text-[#111827] tracking-tight">
          Facility Operations Overview
        </h1>
        <p className="text-sm text-[#4B5563] mt-2 flex items-center gap-2">
          <MapPin className="w-4 h-4 text-[#6B7280]" />
          <span>Real-time autonomous facility optimization active across <strong>3</strong> campus nodes.</span>
        </p>
      </div>
    </motion.div>
  );
}
