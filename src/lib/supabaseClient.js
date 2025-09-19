// src/lib/supabaseClient.js
import { createClient } from "@supabase/supabase-js";

export const env = {
  url: import.meta.env?.VITE_SUPABASE_URL || "",
  key: import.meta.env?.VITE_SUPABASE_ANON_KEY || "",
};

export let initError = null;
export let supabase = null;

try {
  if (!env.url || !env.key) {
    initError = `Missing env: ${
      !env.url ? "VITE_SUPABASE_URL " : ""
    }${!env.key ? "VITE_SUPABASE_ANON_KEY" : ""}`.trim();
    console.error("[CORE] Supabase init error →", initError);
  } else {
    supabase = createClient(env.url, env.key, {
      auth: { persistSession: true, autoRefreshToken: true },
    });
  }
} catch (e) {
  initError = e?.message || String(e);
  console.error("[CORE] Supabase init exception →", e);
}

// Utilitaire de test (optionnel)
export async function diagAnonymousSelect() {
  if (!supabase) return { ok: false, error: initError || "Client not initialised" };
  try {
    const { data, error } = await supabase.from("profiles").select("id").limit(1);
    if (error) return { ok: false, error: error.message };
    return { ok: true, rows: Array.isArray(data) ? data.length : 0 };
  } catch (e) {
    return { ok: false, error: e?.message || String(e) };
  }
}
