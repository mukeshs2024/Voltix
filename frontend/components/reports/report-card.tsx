"use client";

import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { FileText, Download, Calendar, Zap, Leaf, DollarSign } from "lucide-react";
import { motion } from "framer-motion";
import { downloadReport } from "@/components/reports/report-export";

export type ReportCategory = "Energy" | "Carbon" | "Savings" | "Monthly";

export interface ReportDetail {
  id: string;
  title: string;
  description: string;
  category: ReportCategory;
  date: string;
  size: string;
}

interface ReportCardProps {
  report: ReportDetail;
  onPreview: (report: ReportDetail) => void;
  index: number;
}

export function ReportCard({ report, onPreview, index }: ReportCardProps) {
  
  const getCategoryIcon = (category: ReportCategory) => {
    switch(category) {
      case "Energy": return <Zap className="w-5 h-5 text-[#3B82F6]" />;
      case "Carbon": return <Leaf className="w-5 h-5 text-[#22C55E]" />;
      case "Savings": return <DollarSign className="w-5 h-5 text-[#F59E0B]" />;
      case "Monthly": return <Calendar className="w-5 h-5 text-[#8B5CF6]" />;
      default: return <FileText className="w-5 h-5 text-[#6B7280]" />;
    }
  };

  const getCategoryColor = (category: ReportCategory) => {
    switch(category) {
      case "Energy": return "bg-[#EFF6FF] border-[#BFDBFE]";
      case "Carbon": return "bg-[#F0FDF4] border-[#BBF7D0]";
      case "Savings": return "bg-[#FEF3C7] border-[#FDE68A]";
      case "Monthly": return "bg-[#F5F3FF] border-[#DDD6FE]";
      default: return "bg-[#F3F4F6] border-[#E5E7EB]";
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.05 }}
      whileHover={{ y: -4 }}
    >
      <Card hoverable className="h-full border-[#E5E7EB] hover:border-[#D1D5DB] transition-all">
        <CardContent className="p-6 flex flex-col h-full">
          <div className="flex justify-between items-start mb-4">
            <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 border ${getCategoryColor(report.category)}`}>
              {getCategoryIcon(report.category)}
            </div>
            <Badge variant="neutral" className="text-[10px] text-[#6B7280] bg-white border-[#E5E7EB]">
              {report.category}
            </Badge>
          </div>
          
          <div className="flex-1">
            <h3 className="font-bold text-[#111827] text-lg mb-1">{report.title}</h3>
            <p className="text-sm text-[#6B7280] line-clamp-2">{report.description}</p>
          </div>

          <div className="pt-4 mt-4 border-t border-[#E5E7EB] flex items-center justify-between">
            <div className="flex items-center gap-2 text-xs text-[#9CA3AF] font-medium">
              <Calendar className="w-3.5 h-3.5" />
              {report.date} • {report.size}
            </div>
            <div className="flex gap-2">
              <Button variant="ghost" size="sm" onClick={() => onPreview(report)} className="text-[#6B7280] hover:text-[#111827]">
                Preview
              </Button>
              <Button variant="outline" size="sm" className="w-8 h-8 p-0" onClick={() => downloadReport(report, "pdf")}>
                <Download className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
