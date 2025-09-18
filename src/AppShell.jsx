// src/AppShell.jsx
import React from "react";
import { NavLink, Outlet } from "react-router-dom";

export default function AppShell() {
  const linkStyle = ({ isActive }) => ({
    padding: "8px 12px",
    borderRadius: 12,
    textDecoration: "none",
    color: isActive ? "#0b1220" : "#0f172a",
    background: isActive ? "#a7f3d0" : "#f1f5f9",
    fontWeight: 600
  });

  return (
    <div id="main" style={{ minHeight: "100vh", background: "#ffffff" }}>
      <header
        style={{
          display: "flex",
          gap: 12,
          alignItems: "center",
          padding: 16,
          borderBottom: "1px solid #e2e8f0",
          position: "sticky",
          top: 0,
          background: "white",
          zIndex: 10
        }}
      >
        <div style={{ fontWeight: 800 }}>CORE</div>
        <nav style={{ display: "flex", gap: 8 }}>
          <NavLink to="/capo" style={linkStyle}>Capo</NavLink>
          <NavLink to="/manager" style={linkStyle}>Manager</NavLink>
          <NavLink to="/direzione" style={linkStyle}>Direzione</NavLink>
          <NavLink to="/login" style={linkStyle}>Login</NavLink>
        </nav>
      </header>

      <main style={{ padding: 24 }}>
        <Outlet />
      </main>
    </div>
  );
}
