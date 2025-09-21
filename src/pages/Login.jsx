import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase, initError } from "../lib/supabaseClient";
import { useAppStore } from "../store/useAppStore";
import { T } from "../i18n";

export default function Login(){
  const n=useNavigate();
  const { lang, setLang, setSession, setProfile } = useAppStore();
  const t = T[lang].login;
  const [email,setEmail]=useState(""); const [password,setPassword]=useState("");
  const [loading,setLoading]=useState(false); const [error,setError]=useState("");

  const onSubmit = async (e) => {
    e.preventDefault();
    if (initError) { setError("Config Supabase invalide. Vérifie VITE_SUPABASE_URL / VITE_SUPABASE_ANON_KEY."); return; }
    setLoading(true); setError("");
    const timeout = setTimeout(()=>{ setLoading(false); setError("L’authentification semble bloquée (extension?). Réessaie en navigation privée."); }, 9000);
    try {
      const { data, error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) throw error;
      clearTimeout(timeout);
      setSession(data.session);
      setProfile({ role: "manager", lang }); // placeholder
      n("/");
    } catch (err) {
      clearTimeout(timeout);
      const msg = (err?.message || "").toLowerCase();
      if (msg.includes("invalid") || msg.includes("invalid_grant")) setError("Email o password non validi.");
      else if (msg.includes("network") || msg.includes("fetch")) setError("Problema di rete. Riprova tra poco.");
      else setError(err?.message || "Errore sconosciuto.");
    } finally { setLoading(false); }
  };

  return (<div className="min-h-screen bg-white">
    <div className="container py-20 grid md:grid-cols-2 gap-10 items-center">
      <div>
        <h1 className="text-4xl font-bold mb-2">{t.title}</h1>
        <p className="text-core-muted mb-6">Accedi con le tue credenziali.</p>
        <form onSubmit={onSubmit} className="space-y-3 max-w-md">
          <label className="block">
            <span className="text-sm">{t.email}</span>
            <input type="email" className="input mt-1" value={email} onChange={e=>setEmail(e.target.value)} required/>
          </label>
          <label className="block">
            <span className="text-sm">{t.password}</span>
            <input type="password" className="input mt-1" value={password} onChange={e=>setPassword(e.target.value)} required/>
          </label>
          <div className="flex items-center justify-between">
            <label className="inline-flex items-center gap-2 text-sm opacity-80"><input type="checkbox" defaultChecked/>{T[lang].login.remember}</label>
            <a className="text-sm underline" href="/reset-password">{T[lang].login.forgot}</a>
          </div>
          {error && <div className="text-red-600 text-sm">{error}</div>}
          <button type="submit" disabled={loading} className="btn-primary w-full">
            {loading ? <><span className="h-4 w-4 rounded-full border-2 border-white/30 border-t-white animate-spin"></span><span>Connessione…</span></> : t.signIn}
          </button>
        </form>
      </div>
      <div className="bg-core-surface border border-core-border rounded-lg p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <img src="/assets/brand/logo-mark.svg" className="w-8 h-8" />
            <div className="text-xl font-semibold">CORE</div>
          </div>
          <select className="border border-core-border rounded-md p-1 bg-white" value={lang} onChange={e=>setLang(e.target.value)}>
            <option value="it">IT</option><option value="fr">FR</option><option value="en">EN</option>
          </select>
        </div>
        <p className="text-sm text-core-muted">Seleziona la lingua, poi effettua l’accesso.</p>
      </div>
    </div>
  </div>);
}
