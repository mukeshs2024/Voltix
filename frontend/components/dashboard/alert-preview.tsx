"use client";

import React from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Clock, ArrowRight } from "lucide-react";
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
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Badge variant={
                      alert.severity === 'critical' ? 'danger' :
                      alert.severity === 'high' ? 'warning' : 'neutral'
                    }>
                      {alert.severity.toUpperCase()}
                    </Badge>
                    <h4 className="text-sm font-semibold text-[#111827]">{alert.title}</h4>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className="text-xs text-[#6B7280] flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {alert.timestamp}
                    </span>
                    <Button variant="ghost" size="sm" className="h-6 px-2 text-[#2563EB] hover:text-[#1D4ED8]">
                      View
                    </Button>
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
