/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: "#E8580A",
        cream: "#FDF8F2",
        accent: "#F5C518",
        muted: "#6B6B6B",
        border: "#E8E0D5",
        success: "#2D9B5A",
        danger: "#D63C3C",
      },
      fontFamily: {
        playfair: ["'Playfair Display'", "serif"],
        sans: ["'DM Sans'", "sans-serif"],
        mono: ["'DM Mono'", "monospace"],
      },
    },
  },
  plugins: [],
}
