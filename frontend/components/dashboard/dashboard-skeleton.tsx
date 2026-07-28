"use client";

import React from "react";
import { PageContainer, SectionContainer } from "@/components/shared/page-container";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
export function DashboardSkeleton() {
  return (
    <PageContainer>
      {/* Header Skeleton */}
      <SectionContainer>
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 bg-white border border-[#E5E7EB] rounded-[24px] p-6 shadow-sm">
          <div className="space-y-4">
            <Skeleton className="h-4 w-32 rounded-full" />
            <Skeleton className="h-8 w-64 rounded-md" />
            <Skeleton className="h-4 w-80 rounded-md" />
          </div>
          <div className="flex gap-3">
            <Skeleton className="h-9 w-32 rounded-[12px]" />
            <Skeleton className="h-9 w-40 rounded-[12px]" />
          </div>
        </div>
      </SectionContainer>

      {/* KPI Cards Skeleton */}
      <SectionContainer className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[1, 2, 3, 4].map((i) => (
          <Card key={i} className="h-full">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <Skeleton className="h-4 w-24 rounded-full" />
              <Skeleton className="h-8 w-8 rounded-xl" />
            </CardHeader>
            <CardContent className="space-y-3">
              <Skeleton className="h-8 w-20 rounded-md" />
              <div className="flex gap-2">
                <Skeleton className="h-4 w-12 rounded-md" />
                <Skeleton className="h-4 w-24 rounded-md" />
              </div>
            </CardContent>
          </Card>
        ))}
      </SectionContainer>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
        <div className="xl:col-span-2 space-y-8">
          {/* Chart Skeleton */}
          <SectionContainer>
            <Card>
              <CardHeader className="flex flex-row items-start justify-between">
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <Skeleton className="h-6 w-48 rounded-md" />
                    <Skeleton className="h-5 w-24 rounded-full" />
                  </div>
                  <Skeleton className="h-4 w-64 rounded-md" />
                </div>
                <Skeleton className="h-8 w-32 rounded-md" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-[320px] w-full rounded-[12px] mt-4" />
              </CardContent>
            </Card>
          </SectionContainer>
          
          {/* Table Skeleton */}
          <SectionContainer>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <div className="space-y-3">
                  <Skeleton className="h-6 w-48 rounded-md" />
                  <Skeleton className="h-4 w-64 rounded-md" />
                </div>
                <div className="flex gap-3">
                  <Skeleton className="h-9 w-48 rounded-[12px]" />
                  <Skeleton className="h-9 w-9 rounded-[12px]" />
                </div>
              </CardHeader>
              <CardContent>
                <Skeleton className="h-[240px] w-full rounded-[12px]" />
              </CardContent>
            </Card>
          </SectionContainer>
        </div>
        
        <div className="space-y-8">
          {/* Weather Skeleton */}
          <SectionContainer>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <Skeleton className="h-6 w-32 rounded-md" />
                <Skeleton className="h-5 w-24 rounded-full" />
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex gap-4">
                  <Skeleton className="h-14 w-14 rounded-full" />
                  <div className="space-y-2">
                    <Skeleton className="h-10 w-24 rounded-md" />
                    <Skeleton className="h-4 w-32 rounded-md" />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  {[1,2,3,4].map(i => <Skeleton key={i} className="h-12 w-full rounded-lg" />)}
                </div>
              </CardContent>
            </Card>
          </SectionContainer>

          {/* Quick Actions Skeleton */}
          <SectionContainer>
            <Card>
              <CardHeader>
                <Skeleton className="h-6 w-32 rounded-md" />
              </CardHeader>
              <CardContent className="grid grid-cols-2 gap-4">
                {[1,2,3,4].map(i => <Skeleton key={i} className="h-[84px] w-full rounded-[12px]" />)}
              </CardContent>
            </Card>
          </SectionContainer>
        </div>
      </div>
    </PageContainer>
  );
}
