// src/components/Header.jsx
import React from "react";
import { NavLink, useNavigate } from "react-router-dom";
import Logo from "@/components/Logo.jsx";
import { getSession, signOut } from "@/auth/session";

export default function Header() {
  const navigate = useNavigate();
  const session = getSession();

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
        display: "grid",
        gridTemplateColumns: "auto 1fr auto",
        alignItems: "center",
        gap: 12,
        padding: "12px 16px",
        borderBottom: "1px solid #e2e8f0",
        background: "#fff",
        position: "sticky",
        top: 0,
        zIndex: 20,
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
        <Logo height={22} />
        <div style={{ fontWeight: 800, letterSpacing: ".2px" }}>CORE</div>
      </div>

      <nav style={{ display: "flex", gap: 8 }}>
        <NavLink to="/capo" style={linkStyle}>Capo</NavLink>
        <NavLink to="/manager" style={linkStyle}>Manager</NavLink>
        <NavLink to="/direzione" style={linkStyle}>Direzione</NavLink>
      </nav>

      <div>
        {!session ? (
          <button
            onClick={() => navigate("/login")}
            style={{
              padding: "8px 12px",
              borderRadius: 12,
              border: "1px solid #0ea5e9",
              background: "#0ea5e9",
              color: "white",
              fontWeight: 700,
              cursor: "pointer",
            }}
          >
            Login
          </button>
        ) : (
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <span style={{ color: "#475569", fontSize: 14 }}>
              {session.email} • <strong>{session.role}</strong>
            </span>
            <button
              onClick={() => { signOut(); navigate("/login", { replace: true }); }}
              style={{
                padding: "8px 12px",
                borderRadius: 12,
                border: "1px solid #e2e8f0",
                background: "#fff",
                fontWeight: 700,
                cursor: "pointer",
              }}
              title="Esci"
            >
              Esci
            </button>
          </div>
        )}
      </div>
    </header>
  );
}
