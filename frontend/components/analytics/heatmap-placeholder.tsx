"use client";

import React from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { motion } from "framer-motion";

export function HeatmapPlaceholder() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.5 }}
    >
      <Card>
        <CardHeader>
          <CardTitle>Peak Demand Heatmap</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-[180px] w-full rounded-xl overflow-hidden border border-[#E5E7EB] flex flex-col">
            <div className="flex flex-1">
              {[...Array(7)].map((_, dayIndex) => (
                <div key={dayIndex} className="flex-1 flex flex-col border-r border-[#E5E7EB] last:border-0">
                  {[...Array(24)].map((_, hourIndex) => {
                    // Generate a fake intensity based on time of day (peak between 12-18)
                    let intensity = 0;
                    if (hourIndex > 8 && hourIndex < 20) {
                      intensity = Math.random() > 0.5 ? 2 : 1;
                      if (hourIndex >= 12 && hourIndex <= 18) {
                         intensity = Math.random() > 0.3 ? 3 : 2;
                      }
                    }
                    
                    const bgColors = [
                      "bg-[#F3F4F6]", // off-peak
                      "bg-[#DBEAFE]", // low
                      "bg-[#3B82F6]", // med
                      "bg-[#1D4ED8]", // high
                    ];

                    return (
                      <div 
                        key={hourIndex} 
                        className={`flex-1 ${bgColors[intensity]} transition-colors hover:opacity-75`}
                        title={`Day ${dayIndex + 1}, Hour ${hourIndex}: Intensity ${intensity}`}
                      />
                    );
                  })}
                </div>
              ))}
            </div>
            <div className="flex justify-between px-2 py-1 bg-[#FAFAFA] text-[10px] text-[#9CA3AF] font-medium border-t border-[#E5E7EB]">
              <span>Mon</span>
              <span>Wed</span>
              <span>Fri</span>
              <span>Sun</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
