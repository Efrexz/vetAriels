/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        paper: "#FFFFFF",
        mist: "#F4F7F9",
        ink: "#0F172A",
        slate: "#64748B",
        primary: "rgb(var(--c-primary-rgb) / <alpha-value>)",
        teal: {
          DEFAULT: "#0D9488",
          light: "#14B8A6",
          dark: "#0F766E",
        },
        amber: {
          DEFAULT: "#D97706",
          light: "#F59E0B",
          dark: "#C26604",
        },
        danger: "#DC2626",
        success: "#059669",
        warning: "#D97706",
      },
      fontFamily: {
        display: ['"Space Grotesk"', "sans-serif"],
        body: ['"Manrope"', "sans-serif"],
        mono: ['"JetBrains Mono"', "monospace"],
      },
      screens: {
        xs: "475px",
      },
    },
  },
  plugins: ["@tailwindcss/forms"],
};
