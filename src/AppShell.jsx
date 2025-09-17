// src/AppShell.jsx
import React, { useEffect } from "react";
import { Outlet, NavLink, useNavigate, useLocation } from "react-router-dom";
import { supabase } from "./lib/supabaseClient";

export default function AppShell() {
  const navigate = useNavigate();
  const loc = useLocation();

  // Masque le splash HTML une fois React monté
  useEffect(() => {
    if (typeof window !== "undefined" && window.__react_mounted__) {
      window.__react_mounted__();
    }
  }, []);

  async function onLogout() {
    await supabase.auth.signOut();
    navigate("/login", { replace: true });
  }

  return (
    <div style={{ minHeight: "100vh", backgroundColor: "#0b0b0b", color: "#eaeaea" }}>
      <header
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "12px 16px",
          borderBottom: "1px solid rgba(255,255,255,.08)"
        }}
      >
        <strong>CORE v5</strong>

        <nav style={{ display: "flex", gap: 12 }}>
          <NavLink to="/capo">Capo</NavLink>
          <NavLink to="/manager">Manager</NavLink>
          <NavLink to="/direzione">Direzione</NavLink>
        </nav>

        {loc.pathname !== "/login" ? (
          <button onClick={onLogout} style={{ cursor: "pointer" }}>
            Logout
          </button>
        ) : (
          <span style={{ opacity: 0.6 }}>Login</span>
        )}
      </header>

      <main style={{ padding: 16 }}>
        <Outlet />
      </main>
    </div>
  );
}
