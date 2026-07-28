"use client";

import React from "react";
import { cn } from "@/lib/utils";
import { FolderOpen } from "lucide-react";
import { Button } from "@/components/ui/button";

export interface EmptyStateProps {
  title?: string;
  description?: string;
  icon?: React.ReactNode;
  actionLabel?: string;
  onAction?: () => void;
  className?: string;
}

export function EmptyState({
  title = "No data available",
  description = "There are no records to display at this time.",
  icon = <FolderOpen className="w-8 h-8 text-[#6B7280]" />,
  actionLabel,
  onAction,
  className,
}: EmptyStateProps) {
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center p-12 text-center rounded-[24px] border border-dashed border-[#E5E7EB] bg-[#FAFAFA]",
        className
      )}
    >
      <div className="p-3 bg-white rounded-2xl shadow-xs border border-[#E5E7EB] mb-4">
        {icon}
      </div>
      <h3 className="text-base font-semibold text-[#111827]">{title}</h3>
      <p className="text-xs text-[#6B7280] max-w-sm mt-1 mb-6">{description}</p>
      {actionLabel && onAction && (
        <Button variant="primary" size="sm" onClick={onAction}>
          {actionLabel}
        </Button>
      )}
    </div>
  );
}
