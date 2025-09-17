// src/pages/AuthCallback.jsx
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../lib/supabaseClient";

export default function AuthCallback() {
  const [msg, setMsg] = useState("Vérification…");
  const navigate = useNavigate();

  useEffect(() => {
    (async () => {
      // 1) Échanger un éventuel code (PKCE OAuth / magic link moderne)
      try { await supabase.auth.exchangeCodeForSession(); } catch (_) {}

      // 2) Lire la session
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        setMsg("Lien invalide ou expiré. Réessaie l’authentification.");
        setTimeout(() => navigate("/login"), 2000);
        return;
      }

      const user = session.user;

      // 3) S’assurer qu’un profil existe et qu’il est au minimum 'capo'
      await ensureProfile(user);

      // 4) Charger le rôle et router
      const role = await getUserRole(user.id);
      navigate(getHomeRoute(role), { replace: true });
    })();
  }, [navigate]);

  return <div style={{ padding: 24 }}>{msg}</div>;
}

async function ensureProfile(user) {
  const { data: existing } = await supabase
    .from("profiles")
    .select("id")
    .eq("id", user.id)
    .maybeSingle();

  if (!existing) {
    await supabase.from("profiles").insert({
      id: user.id,
      email: user.email,
      role: "capo",
    });
  } else {
    // Optionnel: garder l'email à jour
    await supabase.from("profiles").update({ email: user.email }).eq("id", user.id);
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

export function getHomeRoute(role) {
  if (role === "direzione") return "/direzione";
  if (role === "manager") return "/manager";
  return "/capo";
}
