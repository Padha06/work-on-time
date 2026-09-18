/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        charcoal: "#1C1C1E",
        graphite: "#3A3A3C",
        aluminum: "#C7CBCF",
        wood: "#8F5A30",
        cream: "#FAFAF8",
        accent: "#B45625",
        // Lighter accent for small text on dark surfaces (4.5:1 verified).
        accentsoft: "#E08A4E",
        // WhatsApp brand pair, reused across CTAs (tokenized, not hex).
        wa: "#25D366",
        wadeep: "#0B3D20",
      },
      fontFamily: {
        ui: ["Inter", "system-ui", "sans-serif"],
        display: ["Fraunces", "Georgia", "serif"],
      },
      maxWidth: {
        content: "1280px",
      },
    },
  },
  plugins: [],
};
