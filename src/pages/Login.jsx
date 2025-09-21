import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "../store/useAuthStore";

export default function Login() {
  const navigate = useNavigate();
  const { signIn, loading, error, lastRequestedPath } = useAuthStore();
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [show, setShow] = useState(false);
  const [remember, setRemember] = useState(true);

  const onSubmit = async (e) => {
    e.preventDefault();
    const res = await signIn({ identifier, password, remember });
    if (res?.ok) navigate(lastRequestedPath || "/");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-core-surface">
      <div className="w-full max-w-md bg-white rounded-lg shadow-e1 p-6">
        <div className="mb-6 text-center">
          <img src="/assets/brand/logo-wordmark.svg" alt="CORE" className="h-8 mx-auto mb-2" />
          <h1 className="text-xl font-semibold">Accedi a CORE</h1>
          <p className="text-core-muted text-sm">Email / Nome utente + Password</p>
        </div>
        <form onSubmit={onSubmit} className="space-y-4">
          <div>
            <label className="block text-sm mb-1">Email / Nome utente</label>
            <input type="text" value={identifier} onChange={(e)=>setIdentifier(e.target.value)}
              className="w-full border border-core-border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-core-violet"
              placeholder="es. mario.rossi o mario@azienda.it" autoComplete="username" />
          </div>
          <div>
            <label className="block text-sm mb-1">Password</label>
            <div className="relative">
              <input type={show ? "text":"password"} value={password} onChange={(e)=>setPassword(e.target.value)}
                className="w-full border border-core-border rounded-md px-3 py-2 pr-10 focus:outline-none focus:ring-2 focus:ring-core-violet"
                placeholder="••••••••" autoComplete="current-password" />
              <button type="button" onClick={()=>setShow(!show)} className="absolute inset-y-0 right-2 text-sm text-core-muted">
                {show ? "Nascondi" : "Mostra"}
              </button>
            </div>
          </div>
          <div className="flex items-center justify-between">
            <label className="inline-flex items-center gap-2 text-sm">
              <input type="checkbox" checked={remember} onChange={(e)=>setRemember(e.target.checked)} />
              Ricordami
            </label>
            <div className="text-sm text-core-muted">IT / FR / EN</div>
          </div>
          {error && <div className="text-red-600 text-sm bg-red-50 border border-red-200 rounded-md p-2">{error}</div>}
          <button type="submit" disabled={loading}
            className="w-full bg-core-violet hover:bg-core-violetHover active:bg-core-violetPressed text-white rounded-md py-2 font-medium disabled:opacity-60">
            {loading ? "Accesso…" : "Accedi"}
          </button>
        </form>
        <p className="mt-4 text-center text-xs text-core-muted">No magic link. Credenziali classiche.</p>
      </div>
    </div>
  );
}
