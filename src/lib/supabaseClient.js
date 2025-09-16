// 🔥 Hotfix: bascule CDN si le paquet local n'est pas dispo en build
let createClient;
try {
  ({ createClient } = await import('@supabase/supabase-js'));
} catch {
  ({ createClient } = await import('https://esm.sh/@supabase/supabase-js@2'));
}

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const supabase = createClient(supabaseUrl, supabaseKey, {
  auth: { persistSession: true, autoRefreshToken: true, detectSessionInUrl: true },
});
