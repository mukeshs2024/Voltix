import React, { ReactNode } from "react";

interface PageHeaderProps {
  title: string;
  description?: string;
  actions?: ReactNode;
}

export function PageHeader({ title, description, actions }: PageHeaderProps) {
  return (
    <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-2">
      <div>
        <h1 className="text-2xl font-bold text-[#111827] tracking-tight">{title}</h1>
        {description && (
          <p className="text-sm text-[#6B7280] mt-1">{description}</p>
        )}
      </div>
      
      {actions && (
        <div className="flex flex-col sm:flex-row items-center gap-3">
          {actions}
        </div>
      )}
    </div>
  );
}
