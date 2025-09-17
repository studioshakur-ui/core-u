// src/pages/Login.jsx
import { useState } from "react";
import { supabase } from "../lib/supabaseClient";

export default function Login() {
  const [email, setEmail] = useState("");
  const [done, setDone] = useState(false);
  const [err, setErr] = useState("");

  const onSubmit = async (e) => {
    e.preventDefault();
    setErr("");

    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: {
        emailRedirectTo: `${window.location.origin}/#/auth/callback`,
      },
    });

    if (error) setErr(error.message);
    else setDone(true);
  };

  if (done) {
    return (
      <div style={{ padding: 24 }}>
        Lien de connexion envoyé. Vérifie ta boîte mail.
        <br />
        Après clic, tu seras redirigé vers l’app.
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} style={{ padding: 24, display: "grid", gap: 8 }}>
      <label>
        Email
        <input
          type="email"
          required
          value={email}
          onChange={(e)=>setEmail(e.target.value)}
          placeholder="you@company.com"
        />
      </label>
      <button type="submit">Recevoir un lien</button>
      {err && <div style={{ color: "red" }}>{err}</div>}
    </form>
  );
}
