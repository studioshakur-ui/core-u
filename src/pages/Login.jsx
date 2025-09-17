// src/pages/Login.jsx
import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { supabase } from "../lib/supabaseClient";
import { getHomeRoute } from "../lib/routeUtils";

export default function Login() {
  const [email, setEmail] = useState("");
  const [pwd, setPwd] = useState("");
  const [err, setErr] = useState("");
  const [ok, setOk] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    (async () => {
      const { data: { session } } = await supabase.auth.getSession();
      const user = session?.user ?? null;
      if (!user) return;
      const { data: p } = await supabase.from("profiles").select("role").eq("id", user.id).maybeSingle();
      const role = p?.role ?? "capo";
      navigate(getHomeRoute(role), { replace: true });
    })();
  }, [navigate]);

  async function onLogin(e){
    e.preventDefault();
    setErr(""); setOk("");
    const { error } = await supabase.auth.signInWithPassword({ email, password: pwd });
    if (error) { setErr(error.message); return; }

    const { data: { user } } = await supabase.auth.getUser();
    const { data: p } = await supabase.from("profiles").select("role").eq("id", user.id).maybeSingle();
    const role = p?.role ?? "capo";
    navigate(getHomeRoute(role), { replace: true });
  }

  async function onForgot(){
    setErr(""); setOk("");
    if (!email) { setErr("Inserisci l'email, poi clicca ‘Password dimenticata’."); return; }
    const redirectTo = `${window.location.origin}/#/reset`;
    const { error } = await supabase.auth.resetPasswordForEmail(email, { redirectTo });
    if (error) setErr(error.message);
    else setOk("Email inviata: controlla la posta per impostare una nuova password.");
  }

  return (
    <div className="container-core">
      <form onSubmit={onLogin} className="card space-y-4 max-w-lg">
        <h1 className="text-2xl font-semibold">Accesso</h1>

        <label className="block">
          <span className="block mb-1">Email</span>
          <input
            type="email" required value={email} onChange={(e)=>setEmail(e.target.value)}
            className="w-full rounded-xl bg-white/5 border border-white/15 px-4 py-2 outline-none focus:ring-2 focus:ring-white/30"
            placeholder="nome@azienda.it"
          />
        </label>

        <label className="block">
          <span className="block mb-1">Password</span>
          <input
            type="password" required value={pwd} onChange={(e)=>setPwd(e.target.value)}
            className="w-full rounded-xl bg-white/5 border border-white/15 px-4 py-2 outline-none focus:ring-2 focus:ring-white/30"
            placeholder="••••••••"
          />
        </label>

        <div className="flex items-center gap-3">
          <button type="submit" className="btn btn-primary">Entra</button>
          <button type="button" className="btn btn-ghost" onClick={onForgot}>Password dimenticata</button>
        </div>

        {err && <div className="text-red-400">{err}</div>}
        {ok && <div className="text-emerald-400">{ok}</div>}

        <div className="muted text-sm">
          Solo gli account creati dall’amministrazione possono accedere.
          <br/>
          Area amministrazione: <Link to="/admin/users" className="underline">Gestione utenti</Link> (solo Direzione).
        </div>
      </form>
    </div>
  );
}
