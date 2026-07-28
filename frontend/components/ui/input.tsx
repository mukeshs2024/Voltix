"use client";

import React from "react";
import { cn } from "@/lib/utils";

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  icon?: React.ReactNode;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, label, error, icon, type = "text", ...props }, ref) => {
    return (
      <div className="w-full space-y-1.5">
        {label && (
          <label className="text-xs font-medium text-[#111827] select-none">
            {label}
          </label>
        )}
        <div className="relative flex items-center">
          {icon && <div className="absolute left-3 text-[#6B7280]">{icon}</div>}
          <input
            type={type}
            ref={ref}
            className={cn(
              "w-full bg-[#FAFAFA] border border-[#E5E7EB] rounded-[12px] px-3.5 py-2 text-sm text-[#111827] placeholder-[#6B7280] focus:outline-none focus:border-[#111827] focus:ring-1 focus:ring-[#111827] transition-all disabled:opacity-50 disabled:cursor-not-allowed",
              icon && "pl-9",
              error && "border-[#EF4444] focus:border-[#EF4444] focus:ring-[#EF4444]",
              className
            )}
            {...props}
          />
        </div>
        {error && <p className="text-xs text-[#EF4444]">{error}</p>}
      </div>
    );
  }
);
Input.displayName = "Input";
