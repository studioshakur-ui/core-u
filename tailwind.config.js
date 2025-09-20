// tailwind.config.js
/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx,ts,tsx}"
  ],
  theme: {
    extend: {
      colors: {
        core: {
          50:  "#f7f5ff",
          100: "#eee9ff",
          200: "#dac8ff",
          300: "#c3a0ff",
          400: "#a86dff",
          500: "#8f3dff",
          600: "#7a25f2",
          700: "#671fd1",
          800: "#4d18a0",
          900: "#37126f"
        }
      }
    }
  },
  plugins: [],
};
