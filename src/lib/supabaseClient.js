import { createClient } from "@supabase/supabase-js";

const URL = import.meta.env?.VITE_SUPABASE_URL || "";
const KEY = import.meta.env?.VITE_SUPABASE_ANON_KEY || "";

let _supabase = null;
let _error = null;

export function getSupabase() {
  if (_supabase) return _supabase;
  try {
    if (!URL || !KEY) {
      _error = "Supabase config missing (VITE_SUPABASE_URL / VITE_SUPABASE_ANON_KEY)";
      console.error("[CORE] " + _error);
      return null;
    }
    _supabase = createClient(URL, KEY, {
      auth: { persistSession: true, autoRefreshToken: true, detectSessionInUrl: true },
      global: { headers: { "x-core-version": "v8.2.2" } },
    });
    return _supabase;
  } catch (e) {
    _error = e?.message || String(e);
    console.error("[CORE] Supabase init exception →", e);
    return null;
  }
}

export function getSupabaseInitError() { return _error; }
