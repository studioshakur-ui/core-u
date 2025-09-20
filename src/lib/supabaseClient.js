import { createClient } from "@supabase/supabase-js";
export const env = { url: import.meta.env?.VITE_SUPABASE_URL || "", key: import.meta.env?.VITE_SUPABASE_ANON_KEY || "" };
export let supabase = null; export let initError = null;
try {
  if (!env.url || !env.key) {
    initError = `Supabase config manquante: ${!env.url ? "VITE_SUPABASE_URL " : ""}${!env.key ? "VITE_SUPABASE_ANON_KEY" : ""}`.trim();
    console.error("[CORE] " + initError);
  } else {
    supabase = createClient(env.url, env.key, { auth: { persistSession: true, autoRefreshToken: true, detectSessionInUrl: true } });
  }
} catch (e) { initError = e?.message || String(e); console.error("[CORE] Supabase init exception →", e); }
