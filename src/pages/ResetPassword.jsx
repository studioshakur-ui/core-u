// src/pages/ResetPassword.jsx
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../lib/supabaseClient";

function parseHashParams() {
  const hash = window.location.hash || "";
  const q = hash.includes("?") ? hash.split("?")[1] : "";
  return new URLSearchParams(q);
}

export default function ResetPassword() {
  const navigate = useNavigate();
  const [stage, setStage] = useState("checking"); // checking | form | done | error
  const [pwd, setPwd] = useState("");
  const [err, setErr] = useState("");

  useEffect(() => {
    (async () => {
      try {
        // Le lien recovery arrive avec #...type=recovery&access_token=...
        const hp = parseHashParams();
        const access_token = hp.get("access_token");
        const refresh_token = hp.get("refresh_token");

        if (access_token && refresh_token) {
          await supabase.auth.setSession({ access_token, refresh_token });
        }
        const { data: { session } } = await supabase.auth.getSession();
        if (!session) { setStage("error"); return; }
        setStage("form");
      } catch {
        setStage("error");
      }
    })();
  }, []);

  async function onSave(e){
    e.preventDefault();
    setErr("");
    const { error } = await supabase.auth.updateUser({ password: pwd });
    if (error) { setErr(error.message); return; }
    setStage("done");
    setTimeout(() => navigate("/login", { replace: true }), 1200);
  }

  if (stage === "checking") return <div style={{ padding:24 }}>Verifica link…</div>;
  if (stage === "error") return <div style={{ padding:24 }}>Link non valido o scaduto.</div>;
  if (stage === "done") return <div style={{ padding:24 }}>Password aggiornata. Reindirizzamento…</div>;

  return (
    <div className="container-core">
      <form onSubmit={onSave} className="card space-y-4 max-w-lg">
        <h1 className="text-2xl font-semibold">Imposta nuova password</h1>
        <label className="block">
          <span className="block mb-1">Nuova password</span>
          <input
            type="password" required value={pwd} onChange={(e)=>setPwd(e.target.value)}
            className="w-full rounded-xl bg-white/5 border border-white/15 px-4 py-2 outline-none focus:ring-2 focus:ring-white/30"
            placeholder="••••••••"
          />
        </label>
        <button type="submit" className="btn btn-primary">Salva</button>
        {err && <div className="text-red-400">{err}</div>}
      </form>
    </div>
  );
}
