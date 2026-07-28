"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { MoreHorizontal, AlertTriangle, Clock, Server, Thermometer, Zap } from "lucide-react";
import { DataTable, Column } from "@/components/shared/data-table";

export type AlertSeverity = "critical" | "high" | "medium" | "low";
export type AlertStatus = "active" | "acknowledged" | "resolved";

export interface AlertDetail {
  id: string;
  title: string;
  description: string;
  severity: AlertSeverity;
  status: AlertStatus;
  building: string;
  system: "HVAC" | "Power" | "IT" | "Lighting";
  timestamp: string;
}

interface AlertTableProps {
  alerts: AlertDetail[];
  onRowClick: (alert: AlertDetail) => void;
}

export function AlertTable({ alerts, onRowClick }: AlertTableProps) {
  
  const getSeverityBadge = (severity: AlertSeverity) => {
    const styles = {
      critical: "bg-[#FEF2F2] text-[#B91C1C] border-[#FCA5A5]",
      high: "bg-[#FFF7ED] text-[#C2410C] border-[#FDBA74]",
      medium: "bg-[#FEFCE8] text-[#A16207] border-[#FEF08A]",
      low: "bg-[#F3F4F6] text-[#374151] border-[#D1D5DB]"
    };
    return (
      <span className={`px-2.5 py-1 text-[10px] uppercase font-bold tracking-wider rounded-full border ${styles[severity]}`}>
        {severity}
      </span>
    );
  };

  const getSystemIcon = (system: string) => {
    switch(system) {
      case "HVAC": return <Thermometer className="w-4 h-4 text-[#6B7280]" />;
      case "Power": return <Zap className="w-4 h-4 text-[#6B7280]" />;
      case "IT": return <Server className="w-4 h-4 text-[#6B7280]" />;
      default: return <AlertTriangle className="w-4 h-4 text-[#6B7280]" />;
    }
  };

  const columns: Column<AlertDetail>[] = [
    {
      header: "Severity",
      className: "whitespace-nowrap",
      accessor: (alert) => getSeverityBadge(alert.severity),
    },
    {
      header: "Incident Details",
      accessor: (alert) => (
        <>
          <div className="font-semibold text-[#111827]">{alert.title}</div>
          <div className="text-xs text-[#6B7280] mt-0.5 truncate max-w-[300px]">{alert.description}</div>
        </>
      ),
    },
    {
      header: "Facility & System",
      className: "whitespace-nowrap",
      accessor: (alert) => (
        <>
          <div className="font-medium text-[#111827]">{alert.building}</div>
          <div className="text-xs text-[#6B7280] mt-0.5 flex items-center gap-1">
            {getSystemIcon(alert.system)} {alert.system}
          </div>
        </>
      ),
    },
    {
      header: "Timestamp",
      className: "whitespace-nowrap text-[#6B7280]",
      accessor: (alert) => (
        <div className="flex items-center gap-1.5 mt-2">
          <Clock className="w-3.5 h-3.5" />
          {alert.timestamp}
        </div>
      ),
    },
    {
      header: "Actions",
      className: "text-right",
      accessor: () => (
        <Button variant="ghost" size="sm" className="h-8 w-8 p-0 text-[#9CA3AF] group-hover:text-[#111827]">
          <MoreHorizontal className="w-4 h-4" />
        </Button>
      ),
    }
  ];

  return <DataTable data={alerts} columns={columns} onRowClick={onRowClick} />;
}
