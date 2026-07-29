"use client";

import React from "react";

export function ScenarioSkeletonGrid({ count = 6 }: { count?: number }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
      {Array.from({ length: count }).map((_, i) => (
        <div
          key={i}
          className="bg-white rounded-xl border border-gray-200 p-5 shadow-xs flex flex-col justify-between h-[210px] animate-pulse"
        >
          <div>
            <div className="flex justify-between items-center mb-3">
              <div className="h-4 w-20 bg-gray-200 rounded-full" />
              <div className="h-4 w-24 bg-gray-200 rounded-full" />
            </div>
            <div className="h-5 w-3/4 bg-gray-200 rounded mb-2" />
            <div className="h-4 w-full bg-gray-100 rounded mb-1" />
            <div className="h-4 w-2/3 bg-gray-100 rounded" />
          </div>

          <div>
            <div className="pt-3 mb-4 border-t border-gray-100 flex justify-between">
              <div className="h-3.5 w-24 bg-gray-200 rounded" />
              <div className="h-3.5 w-16 bg-gray-200 rounded" />
            </div>
            <div className="h-[38px] w-full bg-gray-200 rounded-lg" />
          </div>
        </div>
      ))}
    </div>
  );
}
