import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          bg: "#F5F3EE",
          fg: "#151515",
          surface: "#E8E5DE",
          accent: "#D8FF36", // Electric Lime
          dark: "#101010",
          cardDark: "#181818",
          muted: "#777777",
          border: "#D4D0C8",
          borderDark: "#262626",
          white: "#FFFFFF",
        },
      },
      fontFamily: {
        heading: ["var(--font-heading)", "Space Grotesk", "sans-serif"],
        display: ["var(--font-display)", "Bebas Neue", "Impact", "sans-serif"],
        sans: ["var(--font-sans)", "Inter", "sans-serif"],
      },
      letterSpacing: {
        tightest: "-0.05em",
        tighter: "-0.03em",
        widest: "0.2em",
        mega: "0.3em",
      },
      animation: {
        "marquee-fast": "marquee 18s linear infinite",
        "marquee-slow": "marquee 35s linear infinite",
        "pulse-subtle": "pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite",
      },
      keyframes: {
        marquee: {
          "0%": { transform: "translateX(0%)" },
          "100%": { transform: "translateX(-50%)" },
        },
      },
    },
  },
  plugins: [],
};

export default config;
