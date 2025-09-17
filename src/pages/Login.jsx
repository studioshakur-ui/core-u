// src/pages/Login.jsx
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../lib/supabaseClient";
import { getHomeRoute } from "../lib/routeUtils";

export default function Login() {
  const [email, setEmail] = useState("");
  const [done, setDone] = useState(false);
  const [err, setErr] = useState("");
  const navigate = useNavigate();

  // Se già autenticato → vai subito alla home del ruolo
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

  const onSubmit = async (e) => {
    e.preventDefault();
    setErr("");
    const redirect = `${window.location.origin}/#/auth/callback`;

    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: { emailRedirectTo: redirect },
    });

    if (error) setErr(error.message);
    else setDone(true);
  };

  if (done) {
    return (
      <div className="container-core">
        <div className="card space-y-2 max-w-lg">
          <h1 className="text-xl font-semibold">Controlla la posta</h1>
          <p>Ti abbiamo inviato un link di accesso. Cliccalo per entrare.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container-core">
      <form onSubmit={onSubmit} className="card space-y-4 max-w-lg">
        <h1 className="text-2xl font-semibold">Accesso</h1>
        <label className="block">
          <span className="block mb-1">Email</span>
          <input
            type="email" required value={email} onChange={(e)=>setEmail(e.target.value)}
            className="w-full rounded-xl bg-white/5 border border-white/15 px-4 py-2 outline-none focus:ring-2 focus:ring-white/30"
            placeholder="nome@azienda.it"
          />
        </label>
        <button type="submit" className="btn btn-primary">Invia link di accesso</button>
        {err && <div className="text-red-400">{err}</div>}
      </form>
    </div>
  );
}
