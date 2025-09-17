// src/pages/AuthCallback.jsx
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../lib/supabaseClient";
import { getHomeRoute } from "../lib/routeUtils";

export default function AuthCallback() {
  const [msg, setMsg] = useState("Vérification…");
  const navigate = useNavigate();

  useEffect(() => {
    (async () => {
      try {
        // Finalise la session (PKCE/magic link). Si pas nécessaire, ignore l’erreur.
        await supabase.auth.exchangeCodeForSession();
      } catch (_) {}

      // Session courante
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        setMsg("Lien invalide ou expiré. Réessaie la connexion.");
        setTimeout(() => navigate("/login"), 1500);
        return;
      }

      const user = session.user;

      // Garantit que le profil existe (n’écrase pas un rôle déjà défini)
      await ensureProfile(user);

      // Lis le rôle et route
      const role = await getUserRole(user.id);
      navigate(getHomeRoute(role), { replace: true });
    })();
  }, [navigate]);

  return <div style={{ padding: 24 }}>{msg}</div>;
}

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
      role: "capo", // par défaut; sera remplacé si déjà promu par admin
    });
  } else {
    // garde l'email à jour, ne touche pas au rôle
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
