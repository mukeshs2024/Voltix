"use client";

import React from "react";
import { cn } from "@/lib/utils";

interface LoadingSkeletonProps {
  className?: string;
  height?: string | number;
  width?: string | number;
  rounded?: string;
}

export function LoadingSkeleton({
  className,
  height,
  width,
  rounded = "rounded-lg",
}: LoadingSkeletonProps) {
  return (
    <div
      className={cn("bg-gray-200/80 animate-pulse", rounded, className)}
      style={{
        height: height ?? undefined,
        width: width ?? undefined,
      }}
    />
  );
}
