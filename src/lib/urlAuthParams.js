// src/lib/urlAuthParams.js
export function parseAuthParamsFromUrl(href = "") {
  const url = new URL(href || (typeof window !== "undefined" ? window.location.href : "http://localhost/"));
  // Params classiques (?code=..., ?error=...)
  const q = new URLSearchParams(url.search);

  // Params éventuels dans le hash (ex: #access_token=... OU #/auth/callback?code=...)
  const hash = url.hash || "";
  // 1) tout le hash (sans #)
  const hp = new URLSearchParams(hash.startsWith("#") ? hash.slice(1) : hash);
  // 2) la dernière partie après le dernier # (utile pour "#/auth/callback?code=...")
  const lastHash = href.split("#").slice(-1)[0] || "";
  const lastHashQuery = lastHash.includes("?") ? lastHash.split("?")[1] : "";
  const hp2 = new URLSearchParams(lastHashQuery);

  const get = (key) => q.get(key) || hp.get(key) || hp2.get(key);
  return {
    code: get("code"),
    access_token: get("access_token"),
    error: get("error"),
    error_description: get("error_description"),
    token_hash: get("token_hash"), // parfois utilisé par magic link
    type: get("type"),
  };
}
