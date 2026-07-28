import { create } from "zustand";

interface UIState {
  selectedScenario: string | null;
  setSelectedScenario: (scenarioId: string | null) => void;
}

export const useUIStore = create<UIState>((set) => ({
  selectedScenario: null,
  setSelectedScenario: (selectedScenario) => set({ selectedScenario }),
}));
