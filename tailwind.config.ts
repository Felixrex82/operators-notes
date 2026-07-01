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
        void: "#0A0A0B",
        surface: "#111113",
        border: "#1C1C1F",
        "border-light": "#2A2A2F",
        primary: "#F2F2F3",
        secondary: "#A0A0B0",
        muted: "#5A5A6A",
        accent: "#3B7BF8",
        "accent-dim": "#1E3A7A",
      },
      fontFamily: {
        sans: ["Inter", "system-ui", "sans-serif"],
        mono: ["Geist Mono", "JetBrains Mono", "monospace"],
      },
      typography: {
        DEFAULT: {
          css: {
            color: "#A0A0B0",
            maxWidth: "65ch",
          },
        },
      },
    },
  },
  plugins: [],
};

export default config;
