import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";
export default ({ mode }) => {
  loadEnv(mode, process.cwd(), "");
  return defineConfig({
    plugins: [react()],
    resolve: { alias: { "@": path.resolve(__dirname, "src") } },
    build: { outDir: "dist", target: "es2019", sourcemap: true,
      rollupOptions: { output: { manualChunks: { vendor: ["react", "react-dom", "react-router-dom"] } } } }
  });
};
