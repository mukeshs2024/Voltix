"use client";

import React from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowRight, Bot, Zap, Settings, ShieldAlert } from "lucide-react";
import { motion } from "framer-motion";

export function ActivityTimeline() {
  const activities = [
    {
      id: "1",
      title: "AI Optimization Applied: Chiller setpoint adjusted",
      time: "10m",
      icon: Bot,
      color: "text-[#2563EB]",
      bg: "bg-[#2563EB]/10"
    },
    {
      id: "2",
      title: "Demand Spike Detected: East Coast Plaza",
      time: "45m",
      icon: Zap,
      color: "text-[#F59E0B]",
      bg: "bg-[#F59E0B]/10"
    },
    {
      id: "3",
      title: "Security Scan Completed",
      time: "1h",
      icon: ShieldAlert,
      color: "text-[#3B82F6]",
      bg: "bg-[#3B82F6]/10"
    },
    {
      id: "4",
      title: "System Update: Firmware v2.4 installed",
      time: "2h",
      icon: Settings,
      color: "text-[#6B7280]",
      bg: "bg-[#F3F4F6]"
    }
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.4 }}
    >
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Recent Activity</CardTitle>
          <Button variant="ghost" size="sm" className="h-8">
            History <ArrowRight className="w-3.5 h-3.5 ml-1" />
          </Button>
        </CardHeader>
        <CardContent>
          <div className="relative border-l-2 border-[#E5E7EB] ml-3 pl-6 space-y-7 pb-2">
            {activities.map((activity, idx) => {
              const Icon = activity.icon;
              return (
                <motion.div 
                  key={activity.id} 
                  className="relative group"
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.4, delay: 0.5 + (idx * 0.1) }}
                >
                  <div className={`absolute -left-[35px] p-1.5 rounded-full border-4 border-white ${activity.bg} shadow-xs z-10 transition-transform group-hover:scale-110`}>
                    <Icon className={`w-3.5 h-3.5 ${activity.color}`} />
                  </div>
                  <div>
                    <h4 className="text-sm font-semibold text-[#111827] flex items-center justify-between group-hover:text-[#2563EB] transition-colors">
                      <span>{activity.title}</span>
                      <span className="text-xs text-[#9CA3AF] font-medium">{activity.time}</span>
                    </h4>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
