"use client";

import React from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { AlertTriangle, Clock, ArrowRight } from "lucide-react";
import { AlertItem } from "@/types";
import { motion } from "framer-motion";

export function AlertPreview({ alerts }: { alerts: AlertItem[] }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.3 }}
    >
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Active Incidents</CardTitle>
          <Button variant="ghost" size="sm" className="h-8">
            View All <ArrowRight className="w-3.5 h-3.5 ml-1" />
          </Button>
        </CardHeader>
        <CardContent className="space-y-3">
          {alerts.length === 0 ? (
            <div className="text-center py-6 text-sm text-[#6B7280]">
              No active incidents detected.
            </div>
          ) : (
            alerts.map((alert) => (
              <div
                key={alert.id}
                className="p-3 border border-[#E5E7EB] rounded-[12px] hover:border-[#D1D5DB] transition-all hover:-translate-y-0.5 cursor-pointer group bg-[#FAFAFA]"
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-3">
                    <div className={`p-2 rounded-lg mt-0.5 ${
                      alert.severity === 'critical' ? 'bg-[#EF4444]/10 text-[#EF4444]' :
                      alert.severity === 'high' ? 'bg-[#F59E0B]/10 text-[#F59E0B]' :
                      'bg-[#F3F4F6] text-[#6B7280]'
                    }`}>
                      <AlertTriangle className="w-4 h-4" />
                    </div>
                    <div>
                      <h4 className="text-sm font-semibold text-[#111827]">{alert.title}</h4>
                      <p className="text-xs text-[#6B7280] mt-1 flex items-center gap-1.5">
                        <span className="font-medium text-[#4B5563]">{alert.buildingName}</span>
                        <span>•</span>
                        <span>{alert.system}</span>
                      </p>
                    </div>
                  </div>
                  <div className="flex flex-col items-end gap-2">
                    <Badge variant={
                      alert.severity === 'critical' ? 'danger' :
                      alert.severity === 'high' ? 'warning' : 'neutral'
                    }>
                      {alert.severity.toUpperCase()}
                    </Badge>
                    <span className="text-[10px] text-[#6B7280] flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {alert.timestamp}
                    </span>
                  </div>
                </div>
              </div>
            ))
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
}
