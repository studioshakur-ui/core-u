import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import legacy from "@vitejs/plugin-legacy";

export default defineConfig({
  plugins: [
    react(),
    legacy({
      // génère un bundle fallback pour vieux Chrome/Android/Samsung, vieux Safari iOS
      targets: [
        "defaults",
        "not IE 11",
        "Android >= 7",
        "iOS >= 12",
        "Chrome >= 61",
        "Safari >= 12",
        "Samsung >= 8"
      ],
      renderLegacyChunks: true,
      polyfills: true,            // injecte les polyfills nécessaires
      modernPolyfills: true
    })
  ],
  esbuild: { jsx: "automatic" },
  optimizeDeps: { include: ["react", "react-dom", "react-router-dom"] },
  build: { sourcemap: true }
});
