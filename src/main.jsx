// src/main.jsx
import "./index.css";
import React, { useEffect, useState } from "react";
import { createRoot } from "react-dom/client";
import { HashRouter, Routes, Route, Navigate, Outlet, useNavigate } from "react-router-dom";
import { supabase } from "@/lib/supabaseClient";
import AppShell from "@/AppShell.jsx";
import ErrorBoundary from "@/components/ErrorBoundary.jsx";
import AppLoader from "@/components/AppLoader.jsx";

// Pages
import Login from "@/pages/Login.jsx";
import Capo from "@/pages/Capo.jsx";
import ManagerHub from "@/pages/ManagerHub.jsx";
import Direzione from "@/pages/Direzione.jsx";
import AdminUsers from "@/pages/AdminUsers.jsx";

const AUTH_TIMEOUT_MS = 2000;

async function fetchRole(userId) {
  try {
    const { data, error } = await supabase
      .from("profiles")
      .select("role")
      .eq("id", userId)
      .maybeSingle();
    if (!error && data && data.role) return data.role;
  } catch (e) {
    console.warn("[CORE] fetchRole error:", e);
  }
  return null;
}

function RequireAuth({ accept = ["capo", "manager", "direzione"] }) {
  const [state, setState] = useState({ loading: true, user: null, role: null });

  useEffect(() => {
    let alive = true;

    async function prime() {
      try {
        const sessionPromise = supabase.auth.getSession();
        const timeoutPromise = new Promise((resolve) =>
          setTimeout(() => resolve({ data: { session: null } }), AUTH_TIMEOUT_MS)
        );
        const raced = (await Promise.race([sessionPromise, timeoutPromise])) || { data: { session: null } };
        const session = raced?.data?.session ?? null;
        const user = session?.user ?? null;
        const role = user ? await fetchRole(user.id) : null;

        if (!alive) return;
        setState({ loading: false, user, role });
      } catch (e) {
        console.error("[CORE] auth prime error:", e);
        if (!alive) return;
        setState({ loading: false, user: null, role: null });
      }
    }

    const { data: sub } = supabase.auth.onAuthStateChange(async (_evt, sess) => {
      try {
        const user = sess?.user ?? null;
        const role = user ? await fetchRole(user.id) : null;
        if (!alive) return;
        setState({ loading: false, user, role });
      } catch (e) {
        console.warn("[CORE] onAuthStateChange error:", e);
        if (!alive) return;
        setState({ loading: false, user: null, role: null });
      }
    });

    prime();

    return () => {
      alive = false;
      sub?.subscription?.unsubscribe?.();
    };
  }, []);

  if (state.loading) return <AppLoader label="Caricamento…" />;
  if (!state.user) return <Navigate to="/login" replace />;

  const role = state.role || "capo";
  if (!accept.includes(role)) return <Navigate to="/capo" replace />;

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

        <Route element={<RequireAuth accept={["capo", "manager", "direzione"]} />}>
          <Route path="/capo" element={<Capo />} />
        </Route>

        <Route element={<RequireAuth accept={["manager", "direzione"]} />}>
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
    <ErrorBoundary>
      <HashRouter>
        <AppRoutes />
      </HashRouter>
    </ErrorBoundary>
  </React.StrictMode>
);
