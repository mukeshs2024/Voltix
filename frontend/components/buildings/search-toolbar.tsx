import React from "react";
import { Search } from "lucide-react";

interface SearchToolbarProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

export function SearchToolbar({ value, onChange, placeholder = "Search buildings..." }: SearchToolbarProps) {
  return (
    <div className="relative w-full max-w-[420px]">
      <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-secondaryText\/50" />
      <input
        type="text"
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full h-[40px] bg-surface border border-border rounded-md pl-9 pr-4 text-[14px] text-primaryText placeholder-gray-400 focus:outline-none focus:border-gray-300 focus:ring-1 focus:ring-gray-300 shadow-sm transition-all"
      />
    </div>
  );
}
