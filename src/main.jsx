// src/main.jsx
import "./index.css";
import { createRoot } from "react-dom/client";
import { HashRouter, Routes, Route, Navigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { supabase } from "./lib/supabaseClient";
import { getHomeRoute } from "./lib/routeUtils";

import AppShell from "./AppShell.jsx";
import Login from "./pages/Login.jsx";
import AuthCallback from "./pages/AuthCallback.jsx";
import Capo from "./pages/Capo.jsx";
import Manager from "./pages/Manager.jsx";
import Direzione from "./pages/Direzione.jsx";

function AutoHome() {
  const [done, setDone] = useState(false);
  useEffect(() => {
    (async () => {
      const { data: { session } } = await supabase.auth.getSession();
      const user = session?.user ?? null;
      if (!user) { window.location.replace(`${window.location.origin}/#/login`); return; }
      const { data: p } = await supabase.from("profiles").select("role").eq("id", user.id).maybeSingle();
      const role = p?.role ?? "capo";
      window.location.replace(`${window.location.origin}/#${getHomeRoute(role)}`);
    })().finally(()=>setDone(true));
  }, []);
  return done ? null : <div style={{ padding:24 }}>Redirezionamento…</div>;
}

function RequireAuth({ children, accept }) {
  const [state, setState] = useState({ loading: true, user: null, role: null });
  useEffect(() => {
    let mounted = true;
    (async () => {
      const { data: { session } } = await supabase.auth.getSession();
      const { data: sub } = supabase.auth.onAuthStateChange((_evt, sess) => {
        setState((s)=>({ ...s, user: sess?.user ?? null }));
      });
      let user = session?.user ?? null, role = null;
      if (user) {
        const { data: p } = await supabase.from("profiles").select("role").eq("id", user.id).maybeSingle();
        role = p?.role ?? "capo";
      }
      if (mounted) setState({ loading:false, user, role });
      return () => sub.subscription.unsubscribe();
    })();
    return () => { mounted = false; };
  }, []);
  if (state.loading) return <div style={{ padding:24 }}>Caricamento…</div>;
  if (!state.user) return <Navigate to="/login" replace />;
  if (accept && !accept.includes(state.role)) return <Navigate to={getHomeRoute(state.role)} replace />;
  return children;
}

createRoot(document.getElementById("root")).render(
  <HashRouter>
    <Routes>
      <Route element={<AppShell />}>
        <Route path="/" element={<AutoHome />} />
        <Route path="/login" element={<Login />} />
        <Route path="/auth/callback" element={<AuthCallback />} />
        <Route path="/capo" element={<RequireAuth accept={["capo","manager","direzione"]}><Capo /></RequireAuth>} />
        <Route path="/manager" element={<RequireAuth accept={["manager","direzione"]}><Manager /></RequireAuth>} />
        <Route path="/direzione" element={<RequireAuth accept={["direzione"]}><Direzione /></RequireAuth>} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Route>
    </Routes>
  </HashRouter>
);
