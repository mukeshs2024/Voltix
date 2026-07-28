export const NAV_ITEMS = [
  { name: "Dashboard", href: "/", iconName: "LayoutDashboard" },
  { name: "Buildings", href: "/buildings", iconName: "Building2" },
  { name: "Analytics", href: "/analytics", iconName: "BarChart3" },
  { name: "Alerts & Incidents", href: "/alerts", iconName: "AlertTriangle" },
  { name: "Scenario Builder", href: "/scenario-builder", iconName: "GitFork" },
  { name: "AI Copilot", href: "/copilot", iconName: "Bot" },
  { name: "Reports", href: "/reports", iconName: "FileText" },
  { name: "Settings", href: "/settings", iconName: "Settings" },
] as const;

export const THEME_CONSTANTS = {
  colors: {
    background: "#FFFFFF",
    surface: "#FAFAFA",
    sidebar: "#FCFCFC",
    primaryText: "#111827",
    secondaryText: "#6B7280",
    border: "#E5E7EB",
    accent: "#22C55E",
    success: "#22C55E",
    warning: "#F59E0B",
    danger: "#EF4444",
  },
  borderRadius: "24px",
  fontFamily: "Inter",
} as const;
