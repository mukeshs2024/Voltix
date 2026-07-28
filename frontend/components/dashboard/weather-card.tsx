"use client";

import React from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { CloudRain, Sun, Wind, Thermometer } from "lucide-react";

export function WeatherCard() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Regional Grid Weather</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-blue-50 rounded-full flex items-center justify-center">
              <Sun className="w-6 h-6 text-blue-500" />
            </div>
            <div>
              <div className="text-3xl font-bold text-[#111827]">72°F</div>
              <div className="text-sm text-[#6B7280]">Clear, San Francisco</div>
            </div>
          </div>
        </div>
        
        <div className="grid grid-cols-2 gap-4 pt-4 border-t border-[#E5E7EB]">
          <div className="flex items-center gap-2">
            <Thermometer className="w-4 h-4 text-[#6B7280]" />
            <div>
              <div className="text-xs text-[#6B7280]">Humidity</div>
              <div className="text-sm font-semibold text-[#111827]">45%</div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Wind className="w-4 h-4 text-[#6B7280]" />
            <div>
              <div className="text-xs text-[#6B7280]">Wind</div>
              <div className="text-sm font-semibold text-[#111827]">12 mph N</div>
            </div>
          </div>
        </div>
        
        <div className="mt-4 p-3 bg-[#FAFAFA] rounded-[12px] border border-[#E5E7EB] flex items-start gap-3">
          <CloudRain className="w-4 h-4 text-[#22C55E] mt-0.5 shrink-0" />
          <div className="text-xs text-[#4B5563]">
            <span className="font-semibold text-[#111827]">AI Forecast:</span> Optimal conditions for solar generation. HVAC load expected to remain low until 14:00.
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
