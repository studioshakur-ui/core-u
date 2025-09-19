// src/main.jsx
import React, { useEffect, useState } from "react";
import { createRoot } from "react-dom/client";
import { HashRouter, Routes, Route, Navigate, Outlet, useLocation } from "react-router-dom";
import AppShell from "@/AppShell.jsx";
import { supabase } from "@/lib/supabaseClient";

import Capo from "@/pages/Capo.jsx";
import Manager from "@/pages/Manager.jsx";
import Direzione from "@/pages/Direzione.jsx";
import Login from "@/pages/Login.jsx";

async function fetchRole(userId) {
  try {
    const { data } = await supabase.from("profiles").select("role").eq("id", userId).maybeSingle();
    return data?.role || null;
  } catch {
    return null;
  }
}

function RequireAuth() {
  const [state, setState] = useState({ loading: true, user: null, role: null });
  const location = useLocation();

  useEffect(() => {
    let alive = true;
    (async () => {
      const { data: { session } } = await supabase.auth.getSession();
      const user = session?.user ?? null;
      const role = user ? await fetchRole(user.id) : null;
      if (alive) setState({ loading: false, user, role });
    })();
    const { data: sub } = supabase.auth.onAuthStateChange(async (_evt, session) => {
      const user = session?.user ?? null;
      const role = user ? await fetchRole(user.id) : null;
      setState({ loading: false, user, role });
    });
    return () => {
      alive = false;
      sub.subscription.unsubscribe();
    };
  }, []);

  if (state.loading) return <p style={{ padding: 24 }}>Caricamento…</p>;
  if (!state.user) {
    return <Navigate to="/login" replace state={{ from: location.pathname }} />;
  }
  return <Outlet context={{ role: state.role || "capo" }} />;
}

function RequireRole({ expected }) {
  const [state, setState] = useState({ loading: true, user: null, role: null });
  const location = useLocation();

  useEffect(() => {
    let alive = true;
    (async () => {
      const { data: { session } } = await supabase.auth.getSession();
      const user = session?.user ?? null;
      const role = user ? await fetchRole(user.id) : null;
      if (alive) setState({ loading: false, user, role });
    })();
    return () => { alive = false; };
  }, []);

  if (state.loading) return <p style={{ padding: 24 }}>Caricamento…</p>;
  if (!state.user) return <Navigate to="/login" replace state={{ from: location.pathname }} />;

  const role = state.role || "capo";
  if (role !== expected) {
    if (role === "direzione") return <Navigate to="/direzione" replace />;
    if (role === "manager") return <Navigate to="/manager" replace />;
    return <Navigate to="/capo" replace />;
  }
  return <Outlet />;
}

function AppRoutes() {
  return (
    <Routes>
      <Route element={<AppShell />}>
        <Route path="/" element={<Navigate to="/capo" replace />} />
        <Route path="/login" element={<Login />} />

        <Route element={<RequireAuth />}>
          <Route element={<RequireRole expected="capo" />}>
            <Route path="/capo" element={<Capo />} />
          </Route>
          <Route element={<RequireRole expected="manager" />}>
            <Route path="/manager" element={<Manager />} />
          </Route>
          <Route element={<RequireRole expected="direzione" />}>
            <Route path="/direzione" element={<Direzione />} />
          </Route>
        </Route>

        <Route path="*" element={<Navigate to="/" replace />} />
      </Route>
    </Routes>
  );
}

const root = createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <HashRouter>
      <AppRoutes />
    </HashRouter>
  </React.StrictMode>
);
