import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
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
      borderRadius: {
        voltix: "24px",
        card: "24px",
        btn: "12px",
      },
      boxShadow: {
        apple: "0 4px 20px -2px rgba(0, 0, 0, 0.05), 0 2px 6px -1px rgba(0, 0, 0, 0.02)",
        "apple-hover": "0 10px 25px -3px rgba(0, 0, 0, 0.08), 0 4px 10px -2px rgba(0, 0, 0, 0.03)",
      },
      fontFamily: {
        sans: ["Inter", "sans-serif"],
      },
    },
  },
  plugins: [],
};
export default config;
