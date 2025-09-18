// vite.config.js
import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";

export default ({ mode }) => {
  // Charge aussi les variables .env* (pour VITE_SUPABASE_URL / VITE_SUPABASE_ANON_KEY si besoin local)
  loadEnv(mode, process.cwd(), "");

  return defineConfig({
    plugins: [react()],

    // Alias: "@/..." pointe vers "src"
    resolve: {
      alias: {
        "@": path.resolve(__dirname, "src"),
      },
    },

    build: {
      sourcemap: true,   // utile pour déboguer en prod (Netlify)
      outDir: "dist",
      target: "es2019",
      // rollupOptions: { external: [] }, // à utiliser si tu veux externaliser un module
      // commonjsOptions: { transformMixedEsModules: true }, // si tu en as besoin
    },

    server: {
      port: 5173,
      strictPort: false,
      open: false,
    },

    preview: {
      port: 4173,
    },

    // Expose NODE_ENV pour l'ErrorBoundary (affichage du stack uniquement en non-prod)
    define: {
      "process.env.NODE_ENV": JSON.stringify(mode),
    },
  });
};
