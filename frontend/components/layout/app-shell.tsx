"use client";

import React from "react";
import { Sidebar } from "@/components/layout/sidebar";
import { TopNavigation } from "@/components/layout/top-navigation";

export function AppShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-[#FFFFFF] flex font-sans text-[#111827]">
      <Sidebar />
      <div className="flex-1 flex flex-col min-w-0">
        <TopNavigation />
        <main className="flex-1 p-8 bg-[#FFFFFF] overflow-y-auto">{children}</main>
      </div>
    </div>
  );
}

export function ContentWrapper({ children }: { children: React.ReactNode }) {
  return <div className="w-full space-y-6">{children}</div>;
}

export function PageLayout({ children }: { children: React.ReactNode }) {
  return <ContentWrapper>{children}</ContentWrapper>;
}
