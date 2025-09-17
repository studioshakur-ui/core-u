// src/AppShell.jsx
import React, { useEffect } from "react";
import { Outlet, Link, useNavigate, useLocation } from "react-router-dom";
import { supabase } from "./lib/supabaseClient";

export default function AppShell() {
  const navigate = useNavigate();
  const loc = useLocation();

  // Masquer le splash HTML une fois React monté
  useEffect(() => {
    if (typeof window !== "undefined" && window.__react_mounted__) {
      window.__react_mounted__();
    }
  }, []);

  const onLogout = async () => {
    await supabase.auth.signOut();
    navigate("/login", { replace: true });
  };

  return (
    <div style={{ minHeight: "100vh", backgroundColor: "#0b0b0b", color: "#eaeaea" }}>
      <header
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "12px 16px",
          borderBottom: "1px solid rgba(255,255,255,.08)",
          position: "sticky",
          top: 0,
          backdropFilter: "saturate(160%) blur(6px)",
          background: "rgba(0,0,0,.35)"
        }}
      >
        <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
          <strong>CORE v5</strong>
          <nav style={{ display: "flex", gap: 12 }}>
            <Link to="/capo">Capo</Link>
            <Link to="/manager">Manager</Link>
