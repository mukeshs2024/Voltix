"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSidebarStore } from "@/store/sidebar-store";
import { cn } from "@/lib/utils";
import { NAV_ITEMS } from "@/data/constants";
import {
  LayoutDashboard,
  Building2,
  BarChart3,
  AlertTriangle,
  BrainCircuit,
  Bot,
  FileText,
  Settings,
  ChevronLeft,
  ChevronRight,
  Zap,
  FlaskConical,
} from "lucide-react";

const iconMap: Record<string, React.ElementType> = {
  LayoutDashboard,
  Building2,
  BarChart3,
  AlertTriangle,
  BrainCircuit,
  Bot,
  FileText,
  Settings,
  FlaskConical,
};

export function Sidebar() {
  const pathname = usePathname();
  const { collapsed, toggleSidebar, mobileOpen, setMobileOpen } = useSidebarStore();

  return ( 
    <>
      {/* Mobile Overlay */}
      {mobileOpen && (
        <div 
          className="fixed inset-0 bg-[#111827]/20 z-40 lg:hidden backdrop-blur-sm"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Sidebar Content */}
      <aside
        className={cn(
          "bg-[#FCFCFC] border-r border-[#E5E7EB] h-screen fixed lg:sticky top-0 flex flex-col transition-all duration-300 z-50 select-none",
          collapsed ? "w-20" : "w-64",
          mobileOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        )}
      >
        {/* Brand Header */}
        <div className="h-16 px-5 border-b border-[#E5E7EB] flex items-center justify-between bg-[#FCFCFC]">
          <Link href="/" className="flex items-center gap-3 overflow-hidden">
            <div className="w-9 h-9 rounded-xl bg-[#111827] flex items-center justify-center text-white shrink-0 shadow-sm">
              <Zap className="w-5 h-5 text-[#22C55E]" />
            </div>
            {!collapsed && (
              <div className="flex flex-col">
                <span className="font-semibold text-base text-[#111827] tracking-tight leading-none">
                  VOLTIX
                </span>
                <span className="text-[10px] text-[#6B7280] font-medium tracking-wider uppercase mt-1">
                  Autonomous Ops
                </span>
              </div>
            )}
          </Link>
          <button
            onClick={toggleSidebar}
            aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
            className="hidden lg:flex p-1.5 rounded-lg text-[#6B7280] hover:text-[#111827] hover:bg-[#FAFAFA] transition-colors"
          >
            {collapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
          </button>
        </div>

        {/* Navigation Items */}
        <div className="flex-1 py-4 px-3 space-y-1 overflow-y-auto">
          {NAV_ITEMS.map((item) => {
            const isActive = pathname === item.href;
            const Icon = iconMap[item.iconName] || LayoutDashboard;
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setMobileOpen(false)}
                className={cn(
                  "flex items-center gap-3 px-3 py-2.5 rounded-[12px] text-sm font-medium transition-all duration-150 group",
                  isActive
                    ? "bg-[#111827] text-white shadow-sm"
                    : "text-[#6B7280] hover:text-[#111827] hover:bg-[#FAFAFA]"
                )}
              >
                <Icon
                  className={cn(
                    "w-4 h-4 shrink-0 transition-colors",
                    isActive ? "text-[#22C55E]" : "text-[#6B7280] group-hover:text-[#111827]"
                  )}
                />
                {!collapsed && <span className="truncate">{item.name}</span>}
              </Link>
            );
          })}
        </div>

        {/* Footer / Status */}
        <div className="p-4 border-t border-[#E5E7EB] bg-[#FCFCFC]">
          <div
            className={cn(
              "flex items-center gap-3 p-2.5 rounded-[12px] bg-[#FAFAFA] border border-[#E5E7EB]",
              collapsed && "justify-center p-2"
            )}
          >
            <span className="w-2.5 h-2.5 rounded-full bg-[#22C55E] animate-pulse shrink-0" />
            {!collapsed && (
              <div className="flex flex-col overflow-hidden">
                <span className="text-xs font-semibold text-[#111827] truncate">System Active</span>
                <span className="text-[10px] text-[#6B7280]">Autonomous Grid Live</span>
              </div>
            )}
          </div>
        </div>
      </aside>
    </>
  );
}
