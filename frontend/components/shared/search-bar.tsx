import React from "react";
import { Search } from "lucide-react";

interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

export function SearchBar({ value, onChange, placeholder = "Search..." }: SearchBarProps) {
  return (
    <div className="relative w-full sm:w-64">
      <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-[#6B7280]" />
      <input
        type="text"
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full bg-white border border-[#E5E7EB] rounded-[10px] pl-9 pr-4 py-2 text-sm text-[#111827] placeholder-[#6B7280] focus:outline-none focus:border-[#111827] focus:ring-1 focus:ring-[#111827] shadow-sm transition-all"
      />
    </div>
  );
}
