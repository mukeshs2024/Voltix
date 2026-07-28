"use client";

import React from "react";
import { PageContainer, SectionContainer } from "@/components/shared/page-container";
import { Card } from "@/components/ui/card";
import { Bot } from "lucide-react";

export default function CopilotPage() {
  return (
    <PageContainer>
      <SectionContainer>
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-2">
          <div>
            <h1 className="text-2xl font-bold text-[#111827] tracking-tight">Voltix Copilot</h1>
            <p className="text-sm text-[#6B7280] mt-1">Chat with your AI assistant to analyze building data and execute optimizations.</p>
          </div>
        </div>
      </SectionContainer>
      <SectionContainer>
        <Card className="h-[500px] flex flex-col items-center justify-center border-dashed border-2 bg-white">
          <div className="w-16 h-16 rounded-full bg-[#F3E8FF] flex items-center justify-center mb-4">
            <Bot className="w-8 h-8 text-[#A855F7]" />
          </div>
          <h3 className="text-lg font-bold text-[#111827]">AI Copilot Interface</h3>
          <p className="text-sm text-[#6B7280] mt-1">Copilot UI implementation pending Phase 8.</p>
        </Card>
      </SectionContainer>
    </PageContainer>
  );
}
