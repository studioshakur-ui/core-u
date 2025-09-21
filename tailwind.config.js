export default {
  content: ["./index.html", "./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        core: {
          bg: "#ffffff",
          surface: "#f5f5f7",
          border: "#e6e8eb",
          text: "#0f172a",
          muted: "#6b7280",
          violet: "#6C4CF5",
          violetHover: "#5636D9",
          violetPressed: "#4329B3",
          green: "#17b26a"
        }
      },
      boxShadow: {
        e0: "0 2px 8px rgba(0,0,0,0.06)",
        e1: "0 8px 24px rgba(0,0,0,0.08)"
      },
      borderRadius: { md: "12px", lg: "16px" },
      maxWidth: { '7xl': '80rem' }
    },
  },
  plugins: [],
};
