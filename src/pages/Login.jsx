import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase, initError } from "../lib/supabaseClient";

export default function Login(){
  const n=useNavigate(); const [email,setEmail]=useState(""); const [password,setPassword]=useState("");
  const [loading,setLoading]=useState(false); const [error,setError]=useState("");
  const onSubmit=async(e)=>{ e.preventDefault(); if(initError){ setError("Supabase non configuré."); return;}
    setLoading(true); try{ const { data, error } = await supabase.auth.signInWithPassword({ email, password }); if(error) throw error; n("/"); } catch(err){ setError(err?.message||"Erreur"); } finally{ setLoading(false);} };
  return (<div className="min-h-screen bg-white">
    <div className="container py-20 grid md:grid-cols-2 gap-10 items-center">
      <div>
        <h1 className="text-4xl font-bold mb-2">Connexion</h1>
        <p className="text-core-muted mb-6">Accédez à CORE.</p>
        <form onSubmit={onSubmit} className="space-y-3 max-w-md">
          <label className="block"><span className="text-sm">Email</span><input type="email" className="input mt-1" value={email} onChange={e=>setEmail(e.target.value)} required/></label>
          <label className="block"><span className="text-sm">Mot de passe</span><input type="password" className="input mt-1" value={password} onChange={e=>setPassword(e.target.value)} required/></label>
          {error && <div className="text-red-600 text-sm">{error}</div>}
          <button type="submit" disabled={loading} className="btn-primary w-full">{loading?"Connexion…":"Se connecter"}</button>
        </form>
      </div>
      <div className="bg-core-surface border border-core-border rounded-lg p-6">
        <div className="flex items-center gap-2"><img src="/assets/brand/logo-mark.svg" className="w-8 h-8"/><div className="text-xl font-semibold">CORE</div></div>
        <p className="text-sm text-core-muted mt-2">Identité blanc/noir/violet. Design Apple-like.</p>
      </div>
    </div>
  </div>);
}
