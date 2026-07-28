"use client";

import React from "react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { StatusBadge } from "@/components/shared/status-badge";
import { Building2 } from "lucide-react";
import { Building } from "@/types";

export function BuildingOverviewCard({ buildings }: { buildings: Building[] }) {
  return (
    <Card>
      <CardHeader>
        <div>
          <CardTitle>Building Portfolio Status</CardTitle>
          <CardDescription>Monitored facility nodes and energy metrics</CardDescription>
        </div>
        <Button variant="outline" size="sm">
          <span>View All Facilities</span>
        </Button>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-[#E5E7EB] text-[#6B7280] font-medium text-xs">
                <th className="pb-3 pt-1">Building Name</th>
                <th className="pb-3 pt-1">Location</th>
                <th className="pb-3 pt-1">Efficiency Score</th>
                <th className="pb-3 pt-1">Operational State</th>
                <th className="pb-3 pt-1 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E5E7EB]">
              {buildings.map((b) => (
                <tr key={b.id} className="hover:bg-[#FAFAFA] transition-colors">
                  <td className="py-4 font-semibold text-[#111827] flex items-center gap-3">
                    <Building2 className="w-4 h-4 text-[#6B7280]" />
                    {b.name}
                  </td>
                  <td className="py-4 text-[#6B7280]">{b.location}</td>
                  <td className="py-4 font-medium">{b.energyScore} / 100</td>
                  <td className="py-4">
                    <StatusBadge status={b.status} />
                  </td>
                  <td className="py-4 text-right">
                    <Button variant="ghost" size="sm">
                      Inspect
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  );
}
