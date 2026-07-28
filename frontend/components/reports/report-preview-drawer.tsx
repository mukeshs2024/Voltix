"use client";

import React from "react";
import { ReportDetail } from "@/components/reports/report-card";
import { FileText, Download, Share2, Eye } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Drawer } from "@/components/shared/drawer";
import { downloadReport } from "@/components/reports/report-export";

interface ReportPreviewDrawerProps {
  report: ReportDetail | null;
  isOpen: boolean;
  onClose: () => void;
}

export function ReportPreviewDrawer({ report, isOpen, onClose }: ReportPreviewDrawerProps) {
  if (!report) return null;

  const headerIcon = <FileText className="w-5 h-5 text-[#111827]" />;
  
  const titleContent = (
    <div>
      <span>{report.title}</span>
      <div className="flex items-center gap-2 mt-1 text-sm text-[#6B7280] font-normal">
        <span>{report.date}</span>
        <span>•</span>
        <span>{report.size}</span>
      </div>
    </div>
  );

  const footer = (
    <div className="flex flex-col sm:flex-row justify-end gap-3 w-full">
      <Button variant="outline" className="gap-2">
        <Share2 className="w-4 h-4" /> Share
      </Button>
      <div className="flex flex-wrap gap-2">
        <Button variant="outline" className="gap-2" onClick={() => downloadReport(report, "csv")}>
          <Download className="w-4 h-4" /> CSV
        </Button>
        <Button variant="outline" className="gap-2" onClick={() => downloadReport(report, "xlsx")}>
          <Download className="w-4 h-4" /> XLSX
        </Button>
        <Button variant="primary" className="bg-[#111827] hover:bg-[#374151] text-white border-none gap-2" onClick={() => downloadReport(report, "pdf")}>
          <Download className="w-4 h-4" /> PDF
        </Button>
      </div>
    </div>
  );

  return (
    <Drawer
      isOpen={isOpen}
      onClose={onClose}
      title={titleContent}
      headerIcon={headerIcon}
      maxWidth="max-w-2xl"
      footer={footer}
    >
      <div className="w-full h-[600px] bg-white border border-[#E5E7EB] rounded-xl shadow-sm p-8 flex flex-col items-center justify-center text-center">
        <Eye className="w-12 h-12 text-[#D1D5DB] mb-4" />
        <h3 className="text-lg font-bold text-[#111827] mb-2">Document Preview</h3>
        <p className="text-sm text-[#6B7280] max-w-sm">
          This is a mock representation of the generated {report.category.toLowerCase()} report. 
          In production, this would render a PDF viewer or an interactive HTML summary.
        </p>
        
        <div className="mt-8 w-full max-w-md space-y-4 text-left">
          <div className="h-4 bg-[#F3F4F6] rounded w-3/4" />
          <div className="h-4 bg-[#F3F4F6] rounded w-full" />
          <div className="h-4 bg-[#F3F4F6] rounded w-5/6" />
          <div className="h-4 bg-[#F3F4F6] rounded w-full" />
          <div className="h-32 bg-[#F3F4F6] rounded-lg w-full mt-6" />
          <div className="h-4 bg-[#F3F4F6] rounded w-1/2" />
        </div>
      </div>
    </Drawer>
  );
}
