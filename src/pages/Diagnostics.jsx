// src/pages/Diagnostics.jsx
import React, { useEffect, useState } from "react";
import { env, initError } from "@/lib/supabaseClient";

async function probeSelect() {
  try {
    // chargement à la demande pour éviter un import circulaire
    const mod = await import("@/lib/supabaseClient");
    if (!mod.supabase) {
      return { ok: false, error: mod.initError || "Supabase client not initialised" };
    }
    const { data, error } = await mod.supabase.from("profiles").select("id").limit(1);
    if (error) return { ok: false, error: error.message };
    return { ok: true, rows: Array.isArray(data) ? data.length : 0 };
  } catch (e) {
    return { ok: false, error: e?.message || String(e) };
  }
}

export default function Diagnostics() {
  const [probe, setProbe] = useState({ loading: true, result: null });

  useEffect(() => {
    (async () => {
      const r = await probeSelect();
      setProbe({ loading: false, result: r });
    })();
  }, []);

  return (
    <section style={{ maxWidth: 800 }}>
      <h1 style={{ marginBottom: 12 }}>Diagnostics — Supabase</h1>

      <div style={{ padding: 16, border: "1px solid #e2e8f0", borderRadius: 12, marginBottom: 16 }}>
        <h2 style={{ margin: 0, fontSize: 16 }}>Environment</h2>
        <ul style={{ margin: "8px 0" }}>
          <li><strong>VITE_SUPABASE_URL</strong>: {env.url ? "OK" : "❌ ABSENT"}</li>
          <li><strong>VITE_SUPABASE_ANON_KEY</strong>: {env.key ? "OK" : "❌ ABSENT"}</li>
        </ul>
        {initError && (
          <p style={{ color: "#b91c1c", margin: 0 }}>
            <strong>Init error:</strong> {initError}
          </p>
        )}
        <p style={{ fontSize: 12, color: "#475569", marginTop: 8 }}>
          La clé doit être la <em>anon public</em> (Supabase → Settings → API).  
          Après modification des variables Netlify, utilise “Clear cache and deploy site”.
        </p>
      </div>

      <div style={{ padding: 16, border: "1px solid #e2e8f0", borderRadius: 12 }}>
        <h2 style={{ margin: 0, fontSize: 16 }}>Probe — SELECT anonyme sur <code>profiles</code></h2>
        {probe.loading ? (
          <p>Test en cours…</p>
        ) : probe.result?.ok ? (
          <p>✅ Connexion OK — lignes visibles: {probe.result.rows}</p>
        ) : (
          <p style={{ color: "#b91c1c" }}>
            ❌ Échec SELECT: {probe.result?.error || "Erreur inconnue"}
          </p>
        )}
        <p style={{ fontSize: 12, color: "#475569" }}>
          Si RLS bloque, applique les policies “read_own_profile” et “direzione_read_all_profiles”.
        </p>
      </div>
    </section>
  );
}
