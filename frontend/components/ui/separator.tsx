"use client";

import React from "react";
import { cn } from "@/lib/utils";

export interface SeparatorProps {
  orientation?: "horizontal" | "vertical";
  className?: string;
}

export function Separator({ orientation = "horizontal", className }: SeparatorProps) {
  return (
    <div
      className={cn(
        "bg-[#E5E7EB] shrink-0 transition-colors",
        orientation === "horizontal" ? "h-px w-full my-4" : "w-px h-full mx-4",
        className
      )}
    />
  );
}
