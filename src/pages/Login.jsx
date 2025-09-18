// src/pages/Login.jsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/lib/supabaseClient";

async function fetchRole(userId) {
  try {
    const { data, error } = await supabase
      .from("profiles")
      .select("role")
      .eq("id", userId)
      .maybeSingle();
    if (error) throw error;
    return data?.role || null;
  } catch {
    return null;
  }
}

export default function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [pwd, setPwd] = useState("");
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState(null);

  async function onSubmit(e) {
    e.preventDefault();
    setMsg(null);
    setLoading(true);
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password: pwd,
      });
      if (error) {
        setMsg({ type: "error", text: error.message });
        return;
      }
      const user = data?.user;
      if (!user) {
        setMsg({ type: "error", text: "Accesso fallito." });
        return;
      }
      const role = await fetchRole(user.id);
      if (role === "direzione") navigate("/direzione", { replace: true });
      else if (role === "manager") navigate("/manager", { replace: true });
      else navigate("/capo", { replace: true });
      setMsg({ type: "success", text: "Accesso effettuato." });
    } finally {
      setLoading(false);
    }
  }

  return (
    <section
      style={{
        display: "grid",
        gridTemplateColumns: "1fr 1fr",
        gap: 24,
        alignItems: "stretch",
      }}
    >
      {/* Hero panel */}
      <div
        aria-hidden="true"
        style={{
          borderRadius: 24,
          overflow: "hidden",
          position: "relative",
          minHeight: 360,
          background: "#0b1220",
        }}
      >
        <img
          src="/assets/images/hero.webp"
          alt=""
          style={{
            width: "100%",
            height: "100%",
            objectFit: "cover",
            opacity: 0.35,
            display: "block",
          }}
          loading="lazy"
          decoding="async"
        />
        <div
          style={{
            position: "absolute",
            inset: 0,
            padding: 32,
            color: "white",
            display: "grid",
            alignContent: "end",
            gap: 8,
            background:
              "radial-gradient(80% 60% at 10% 10%, rgba(14,165,233,.18), rgba(2,6,23,0))",
          }}
        >
          <h1 style={{ margin: 0, fontSize: 28, lineHeight: 1.1 }}>
            Pianifica • Esegui • Controlla
          </h1>
          <p style={{ margin: 0, opacity: 0.9 }}>
            CORE centralizza la pianificazione, l’operatività e il controllo
            per direzione, manager e capi.
          </p>
        </div>
      </div>

      {/* Form panel */}
      <div
        style={{
          padding: 24,
          border: "1px solid #e5e7eb",
          borderRadius: 16,
          background: "white",
          alignSelf: "center",
          maxWidth: 520,
          justifySelf: "center",
          width: "100%",
        }}
      >
        <h2 style={{ marginTop: 0, marginBottom: 8 }}>Accedi a CORE</h2>
        <p style={{ marginTop: 0, marginBottom: 18, color: "#475569" }}>
          Inserisci le tue credenziali per continuare.
        </p>

        <form onSubmit={onSubmit} style={{ display: "grid", gap: 12 }}>
          <label htmlFor="email" style={{ fontWeight: 600 }}>
            Email
          </label>
          <input
            id="email"
            type="email"
            autoComplete="username"
            placeholder="studio.shakur@gmail.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            style={{
              padding: "10px 12px",
              border: "1px solid #cbd5e1",
              borderRadius: 12,
            }}
          />

          <label htmlFor="pwd" style={{ fontWeight: 600 }}>
            Password
          </label>
          <input
            id="pwd"
            type="password"
            autoComplete="current-password"
            placeholder="••••••••"
            value={pwd}
            onChange={(e) => setPwd(e.target.value)}
            required
            style={{
              padding: "10px 12px",
              border: "1px solid #cbd5e1",
              borderRadius: 12,
            }}
          />

          <button
            type="submit"
            disabled={loading}
            style={{
              marginTop: 4,
              padding: "10px 14px",
              borderRadius: 12,
              border: "1px solid #0ea5e9",
              background: loading ? "#93c5fd" : "#0ea5e9",
              color: "white",
              fontWeight: 700,
              cursor: loading ? "not-allowed" : "pointer",
            }}
          >
            {loading ? "Connessione…" : "Entra"}
          </button>
        </form>

        {msg && (
          <div
            role="status"
            style={{
              marginTop: 12,
              padding: 10,
              borderRadius: 12,
              background:
                msg.type === "error" ? "#fee2e2" : "rgba(16,185,129,.12)",
              color: msg.type === "error" ? "#7f1d1d" : "#065f46",
              fontWeight: 600,
            }}
          >
            {msg.text}
          </div>
        )}
      </div>
    </section>
  );
}
