import React, { useEffect } from "react";
import { Outlet, NavLink, useNavigate, useLocation } from "react-router-dom";
import { supabase } from "./lib/supabaseClient";

export default function AppShell() {
  const navigate = useNavigate();
  const loc = useLocation();

  useEffect(() => {
    if (typeof window !== "undefined" && window.__react_mounted__) {
      window.__react_mounted__();
    }
  }, []);

  async function onLogout() {
    await supabase.auth.signOut();
    navigate("/login", { replace: true });
  }

  const linkCls = ({ isActive }) =>
    "px-2 py-1 rounded-lg " +
    (isActive ? "bg-neutral-800 text-white" : "text-sky-400 hover:text-sky-300");

  return (
    <div className="min-h-screen">
      <header className="sticky top-0 z-10 border-b border-white/10 bg-black/40 backdrop-blur">
        <div className="mx-auto max-w-7xl flex items-center justify-between px-4 py-3">
          <strong className="text-white">CORE v5</strong>
          <nav className="flex gap-3">
            <NavLink to="/capo" className={linkCls}>Capo</NavLink>
            <NavLink to="/manager" className={linkCls}>Manager</NavLink>
            <NavLink to="/direzione" className={linkCls}>Direzione</NavLink>
          </nav>
          {loc.pathname !== "/login" ? (
            <button onClick={onLogout}>Logout</button>
          ) : (
            <span className="opacity-60">Login</span>
          )}
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-4 py-6">
        <Outlet />
      </main>
    </div>
  );
}
