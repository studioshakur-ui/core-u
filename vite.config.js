import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  esbuild: { jsx: "automatic" },
  optimizeDeps: { include: ["react", "react-dom", "react-router-dom"] },
  build: { sourcemap: true },
});
