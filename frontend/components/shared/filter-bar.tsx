import React from "react";
import { Button } from "@/components/ui/button";
import { Filter } from "lucide-react";

interface FilterBarProps {
  label?: string;
  onClick?: () => void;
}

export function FilterBar({ label = "Filter", onClick }: FilterBarProps) {
  return (
    <Button variant="outline" size="sm" onClick={onClick} className="h-9 px-3 gap-2 bg-white flex-1 sm:flex-none">
      <Filter className="w-4 h-4" />
      <span className="hidden sm:inline">{label}</span>
    </Button>
  );
}
