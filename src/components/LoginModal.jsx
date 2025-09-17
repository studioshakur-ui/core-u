import React, { useState } from "react";
import { supabase } from "../lib/supabaseClient";
import { useToast } from "./Toast.jsx";

export default function LoginModal({ open, onClose }){
  const [email,setEmail] = useState("");
  const [loading,setLoading] = useState(false);
  const toast = useToast();
  if (!open) return null;

  async function onSubmit(e){
    e.preventDefault();
    setLoading(true);
    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: { emailRedirectTo: window.location.origin + "/#/" }
    });
    setLoading(false);
    if (error) {
      toast.err("Errore: " + error.message);
    } else {
      toast.ok("Link inviato. Controlla la posta (anche spam).");
    }
  }

  return (
    <div className="fixed inset-0 z-[60] grid place-items-center bg-black/60" role="dialog" aria-modal="true">
      <div className="w-[92%] max-w-md rounded-2xl border border-white/10 bg-[#0b0f14]/90 backdrop-blur-xl p-6 text-white">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold">Accedi</h3>
          <button className="text-white/70 hover:text-white" onClick={onClose} aria-label="Chiudi">✕</button>
        </div>

        <form onSubmit={onSubmit} className="mt-4 space-y-4">
          <div>
            <label className="text-sm text-white/70" htmlFor="login-email">Email</label>
            <input
              id="login-email"
              type="email"
              required
              value={email}
              onChange={e=>setEmail(e.target.value)}
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

          <p className="text-xs text-white/55">
            Riceverai un link via email. Cliccalo per collegarti.
          </p>
        </form>
      </div>
    </div>
  );
}
