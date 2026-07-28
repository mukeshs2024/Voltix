"use client";

import React from "react";
import { cn } from "@/lib/utils";

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "outline" | "ghost" | "danger";
  size?: "sm" | "md" | "lg";
  children: React.ReactNode;
}

export function Button({
  variant = "primary",
  size = "md",
  className,
  children,
  ...props
}: ButtonProps) {
  const baseStyles =
    "inline-flex items-center justify-center font-medium transition-all duration-150 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed active:scale-[0.98]";

  const variants = {
    primary: "bg-[#111827] text-white hover:bg-black focus:ring-[#111827] rounded-[12px] shadow-sm",
    secondary: "bg-[#FAFAFA] text-[#111827] border border-[#E5E7EB] hover:bg-[#F3F4F6] focus:ring-[#E5E7EB] rounded-[12px]",
    outline: "bg-transparent text-[#111827] border border-[#E5E7EB] hover:bg-[#FAFAFA] focus:ring-[#E5E7EB] rounded-[12px]",
    ghost: "bg-transparent text-[#6B7280] hover:text-[#111827] hover:bg-[#FAFAFA] rounded-[12px]",
    danger: "bg-[#EF4444] text-white hover:bg-[#DC2626] focus:ring-[#EF4444] rounded-[12px]",
  };

  const sizes = {
    sm: "px-3 py-1.5 text-xs gap-1.5",
    md: "px-4 py-2 text-sm gap-2",
    lg: "px-6 py-3 text-base gap-2.5",
  };

  return (
    <button className={cn(baseStyles, variants[variant], sizes[size], className)} {...props}>
      {children}
    </button>
  );
}
