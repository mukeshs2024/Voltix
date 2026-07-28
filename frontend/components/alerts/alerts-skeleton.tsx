"use client";

import React from "react";
import { PageContainer, SectionContainer } from "@/components/shared/page-container";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export function AlertsSkeleton() {
  return (
    <PageContainer>
      <SectionContainer>
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-6">
          <div className="space-y-3">
            <Skeleton className="h-8 w-48 rounded-md" />
            <Skeleton className="h-4 w-72 rounded-md" />
          </div>
          <div className="flex items-center gap-3">
            <Skeleton className="h-10 w-64 rounded-xl" />
            <Skeleton className="h-10 w-24 rounded-xl" />
          </div>
        </div>
      </SectionContainer>

      <SectionContainer>
        <Card>
          <CardContent className="p-0">
            {/* Table Header */}
            <div className="grid grid-cols-6 gap-4 p-4 border-b border-[#E5E7EB] bg-[#FAFAFA]">
              <Skeleton className="h-4 w-20 rounded-md" />
              <Skeleton className="h-4 w-32 rounded-md col-span-2" />
              <Skeleton className="h-4 w-24 rounded-md" />
              <Skeleton className="h-4 w-24 rounded-md" />
              <Skeleton className="h-4 w-16 rounded-md ml-auto" />
            </div>
            
            {/* Table Rows */}
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="grid grid-cols-6 gap-4 p-4 border-b border-[#E5E7EB] items-center">
                <Skeleton className="h-6 w-24 rounded-full" />
                <div className="col-span-2 space-y-2">
                  <Skeleton className="h-4 w-48 rounded-md" />
                  <Skeleton className="h-3 w-32 rounded-md" />
                </div>
                <Skeleton className="h-4 w-32 rounded-md" />
                <Skeleton className="h-4 w-24 rounded-md" />
                <Skeleton className="h-8 w-8 rounded-md ml-auto" />
              </div>
            ))}
          </CardContent>
        </Card>
      </SectionContainer>
    </PageContainer>
  );
}
