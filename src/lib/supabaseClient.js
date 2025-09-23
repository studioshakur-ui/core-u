import { createClient } from "@supabase/supabase-js";

let _client = null;

export function getSupabase() {
  if (_client) return _client;

  const url = import.meta.env.VITE_SUPABASE_URL;
  const key = import.meta.env.VITE_SUPABASE_ANON_KEY;

  if (!url || !key) {
    // On ne jette plus une erreur bloquante au chargement du bundle
    console.warn(
      "[CORE] VITE_SUPABASE_URL / VITE_SUPABASE_ANON_KEY manquants. " +
      "Configure-les dans Netlify → Environment."
    );
  }

  _client = createClient(url || "http://localhost:54321", key || "dev-key", {
    auth: { persistSession: true, autoRefreshToken: true },
  });
  return _client;
}
