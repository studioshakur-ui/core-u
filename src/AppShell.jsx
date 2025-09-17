// src/AppShell.jsx
import React, { useEffect } from "react";
import { Outlet, NavLink, useNavigate } from "react-router-dom";
import { supabase } from "./lib/supabaseClient";
import { useCoreStore } from "./store/useCoreStore";
import ToastHost from "./components/ui/ToastHost";
import BrandLogo from "./components/BrandLogo";

export default function AppShell() {
  const navigate = useNavigate();
  const { session, setSession, offline, setOffline, pushToast } = useCoreStore();

  useEffect(() => {
    if (window.__react_mounted__) window.__react_mounted__();

    const handleNet = () => {
      setOffline(!navigator.onLine);
      pushToast({
        title: navigator.onLine ? "Online" : "Offline",
        message: navigator.onLine ? "Connessione ripristinata" : "Modalità offline",
      });
    };
    window.addEventListener("online", handleNet);
    window.addEventListener("offline", handleNet);

    (async () => {
      const { data: { session } } = await supabase.auth.getSession();
      let role = null, email = null;
      const user = session?.user ?? null;
      if (user) {
        email = user.email;
        const { data: p } = await supabase.from("profiles").select("role,email").eq("id", user.id).maybeSingle();
        role = p?.role ?? null; email = p?.email ?? email;
      }
      setSession({ user: user ?? null, role, email });
    })();

    const { data: sub } = supabase.auth.onAuthStateChange(async (_evt, sess) => {
      const u = sess?.user ?? null;
      let r = null; let e = u?.email ?? null;
      if (u) {
        const { data: pr } = await supabase.from("profiles").select("role,email").eq("id", u.id).maybeSingle();
        r = pr?.role ?? null; e = pr?.email ?? e;
      }
      setSession({ user: u, role: r, email: e });
    });

    return () => {
      window.removeEventListener("online", handleNet);
      window.removeEventListener("offline", handleNet);
      sub.subscription.unsubscribe();
    };
  }, [setOffline, setSession, pushToast]);

  async function onLogout(){
    await supabase.auth.signOut();
    navigate("/login", { replace: true });
  }

  const linkCls = ({ isActive }) =>
    "px-2 py-1 rounded-lg " + (isActive ? "bg-neutral-800 text-white" : "text-sky-400 hover:text-sky-300");

  const role = session.role;
  const isAuth = !!session.user;

  return (
    <div className="min-h-screen">
      <header className="sticky top-0 z-10 border-b border-white/10 bg-black/40 backdrop-blur">
        <div className="mx-auto max-w-7xl flex items-center justify-between px-4 py-3">
          <div className="flex items-center gap-3">
            <BrandLogo className="h-6 w-auto" />
          </div>

          {isAuth && (
            <nav className="flex gap-3 items-center">
              <NavLink to="/capo" className={linkCls}>Capo</NavLink>
              {(role === "manager" || role === "direzione") && (
                <NavLink to="/manager" className={linkCls}>Manager</NavLink>
              )}
              {role === "direzione" && (
                <NavLink to="/direzione" className={linkCls}>Direzione</NavLink>
              )}
              {offline && <span className="chip">Offline</span>}
            </nav>
          )}

          {isAuth ? (
            <div className="flex items-center gap-2">
              <span className="muted text-sm">{session.email || "sessione"}</span>
              <button onClick={onLogout} className="btn btn-ghost">Esci</button>
            </div>
          ) : (
            <span className="opacity-60">Accesso</span>
          )}
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-4 py-6">
        <Outlet />
      </main>
      <ToastHost />
    </div>
  );
}
