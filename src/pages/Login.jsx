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
      setProfile({ role: "manager", lang }); // placeholder role
      n("/");
    } catch (err) {
      clearTimeout(timeout);
      const msg = (err?.message || "").toLowerCase();
      if (msg.includes("invalid") || msg.includes("invalid_grant")) setError("Email o password non validi.");
      else if (msg.includes("network") || msg.includes("fetch")) setError("Problema di rete. Riprova tra poco.");
      else setError(err?.message || "Errore sconosciuto.");
    } finally { setLoading(false); }
  };

  return (<div className="min-h-screen grid place-items-center p-6 lv-bg">
    <div className="relative w-full max-w-md card p-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <img src="/assets/brand/logo-mark.svg" alt="CORE" className="w-7 h-7"/>
          <h1 className="text-2xl font-semibold">{t.title}</h1>
        </div>
        <select className="bg-transparent border border-white/10 rounded p-1" value={lang} onChange={e=>setLang(e.target.value)}>
          <option value="it">IT</option><option value="fr">FR</option><option value="en">EN</option>
        </select>
      </div>
      <form onSubmit={onSubmit} className="space-y-3">
        <label className="block"><span className="text-sm">{t.email}</span><input type="email" className="input mt-1" value={email} onChange={e=>setEmail(e.target.value)} required/></label>
        <label className="block"><span className="text-sm">{t.password}</span><input type="password" className="input mt-1" value={password} onChange={e=>setPassword(e.target.value)} required/></label>
        <div className="flex items-center justify-between">
          <label className="inline-flex items-center gap-2 text-sm opacity-80"><input type="checkbox" defaultChecked/>{T[lang].login.remember}</label>
          <a className="text-sm link" href="/reset-password">{T[lang].login.forgot}</a>
        </div>
        {error && <div className="text-red-400 text-sm">{error}</div>}
        <button type="submit" disabled={loading} className="btn-primary w-full">
          {loading ? <><span className="h-4 w-4 rounded-full border-2 border-black/30 border-t-black animate-spin"></span><span>Connessione…</span></> : t.signIn}
        </button>
      </form>
    </div>
  </div>);
}
