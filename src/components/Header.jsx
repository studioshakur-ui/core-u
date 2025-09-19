// src/components/Header.jsx
import React from "react";
import { NavLink } from "react-router-dom";
import Logo from "@/components/Logo.jsx";

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
        display: "flex",
        alignItems: "center",
        gap: 16,
        padding: "12px 16px",
        borderBottom: "1px solid #e2e8f0",
        background: "#fff",
        position: "sticky",
        top: 0,
        zIndex: 20,
      }}
    >
      <Logo height={22} />
      <nav style={{ display: "flex", gap: 8 }}>
        <NavLink to="/capo" style={linkStyle}>
          Capo
        </NavLink>
        <NavLink to="/manager" style={linkStyle}>
          Manager
        </NavLink>
        <NavLink to="/direzione" style={linkStyle}>
          Direzione
        </NavLink>
      </nav>
    </header>
  );
}
