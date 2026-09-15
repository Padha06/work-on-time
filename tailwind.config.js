/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        charcoal: "#1C1C1E",
        graphite: "#3A3A3C",
        aluminum: "#C7CBCF",
        wood: "#A9764E",
        cream: "#FAFAF8",
        accent: "#C9622C",
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
