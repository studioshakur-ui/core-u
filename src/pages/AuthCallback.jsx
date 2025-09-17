// src/pages/AuthCallback.jsx
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../lib/supabaseClient";
import { getHomeRoute } from "../lib/routeUtils";
import { parseAuthParamsFromUrl } from "../lib/urlAuthParams";

export default function AuthCallback() {
  const [msg, setMsg] = useState("Verifica in corso…");
  const navigate = useNavigate();

  useEffect(() => {
    let alive = true;

    (async () => {
      const params = parseAuthParamsFromUrl();
      // Si Supabase renvoie une erreur dans l'URL
      if (params.error) {
        setMsg(params.error_description || "Errore durante la verifica. Ripeti l’accesso.");
        await sleep(1200);
        if (!alive) return;
        navigate("/login", { replace: true });
        return;
      }

      // Si on a un code (PKCE OAuth), on tente l'échange
      if (params.code) {
        try { await supabase.auth.exchangeCodeForSession(); } catch (e) { /* ignore, on continue */ }
      }

      // Attente robuste de la session (utile pour magic link avec access_token dans le hash)
      const session = await waitForSession(40, 100); // 40 * 100ms = 4s max
      if (!session) {
        setMsg("Link non valido o scaduto. Ripeti l’accesso.");
        await sleep(1200);
        if (!alive) return;
        navigate("/login", { replace: true });
        return;
      }

      // Garantit/actualise le profilo
      const user = session.user;
      await ensureProfile(user);

      const role = await getUserRole(user.id);
      if (!alive) return;
      navigate(getHomeRoute(role), { replace: true });
    })();

    return () => { alive = false; };
  }, [navigate]);

  return <div style={{ padding: 24 }}>{msg}</div>;
}

async function waitForSession(tries = 40, delayMs = 100) {
  for (let i = 0; i < tries; i++) {
    const { data: { session } } = await supabase.auth.getSession();
    if (session) return session;
    await sleep(delayMs);
  }
  return null;
}
function sleep(ms){ return new Promise(r => setTimeout(r, ms)); }

async function ensureProfile(user) {
  const { data: existing } = await supabase
    .from("profiles")
    .select("id, role")
    .eq("id", user.id)
    .maybeSingle();

  if (!existing) {
    await supabase.from("profiles").insert({
      id: user.id,
      email: user.email,
      role: "capo",
    });
  } else {
    await supabase.from("profiles")
      .update({ email: user.email })
      .eq("id", user.id);
  }
}

async function getUserRole(userId) {
  const { data: p } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", userId)
    .maybeSingle();
  return p?.role ?? "capo";
}
