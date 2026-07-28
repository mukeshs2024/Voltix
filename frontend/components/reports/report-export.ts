import * as XLSX from "xlsx";
import { jsPDF } from "jspdf";

import type { ReportDetail } from "@/components/reports/report-card";

export type ReportExportFormat = "csv" | "xlsx" | "pdf";

function safeFileName(title: string) {
  return title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "");
}

function buildRows(report: ReportDetail) {
  return [
    { field: "Report ID", value: report.id },
    { field: "Title", value: report.title },
    { field: "Description", value: report.description },
    { field: "Category", value: report.category },
    { field: "Date", value: report.date },
    { field: "Size", value: report.size },
    { field: "Generated At", value: new Date().toISOString() },
  ];
}

function downloadBlob(content: BlobPart, fileName: string, type: string) {
  const blob = new Blob([content], { type });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = fileName;
  document.body.appendChild(anchor);
  anchor.click();
  anchor.remove();
  URL.revokeObjectURL(url);
}

function exportCsv(report: ReportDetail) {
  const rows = buildRows(report);
  const csv = ["field,value", ...rows.map((row) => `${JSON.stringify(row.field)},${JSON.stringify(row.value)}`)].join("\n");
  downloadBlob(csv, `${safeFileName(report.title)}.csv`, "text/csv;charset=utf-8");
}

function exportXlsx(report: ReportDetail) {
  const rows = buildRows(report);
  const worksheet = XLSX.utils.json_to_sheet(rows);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, "Report");
  XLSX.writeFile(workbook, `${safeFileName(report.title)}.xlsx`);
}

function exportPdf(report: ReportDetail) {
  const pdf = new jsPDF({ unit: "pt", format: "a4" });
  const marginLeft = 48;
  let cursorY = 56;

  pdf.setFont("helvetica", "bold");
  pdf.setFontSize(18);
  pdf.text(report.title, marginLeft, cursorY);

  cursorY += 22;
  pdf.setFont("helvetica", "normal");
  pdf.setFontSize(11);
  pdf.setTextColor(107, 114, 128);
  pdf.text(`${report.category} report • ${report.date} • ${report.size}`, marginLeft, cursorY);

  cursorY += 28;
  pdf.setTextColor(17, 24, 39);
  pdf.setFontSize(12);
  pdf.setFont("helvetica", "bold");
  pdf.text("Summary", marginLeft, cursorY);

  cursorY += 16;
  pdf.setFont("helvetica", "normal");
  const wrappedDescription = pdf.splitTextToSize(report.description, 500);
  pdf.text(wrappedDescription, marginLeft, cursorY);
  cursorY += wrappedDescription.length * 14 + 18;

  pdf.setFont("helvetica", "bold");
  pdf.text("Report Details", marginLeft, cursorY);
  cursorY += 16;

  pdf.setFont("helvetica", "normal");
  buildRows(report).forEach((row) => {
    const line = `${row.field}: ${row.value}`;
    const wrappedLine = pdf.splitTextToSize(line, 500);
    pdf.text(wrappedLine, marginLeft, cursorY);
    cursorY += wrappedLine.length * 13 + 4;
  });

  pdf.save(`${safeFileName(report.title)}.pdf`);
}

export function downloadReport(report: ReportDetail, format: ReportExportFormat) {
  if (format === "csv") {
    exportCsv(report);
    return;
  }

  if (format === "xlsx") {
    exportXlsx(report);
    return;
  }

  exportPdf(report);
}