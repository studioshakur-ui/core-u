// vite.config.js
import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";

export default ({ mode }) => {
  loadEnv(mode, process.cwd(), "");
  return defineConfig({
    plugins: [react()],

    resolve: {
      alias: {
        "@": path.resolve(__dirname, "src")
      }
    },

    // 🔧 Important: exceljs/jspdf/html2canvas sont lourds
    optimizeDeps: {
      include: [
        "react",
        "react-dom",
        "react-router-dom",
        "zustand",
        "dayjs",
        "exceljs",
        "jspdf",
        "jspdf-autotable",
        "html2canvas",
        "clsx",
        "localforage"
      ]
    },

    build: {
      sourcemap: true,
      outDir: "dist",
      target: "es2019",
      modulePreload: { polyfill: false },
      // taille/chunking mieux maîtrisés → moins de stress mémoire côté build
      rollupOptions: {
        output: {
          manualChunks: {
            vendor: ["react", "react-dom", "react-router-dom"],
            data: ["dayjs", "zustand", "localforage"],
            heavy: ["exceljs", "jspdf", "jspdf-autotable", "html2canvas"]
          }
        }
      },
      commonjsOptions: {
        transformMixedEsModules: true
      }
    },

    server: {
      port: 5173
    },

    preview: {
      port: 4173
    },

    define: {
      "process.env.NODE_ENV": JSON.stringify(mode)
    }
  });
};
