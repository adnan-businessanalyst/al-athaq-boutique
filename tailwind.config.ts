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
        athaq: {
          purple: "#6C3FA4",
          "purple-dark": "#4E2A7A",
          "purple-tint": "#C6A9E8",
          teal: "#178C86",
          lapis: "#2E6BE6",
          cream: "#FBF5EC",
          ink: "#2A2320",
          white: "#FFFFFF",
        },
      },
      fontFamily: {
        display: ["var(--font-marcellus)", "Georgia", "serif"],
        sans: ["var(--font-work-sans)", "system-ui", "sans-serif"],
      },
      maxWidth: {
        content: "1240px",
      },
      borderRadius: {
        pill: "9999px",
      },
      transitionDuration: {
        nav: "450ms",
      },
      backgroundImage: {
        "hero-fallback":
          "radial-gradient(120% 120% at 50% 10%, #7B4BB4, #4E2A7A 55%, #2b1a4d)",
        "story-fallback":
          "radial-gradient(100% 100% at 30% 20%, #5a3488, #4E2A7A 50%, #2b1a4d)",
        "footer-gradient":
          "radial-gradient(120% 100% at 50% 0%, #7B4BB4, #4E2A7A 45%, #2b1a4d)",
        "tile-pattern":
          "radial-gradient(circle, rgba(108,63,164,0.12) 1px, transparent 1.5px)",
      },
      backgroundSize: {
        "tile-dot": "18px 18px",
      },
      keyframes: {
        "fly-up": {
          "0%": { opacity: "0", transform: "translateY(28px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        "fade-in": {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
      },
      animation: {
        "fly-up": "fly-up 0.7s cubic-bezier(0.22, 1, 0.36, 1) both",
        "fade-in": "fade-in 0.5s ease both",
      },
    },
  },
  plugins: [],
};

export default config;
