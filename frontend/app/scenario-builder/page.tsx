"use client";

import React from "react";
import { PageContainer, SectionContainer } from "@/components/shared/page-container";
import { Card } from "@/components/ui/card";
import { Cpu } from "lucide-react";

export default function ScenarioBuilderPage() {
  return (
    <PageContainer>
      <SectionContainer>
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-2">
          <div>
            <h1 className="text-2xl font-bold text-[#111827] tracking-tight">Scenario Builder</h1>
            <p className="text-sm text-[#6B7280] mt-1">Design and simulate custom energy optimization strategies.</p>
          </div>
        </div>
      </SectionContainer>
      <SectionContainer>
        <Card className="h-[600px] flex flex-col items-center justify-center border-dashed border-2 bg-white">
          <div className="w-16 h-16 rounded-full bg-[#ECFDF5] flex items-center justify-center mb-4">
            <Cpu className="w-8 h-8 text-[#10B981]" />
          </div>
          <h3 className="text-lg font-bold text-[#111827]">Visual Scenario Editor</h3>
          <p className="text-sm text-[#6B7280] mt-1">React Flow implementation pending Phase 9.</p>
        </Card>
      </SectionContainer>
    </PageContainer>
  );
}
