// src/lib/supabaseClient.js
import { createClient } from "@supabase/supabase-js";

/**
 * ✅ MODE RÉEL (obligatoire)
 * Ces variables doivent être définies dans Netlify → Site settings → Build & deploy → Environment
 * - VITE_SUPABASE_URL
 * - VITE_SUPABASE_ANON_KEY
 */
const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL;
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Vérification stricte : on préfère échouer vite avec un message clair.
if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
  // Message explicite dans la console pour diagnostiquer en prod si besoin.
  console.error(
    "[CORE] Variables manquantes:",
    { VITE_SUPABASE_URL: !!SUPABASE_URL, VITE_SUPABASE_ANON_KEY: !!SUPABASE_ANON_KEY }
  );
  throw new Error(
    "Supabase configuration missing: set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY in Netlify."
  );
}

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
  },
});
