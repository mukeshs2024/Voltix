"use client";

import React from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { StatusBadge } from "@/components/shared/status-badge";
import { Building2, ArrowUpDown, MoreHorizontal } from "lucide-react";
import { Building } from "@/types";
import { motion } from "framer-motion";

export function BuildingOverviewCard({ buildings }: { buildings: Building[] }) {

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.3 }}
    >
      <Card>
        <CardHeader>
          <CardTitle>Building Portfolio Status</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto rounded-[12px] border border-[#E5E7EB]">
            <table className="w-full text-left text-sm whitespace-nowrap">
              <thead className="bg-[#FAFAFA]">
                <tr className="border-b border-[#E5E7EB] text-[#6B7280] font-semibold text-xs uppercase tracking-wider">
                  <th className="px-4 py-2">
                    <div className="flex items-center gap-2 cursor-pointer hover:text-[#111827] transition-colors">
                      Building Name <ArrowUpDown className="w-3 h-3" />
                    </div>
                  </th>
                  <th className="px-4 py-2">Location</th>
                  <th className="px-4 py-2">
                    <div className="flex items-center gap-2 cursor-pointer hover:text-[#111827] transition-colors">
                      Efficiency <ArrowUpDown className="w-3 h-3" />
                    </div>
                  </th>
                  <th className="px-4 py-2">State</th>
                  <th className="px-4 py-2 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E5E7EB] bg-white">
                {buildings.map((b) => (
                  <tr key={b.id} className="hover:bg-[#F9FAFB] transition-colors group cursor-pointer">
                    <td className="px-4 py-2 font-semibold text-[#111827] flex items-center gap-3">
                      <div className="w-7 h-7 rounded-lg bg-[#F3F4F6] flex items-center justify-center shrink-0 border border-[#E5E7EB] group-hover:border-[#D1D5DB] transition-colors">
                        <Building2 className="w-3.5 h-3.5 text-[#6B7280]" />
                      </div>
                      {b.name}
                    </td>
                    <td className="px-4 py-2 text-[#6B7280]">{b.location}</td>
                    <td className="px-4 py-2">
                      <div className="flex items-center gap-2">
                        <span className="font-medium text-[#111827]">{b.energyScore}</span>
                        <span className="text-xs text-[#6B7280]">/ 100</span>
                      </div>
                    </td>
                    <td className="px-4 py-2">
                      <StatusBadge status={b.status} />
                    </td>
                    <td className="px-4 py-2 text-right">
                      <Button variant="ghost" size="sm" className="h-8 w-8 p-0 text-[#6B7280] hover:text-[#111827]">
                        <MoreHorizontal className="w-4 h-4" />
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>


        </CardContent>
      </Card>
    </motion.div>
  );
}
