// src/main.jsx
import "./index.css";
import React, { useEffect, useState } from "react";
import { createRoot } from "react-dom/client";
import { HashRouter, Routes, Route, Navigate, Outlet, useNavigate } from "react-router-dom";
import { supabase } from "./lib/supabaseClient";
import AppShell from "./AppShell.jsx";

// Pages
import Login from "./pages/Login.jsx";
import ResetPassword from "./pages/ResetPassword.jsx";
import AuthCallback from "./pages/AuthCallback.jsx";
import Capo from "./pages/Capo.jsx";
import ManagerHub from "./pages/ManagerHub.jsx";
import Direzione from "./pages/Direzione.jsx";
import AdminUsers from "./pages/AdminUsers.jsx";

// Helpers
async function fetchRole(userId) {
  try {
    const { data, error } = await supabase.from("profiles").select("role").eq("id", userId).maybeSingle();
    if (!error && data && data.role) return data.role;
  } catch {}
  const { data: { session } } = await supabase.auth.getSession();
  return session?.user?.app_metadata?.role || session?.user?.user_metadata?.role || null;
}

function RequireAuth({ accept = ["capo", "manager", "direzione"] }) {
  const [state, setState] = useState({ loading: true, user: null, role: null });

  useEffect(() => {
    let alive = true;
    async function prime() {
      const { data: { session } } = await supabase.auth.getSession();
      const user = session?.user ?? null;
      const role = user ? await fetchRole(user.id) : null;
      if (!alive) return;
      setState({ loading: false, user, role });
    }
    const { data: sub } = supabase.auth.onAuthStateChange(async (_evt, sess) => {
      const user = sess?.user ?? null;
      const role = user ? await fetchRole(user.id) : null;
      if (!alive) return;
      setState({ loading: false, user, role });
    });
    prime();
    return () => { alive = false; sub?.subscription?.unsubscribe?.(); };
  }, []);

  if (state.loading) return <div style={{ padding: 24 }}>Caricamento…</div>;
  if (!state.user) return <Navigate to="/login" replace />;
  if (!accept.includes(state.role || "capo")) return <Navigate to="/capo" replace />;
  return <Outlet />;
}

function AppRoutes() {
  const navigate = useNavigate();
  useEffect(() => {
    if (location.hash === "#main") navigate("/", { replace: true });
  }, [navigate]);

  return (
    <Routes>
      <Route element={<AppShell />}>
        <Route path="/" element={<Navigate to="/capo" replace />} />
        <Route path="/login" element={<Login />} />
        <Route path="/reset" element={<ResetPassword />} />
        <Route path="/auth/callback" element={<AuthCallback />} />

        <Route element={<RequireAuth accept={["capo","manager","direzione"]} />}>
          <Route path="/capo" element={<Capo />} />
        </Route>

        <Route element={<RequireAuth accept={["manager","direzione"]} />}>
          <Route path="/manager" element={<ManagerHub />} />
        </Route>

        <Route element={<RequireAuth accept={["direzione"]} />}>
          <Route path="/direzione" element={<Direzione />} />
          <Route path="/admin/users" element={<AdminUsers />} />
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
