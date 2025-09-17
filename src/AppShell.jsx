import { useEffect } from "react";
import { Outlet, Link, useNavigate, useLocation } from "react-router-dom";
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

  const onLogout = async () => {
    await supabase.auth.signOut();
    navigate("/login", { replace: true });
  };

  // Header minimal (reste visible même sur /login)
  return (
    <div className="min-h-screen bg-neutral-950 text-neutral-100">
      <header
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "12px 16px",
          borderBottom: "1px solid rgba(255,255,255,.08)",
