/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        core: {
          bg: "#f6f7f9",
          green: "#15a34a"
        }
      },
      borderRadius: { '2xl': '1rem' },
      boxShadow: {
        soft: "0 6px 24px rgba(0,0,0,.06)",
        e1: "0 2px 10px rgba(0,0,0,.06)",
        e2: "0 6px 24px rgba(0,0,0,.10)"
      }
    }
  },
  plugins: []
};
