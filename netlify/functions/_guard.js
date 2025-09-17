import { createClient } from "@supabase/supabase-js";

export async function requireDirezione(event) {
  const url = process.env.VITE_SUPABASE_URL;
  const anon = process.env.VITE_SUPABASE_ANON_KEY;
  if (!url || !anon) throw new Error("Missing Supabase env (anon)");

  const authz = event.headers.authorization || event.headers.Authorization || "";
  const token = authz.startsWith("Bearer ") ? authz.slice(7) : null;
  if (!token) return { ok: false, statusCode: 401, body: "Missing bearer token" };

  const pub = createClient(url, anon, { auth: { persistSession: false, autoRefreshToken: false }});
  const { data: { user }, error } = await pub.auth.getUser(token);
  if (error || !user) return { ok: false, statusCode: 401, body: "Invalid token" };

  const { data: profile, error: e2 } = await pub.from("profiles").select("role").eq("id", user.id).maybeSingle();
  if (e2) return { ok: false, statusCode: 500, body: e2.message };
  if (!profile || profile.role !== "direzione") return { ok: false, statusCode: 403, body: "Forbidden" };

  return { ok: true, userId: user.id };
}
