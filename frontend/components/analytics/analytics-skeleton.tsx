"use client";

import React from "react";
import { PageContainer, SectionContainer } from "@/components/shared/page-container";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export function AnalyticsSkeleton() {
  return (
    <PageContainer>
      <SectionContainer>
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-6">
          <div className="space-y-3">
            <Skeleton className="h-8 w-48 rounded-md" />
            <Skeleton className="h-4 w-72 rounded-md" />
          </div>
          <div className="flex items-center gap-3">
            <Skeleton className="h-10 w-48 rounded-xl" />
            <Skeleton className="h-10 w-32 rounded-xl" />
          </div>
        </div>
      </SectionContainer>

      <SectionContainer className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[1, 2, 3, 4].map((i) => (
          <Card key={i} className="h-full">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <Skeleton className="h-4 w-24 rounded-full" />
              <Skeleton className="h-8 w-8 rounded-xl" />
            </CardHeader>
            <CardContent className="space-y-3">
              <Skeleton className="h-8 w-20 rounded-md" />
              <Skeleton className="h-4 w-32 rounded-md" />
            </CardContent>
          </Card>
        ))}
      </SectionContainer>

      <SectionContainer className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <Skeleton className="h-6 w-48 rounded-md mb-2" />
              <Skeleton className="h-4 w-64 rounded-md" />
            </CardHeader>
            <CardContent>
              <Skeleton className="h-[320px] w-full rounded-xl mt-4" />
            </CardContent>
          </Card>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <Skeleton className="h-6 w-40 rounded-md" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-[240px] w-full rounded-xl" />
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <Skeleton className="h-6 w-40 rounded-md" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-[240px] w-full rounded-xl" />
              </CardContent>
            </Card>
          </div>
        </div>
        
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <Skeleton className="h-6 w-48 rounded-md" />
            </CardHeader>
            <CardContent>
              <Skeleton className="h-[280px] w-full rounded-full" />
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <Skeleton className="h-6 w-48 rounded-md" />
            </CardHeader>
            <CardContent>
              <Skeleton className="h-[180px] w-full rounded-xl" />
            </CardContent>
          </Card>
        </div>
      </SectionContainer>
    </PageContainer>
  );
}
