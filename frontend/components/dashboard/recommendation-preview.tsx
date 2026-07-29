"use client";

import React, { useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Sparkles, ArrowRight, CheckCircle2, Loader2 } from "lucide-react";
import { AIRecommendation } from "@/types";
import { motion } from "framer-motion";

export function RecommendationPreview({ recommendations }: { recommendations: AIRecommendation[] }) {
  const [executing, setExecuting] = useState<string | null>(null);

  const handleExecute = (id: string) => {
    setExecuting(id);
    setTimeout(() => {
      setExecuting(null);
    }, 2000);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.3 }}
    >
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-[#2563EB]" />
            <CardTitle>AI Copilot Insights</CardTitle>
          </div>
          <Button variant="ghost" size="sm" className="h-8">
            AI Center <ArrowRight className="w-3.5 h-3.5 ml-1" />
          </Button>
        </CardHeader>
        <CardContent className="space-y-4">
          {recommendations.map((rec) => {
            const isExecuting = executing === rec.id;
            
            return (
              <motion.div 
                key={rec.id} 
                className="p-4 border border-[#2563EB]/20 bg-gradient-to-br from-[#2563EB]/5 to-transparent rounded-[16px] hover:border-[#2563EB]/40 transition-colors group"
                whileHover={{ y: -2 }}
              >
                <div className="flex items-start justify-between">
                  <div>
                    <h4 className="text-sm font-bold text-[#111827] flex items-center gap-2">
                      {rec.title}
                    </h4>
                    <p className="text-xs text-[#6B7280] mt-1 font-medium">{rec.buildingName}</p>
                  </div>
                  <Badge variant="success" className="bg-white shadow-sm border border-[#2563EB]/20">
                    {rec.confidenceScore}% Confidence
                  </Badge>
                </div>
                
                <p className="text-sm text-[#4B5563] mt-3 leading-relaxed">
                  {rec.actionSummary}
                </p>
                
                <div className="mt-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-4 border-t border-[#2563EB]/10">
                  <div className="flex items-center gap-6">
                    <div className="flex flex-col">
                      <span className="text-[10px] text-[#6B7280] uppercase tracking-wider font-bold">Est. Savings</span>
                      <span className="text-sm font-extrabold text-[#2563EB]">+${rec.impactUSD}</span>
                    </div>
                  </div>
                  <Button 
                    variant="primary" 
                    size="sm" 
                    disabled={isExecuting}
                    onClick={() => handleExecute(rec.id)}
                    className="w-full sm:w-auto bg-[#2563EB] hover:bg-[#1D4ED8] focus:ring-[#2563EB] text-white shadow-md shadow-[#2563EB]/20 border-none gap-2 transition-all"
                  >
                    {isExecuting ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        <span>Optimizing...</span>
                      </>
                    ) : (
                      <>
                        <CheckCircle2 className="w-4 h-4" />
                        <span>Execute</span>
                      </>
                    )}
                  </Button>
                </div>
              </motion.div>
            );
          })}
        </CardContent>
      </Card>
    </motion.div>
  );
}
