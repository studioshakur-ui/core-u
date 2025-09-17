// src/lib/urlAuthParams.js
export function parseAuthParamsFromUrl(href = "") {
  const url = new URL(href || (typeof window !== "undefined" ? window.location.href : "http://localhost/"));

  // 1) query ?a=1
  const q = new URLSearchParams(url.search);

  // 2) hash brut #a=1&b=2
  const hash = url.hash || "";
  const hp = new URLSearchParams(hash.startsWith("#") ? hash.slice(1) : hash);

  // 3) cas HashRouter: "#/auth/callback?code=..." → on prend la partie après ? du dernier hash
  const lastHash = (href || url.href).split("#").slice(-1)[0] || "";
  const lastHashQuery = lastHash.includes("?") ? lastHash.split("?")[1] : "";
  const hp2 = new URLSearchParams(lastHashQuery);

  const get = (k) => q.get(k) || hp.get(k) || hp2.get(k);

  return {
    // PKCE / OAuth
    code: get("code"),
    // Magic link
    access_token: get("access_token"),
    refresh_token: get("refresh_token"),
    token_type: get("token_type"),
    expires_in: get("expires_in"),
    // Lien "verify" éventuel
    token_hash: get("token_hash"),
    type: get("type"),
    error: get("error"),
    error_description: get("error_description"),
  };
}

export function cleanAuthUrl() {
  if (typeof window === "undefined") return;
  // Nettoie l’URL pour ne pas relancer les handlers au refresh
  const clean = `${window.location.origin}/#/auth/callback`;
  window.history.replaceState({}, "", clean);
}
