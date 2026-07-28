import React from "react";
import { Button } from "@/components/ui/button";
import { AlertCircle, RefreshCw } from "lucide-react";

interface ErrorStateProps {
  title?: string;
  description?: string;
  onRetry?: () => void;
}

export function ErrorState({
  title = "Something went wrong",
  description = "An unexpected error occurred while loading this section. Please try again.",
  onRetry
}: ErrorStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center bg-white rounded-[24px] border border-[#FCA5A5]/30 bg-[#FEF2F2]/10 shadow-sm w-full p-6">
      <div className="w-14 h-14 rounded-full bg-[#FEF2F2] border border-[#FCA5A5] flex items-center justify-center mb-4">
        <AlertCircle className="w-7 h-7 text-[#B91C1C]" />
      </div>
      <h3 className="text-lg font-bold text-[#111827]">{title}</h3>
      <p className="text-sm text-[#6B7280] mt-1 max-w-md">{description}</p>
      
      {onRetry && (
        <Button variant="outline" size="sm" className="mt-4 gap-2 bg-white" onClick={onRetry}>
          <RefreshCw className="w-3.5 h-3.5" />
          <span>Try Again</span>
        </Button>
      )}
    </div>
  );
}
