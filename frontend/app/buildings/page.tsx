"use client";

import React, { useState, useEffect } from "react";
import { PageContainer, SectionContainer } from "@/components/shared/page-container";
import { BuildingsSkeleton } from "@/components/buildings/buildings-skeleton";
import { BuildingCard } from "@/components/buildings/building-card";
import { BuildingListItem } from "@/components/buildings/building-list-item";
import { BuildingDrawer } from "@/components/buildings/building-drawer";
import { PageHeader } from "@/components/shared/page-header";
import { SearchBar } from "@/components/shared/search-bar";
import { FilterBar } from "@/components/shared/filter-bar";
import { EmptyState } from "@/components/shared/empty-state";
import { Button } from "@/components/ui/button";
import { LayoutGrid, List, Plus, Building2 } from "lucide-react";
import { Building } from "@/types";
import { motion, AnimatePresence } from "framer-motion";

const mockBuildings: Building[] = [
  { id: "1", name: "HQ Tower One", location: "San Francisco, CA", areaSqFt: 150000, occupancyRate: 85, energyScore: 94, status: "OPTIMAL", activeAlerts: 0, monthlySavingsUSD: 12500, co2ReductionTons: 45 },
  { id: "2", name: "Innovation Hub", location: "Austin, TX", areaSqFt: 85000, occupancyRate: 92, energyScore: 88, status: "OPTIMAL", activeAlerts: 1, monthlySavingsUSD: 8400, co2ReductionTons: 28 },
  { id: "3", name: "East Coast Plaza", location: "New York, NY", areaSqFt: 210000, occupancyRate: 78, energyScore: 72, status: "ATTENTION_REQUIRED", activeAlerts: 3, monthlySavingsUSD: 4100, co2ReductionTons: 12 },
  { id: "4", name: "Westside Data Center", location: "San Jose, CA", areaSqFt: 320000, occupancyRate: 100, energyScore: 85, status: "OPTIMAL", activeAlerts: 0, monthlySavingsUSD: 24000, co2ReductionTons: 90 },
  { id: "5", name: "London Office", location: "London, UK", areaSqFt: 65000, occupancyRate: 60, energyScore: 68, status: "CRITICAL", activeAlerts: 4, monthlySavingsUSD: 1200, co2ReductionTons: 5 },
  { id: "6", name: "Berlin Research Center", location: "Berlin, DE", areaSqFt: 110000, occupancyRate: 88, energyScore: 91, status: "OPTIMAL", activeAlerts: 0, monthlySavingsUSD: 9800, co2ReductionTons: 35 },
];

export default function BuildingsPage() {
  const [isLoading, setIsLoading] = useState(true);
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedBuilding, setSelectedBuilding] = useState<Building | null>(null);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1000);
    return () => clearTimeout(timer);
  }, []);

  const filteredBuildings = mockBuildings.filter(b => 
    b.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    b.location.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (isLoading) {
    return <BuildingsSkeleton />;
  }

  return (
    <PageContainer>
      {/* Page Header */}
      <SectionContainer>
        <PageHeader 
          title="Building Portfolio"
          description={`Manage and monitor ${mockBuildings.length} active autonomous facilities.`}
          actions={
            <>
              <SearchBar 
                value={searchTerm} 
                onChange={setSearchTerm} 
                placeholder="Search buildings..." 
              />
              <div className="flex items-center gap-2 w-full sm:w-auto">
                <FilterBar />
                
                <div className="flex bg-[#F3F4F6] p-1 rounded-lg border border-[#E5E7EB]">
                  <button
                    onClick={() => setViewMode("grid")}
                    className={`p-1.5 rounded-md transition-colors ${viewMode === "grid" ? "bg-white text-[#111827] shadow-sm" : "text-[#6B7280] hover:text-[#111827]"}`}
                  >
                    <LayoutGrid className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => setViewMode("list")}
                    className={`p-1.5 rounded-md transition-colors ${viewMode === "list" ? "bg-white text-[#111827] shadow-sm" : "text-[#6B7280] hover:text-[#111827]"}`}
                  >
                    <List className="w-4 h-4" />
                  </button>
                </div>

                <Button variant="primary" size="sm" className="h-9 px-3 gap-1 bg-[#111827] text-white hidden sm:flex border-none shadow-sm hover:bg-[#374151]">
                  <Plus className="w-4 h-4" />
                  <span>Add Node</span>
                </Button>
              </div>
            </>
          }
        />
      </SectionContainer>

      {/* Main Content Area */}
      <SectionContainer>
        {filteredBuildings.length === 0 ? (
          <EmptyState 
            icon={Building2}
            title="No buildings found"
            description="Try adjusting your search or filters."
            actionLabel="Clear Search"
            onAction={() => setSearchTerm("")}
          />
        ) : (
          <AnimatePresence mode="wait">
            {viewMode === "grid" ? (
              <motion.div 
                key="grid"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6"
              >
                {filteredBuildings.map((building, idx) => (
                  <BuildingCard 
                    key={building.id} 
                    building={building} 
                    onClick={setSelectedBuilding} 
                    index={idx}
                  />
                ))}
              </motion.div>
            ) : (
              <motion.div 
                key="list"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="flex flex-col"
              >
                {filteredBuildings.map((building, idx) => (
                  <BuildingListItem 
                    key={building.id} 
                    building={building} 
                    onClick={setSelectedBuilding} 
                    index={idx}
                  />
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        )}
      </SectionContainer>

      {/* Drawer */}
      <BuildingDrawer 
        building={selectedBuilding} 
        isOpen={!!selectedBuilding} 
        onClose={() => setSelectedBuilding(null)} 
      />
    </PageContainer>
  );
}
