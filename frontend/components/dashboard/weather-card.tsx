"use client";

import React from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { CloudRain, Sun, Wind, Thermometer, Cloud, Sunrise, Sunset } from "lucide-react";
import { motion } from "framer-motion";
import { Badge } from "@/components/ui/badge";

export function WeatherCard() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.3 }}
    >
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Regional Grid Weather</CardTitle>
          <Badge variant="accent" className="bg-blue-50 text-blue-700 border-blue-200">
            Clear Forecast
          </Badge>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-4 mb-6">
            <motion.div 
              whileHover={{ rotate: 15 }}
              className="w-14 h-14 bg-gradient-to-br from-blue-50 to-blue-100 rounded-full flex items-center justify-center shadow-inner"
            >
              <Sun className="w-7 h-7 text-blue-500" />
            </motion.div>
            <div>
              <div className="text-4xl font-bold text-[#111827] tracking-tighter">72°F</div>
              <div className="text-sm font-medium text-[#6B7280]">San Francisco, CA</div>
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-y-5 gap-x-4 pt-5 border-t border-[#E5E7EB]">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-[#F3F4F6] rounded-lg">
                <Thermometer className="w-4 h-4 text-[#4B5563]" />
              </div>
              <div>
                <div className="text-[10px] uppercase font-bold text-[#6B7280]">Humidity</div>
                <div className="text-sm font-semibold text-[#111827]">45%</div>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="p-2 bg-[#F3F4F6] rounded-lg">
                <Wind className="w-4 h-4 text-[#4B5563]" />
              </div>
              <div>
                <div className="text-[10px] uppercase font-bold text-[#6B7280]">Wind</div>
                <div className="text-sm font-semibold text-[#111827]">12 mph N</div>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="p-2 bg-[#F3F4F6] rounded-lg">
                <Cloud className="w-4 h-4 text-[#4B5563]" />
              </div>
              <div>
                <div className="text-[10px] uppercase font-bold text-[#6B7280]">Cloud Cover</div>
                <div className="text-sm font-semibold text-[#111827]">10%</div>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="p-2 bg-[#F3F4F6] rounded-lg">
                <CloudRain className="w-4 h-4 text-[#4B5563]" />
              </div>
              <div>
                <div className="text-[10px] uppercase font-bold text-[#6B7280]">Rain Chance</div>
                <div className="text-sm font-semibold text-[#111827]">0%</div>
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between mt-5 pt-5 border-t border-[#E5E7EB] px-2">
            <div className="flex flex-col items-center gap-1">
              <Sunrise className="w-5 h-5 text-[#F59E0B]" />
              <span className="text-xs font-semibold text-[#4B5563]">06:24 AM</span>
            </div>
            <div className="h-px bg-[#E5E7EB] flex-1 mx-4" />
            <div className="flex flex-col items-center gap-1">
              <Sunset className="w-5 h-5 text-[#6366F1]" />
              <span className="text-xs font-semibold text-[#4B5563]">07:45 PM</span>
            </div>
          </div>
          
          <div className="mt-5 p-3.5 bg-gradient-to-r from-[#22C55E]/10 to-transparent rounded-[12px] border border-[#22C55E]/20 flex items-start gap-3">
            <Sun className="w-4 h-4 text-[#22C55E] mt-0.5 shrink-0" />
            <div className="text-xs text-[#4B5563] leading-relaxed">
              <span className="font-semibold text-[#111827]">AI Forecast:</span> Optimal conditions for solar generation. HVAC load expected to remain low until 14:00.
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
