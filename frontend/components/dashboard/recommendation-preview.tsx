"use client";

import React from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Sparkles, ArrowRight, CheckCircle2 } from "lucide-react";
import { AIRecommendation } from "@/types";

export function RecommendationPreview({ recommendations }: { recommendations: AIRecommendation[] }) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div className="flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-[#22C55E]" />
          <CardTitle>AI Copilot Insights</CardTitle>
        </div>
        <Button variant="ghost" size="sm" className="h-8">
          AI Center <ArrowRight className="w-3.5 h-3.5 ml-1" />
        </Button>
      </CardHeader>
      <CardContent className="space-y-4">
        {recommendations.map((rec) => (
          <div key={rec.id} className="p-4 border border-[#22C55E]/20 bg-[#22C55E]/5 rounded-[16px]">
            <div className="flex items-start justify-between">
              <div>
                <h4 className="text-sm font-semibold text-[#111827]">{rec.title}</h4>
                <p className="text-xs text-[#6B7280] mt-1">{rec.buildingName}</p>
              </div>
              <Badge variant="success" className="bg-white">
                {rec.confidenceScore}% Confidence
              </Badge>
            </div>
            
            <p className="text-sm text-[#4B5563] mt-3 leading-relaxed">
              {rec.actionSummary}
            </p>
            
            <div className="mt-4 flex items-center justify-between pt-4 border-t border-[#22C55E]/10">
              <div className="flex items-center gap-4">
                <div className="flex flex-col">
                  <span className="text-[10px] text-[#6B7280] uppercase tracking-wider font-semibold">Est. Savings</span>
                  <span className="text-sm font-bold text-[#22C55E]">+${rec.impactUSD}</span>
                </div>
                <div className="flex flex-col">
                  <span className="text-[10px] text-[#6B7280] uppercase tracking-wider font-semibold">Load Shift</span>
                  <span className="text-sm font-bold text-[#111827]">{rec.energySavingPct}%</span>
                </div>
              </div>
              <Button variant="primary" size="sm" className="bg-[#22C55E] hover:bg-[#16A34A] focus:ring-[#22C55E] text-white shadow-sm border-none gap-2">
                <CheckCircle2 className="w-4 h-4" />
                <span>Execute</span>
              </Button>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
