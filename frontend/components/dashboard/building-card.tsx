"use client";

import React, { useState } from "react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { StatusBadge } from "@/components/shared/status-badge";
import { Building2, Search, Filter, ArrowUpDown, ChevronLeft, ChevronRight, MoreHorizontal } from "lucide-react";
import { Building } from "@/types";
import { motion } from "framer-motion";

export function BuildingOverviewCard({ buildings }: { buildings: Building[] }) {
  const [searchTerm, setSearchTerm] = useState("");

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.3 }}
    >
      <Card>
        <CardHeader>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <CardTitle>Building Portfolio Status</CardTitle>
              <CardDescription>Monitored facility nodes and energy metrics</CardDescription>
            </div>
            <div className="flex items-center gap-3">
              <div className="relative">
                <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-[#6B7280]" />
                <input
                  type="text"
                  placeholder="Search buildings..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full sm:w-64 bg-[#FAFAFA] border border-[#E5E7EB] rounded-[10px] pl-9 pr-4 py-1.5 text-sm text-[#111827] placeholder-[#6B7280] focus:outline-none focus:border-[#111827] focus:ring-1 focus:ring-[#111827] transition-all"
                />
              </div>
              <Button variant="outline" size="sm" className="px-2 h-[34px]">
                <Filter className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto rounded-[12px] border border-[#E5E7EB]">
            <table className="w-full text-left text-sm whitespace-nowrap">
              <thead className="bg-[#FAFAFA]">
                <tr className="border-b border-[#E5E7EB] text-[#6B7280] font-semibold text-xs uppercase tracking-wider">
                  <th className="px-4 py-3">
                    <div className="flex items-center gap-2 cursor-pointer hover:text-[#111827] transition-colors">
                      Building Name <ArrowUpDown className="w-3 h-3" />
                    </div>
                  </th>
                  <th className="px-4 py-3">Location</th>
                  <th className="px-4 py-3">
                    <div className="flex items-center gap-2 cursor-pointer hover:text-[#111827] transition-colors">
                      Efficiency <ArrowUpDown className="w-3 h-3" />
                    </div>
                  </th>
                  <th className="px-4 py-3">State</th>
                  <th className="px-4 py-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E5E7EB] bg-white">
                {buildings.map((b) => (
                  <tr key={b.id} className="hover:bg-[#F9FAFB] transition-colors group cursor-pointer">
                    <td className="px-4 py-3 font-semibold text-[#111827] flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-[#F3F4F6] flex items-center justify-center shrink-0 border border-[#E5E7EB] group-hover:border-[#D1D5DB] transition-colors">
                        <Building2 className="w-4 h-4 text-[#6B7280]" />
                      </div>
                      {b.name}
                    </td>
                    <td className="px-4 py-3 text-[#6B7280]">{b.location}</td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <span className="font-medium text-[#111827]">{b.energyScore}</span>
                        <span className="text-xs text-[#6B7280]">/ 100</span>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <StatusBadge status={b.status} />
                    </td>
                    <td className="px-4 py-3 text-right">
                      <Button variant="ghost" size="sm" className="h-8 w-8 p-0 text-[#6B7280] hover:text-[#111827]">
                        <MoreHorizontal className="w-4 h-4" />
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="flex items-center justify-between mt-4">
            <span className="text-sm text-[#6B7280]">
              Showing <span className="font-semibold text-[#111827]">1</span> to <span className="font-semibold text-[#111827]">3</span> of <span className="font-semibold text-[#111827]">12</span> nodes
            </span>
            <div className="flex items-center gap-1">
              <Button variant="outline" size="sm" className="w-8 h-8 p-0 rounded-md" disabled>
                <ChevronLeft className="w-4 h-4" />
              </Button>
              <Button variant="outline" size="sm" className="w-8 h-8 p-0 rounded-md bg-[#F3F4F6] border-[#E5E7EB] text-[#111827] font-semibold">
                1
              </Button>
              <Button variant="outline" size="sm" className="w-8 h-8 p-0 rounded-md hover:bg-[#F9FAFB]">
                2
              </Button>
              <Button variant="outline" size="sm" className="w-8 h-8 p-0 rounded-md hover:bg-[#F9FAFB]">
                3
              </Button>
              <Button variant="outline" size="sm" className="w-8 h-8 p-0 rounded-md hover:bg-[#F9FAFB]">
                <ChevronRight className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
