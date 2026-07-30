import React from "react";

type StatusFilter = "all" | "OPTIMAL" | "ATTENTION_REQUIRED" | "CRITICAL";
type SortKey = "aiScore" | "energy" | "occupancy" | "alerts" | "name";

interface FilterBarProps {
  activeFilter: StatusFilter;
  onFilterChange: (filter: StatusFilter) => void;
  sortKey: SortKey;
  onSortChange: (sort: SortKey) => void;
}

export function FilterBar({ activeFilter, onFilterChange, sortKey, onSortChange }: FilterBarProps) {
  const statuses: { value: StatusFilter; label: string }[] = [
    { value: "all", label: "All" },
    { value: "OPTIMAL", label: "Optimal" },
    { value: "ATTENTION_REQUIRED", label: "Warning" },
    { value: "CRITICAL", label: "Critical" },
  ];

  const sorts: { value: SortKey; label: string }[] = [
    { value: "aiScore", label: "AI Score" },
    { value: "energy", label: "Energy" },
    { value: "occupancy", label: "Occupancy" },
    { value: "name", label: "Name" },
  ];

  return (
    <div className="flex items-center gap-6 overflow-x-auto pb-2 sm:pb-0 hide-scrollbar w-full whitespace-nowrap">
      <div className="flex items-center gap-2">
        <span className="text-[12px] font-semibold text-secondaryText uppercase tracking-wider mr-2">Status</span>
        {statuses.map((status) => (
          <button
            key={status.value}
            onClick={() => onFilterChange(status.value)}
            className={`px-3 py-1.5 rounded-md text-[13px] font-medium transition-colors border ${
              activeFilter === status.value
                ? "bg-gray-900 text-white border-gray-900"
                : "bg-surface text-secondaryText border-border hover:bg-background hover:text-primaryText"
            }`}
          >
            {status.label}
          </button>
        ))}
      </div>

      <div className="w-px h-6 bg-border hidden sm:block"></div>

      <div className="flex items-center gap-2">
        <span className="text-[12px] font-semibold text-secondaryText uppercase tracking-wider mr-2">Sort By</span>
        {sorts.map((sort) => (
          <button
            key={sort.value}
            onClick={() => onSortChange(sort.value)}
            className={`px-3 py-1.5 rounded-md text-[13px] font-medium transition-colors border ${
              sortKey === sort.value
                ? "bg-border text-primaryText border-gray-300"
                : "bg-surface text-secondaryText border-border hover:bg-background hover:text-primaryText"
            }`}
          >
            {sort.label}
          </button>
        ))}
      </div>
    </div>
  );
}
