export default {
  content: ["./index.html", "./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        core: {
          bg: "#111113",
          card: "#1A1B1E",
          text: "#ECEDEF",
          muted: "#7C7F87",
          accent: "#8B5CF6",
          accentHover: "#A78BFA",
          accentPressed: "#7C3AED",
          capo: "#17a34a"
        }
      },
      boxShadow: {
        e1: "0 4px 12px rgba(0,0,0,0.18)",
        e2: "0 12px 32px rgba(0,0,0,0.24)",
        e3: "0 28px 64px rgba(0,0,0,0.32)"
      },
      borderRadius: { xl2: "1.25rem" },
      backgroundImage: {
        'lv-damier': "linear-gradient(0deg, rgba(255,255,255,0.06) 50%, transparent 50%), linear-gradient(90deg, rgba(255,255,255,0.06) 50%, transparent 50%)"
      },
      backgroundSize: { 'damier': '40px 40px' }
    },
  },
  plugins: [],
};
