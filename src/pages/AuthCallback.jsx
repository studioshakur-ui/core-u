// src/pages/AuthCallback.jsx
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../lib/supabaseClient";
import { getHomeRoute } from "../lib/routeUtils";
import { parseAuthParamsFromUrl, cleanAuthUrl } from "../lib/urlAuthParams";

export default function AuthCallback() {
  const [msg, setMsg] = useState("Verifica in corso…");
  const navigate = useNavigate();

  useEffect(() => {
    let alive = true;

    (async () => {
      const p = parseAuthParamsFromUrl();

      if (p.error) {
        setMsg(p.error_description || "Errore durante la verifica. Ripeti l’accesso.");
        await sleep(1200);
        if (!alive) return;
        cleanAuthUrl();
        navigate("/login", { replace: true });
        return;
      }

      // 1) PKCE / OAuth : ?code=...
      if (p.code) {
        try {
          await supabase.auth.exchangeCodeForSession();
        } catch (e) {
          // On continue vers fallback; si ça marche pas, on affichera l'erreur
        }
      }

      // 2) Magic link (implicit): access_token + refresh_token (dans le hash le plus souvent)
      if (p.access_token && p.refresh_token) {
        try {
          await supabase.auth.setSession({
            access_token: p.access_token,
            refresh_token: p.refresh_token,
          });
        } catch (e) {
          // on laisse la boucle d’attente décider
        }
      }

      // 3) Boucle d’attente de la session (max ~5s)
      const session = await waitForSession(50, 100);
      if (!session) {
        setMsg("Impossibile creare la sessione. Ripeti l’accesso.");
        await sleep(1400);
        if (!alive) return;
        cleanAuthUrl();
        navigate("/login", { replace: true });
        return;
      }

      // 4) Garantisce/aggiorna il profilo (non tocca il ruolo)
      const user = session.user;
      await ensureProfile(user);

      // 5) Legge il ruolo e redirige
      const role = await getUserRole(user.id);

      if (!alive) return;
      cleanAuthUrl();
      navigate(getHomeRoute(role), { replace: true });
    })();

    return () => { alive = false; };
  }, [navigate]);

  return <div style={{ padding: 24 }}>{msg}</div>;
}

async function waitForSession(tries = 50, delayMs = 100) {
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
    }).catch(()=>{});
  } else {
    await supabase.from("profiles")
      .update({ email: user.email })
      .eq("id", user.id)
      .catch(()=>{});
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
