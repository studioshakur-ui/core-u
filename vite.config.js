// vite.config.js
import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";

// Export dynamique pour récupérer le mode (development | production)
// et aligner process.env.NODE_ENV pour le code qui l'utilise.
export default ({ mode }) => {
  // Charge aussi les variables .env* si besoin (VITE_SUPABASE_URL, etc.)
  loadEnv(mode, process.cwd(), "");

  return defineConfig({
    plugins: [react()],

    // Alias pratique: import "@/..." pointe vers /src
    resolve: {
      alias: {
        "@": path.resolve(__dirname, "src"),
      },
    },

    // Build Netlify: active les sourcemaps pour déboguer les erreurs en prod
    build: {
      sourcemap: true,
      outDir: "dist",
      target: "es2019",
      // Si tu as des libs ESM pures, tu peux ajouter: commonjsOptions: { transformMixedEsModules: true }
      // rollupOptions: { external: [] }, // à garder si tu dois externaliser un module
    },

    server: {
      port: 5173,
      strictPort: false,
      open: false,
    },

    preview: {
      port: 4173,
    },

    // Aligne NODE_ENV pour les checks du type: process.env.NODE_ENV !== "production"
    // (utile pour l'ErrorBoundary que nous avons ajouté).
    define: {
      "process.env.NODE_ENV": JSON.stringify(mode),
    },
  });
};
