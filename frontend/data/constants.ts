export const NAV_ITEMS = [
  { name: "Dashboard", href: "/", iconName: "LayoutDashboard" },
  { name: "Buildings", href: "/buildings", iconName: "Building2" },
  { name: "Analytics", href: "/analytics", iconName: "BarChart3" },
  { name: "Alerts & Incidents", href: "/alerts", iconName: "AlertTriangle" },
  { name: "AI Control Center", href: "/ai-center", iconName: "BrainCircuit" },
  { name: "AI Copilot", href: "/copilot", iconName: "Bot" },
  { name: "Simulation Studio", href: "/simulation-input", iconName: "FlaskConical" },
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
    accent: "#2563EB",
    success: "#10B981",
    warning: "#F97316",
    danger: "#EF4444",
  },
  borderRadius: "16px",
  fontFamily: "Inter",
} as const;
