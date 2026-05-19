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
        primary: "#4f46e5",
        "primary-dark": "#4338ca",
        "primary-light": "#6366f1",
        secondary: "#8b5cf6",
        accent: "#f59e0b",
        success: "#10b981",
        danger: "#ef4444",
        bg: "#ffffff",
        "bg-soft": "#f8fafc",
        "bg-blue": "#eef2ff",
        "bg-dark": "#0f172a",
        surface: "#ffffff",
        ink: "#1e1b4b",
        "text-muted": "#6b7280",
        "text-light": "#9ca3af",
        border: "#e5e7eb",
        "border-focus": "#6366f1",
      },
      fontFamily: {
        sans: ["var(--font-inter)", "system-ui", "sans-serif"],
        heading: ["var(--font-jakarta)", "system-ui", "sans-serif"],
        mono: ["var(--font-dm-mono)", "monospace"],
      },
      borderRadius: {
        DEFAULT: "8px",
        sm: "4px",
        md: "8px",
        lg: "12px",
        xl: "16px",
        "2xl": "24px",
        "3xl": "32px",
      },
      boxShadow: {
        card: "0 1px 3px 0 rgba(0,0,0,.07), 0 1px 2px -1px rgba(0,0,0,.05)",
        "card-hover": "0 8px 24px -4px rgba(79,70,229,.18), 0 2px 6px -2px rgba(0,0,0,.08)",
        "card-lg": "0 12px 32px -8px rgba(0,0,0,.12), 0 4px 8px -4px rgba(0,0,0,.06)",
        glow: "0 0 32px rgba(99,102,241,.3)",
        "glow-sm": "0 0 16px rgba(99,102,241,.2)",
      },
      backgroundImage: {
        "gradient-primary": "linear-gradient(135deg, #4f46e5 0%, #8b5cf6 100%)",
        "gradient-hero": "linear-gradient(135deg, #eef2ff 0%, #f5f3ff 50%, #fdf4ff 100%)",
        "gradient-card": "linear-gradient(135deg, #ffffff 0%, #f8fafc 100%)",
        "gradient-dark": "linear-gradient(135deg, #1e1b4b 0%, #312e81 100%)",
      },
      keyframes: {
        fadeUp: {
          "0%": { opacity: "0", transform: "translateY(20px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        fadeIn: {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        ticker: {
          "0%": { transform: "translateX(0)" },
          "100%": { transform: "translateX(-50%)" },
        },
        shimmer: {
          "0%": { backgroundPosition: "-200% 0" },
          "100%": { backgroundPosition: "200% 0" },
        },
        pulse_slow: {
          "0%, 100%": { opacity: "1" },
          "50%": { opacity: "0.6" },
        },
      },
      animation: {
        fadeUp: "fadeUp 0.55s cubic-bezier(0.16, 1, 0.3, 1) forwards",
        fadeIn: "fadeIn 0.4s ease forwards",
        ticker: "ticker 28s linear infinite",
        shimmer: "shimmer 2s linear infinite",
        pulse_slow: "pulse_slow 2s ease-in-out infinite",
      },
    },
  },
  plugins: [],
};

export default config;
