export default {
  content: ["./index.html", "./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        core: {
          bg: "#ffffff",
          surface: "#f5f5f7",
          border: "#e6e8eb",
          text: "#111111",
          muted: "#6b7280",
          red: "#F80000",
          redHover: "#D60000",
          redPressed: "#B00000"
        }
      },
      boxShadow: {
        subtle: "0 1px 2px rgba(0,0,0,0.04)"
      },
      borderRadius: {
        md: "10px",
        lg: "14px"
      },
      maxWidth: {
        '7xl': '80rem'
      }
    },
  },
  plugins: [],
};
