// src/utils/swCleanup.js
/**
 * Désenregistre tous les Service Workers et nettoie les caches
 * → évite d'avoir à faire Ctrl+Shift+R après chaque déploiement.
 *
 * On ne le fait qu'une seule fois par session (flag en mémoire).
 */

let ran = false;

export async function swCleanup() {
  if (ran) return;
  ran = true;

  try {
    // 1) Unregister all service workers
    if ("serviceWorker" in navigator) {
      const regs = await navigator.serviceWorker.getRegistrations();
      await Promise.all(regs.map((r) => r.unregister().catch(() => {})));
      // Si un SW contrôle encore la page, on lui demande de se désactiver
      if (navigator.serviceWorker.controller) {
        navigator.serviceWorker.controller.postMessage({ type: "SKIP_WAITING" });
      }
    }

    // 2) Delete all caches (workbox, vite, custom…)
    if (typeof caches !== "undefined" && caches.keys) {
      const keys = await caches.keys();
      await Promise.all(keys.map((k) => caches.delete(k).catch(() => {})));
    }
  } catch (e) {
    // On ne casse pas l'app si le cleanup échoue
    console.warn("[swCleanup] warning:", e);
  }
}
