import React, { useEffect, useState } from "react";
import { env, initError, diagAnonymousSelect } from "@/lib/supabaseClient";

export default function Diagnostics(){
  const [probe, setProbe] = useState({ loading:true, result:null });
  useEffect(() => { (async ()=>{ const r=await diagAnonymousSelect(); setProbe({loading:false, result:r}); })(); }, []);
  return (
    <section style={{ maxWidth:800 }}>
      <h1 style={{ marginBottom:12 }}>Diagnostics — Supabase</h1>
      <div style={{ padding:16, border:"1px solid #e2e8f0", borderRadius:12, marginBottom:16 }}>
        <h2 style={{ margin:0, fontSize:16 }}>Environment</h2>
        <ul style={{ margin:"8px 0" }}>
          <li><strong>VITE_SUPABASE_URL</strong>: {env.url ? "OK" : "❌ ABSENT"}</li>
          <li><strong>VITE_SUPABASE_ANON_KEY</strong>: {env.key ? "OK" : "❌ ABSENT"}</li>
        </ul>
        {initError && <p style={{ color:"#b91c1c", margin:0 }}><strong>Init error:</strong> {initError}</p>}
      </div>
      <div style={{ padding:16, border:"1px solid #e2e8f0", borderRadius:12 }}>
        <h2 style={{ margin:0, fontSize:16 }}>Probe — SELECT anonyme sur <code>profiles</code></h2>
        {probe.loading ? <p>Test en cours…</p>
          : probe.result?.ok ? <p>✅ Connexion OK — lignes: {probe.result.rows}</p>
          : <p style={{ color:"#b91c1c" }}>❌ Échec SELECT: {probe.result?.error || "Erreur inconnue"}</p>}
      </div>
    </section>
  );
}
