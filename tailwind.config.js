export default {
  content: ["./index.html","./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: { core: { bg:"#0f0f12", card:"#15151b", violet:"#6C63FF", light:"#F5F5F5", ink:"#111111", accent:"#8B85FF", danger:"#DC2626", success:"#22C55E", warning:"#F59E0B" } },
      boxShadow: { e1:"0 8px 18px rgba(0,0,0,.25)", e2:"0 10px 30px rgba(0,0,0,.35)", e3:"0 14px 42px rgba(0,0,0,.45)" },
      borderRadius: { xl2:"1.25rem" }
    }
  }, plugins: []
}
