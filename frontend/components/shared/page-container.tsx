"use client";

import React from "react";
import { cn } from "@/lib/utils";

export interface PageContainerProps {
  children: React.ReactNode;
  className?: string;
}

export function PageContainer({ children, className }: PageContainerProps) {
  return (
    <div className={cn("space-y-8 max-w-7xl mx-auto w-full", className)}>
      {children}
    </div>
  );
}

export function SectionContainer({ children, className }: { children: React.ReactNode; className?: string }) {
  return <section className={cn("space-y-4", className)}>{children}</section>;
}
