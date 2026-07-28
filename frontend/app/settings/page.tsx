"use client";

import React from "react";
import { PageContainer, SectionContainer } from "@/components/shared/page-container";
import { EmptyState } from "@/components/ui/empty-state";
import { Skeleton } from "@/components/ui/skeleton";
import { Settings } from "lucide-react";

export default function SettingsPage() {
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
          <h1 className="text-2xl font-bold text-[#111827] tracking-tight">System Settings</h1>
          <p className="text-sm text-[#6B7280] mt-1">
            Manage global preferences, notifications, and Voltix integrations.
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
            title="Settings Module Uninitialized"
            description="Phase 7 will construct the Settings interface including Appearance and Notifications tabs."
            icon={<Settings className="w-8 h-8 text-[#6B7280]" />}
          />
        )}
      </SectionContainer>
    </PageContainer>
  );
}
