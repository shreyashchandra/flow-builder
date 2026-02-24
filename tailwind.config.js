// tailwind.config.js
/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        canvas: "#0f1117",
        panel: "#1a1d27",
        card: "#21253a",
        border: "#2d3148",
        accent: "#6366f1",
        "accent-hover": "#4f46e5",
        success: "#10b981",
        danger: "#ef4444",
        warning: "#f59e0b",
        muted: "#64748b",
      },
    },
  },
  plugins: [],
};
