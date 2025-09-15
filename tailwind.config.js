export default {
  content: ["./index.html","./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        ink: "#0f172a",
        surface: "#f5f6fa",
        primary: "#7c3aed",
        primaryStrong: "#5B21B6",
        success: "#00B050",
        warning: "#F59E0B",
        danger: "#DC2626",
        focus: "#7c3aed"
      },
      borderRadius: { 'lg':'12px', 'xl':'16px', '2xl': '20px' }
    }
  },
  plugins: []
}