"use client";

import React from "react";
import { PageContainer, SectionContainer } from "@/components/shared/page-container";
import { EmptyState } from "@/components/ui/empty-state";
import { Skeleton } from "@/components/ui/skeleton";
import { Building2 } from "lucide-react";

export default function BuildingsPage() {
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
          <h1 className="text-2xl font-bold text-[#111827] tracking-tight">Buildings Portfolio</h1>
          <p className="text-sm text-[#6B7280] mt-1">
            Manage facility nodes, real-time energy draw, and operational alerts.
          </p>
        </div>
      </SectionContainer>

      <SectionContainer>
        {isLoading ? (
          <div className="space-y-4">
            <Skeleton className="h-[400px] w-full" />
            <Skeleton className="h-20 w-full" />
          </div>
        ) : (
          <EmptyState
            title="Buildings Module Uninitialized"
            description="Phase 4 will construct the detailed building cards, analytics drawers, and status grid."
            icon={<Building2 className="w-8 h-8 text-[#6B7280]" />}
          />
        )}
      </SectionContainer>
    </PageContainer>
  );
}
