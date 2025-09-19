// src/main.jsx
import React from "react";
import { createRoot } from "react-dom/client";

/** Petit logger de démarrage (visible en console) */
console.log("[CORE:test] main.jsx loaded at", new Date().toISOString());

/** Attrape toute erreur JS non gérée pour éviter l'écran blanc silencieux */
window.addEventListener("error", (e) => {
  console.error("[CORE:test] window error:", e?.error || e);
});
window.addEventListener("unhandledrejection", (e) => {
  console.error("[CORE:test] unhandledrejection:", e?.reason || e);
});

/** Composant de test : zéro dépendance, juste du texte */
function AppTest() {
  return (
    <main id="main" style={{ padding: 24, fontFamily: "ui-sans-serif, system-ui" }}>
      <h1 style={{ marginTop: 0 }}>CORE funziona ✅</h1>
      <p>Se vedi questo messaggio, React è montato correttamente.</p>
      <p style={{ color: "#475569" }}>
        Ora possiamo reintrodurre Router, Supabase e il resto passo passo.
      </p>
    </main>
  );
}

/** Montage React strict */
const rootEl = document.getElementById("root");
if (!rootEl) {
  throw new Error("Elemento #root non trovato nel DOM (index.html).");
}
createRoot(rootEl).render(
  <React.StrictMode>
    <AppTest />
  </React.StrictMode>
);
