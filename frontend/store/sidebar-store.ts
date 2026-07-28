import { create } from "zustand";

interface SidebarState {
  collapsed: boolean;
  mobileOpen: boolean;
  activeNav: string;
  toggleSidebar: () => void;
  setCollapsed: (collapsed: boolean) => void;
  toggleMobile: () => void;
  setMobileOpen: (open: boolean) => void;
  setActiveNav: (nav: string) => void;
}

export const useSidebarStore = create<SidebarState>((set) => ({
  collapsed: false,
  mobileOpen: false,
  activeNav: "dashboard",
  toggleSidebar: () => set((state) => ({ collapsed: !state.collapsed })),
  setCollapsed: (collapsed) => set({ collapsed }),
  toggleMobile: () => set((state) => ({ mobileOpen: !state.mobileOpen })),
  setMobileOpen: (mobileOpen) => set({ mobileOpen }),
  setActiveNav: (activeNav) => set({ activeNav }),
}));
