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
        primary: "#00ff87",
        "primary-dark": "#00cc6a",
        "primary-light": "#33ffA0",
        secondary: "#00e5ff",
        accent: "#f59e0b",
        success: "#00ff87",
        danger: "#ef4444",
        bg: "#080808",
        "bg-soft": "#0d0d0d",
        "bg-card": "#111111",
        "bg-card2": "#161616",
        "bg-blue": "#0d1a0d",
        "bg-dark": "#080808",
        surface: "#111111",
        ink: "#f4f4f5",
        "text-muted": "#71717a",
        "text-light": "#52525b",
        border: "#222222",
        "border-focus": "#00ff87",
      },
      fontFamily: {
        sans: ["var(--font-inter)", "system-ui", "sans-serif"],
        heading: ["var(--font-syne)", "system-ui", "sans-serif"],
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
        card: "0 1px 3px 0 rgba(0,0,0,.4), 0 1px 2px -1px rgba(0,0,0,.3)",
        "card-hover": "0 8px 24px -4px rgba(0,255,135,.12), 0 2px 6px -2px rgba(0,0,0,.4)",
        "card-lg": "0 12px 32px -8px rgba(0,0,0,.6), 0 4px 8px -4px rgba(0,0,0,.4)",
        glow: "0 0 32px rgba(0,255,135,.25)",
        "glow-sm": "0 0 16px rgba(0,255,135,.15)",
        "glow-lg": "0 0 60px rgba(0,255,135,.2)",
      },
      backgroundImage: {
        "gradient-primary": "linear-gradient(135deg, #00ff87 0%, #00e5ff 100%)",
        "gradient-hero": "linear-gradient(180deg, #080808 0%, #0a0a0a 100%)",
        "gradient-card": "linear-gradient(135deg, #111111 0%, #161616 100%)",
        "gradient-dark": "linear-gradient(135deg, #080808 0%, #111111 100%)",
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
          "50%": { opacity: "0.5" },
        },
        scanLine: {
          "0%": { top: "0%" },
          "100%": { top: "100%" },
        },
        blink: {
          "0%, 100%": { opacity: "1" },
          "50%": { opacity: "0" },
        },
        glowPulse: {
          "0%, 100%": { boxShadow: "0 0 16px rgba(0,255,135,.15)" },
          "50%": { boxShadow: "0 0 32px rgba(0,255,135,.35)" },
        },
      },
      animation: {
        fadeUp: "fadeUp 0.55s cubic-bezier(0.16, 1, 0.3, 1) forwards",
        fadeIn: "fadeIn 0.4s ease forwards",
        ticker: "ticker 28s linear infinite",
        shimmer: "shimmer 2s linear infinite",
        pulse_slow: "pulse_slow 2s ease-in-out infinite",
        scanLine: "scanLine 2s linear infinite",
        blink: "blink 1s step-end infinite",
        glowPulse: "glowPulse 2s ease-in-out infinite",
      },
    },
  },
  plugins: [],
};

export default config;
