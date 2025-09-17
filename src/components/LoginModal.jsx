import React, { useState } from "react";
import { supabase } from "../lib/supabaseClient";
import { useToast } from "./Toast.jsx";

export default function LoginModal({ open, onClose }){
  const [mode, setMode] = useState("login"); // login | signup | reset
  const [email, setEmail] = useState("");
  const [pwd, setPwd] = useState("");
  const [busy, setBusy] = useState(false);
  const toast = useToast();

  if(!open) return null;

  const close = ()=>{ if(!busy){ setMode("login"); setEmail(""); setPwd(""); onClose?.(); } };

  async function doLogin(){
    if(!email || !pwd) return toast.error("Inserisci email e password.");
    setBusy(true);
    const { error } = await supabase.auth.signInWithPassword({ email, password: pwd });
    setBusy(false);
    if(error){ toast.error("Credenziali non valide."); return; }
    toast.success("Benvenuto!");
    close();
  }

  async function doSignup(){
    if(!email || !pwd) return toast.error("Inserisci email e password.");
    if(pwd.length < 12) return toast.error("Password minimo 12 caratteri.");
    setBusy(true);
    const { error } = await supabase.auth.signUp({ email, password: pwd });
    setBusy(false);
    if(error){ toast.error(error.message); return; }
    toast.success("Account creato. Controlla l’email per confermare.");
    setMode("login");
  }

  async function doReset(){
    if(!email) return toast.error("Inserisci l’email.");
    setBusy(true);
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: window.location.origin + "/#/"
    });
    setBusy(false);
    if(error){ toast.error(error.message); return; }
    toast.success("Email inviata. Controlla la posta.");
    setMode("login");
  }

  return (
    <div className="modal-backdrop" onClick={close}>
      <div className="modal-card" onClick={e=>e.stopPropagation()} role="dialog" aria-modal="true" aria-label="Accesso">
        <div className="flex items-center justify-between">
          <div className="segmented">
            <button className={mode==="login"?"on":""} onClick={()=>setMode("login")}>Login</button>
            <button className={mode==="signup"?"on":""} onClick={()=>setMode("signup")}>Crea account</button>
            <button className={mode==="reset"?"on":""} onClick={()=>setMode("reset")}>Password</button>
          </div>
          <button className="btn btn-ghost" onClick={close}>Chiudi</button>
        </div>

        <div className="mt-6 space-y-3">
          <label className="field">
            <span>Email</span>
            <input type="email" value={email} onChange={e=>setEmail(e.target.value)} placeholder="nome@azienda.it" />
          </label>

          {mode!=="reset" && (
            <label className="field">
              <span>Password</span>
              <input type="password" value={pwd} onChange={e=>setPwd(e.target.value)} placeholder="••••••••••••" />
              {mode==="signup" && <small className="hint">Min 12 caratteri, maiuscola, numero e simbolo.</small>}
            </label>
          )}
        </div>

        <div className="mt-6 flex items-center gap-3">
          {mode==="login"   && <button disabled={busy} className="btn btn-primary" onClick={doLogin}>Entra</button>}
          {mode==="signup"  && <button disabled={busy} className="btn btn-primary" onClick={doSignup}>Crea</button>}
          {mode==="reset"   && <button disabled={busy} className="btn btn-primary" onClick={doReset}>Invia link</button>}
          <button className="btn btn-ghost" onClick={close}>Annulla</button>
        </div>
      </div>
    </div>
  );
}
