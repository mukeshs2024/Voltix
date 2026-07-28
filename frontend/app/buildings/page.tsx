"use client";

import React, { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { PageContainer, SectionContainer } from "@/components/shared/page-container";
import { BuildingsSkeleton } from "@/components/buildings/buildings-skeleton";
import { BuildingCard } from "@/components/buildings/building-card";
import { PageHeader } from "@/components/shared/page-header";
import { SearchBar } from "@/components/shared/search-bar";
import { FilterBar } from "@/components/shared/filter-bar";
import { EmptyState } from "@/components/shared/empty-state";
import { MetricCard } from "@/components/shared/metric-card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { BUILDING_DETAILS, BuildingDetail } from "@/data/buildings";
import { ArrowDownAZ, ArrowUpZA, Building2, Download, Filter, Leaf, Search, SlidersHorizontal, Zap } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

type StatusFilter = "all" | BuildingDetail["status"];
type SortKey = "aiScore" | "energy" | "occupancy" | "alerts" | "name";

export default function BuildingsPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [activeFilter, setActiveFilter] = useState<StatusFilter>("all");
  const [sortKey, setSortKey] = useState<SortKey>("aiScore");
  const [showFilters, setShowFilters] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1000);
    return () => clearTimeout(timer);
  }, []);

  const sortedBuildings = useMemo(() => {
    const filtered = BUILDING_DETAILS.filter((building) => {
      const matchesSearch = [building.name, building.location].some((value) =>
        value.toLowerCase().includes(searchTerm.toLowerCase())
      );

      const matchesFilter = activeFilter === "all" ? true : building.status === activeFilter;

      return matchesSearch && matchesFilter;
    });

    return filtered.sort((left, right) => {
      switch (sortKey) {
        case "aiScore":
          return right.aiScore - left.aiScore;
        case "energy":
          return left.energyKw - right.energyKw;
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
  }, [activeFilter, searchTerm, sortKey]);

  const totalAlerts = BUILDING_DETAILS.reduce((sum, building) => sum + building.activeAlerts, 0);
  const averageAiScore = Math.round(
    BUILDING_DETAILS.reduce((sum, building) => sum + building.aiScore, 0) / BUILDING_DETAILS.length
  );
  const averageOccupancy = Math.round(
    BUILDING_DETAILS.reduce((sum, building) => sum + building.occupancyRate, 0) / BUILDING_DETAILS.length
  );

  function handleExportSnapshot() {
    const payload = JSON.stringify(BUILDING_DETAILS, null, 2);
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
    return <BuildingsSkeleton />;
  }

  return (
    <PageContainer>
      {/* Page Header */}
      <SectionContainer>
        <PageHeader 
          title="Building Portfolio"
          description={`Manage and monitor ${BUILDING_DETAILS.length} active autonomous facilities.`}
          actions={
            <>
              <SearchBar 
                value={searchTerm} 
                onChange={setSearchTerm} 
                placeholder="Search buildings or locations..." 
              />
              <div className="flex items-center gap-2 w-full sm:w-auto">
                <FilterBar label="Filters" onClick={() => setShowFilters((current) => !current)} />
                <Button variant="outline" size="sm" className="h-9 px-3 gap-2 bg-white hidden sm:flex" onClick={handleExportSnapshot}>
                  <Download className="w-4 h-4" />
                  <span>Export Snapshot</span>
                </Button>
              </div>
            </>
          }
        />
      </SectionContainer>

      <SectionContainer className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
        <MetricCard title="Portfolio Coverage" value={BUILDING_DETAILS.length} trend="up" changePercent={100} subtitle="connected facilities" icon={<Building2 className="w-4 h-4 text-[#111827]" />} delay={0.05} />
        <MetricCard title="Average AI Score" value={averageAiScore} trend="up" changePercent={8.2} subtitle="portfolio average" icon={<Zap className="w-4 h-4 text-[#22C55E]" />} delay={0.1} />
        <MetricCard title="Active Alerts" value={totalAlerts} trend={totalAlerts > 0 ? "up" : "neutral"} changePercent={totalAlerts > 0 ? 12.5 : 0} subtitle="across buildings" icon={<Filter className="w-4 h-4 text-[#EF4444]" />} delay={0.15} />
        <MetricCard title="Avg Occupancy" value={`${averageOccupancy}%`} trend="neutral" subtitle="live portfolio load" icon={<Leaf className="w-4 h-4 text-[#22C55E]" />} delay={0.2} />
      </SectionContainer>

      <SectionContainer>
        {showFilters && (
          <Card className="border-[#E5E7EB]">
            <CardContent className="p-5 space-y-4">
              <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                <div>
                  <p className="text-sm font-semibold text-[#111827] flex items-center gap-2">
                    <SlidersHorizontal className="w-4 h-4 text-[#6B7280]" />
                    Portfolio filters
                  </p>
                  <p className="text-xs text-[#6B7280] mt-1">Switch between status buckets and sort the active grid in-place.</p>
                </div>
                <div className="flex items-center gap-2 flex-wrap">
                  {(["all", "OPTIMAL", "ATTENTION_REQUIRED", "CRITICAL"] as const).map((filter) => (
                    <Button
                      key={filter}
                      variant={activeFilter === filter ? "primary" : "outline"}
                      size="sm"
                      onClick={() => setActiveFilter(filter)}
                      className={activeFilter === filter ? "bg-[#111827] text-white border-none" : "bg-white"}
                    >
                      {filter === "all" ? "All" : filter.replace("_", " ")}
                    </Button>
                  ))}
                </div>
              </div>

              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div className="flex items-center gap-2 text-sm text-[#6B7280]">
                  <Badge variant="neutral">{sortedBuildings.length} visible</Badge>
                  <span>Sort by</span>
                </div>
                <div className="flex items-center gap-2 flex-wrap">
                  {([
                    { key: "aiScore", label: "AI Score", icon: ArrowDownAZ },
                    { key: "energy", label: "Energy", icon: Zap },
                    { key: "occupancy", label: "Occupancy", icon: Search },
                    { key: "alerts", label: "Alerts", icon: Filter },
                    { key: "name", label: "Name", icon: ArrowUpZA },
                  ] as const).map((option) => {
                    const Icon = option.icon;

                    return (
                      <Button
                        key={option.key}
                        variant={sortKey === option.key ? "secondary" : "outline"}
                        size="sm"
                        onClick={() => setSortKey(option.key)}
                        className="bg-white"
                      >
                        <Icon className="w-4 h-4" />
                        <span>{option.label}</span>
                      </Button>
                    );
                  })}
                  <Button variant="ghost" size="sm" onClick={() => { setSearchTerm(""); setActiveFilter("all"); setSortKey("aiScore"); }}>
                    Reset
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {sortedBuildings.length === 0 ? (
          <EmptyState 
            icon={Building2}
            title="No buildings found"
            description="Try adjusting your search or filters."
            actionLabel="Clear Search"
            onAction={() => {
              setSearchTerm("");
              setActiveFilter("all");
            }}
          />
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
      </SectionContainer>
    </PageContainer>
  );
}

