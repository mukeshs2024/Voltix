"use client";

import React from "react";
import { PageContainer, SectionContainer } from "@/components/shared/page-container";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
export function BuildingsSkeleton() {
  return (
    <PageContainer>
      {/* Header Skeleton */}
      <SectionContainer>
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-6">
          <div className="space-y-3">
            <Skeleton className="h-8 w-48 rounded-md" />
            <Skeleton className="h-4 w-72 rounded-md" />
          </div>
          <div className="flex items-center gap-3">
            <Skeleton className="h-10 w-64 rounded-xl" />
            <Skeleton className="h-10 w-24 rounded-xl" />
            <div className="flex gap-1 ml-2">
              <Skeleton className="h-10 w-10 rounded-lg" />
              <Skeleton className="h-10 w-10 rounded-lg" />
            </div>
          </div>
        </div>
      </SectionContainer>

      {/* Grid Skeleton */}
      <SectionContainer className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <Card key={i} className="h-full">
            <CardHeader className="space-y-4 pb-4">
              <div className="flex justify-between items-start">
                <div className="flex gap-3">
                  <Skeleton className="h-12 w-12 rounded-xl" />
                  <div className="space-y-2">
                    <Skeleton className="h-5 w-32 rounded-md" />
                    <Skeleton className="h-3 w-24 rounded-md" />
                  </div>
                </div>
                <Skeleton className="h-6 w-20 rounded-full" />
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-3 gap-4 pb-4 border-b border-[#E5E7EB]">
                <div className="space-y-2">
                  <Skeleton className="h-3 w-16 rounded-md" />
                  <Skeleton className="h-5 w-12 rounded-md" />
                </div>
                <div className="space-y-2">
                  <Skeleton className="h-3 w-16 rounded-md" />
                  <Skeleton className="h-5 w-12 rounded-md" />
                </div>
                <div className="space-y-2">
                  <Skeleton className="h-3 w-16 rounded-md" />
                  <Skeleton className="h-5 w-12 rounded-md" />
                </div>
              </div>
              <div className="flex justify-between items-center pt-2">
                <Skeleton className="h-4 w-32 rounded-md" />
                <Skeleton className="h-8 w-20 rounded-md" />
              </div>
            </CardContent>
          </Card>
        ))}
      </SectionContainer>
    </PageContainer>
  );
}
