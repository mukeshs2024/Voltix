"use client";

import React from "react";
import { cn } from "@/lib/utils";

export interface SkeletonProps {
  className?: string;
}

export function Skeleton({ className }: SkeletonProps) {
  return (
    <div
      className={cn("animate-pulse rounded-[12px] bg-[#F3F4F6]", className)}
    />
  );
}
