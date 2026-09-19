import type { Config } from "tailwindcss";

export default {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        arena: {
          bg: "#FAFAFC",
          surface: "#FFFFFF",
          "surface-subtle": "#F5F4F7",
          "surface-purple": "#F5F0FF",
          border: "#E7E5EA",
          "border-subtle": "#F0EEF5",
          purple: "#8B3DFF",
          "purple-hover": "#7C2AE8",
          "purple-deep": "#6D28D9",
          "purple-bright": "#A855F7",
          "purple-soft": "#C084FC",
          "purple-light": "#E9D5FF",
          "purple-verylight": "#F5F0FF",
          text: "#151515",
          "text-secondary": "#5E5E68",
          muted: "#92929D",
          dark: "#17171A",
          "dark-surface": "#17171A",
          "dark-card": "#1E1E22",
          accepted: "#16A34A",
          error: "#DC2626",
          warning: "#D97706",
          medium: "#D97706",
          hard: "#DC2626",
        },
      },
      fontFamily: {
        heading: ["Outfit", "sans-serif"],
        body: ["'Nunito Sans'", "sans-serif"],
        mono: ["'JetBrains Mono'", "monospace"],
      },
      boxShadow: {
        purple: "0 4px 20px rgba(139, 61, 255, 0.2)",
        "purple-sm": "0 2px 10px rgba(139, 61, 255, 0.12)",
        card: "0 4px 20px rgba(0, 0, 0, 0.05)",
        float: "0 10px 30px rgba(23, 23, 23, 0.08)",
      },
    },
  },
  plugins: [],
} satisfies Config;
