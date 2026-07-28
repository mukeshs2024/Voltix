"use client";

import React, { useState, useEffect } from "react";
import { PageContainer, SectionContainer } from "@/components/shared/page-container";
import { AlertsSkeleton } from "@/components/alerts/alerts-skeleton";
import { AlertTable, AlertDetail } from "@/components/alerts/alert-table";
import { AlertDrawer } from "@/components/alerts/alert-drawer";
import { PageHeader } from "@/components/shared/page-header";
import { SearchBar } from "@/components/shared/search-bar";
import { FilterBar } from "@/components/shared/filter-bar";
import { EmptyState } from "@/components/shared/empty-state";
import { Button } from "@/components/ui/button";
import { CheckCircle2 } from "lucide-react";

const mockAlerts: AlertDetail[] = [
  { id: "INC-892", title: "Chiller Array Failure", description: "Primary chiller unit 2 operating 40% outside of optimal parameters.", severity: "critical", status: "active", building: "HQ Tower One", system: "HVAC", timestamp: "10 mins ago" },
  { id: "INC-891", title: "Peak Demand Warning", description: "Facility is approaching peak demand threshold. Automated load shedding recommended.", severity: "high", status: "active", building: "East Coast Plaza", system: "Power", timestamp: "45 mins ago" },
  { id: "INC-890", title: "Server Room Temp Deviation", description: "Zone 4 ambient temperature increased by 2.5°C over the last hour.", severity: "medium", status: "active", building: "Westside Data Center", system: "IT", timestamp: "2 hours ago" },
  { id: "INC-889", title: "Lighting Schedule Mismatch", description: "Floor 12 lighting remained active post-occupancy hours.", severity: "low", status: "acknowledged", building: "London Office", system: "Lighting", timestamp: "5 hours ago" },
  { id: "INC-888", title: "Voltage Fluctuation", description: "Minor voltage sag detected on incoming phase B.", severity: "medium", status: "resolved", building: "Innovation Hub", system: "Power", timestamp: "1 day ago" },
];

export default function AlertsPage() {
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedAlert, setSelectedAlert] = useState<AlertDetail | null>(null);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1000);
    return () => clearTimeout(timer);
  }, []);

  const filteredAlerts = mockAlerts.filter(a => 
    a.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
    a.building.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (isLoading) {
    return <AlertsSkeleton />;
  }

  return (
    <PageContainer>
      {/* Page Header */}
      <SectionContainer>
        <PageHeader 
          title="Active Alerts"
          description="Monitor and respond to system anomalies across all facilities."
          actions={
            <>
              <SearchBar 
                value={searchTerm} 
                onChange={setSearchTerm} 
                placeholder="Search incidents..." 
              />
              <div className="flex items-center gap-2 w-full sm:w-auto">
                <FilterBar />
                <Button variant="outline" size="sm" className="h-9 px-3 gap-2 bg-white flex-1 sm:flex-none">
                  <CheckCircle2 className="w-4 h-4 text-[#22C55E]" />
                  <span className="hidden sm:inline">Resolve Selected</span>
                </Button>
              </div>
            </>
          }
        />
      </SectionContainer>

      {/* Main Content Area */}
      <SectionContainer>
        {filteredAlerts.length === 0 ? (
          <EmptyState 
            icon={CheckCircle2}
            iconColorClass="text-[#10B981]"
            iconBgClass="bg-[#ECFDF5]"
            title="No active incidents found"
            description="All systems are currently operating within nominal parameters."
            actionLabel="Clear Search"
            onAction={() => setSearchTerm("")}
          />
        ) : (
          <AlertTable alerts={filteredAlerts} onRowClick={setSelectedAlert} />
        )}
      </SectionContainer>

      <AlertDrawer 
        alert={selectedAlert}
        isOpen={!!selectedAlert}
        onClose={() => setSelectedAlert(null)}
      />
    </PageContainer>
  );
}
