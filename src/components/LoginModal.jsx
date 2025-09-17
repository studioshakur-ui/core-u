import React, { useState } from "react";
import { supabase } from "../lib/supabaseClient";

export default function LoginModal({ open, onClose }){
  const [email,setEmail] = useState("");
  const [msg,setMsg] = useState("");
  const [loading,setLoading] = useState(false);
  if(!open) return null;

  async function onSubmit(e){
    e.preventDefault(); setMsg(""); setLoading(true);
    const { error } = await supabase.auth.signInWithOtp({
      email,
      options:{ emailRedirectTo: window.location.origin + "/#/" }
    });
    setMsg(error ? "❌ " + error.message : "✅ Link inviato. Controlla la posta (anche spam).");
    setLoading(false);
  }

  return (
    <div className="fixed inset-0 z-[60] grid place-items-center bg-black/60">
      <div className="w-[92%] max-w-md rounded-2xl border border-white/10 bg-[color:var(--panel-2)]/90 backdrop-blur-xl p-6 text-white">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold">Accedi</h3>
          <button className="text-white/70 hover:text-white" onClick={onClose} aria-label="Chiudi">✕</button>
        </div>

        <form onSubmit={onSubmit} className="mt-4 space-y-4">
          <div>
            <label className="text-sm text-white/70">Email</label>
            <input
              type="email" required value={email} onChange={e=>setEmail(e.target.value)}
              className="mt-1 w-full rounded-xl border border-white/15 bg-white/5 px-3 py-2 outline-none focus:ring-2 focus:ring-[--accent]"
              placeholder="nome.cognome@azienda.it"
            />
          </div>
          <div className="flex items-center justify-between">
            <button type="button" className="btn btn-ghost" onClick={onClose}>Chiudi</button>
            <button type="submit" className="btn btn-primary" disabled={loading}>
              {loading ? "Invio…" : "Entra (Magic Link)"}
            </button>
          </div>
          {msg && <p className={"text-sm " + (msg.startsWith("✅") ? "text-emerald-400" : "text-rose-400")}>{msg}</p>}
        </form>
      </div>
    </div>
  );
}
