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
      title: "AI Optimization Applied",
      description: "Chiller setpoint adjusted by +1.5°F",
      time: "10 mins ago",
      icon: Bot,
      color: "text-[#22C55E]",
      bg: "bg-[#22C55E]/10"
    },
    {
      id: "2",
      title: "Demand Spike Detected",
      description: "East Coast Plaza exceeded 2.0 MW threshold",
      time: "45 mins ago",
      icon: Zap,
      color: "text-[#F59E0B]",
      bg: "bg-[#F59E0B]/10"
    },
    {
      id: "3",
      title: "Security Scan Completed",
      description: "No anomalies found in Node 3 network traffic",
      time: "1 hour ago",
      icon: ShieldAlert,
      color: "text-[#3B82F6]",
      bg: "bg-[#3B82F6]/10"
    },
    {
      id: "4",
      title: "System Update",
      description: "Firmware v2.4 installed on Edge Nodes",
      time: "2 hours ago",
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
                    <h4 className="text-sm font-semibold text-[#111827] group-hover:text-[#22C55E] transition-colors">{activity.title}</h4>
                    <p className="text-xs text-[#4B5563] mt-0.5 leading-relaxed">{activity.description}</p>
                    <p className="text-[10px] text-[#9CA3AF] mt-1.5 font-bold uppercase tracking-wider">{activity.time}</p>
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
