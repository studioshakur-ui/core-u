// src/lib/supabaseClient.js
import { createClient } from "@supabase/supabase-js";

const url = import.meta.env?.VITE_SUPABASE_URL;
const key = import.meta.env?.VITE_SUPABASE_ANON_KEY;

// MODE DEMO: client factice si variables manquantes
const demoSupabase = {
  __demo: true,
  from: () => ({
    select: async () => ({ data: null, error: null }),
    insert: async () => ({ data: null, error: { message: "Demo mode: no DB" } }),
    update: async () => ({ data: null, error: { message: "Demo mode: no DB" } }),
    delete: async () => ({ data: null, error: { message: "Demo mode: no DB" } }),
    eq: () => demoSupabase.from()
  }),
  auth: {
    async getSession() {
      return { data: { session: null }, error: null };
    },
    onAuthStateChange(_cb) {
      // Renvoie un objet compatible pour éviter les erreurs d’unsubscribe
      return { data: { subscription: { unsubscribe() {} } } };
    },
    async signInWithPassword() {
      return { data: null, error: { message: "Demo mode: auth disabled" } };
    },
    async signOut() {
      return { error: null };
    }
  }
};

let supabase = demoSupabase;
let isDemo = true;

try {
  if (url && key) {
    supabase = createClient(url, key, {
      auth: { persistSession: true, autoRefreshToken: true }
    });
    isDemo = false;
  } else {
    console.warn(
      "[supabase] VITE_SUPABASE_URL / VITE_SUPABASE_ANON_KEY manquants — passage en DEMO (aucune écriture, pas d’auth)."
    );
  }
} catch (e) {
  console.error("[supabase] init error:", e);
  // On reste en demoSupabase
  supabase = demoSupabase;
  isDemo = true;
}

export { supabase, isDemo };
