/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html","./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        core: {
          bg: "#0f0f12",
          card: "#15151b",
          violet: "#6C63FF",
          light: "#F5F5F5",
          ink: "#111111",
          accent: "#8B85FF",
          danger: "#DC2626",
          success: "#22C55E"
        }
      },
      boxShadow: {
        soft: "0 10px 30px rgba(0,0,0,.35)",
        hard: "0 8px 24px rgba(0,0,0,.6)"
      },
      borderRadius: {
        xl2: "1.25rem"
      }
    }
  },
  plugins: [],
}
