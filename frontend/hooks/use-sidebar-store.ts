import { create } from "zustand";

interface SidebarState {
  collapsed: boolean;
  activeNav: string;
  toggleSidebar: () => void;
  setCollapsed: (collapsed: boolean) => void;
  setActiveNav: (nav: string) => void;
}

export const useSidebarStore = create<SidebarState>((set) => ({
  collapsed: false,
  activeNav: "dashboard",
  toggleSidebar: () => set((state) => ({ collapsed: !state.collapsed })),
  setCollapsed: (collapsed) => set({ collapsed }),
  setActiveNav: (activeNav) => set({ activeNav }),
}));
