"use client";

import React from "react";
import { cn } from "@/lib/utils";

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  className?: string;
  hoverable?: boolean;
}

export function Card({ children, className, hoverable = false, ...props }: CardProps) {
  return (
    <div
      className={cn(
        "bg-white border border-[#E5E7EB] rounded-[24px] p-6 shadow-apple transition-all duration-200",
        hoverable && "hover:shadow-apple-hover hover:border-[#D1D5DB] cursor-pointer",
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}

export function CardHeader({ children, className }: { children: React.ReactNode; className?: string }) {
  return <div className={cn("flex items-center justify-between mb-4", className)}>{children}</div>;
}

export function CardTitle({ children, className }: { children: React.ReactNode; className?: string }) {
  return <h3 className={cn("text-base font-semibold text-[#111827] tracking-tight", className)}>{children}</h3>;
}

export function CardDescription({ children, className }: { children: React.ReactNode; className?: string }) {
  return <p className={cn("text-xs text-[#6B7280]", className)}>{children}</p>;
}

export function CardContent({ children, className }: { children: React.ReactNode; className?: string }) {
  return <div className={cn("", className)}>{children}</div>;
}
