// src/components/Header.jsx
import React, { useEffect, useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import Logo from "@/components/Logo.jsx";
import { supabase } from "@/lib/supabaseClient";

function ThemeToggle() {
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    const prefersDark = window.matchMedia?.("(prefers-color-scheme: dark)")?.matches;
    const saved = localStorage.getItem("core_theme");
    const dark = saved ? saved === "dark" : !!prefersDark;
    setIsDark(dark);
    document.documentElement.dataset.theme = dark ? "dark" : "light";
    document.documentElement.style.backgroundColor = dark ? "#0b1220" : "#ffffff";
    document.body.style.background = dark ? "#0b1220" : "#ffffff";
    document.body.style.color = dark ? "#e2e8f0" : "#0f172a";
  }, []);

  function toggle() {
    const next = !isDark;
    setIsDark(next);
    localStorage.setItem("core_theme", next ? "dark" : "light");
    document.documentElement.dataset.theme = next ? "dark" : "light";
    document.documentElement.style.backgroundColor = next ? "#0b1220" : "#ffffff";
    document.body.style.background = next ? "#0b1220" : "#ffffff";
    document.body.style.color = next ? "#e2e8f0" : "#0f172a";
  }

  return (
    <button
      onClick={toggle}
      aria-label="Cambia tema"
      title="Cambia tema"
      style={{
        border: "1px solid #cbd5e1",
        background: isDark ? "#111827" : "#ffffff",
        color: isDark ? "#e5e7eb" : "#0f172a",
        padding: "6px 10px",
        borderRadius: 999,
        fontWeight: 600,
        cursor: "pointer",
      }}
    >
      {isDark ? "🌙" : "☀️"}
    </button>
  );
}

function UserMenu() {
  const [open, setOpen] = useState(false);
  const [email, setEmail] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    let alive = true;
    supabase.auth.getSession().then(({ data }) => {
      const em = data?.session?.user?.email || "";
      if (alive) setEmail(em);
    });
    return () => { alive = false; };
  }, []);

  async function logout() {
    await supabase.auth.signOut();
    navigate("/login", { replace: true });
  }

  return (
    <div style={{ position: "relative" }}>
      <button
        onClick={() => setOpen((o) => !o)}
        aria-haspopup="menu"
        aria-expanded={open}
        style={{
          display: "flex",
          alignItems: "center",
          gap: 8,
          border: "1px solid #cbd5e1",
          background: "#ffffff",
          color: "#0f172a",
          padding: "6px 10px",
          borderRadius: 999,
          cursor: "pointer",
          fontWeight: 600,
        }}
      >
        <span style={{
          width: 22, height: 22, borderRadius: "50%",
          background: "#0ea5e9", display: "inline-grid", placeItems: "center",
          color: "white", fontSize: 12, fontWeight: 800
        }}>
          {email ? email[0]?.toUpperCase() : "?"}
        </span>
        <span style={{ maxWidth: 140, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
          {email || "Guest"}
        </span>
        <span aria-hidden>▾</span>
      </button>

      {open && (
        <div
          role="menu"
          style={{
            position: "absolute",
            right: 0,
            marginTop: 8,
            background: "white",
            color: "#0f172a",
            border: "1px solid #e5e7eb",
            borderRadius: 12,
            boxShadow: "0 8px 30px rgba(0,0,0,.08)",
            minWidth: 220,
            zIndex: 50,
          }}
        >
          <div style={{ padding: "10px 12px", borderBottom: "1px solid #e5e7eb", fontSize: 12, color: "#64748b" }}>
            Connesso come<br /><strong>{email || "Guest"}</strong>
          </div>

          <button
            onClick={() => navigate("/direzione")}
            role="menuitem"
            style={menuItemStyle}
          >
            Direzione
          </button>
          <button
            onClick={() => navigate("/manager")}
            role="menuitem"
            style={menuItemStyle}
          >
            Manager
          </button>
          <button
            onClick={() => navigate("/capo")}
            role="menuitem"
            style={menuItemStyle}
          >
            Capo
          </button>

          <div style={{ borderTop: "1px solid #e5e7eb" }} />
          <button onClick={logout} role="menuitem" style={{ ...menuItemStyle, color: "#b91c1c" }}>
            Esci
          </button>
        </div>
      )}
    </div>
  );
}

const menuItemStyle = {
  width: "100%",
  textAlign: "left",
  padding: "10px 12px",
  background: "transparent",
  border: "none",
  cursor: "pointer",
  fontSize: 14,
};

export default function Header() {
  const linkStyle = ({ isActive }) => ({
    padding: "8px 12px",
    borderRadius: 12,
    textDecoration: "none",
    color: isActive ? "#0b1220" : "#0f172a",
    background: isActive ? "#a7f3d0" : "transparent",
    fontWeight: 600,
  });

  return (
    <header
      style={{
        position: "sticky",
        top: 0,
        zIndex: 20,
        display: "grid",
        gridTemplateColumns: "auto 1fr auto",
        alignItems: "center",
        gap: 12,
        padding: "10px 16px",
        background: "rgba(255,255,255,0.85)",
        backdropFilter: "saturate(140%) blur(8px)",
        borderBottom: "1px solid #e5e7eb",
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
        <Logo height={22} />
        <div style={{ fontWeight: 800, letterSpacing: ".4px" }}>CORE</div>
      </div>

      <nav style={{ display: "flex", gap: 6 }}>
        <NavLink to="/capo" style={linkStyle}>Capo</NavLink>
        <NavLink to="/manager" style={linkStyle}>Manager</NavLink>
        <NavLink to="/direzione" style={linkStyle}>Direzione</NavLink>
      </nav>

      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
        <ThemeToggle />
        <UserMenu />
      </div>
    </header>
  );
}
