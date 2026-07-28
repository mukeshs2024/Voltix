import React from "react";
import { Button } from "@/components/ui/button";
import { LucideIcon } from "lucide-react";

interface EmptyStateProps {
  icon: LucideIcon;
  iconColorClass?: string;
  iconBgClass?: string;
  title: string;
  description: string;
  actionLabel?: string;
  onAction?: () => void;
}

export function EmptyState({ 
  icon: Icon, 
  iconColorClass = "text-[#9CA3AF]", 
  iconBgClass = "bg-[#F3F4F6]", 
  title, 
  description, 
  actionLabel, 
  onAction 
}: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-20 text-center bg-white rounded-[24px] border border-[#E5E7EB] shadow-sm w-full">
      <div className={`w-16 h-16 rounded-full flex items-center justify-center mb-4 ${iconBgClass}`}>
        <Icon className={`w-8 h-8 ${iconColorClass}`} />
      </div>
      <h3 className="text-lg font-bold text-[#111827]">{title}</h3>
      <p className="text-sm text-[#6B7280] mt-1 max-w-sm">{description}</p>
      
      {actionLabel && onAction && (
        <Button variant="outline" size="sm" className="mt-4" onClick={onAction}>
          {actionLabel}
        </Button>
      )}
    </div>
  );
}
