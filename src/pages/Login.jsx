// src/pages/Login.jsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/lib/supabaseClient";

async function fetchRole(userId) {
  const { data, error } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", userId)
    .maybeSingle();
  if (!error && data && data.role) return data.role;
  return null;
}

export default function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [pwd, setPwd] = useState("");
  const [msg, setMsg] = useState("");

  async function onSubmit(e) {
    e.preventDefault();
    setMsg("");
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password: pwd
    });
    if (error) {
      setMsg(error.message);
      return;
    }
    const user = data?.user || null;
    const role = user ? await fetchRole(user.id) : null;

    // Redirection selon rôle
    if (role === "direzione") navigate("/direzione", { replace: true });
    else if (role === "manager") navigate("/manager", { replace: true });
    else navigate("/capo", { replace: true });
  }

  return (
    <div style={{ maxWidth: 420 }}>
      <h1 style={{ marginBottom: 8 }}>Accedi</h1>
      <form onSubmit={onSubmit} style={{ display: "grid", gap: 12 }}>
        <input
          type="email"
          placeholder="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          style={{ padding: "10px 12px", border: "1px solid #cbd5e1", borderRadius: 12 }}
        />
        <input
          type="password"
          placeholder="password"
          value={pwd}
          onChange={(e) => setPwd(e.target.value)}
          required
          style={{ padding: "10px 12px", border: "1px solid #cbd5e1", borderRadius: 12 }}
        />
        <button
          type="submit"
          style={{
            padding: "10px 14px",
            borderRadius: 12,
            border: "1px solid #0ea5e9",
            background: "#0ea5e9",
            color: "white",
            fontWeight: 700
          }}
        >
          Entra
        </button>
      </form>
      {!!msg && <p style={{ marginTop: 12, color: "#b91c1c" }}>{msg}</p>}
    </div>
  );
}
