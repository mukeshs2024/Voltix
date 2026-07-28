"use client";

import React from "react";
import { PageContainer, SectionContainer } from "@/components/shared/page-container";
import { EmptyState } from "@/components/ui/empty-state";
import { Skeleton } from "@/components/ui/skeleton";
import { BarChart3 } from "lucide-react";

export default function AnalyticsPage() {
  const [isLoading, setIsLoading] = React.useState(true);

  React.useEffect(() => {
    // Simulate loading state for skeleton
    const timer = setTimeout(() => setIsLoading(false), 1000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <PageContainer>
      <SectionContainer>
        <div>
          <h1 className="text-2xl font-bold text-[#111827] tracking-tight">Analytics & Insights</h1>
          <p className="text-sm text-[#6B7280] mt-1">
            Deep dive into energy consumption, carbon reduction, and savings trends.
          </p>
        </div>
      </SectionContainer>

      <SectionContainer>
        {isLoading ? (
          <div className="space-y-4">
            <Skeleton className="h-[200px] w-full" />
            <Skeleton className="h-[200px] w-full" />
          </div>
        ) : (
          <EmptyState
            title="Analytics Module Uninitialized"
            description="Phase 5 will construct advanced Recharts components for multi-metric comparison."
            icon={<BarChart3 className="w-8 h-8 text-[#6B7280]" />}
          />
        )}
      </SectionContainer>
    </PageContainer>
  );
}
