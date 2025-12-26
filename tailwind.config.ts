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
        background: "var(--background)",
        foreground: "var(--foreground)",
        // HSR Theme Colors
        hsr: {
          purple: "#6B4CA4",
          gold: "#D4AF37",
          dark: "#0F0F12",
          card: "#1A1A1E",
          border: "#2A2A30",
        }
      },
      fontFamily: {
        sans: ["var(--font-inter)", "ui-sans-serif", "system-ui"],
      }
    },
  },
  plugins: [],
};
export default config;
