"use client";

import React from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowRight, Bot, Zap, Settings } from "lucide-react";

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
      title: "System Update",
      description: "Firmware v2.4 installed on Edge Nodes",
      time: "2 hours ago",
      icon: Settings,
      color: "text-[#6B7280]",
      bg: "bg-[#F3F4F6]"
    }
  ];

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Recent Activity</CardTitle>
        <Button variant="ghost" size="sm" className="h-8">
          History <ArrowRight className="w-3.5 h-3.5 ml-1" />
        </Button>
      </CardHeader>
      <CardContent>
        <div className="relative border-l border-[#E5E7EB] ml-3 pl-5 space-y-6">
          {activities.map((activity) => {
            const Icon = activity.icon;
            return (
              <div key={activity.id} className="relative">
                <div className={`absolute -left-[30px] p-1.5 rounded-full border-2 border-white ${activity.bg}`}>
                  <Icon className={`w-3.5 h-3.5 ${activity.color}`} />
                </div>
                <div>
                  <h4 className="text-sm font-semibold text-[#111827]">{activity.title}</h4>
                  <p className="text-xs text-[#4B5563] mt-0.5">{activity.description}</p>
                  <p className="text-[10px] text-[#6B7280] mt-1.5 font-medium">{activity.time}</p>
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
