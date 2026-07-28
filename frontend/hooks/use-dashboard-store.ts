import { create } from "zustand";

interface DashboardUIState {
  selectedTimeframe: "24h" | "7d" | "30d" | "1y";
  selectedBuildingFilter: string;
  isCopilotDrawerOpen: boolean;
  activeFilterSystem: string;
  setTimeframe: (timeframe: "24h" | "7d" | "30d" | "1y") => void;
  setBuildingFilter: (buildingId: string) => void;
  setCopilotDrawerOpen: (open: boolean) => void;
  toggleCopilotDrawer: () => void;
  setFilterSystem: (system: string) => void;
}

export const useDashboardStore = create<DashboardUIState>((set) => ({
  selectedTimeframe: "7d",
  selectedBuildingFilter: "all",
  isCopilotDrawerOpen: false,
  activeFilterSystem: "all",
  setTimeframe: (selectedTimeframe) => set({ selectedTimeframe }),
  setBuildingFilter: (selectedBuildingFilter) => set({ selectedBuildingFilter }),
  setCopilotDrawerOpen: (isCopilotDrawerOpen) => set({ isCopilotDrawerOpen }),
  toggleCopilotDrawer: () => set((state) => ({ isCopilotDrawerOpen: !state.isCopilotDrawerOpen })),
  setFilterSystem: (activeFilterSystem) => set({ activeFilterSystem }),
}));
