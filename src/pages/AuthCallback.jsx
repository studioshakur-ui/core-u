// src/pages/AuthCallback.jsx
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../lib/supabaseClient";
import { getHomeRoute } from "../lib/routeUtils";

export default function AuthCallback() {
  const [msg, setMsg] = useState("Verifica in corso…");
  const navigate = useNavigate();

  useEffect(() => {
    (async () => {
      try { await supabase.auth.exchangeCodeForSession(); } catch (_) {}
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        setMsg("Link non valido o scaduto. Ripeti l’accesso.");
        setTimeout(() => navigate("/login"), 1500);
        return;
      }
      const user = session.user;
      await ensureProfile(user);
      const role = await getUserRole(user.id);
      navigate(getHomeRoute(role), { replace: true });
    })();
  }, [navigate]);

  return <div style={{ padding: 24 }}>{msg}</div>;
}

async function ensureProfile(user) {
  const { data: existing } = await supabase.from("profiles").select("id, role").eq("id", user.id).maybeSingle();
  if (!existing) {
    await supabase.from("profiles").insert({ id: user.id, email: user.email, role: "capo" });
  } else {
    await supabase.from("profiles").update({ email: user.email }).eq("id", user.id);
  }
}
async function getUserRole(userId) {
  const { data: p } = await supabase.from("profiles").select("role").eq("id", userId).maybeSingle();
  return p?.role ?? "capo";
}
