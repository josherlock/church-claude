import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./lib/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        cream: "#F5F0EB",
        sand: "#EDE8E3",
        warmGray: "#D4C5B5",
        taupe: "#8B7355",
        espresso: "#2C2420",
        mocha: "#6B5E52",
        parchment: "#FAF8F6",
        gold: "#C9A96E",
        warmBorder: "#E0D5C8",
        sage: "#A8B5A0",
      },
      fontFamily: {
        serif: ["Playfair Display", "Georgia", "serif"],
        sans: ["Inter", "system-ui", "sans-serif"],
      },
    },
  },
  plugins: [],
};
export default config;
