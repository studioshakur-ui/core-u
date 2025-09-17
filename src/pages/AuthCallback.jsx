// src/pages/AuthCallback.jsx
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../lib/supabaseClient";

export default function AuthCallback() {
  const [msg, setMsg] = useState("Vérification…");
  const navigate = useNavigate();

  useEffect(() => {
    (async () => {
      // 1) Essaye d’échanger un éventuel "code" (OAuth PKCE)
      try {
        await supabase.auth.exchangeCodeForSession(); 
      } catch (_) {/* silencieux */}

      // 2) Récupère la session
      const { data: { session } } = await supabase.auth.getSession();

      if (!session) {
        setMsg("Lien invalide ou expiré. Réessaie l’authentification.");
        // retour login après 2s
        setTimeout(() => navigate("/login"), 2000);
        return;
      }

      // 3) Redirige selon rôle (on va définir getHomeRoute plus bas)
      const { data: userData } = await supabase.auth.getUser();
      const user = userData?.user ?? null;

      // petit fetch profil pour connaître le rôle
      let role = "capo";
      try {
        const { data: profile } = await supabase
          .from("profiles")
          .select("role")
          .eq("id", user.id)
          .maybeSingle();
        if (profile?.role) role = profile.role;
      } catch (_) {}

      navigate(getHomeRoute(role), { replace: true });
    })();
  }, [navigate]);

  return <div style={{ padding: 24 }}>{msg}</div>;
}

// à mettre dans un util commun si tu préfères
export function getHomeRoute(role) {
  if (role === "direzione") return "/direzione";
  if (role === "manager") return "/manager";
  return "/capo";
}
