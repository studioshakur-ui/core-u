// src/components/LoginModal.jsx
import React, { useEffect, useRef, useState } from "react";
import { supabase } from "../lib/supabaseClient";
import { useToast } from "./Toast.jsx";

export default function LoginModal({ open, onClose }) {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const dialogRef = useRef(null);
  const inputRef = useRef(null);
  const toast = useToast();

  // Ne rend rien si la modal est fermée
  if (!open) return null;

  // Focus auto + fermeture via ESC + click outside
  useEffect(() => {
    const onKey = (e) => { if (e.key === "Escape") onClose?.(); };
    const onClickOutside = (e) => {
      if (dialogRef.current && !dialogRef.current.contains(e.target)) onClose?.();
    };
    document.addEventListener("keydown", onKey);
    document.addEventListener("mousedown", onClickOutside);
    // focus initial
    setTimeout(() => inputRef.current?.focus(), 0);
    return () => {
      document.removeEventListener("keydown", onKey);
      document.removeEventListener("mousedown", onClickOutside);
    };
  }, [onClose]);

  async function onSubmit(e) {
    e.preventDefault();
    if (!email) return;
    setLoading(true);

    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: { emailRedirectTo: window.location.origin + "/#/" },
    });

    setLoading(false);
    if (error) {
      toast.err?.("Errore: " + error.message);
    } else {
      toast.ok?.("Link inviato. Controlla la posta (anche spam).");
      onClose?.();
    }
  }

  return (
    <div
      className="fixed inset-0 z-[60] grid place-items-center bg-black/60"
      role="dialog"
      aria-modal="true"
      aria-labelledby="login-title"
    >
      <div
        ref={dialogRef}
        className="w-[92%] max-w-md rounded-2xl border border-white/10 bg-[#0b0f14]/90 backdrop-blur-xl p-6 text-white shadow-2xl"
      >
        <div className="flex items-center justify-between">
          <h3 id="login-title" className="text-lg font-semibold">Accedi</h3>
          <button
            className="text-white/70 hover:text-white"
            onClick={onClose}
            aria-label="Chiudi"
          >
            ✕
          </button>
        </div>

        <form onSubmit={onSubmit} className="mt-4 space-y-4">
          <div>
            <label htmlFor="login-email" className="text-sm text-white/70">
              Email
            </label>
            <input
              id="login-email"
              ref={inputRef}
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="nome.cognome@azienda.it"
              className="mt-1 w-full rounded-xl border border-white/15 bg-white/5 px-3 py-2 outline-none focus:ring-2 focus:ring-[--accent]"
              autoComplete="email"
              inputMode="email"
            />
          </div>

          <div className="flex items-center justify-between">
            <button type="button" className="btn btn-ghost" onClick={onClose}>
              Chiudi
            </button>
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
