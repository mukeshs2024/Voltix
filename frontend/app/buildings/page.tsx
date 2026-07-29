"use client";

import React, { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { BuildingsSkeleton } from "@/components/buildings/buildings-skeleton";
import { BuildingCard } from "@/components/buildings/building-card";
import { SearchToolbar } from "@/components/buildings/search-toolbar";
import { FilterBar } from "@/components/buildings/filter-bar";
import { BUILDING_DETAILS, BuildingDetail } from "@/data/buildings";
import { getRealBuildings } from "@/lib/api-client";
import { Download } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

type StatusFilter = "all" | BuildingDetail["status"];
type SortKey = "aiScore" | "energy" | "occupancy" | "alerts" | "name";

export default function BuildingsPage() {
  const router = useRouter();
  const [buildings, setBuildings] = useState<BuildingDetail[]>(BUILDING_DETAILS);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [activeFilter, setActiveFilter] = useState<StatusFilter>("all");
  const [sortKey, setSortKey] = useState<SortKey>("aiScore");

  useEffect(() => {
    let isMounted = true;
    async function loadBuildings() {
      setIsLoading(true);
      const real = await getRealBuildings();
      if (isMounted) {
        if (real && real.length > 0) {
          // Map backend building schema to BuildingDetail format
          const mapped = real.map((b: any) => ({
            id: String(b.id),
            name: b.name || "Building",
            location: b.address || b.location || "San Francisco, CA",
            areaSqFt: b.area_sqft || b.areaSqFt || 150000,
            occupancyRate: b.occupancy_rate || b.occupancyRate || 85,
            energyScore: b.energy_score || b.energyScore || 90,
            status: b.status || "OPTIMAL",
            activeAlerts: b.active_alerts || b.activeAlerts || 0,
            monthlySavingsUSD: b.monthly_savings_usd || 12000,
            co2ReductionTons: b.co2_reduction_tons || 40,
          }));
          setBuildings(mapped as BuildingDetail[]);
        }
        setIsLoading(false);
      }
    }
    loadBuildings();
    return () => {
      isMounted = false;
    };
  }, []);

  const sortedBuildings = useMemo(() => {
    const filtered = buildings.filter((building) => {
      const matchesSearch = [building.name, building.location].some((value) =>
        value.toLowerCase().includes(searchTerm.toLowerCase())
      );

      const matchesFilter = activeFilter === "all" ? true : building.status === activeFilter;

      return matchesSearch && matchesFilter;
    });

    return filtered.sort((left, right) => {
      switch (sortKey) {
        case "aiScore":
          return right.energyScore - left.energyScore;
        case "energy":
          return left.areaSqFt * 0.012 - right.areaSqFt * 0.012; // EnergyKw
        case "occupancy":
          return right.occupancyRate - left.occupancyRate;
        case "alerts":
          return right.activeAlerts - left.activeAlerts;
        case "name":
          return left.name.localeCompare(right.name);
        default:
          return 0;
      }
    });
  }, [buildings, activeFilter, searchTerm, sortKey]);

  function handleExportSnapshot() {
    const payload = JSON.stringify(buildings, null, 2);
    const blob = new Blob([payload], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "voltix-buildings-snapshot.json";
    document.body.appendChild(link);
    link.click();
    link.remove();
    URL.revokeObjectURL(url);
  }

  if (isLoading) {
    return (
      <div className="p-6 md:p-8 w-full">
        <BuildingsSkeleton />
      </div>
    );
  }

  return (
    <div className="p-6 md:p-8 w-full min-h-screen bg-gray-50 flex flex-col gap-6">
      {/* Executive Header Row */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 bg-white p-4 rounded-xl border border-gray-200 shadow-sm">
        <div className="flex items-center gap-6 flex-1 w-full lg:w-auto">
          <h1 className="text-[20px] font-semibold text-gray-900 tracking-tight whitespace-nowrap">Buildings</h1>
          <div className="w-full max-w-[420px]">
            <SearchToolbar value={searchTerm} onChange={setSearchTerm} />
          </div>
        </div>
        <button
          onClick={handleExportSnapshot}
          className="h-[40px] px-4 flex items-center gap-2 bg-white border border-gray-200 rounded-md text-[14px] font-medium text-gray-700 hover:bg-gray-50 transition-colors shrink-0"
        >
          <Download className="w-4 h-4" />
          Export
        </button>
      </div>

      {/* Filter Row */}
      <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        <FilterBar 
          activeFilter={activeFilter} 
          onFilterChange={setActiveFilter}
          sortKey={sortKey}
          onSortChange={setSortKey}
        />
      </div>

      {/* Building Grid */}
      <div className="flex-1">
        {sortedBuildings.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-64 bg-white rounded-xl border border-gray-200 border-dashed">
            <p className="text-gray-500 text-[14px]">No buildings found matching your criteria.</p>
          </div>
        ) : (
          <AnimatePresence mode="wait">
            <motion.div 
              key="grid"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6"
            >
              {sortedBuildings.map((building, idx) => (
                <BuildingCard 
                  key={building.id} 
                  building={building} 
                  onClick={(selected) => router.push(`/buildings/${selected.id}`)}
                  index={idx}
                />
              ))}
            </motion.div>
          </AnimatePresence>
        )}
      </div>
    </div>
  );
}
