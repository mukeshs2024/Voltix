"use client";

import React from "react";
import { cn } from "@/lib/utils";
import { AlertOctagon, RotateCw } from "lucide-react";
import { Button } from "@/components/ui/button";

export interface ErrorStateProps {
  title?: string;
  description?: string;
  onRetry?: () => void;
  className?: string;
}

export function ErrorState({
  title = "Something went wrong",
  description = "Failed to load telemetry data. Please try again or contact support if the issue persists.",
  onRetry,
  className,
}: ErrorStateProps) {
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center p-12 text-center rounded-[24px] border border-[#EF4444]/20 bg-[#EF4444]/5",
        className
      )}
    >
      <div className="p-3 bg-white rounded-2xl shadow-xs border border-[#EF4444]/20 mb-4">
        <AlertOctagon className="w-8 h-8 text-[#EF4444]" />
      </div>
      <h3 className="text-base font-semibold text-[#111827]">{title}</h3>
      <p className="text-xs text-[#6B7280] max-w-sm mt-1 mb-6">{description}</p>
      {onRetry && (
        <Button variant="secondary" size="sm" onClick={onRetry} className="gap-2">
          <RotateCw className="w-3.5 h-3.5" />
          <span>Retry Loading</span>
        </Button>
      )}
    </div>
  );
}
