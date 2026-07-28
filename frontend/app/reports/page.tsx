"use client";

import React, { useState, useEffect } from "react";
import { PageContainer, SectionContainer } from "@/components/shared/page-container";
import { ReportsSkeleton } from "@/components/reports/reports-skeleton";
import { ReportCard, ReportDetail } from "@/components/reports/report-card";
import { ReportPreviewDrawer } from "@/components/reports/report-preview-drawer";
import { PageHeader } from "@/components/shared/page-header";
import { SearchBar } from "@/components/shared/search-bar";
import { FilterBar } from "@/components/shared/filter-bar";
import { EmptyState } from "@/components/shared/empty-state";
import { Button } from "@/components/ui/button";
import { Plus, Search } from "lucide-react";

const mockReports: ReportDetail[] = [
  { id: "REP-01", title: "Monthly Portfolio Overview - Oct 2026", description: "Comprehensive summary of energy consumption, AI optimizations, and alerts across all monitored facilities.", category: "Monthly", date: "Nov 1, 2026", size: "2.4 MB" },
  { id: "REP-02", title: "Carbon Abatement Q3", description: "Detailed breakdown of CO2 emissions avoided vs baseline through automated load shifting.", category: "Carbon", date: "Oct 15, 2026", size: "1.1 MB" },
  { id: "REP-03", title: "Peak Demand Savings Analysis", description: "Financial report detailing cost savings from peak demand avoidance algorithms during summer months.", category: "Savings", date: "Oct 5, 2026", size: "3.5 MB" },
  { id: "REP-04", title: "HVAC Efficiency Audit", description: "System-level analysis of chiller performance and recommended maintenance schedules.", category: "Energy", date: "Sep 28, 2026", size: "1.8 MB" },
  { id: "REP-05", title: "Monthly Portfolio Overview - Sep 2026", description: "Comprehensive summary of energy consumption, AI optimizations, and alerts across all monitored facilities.", category: "Monthly", date: "Oct 1, 2026", size: "2.3 MB" },
  { id: "REP-06", title: "ESG Compliance Export", description: "Standardized data export for corporate ESG reporting and regulatory compliance.", category: "Carbon", date: "Sep 15, 2026", size: "0.8 MB" },
];

export default function ReportsPage() {
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedReport, setSelectedReport] = useState<ReportDetail | null>(null);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1000);
    return () => clearTimeout(timer);
  }, []);

  const filteredReports = mockReports.filter(r => 
    r.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
    r.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (isLoading) {
    return <ReportsSkeleton />;
  }

  return (
    <PageContainer>
      {/* Page Header */}
      <SectionContainer>
        <PageHeader 
          title="Reports & Exports"
          description="Generate and download comprehensive sustainability and operational reports."
          actions={
            <>
              <SearchBar 
                value={searchTerm} 
                onChange={setSearchTerm} 
                placeholder="Search reports..." 
              />
              <div className="flex items-center gap-2 w-full sm:w-auto">
                <FilterBar />
                <Button variant="primary" size="sm" className="h-9 px-3 gap-2 bg-[#111827] text-white flex-1 sm:flex-none border-none shadow-sm hover:bg-[#374151]">
                  <Plus className="w-4 h-4" />
                  <span>Generate Report</span>
                </Button>
              </div>
            </>
          }
        />
      </SectionContainer>

      {/* Main Content Area */}
      <SectionContainer>
        {filteredReports.length === 0 ? (
          <EmptyState 
            icon={Search}
            title="No reports found"
            description="Try adjusting your search criteria."
            actionLabel="Clear Search"
            onAction={() => setSearchTerm("")}
          />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredReports.map((report, idx) => (
              <ReportCard 
                key={report.id} 
                report={report} 
                onPreview={setSelectedReport}
                index={idx}
              />
            ))}
          </div>
        )}
      </SectionContainer>

      <ReportPreviewDrawer 
        report={selectedReport}
        isOpen={!!selectedReport}
        onClose={() => setSelectedReport(null)}
      />
    </PageContainer>
  );
}
