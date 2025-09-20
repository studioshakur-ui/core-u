export default {
  content: ["./index.html", "./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        core: {
          bg: "#0b0b12",
          card: "#141421",
          text: "#ECECF3",
          muted: "#6B6B80",
          accent: "#8B5CF6",
          accentHover: "#A78BFA",
          accentPressed: "#7C3AED"
        }
      },
      boxShadow: {
        e1: "0 4px 12px rgba(0,0,0,0.24)",
        e2: "0 10px 30px rgba(0,0,0,0.28)",
        e3: "0 24px 60px rgba(0,0,0,0.36)"
      },
      borderRadius: { xl2: "1.25rem" },
      transitionTimingFunction: { "out-quad": "cubic-bezier(0.25, 0.46, 0.45, 0.94)" }
    }
  },
  plugins: []
};
