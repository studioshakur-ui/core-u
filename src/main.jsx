// src/main.jsx
import { createRoot } from "react-dom/client";
import { HashRouter, Routes, Route, Navigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { supabase } from "./lib/supabaseClient";

import AppShell from "./AppShell";
import Login from "./pages/Login";
import AuthCallback from "./pages/AuthCallback";
import Capo from "./pages/Capo";
import Manager from "./pages/Manager";
import Direzione from "./pages/Direzione";
import { getHomeRoute } from "./pages/AuthCallback";

function RequireAuth({ children, accept }) {
  const [state, setState] = useState({ loading: true, user: null, role: null });

  useEffect(() => {
    let mounted = true;

    (async () => {
      const { data: { session } } = await supabase.auth.getSession();

      const { data: sub } = supabase.auth.onAuthStateChange((_evt, sess) => {
        setState((s) => ({ ...s, user: sess?.user ?? null }));
      });

      let user = session?.user ?? null;
      let role = null;

      if (user) {
        const { data: p } = await supabase
          .from("profiles")
          .select("role")
          .eq("id", user.id)
          .maybeSingle();
        role = p?.role ?? "capo";
      }

      if (mounted) setState({ loading: false, user, role });

      return () => sub.subscription.unsubscribe();
    })();

    return () => { mounted = false; };
  }, []);

  if (state.loading) return <div style={{ padding: 24 }}>Chargement…</div>;
  if (!state.user) return <Navigate to="/login" replace />;

  if (accept && !accept.includes(state.role)) {
    return <Navigate to={getHomeRoute(state.role)} replace />;
  }

  return children;
}

function AppBoot() {
  // Masquer le fallback HTML (fin des Ctrl+Shift+R)
  useEffect(() => {
    if (typeof window !== "undefined" && window.__react_mounted__) {
      window.__react_mounted__();
    }
  }, []);
  return <AppShell />;
}

createRoot(document.getElementById("root")).render(
  <HashRouter>
    <Routes>
      <Route element={<AppBoot />}>
        <Route path="/login" element={<Login />} />
        <Route path="/auth/callback" element={<AuthCallback />} />

        <Route
          path="/capo"
          element={
            <RequireAuth accept={["capo","manager","direzione"]}>
              <Capo />
            </RequireAuth>
          }
        />
        <Route
          path="/manager"
          element={
            <RequireAuth accept={["manager","direzione"]}>
              <Manager />
            </RequireAuth>
          }
        />
        <Route
          path="/direzione"
          element={
            <RequireAuth accept={["direzione"]}>
              <Direzione />
            </RequireAuth>
          }
        />

        <Route path="*" element={<Navigate to="/login" replace />} />
      </Route>
    </Routes>
  </HashRouter>
);
