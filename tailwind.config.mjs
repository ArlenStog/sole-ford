/** @type {import('tailwindcss').Config} */
export default {
  content: ["./app/**/*.{js,jsx}", "./components/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        ford: { DEFAULT: "#003478", dark: "#00214d", light: "#1a5bb8" },
        accent: { DEFAULT: "#f5a300", dark: "#d48c00" },
      },
    },
  },
  plugins: [],
};
