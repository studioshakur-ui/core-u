// src/main.jsx
import "./index.css";
import React, { useEffect, useState } from "react";
import { createRoot } from "react-dom/client";
import {
  HashRouter,
  Routes,
  Route,
  Navigate,
  useNavigate,
  Outlet,
} from "react-router-dom";
import { supabase } from "./lib/supabaseClient";
import { getHomeRoute } from "./lib/routeUtils";

import AppShell from "./AppShell.jsx";
import Login from "./pages/Login.jsx";
import ResetPassword from "./pages/ResetPassword.jsx";
import AdminUsers from "./pages/AdminUsers.jsx";
import Capo from "./pages/Capo.jsx";
import Manager from "./pages/Manager.jsx";
import Direzione from "./pages/Direzione.jsx";

window.addEventListener("error", function (e) {
  const div = document.createElement("div");
  div.style.position = "fixed";
  div.style.bottom = "0";
  div.style.left = "0";
  div.style.width = "100%";
  div.style.background = "red";
  div.style.color = "white";
  div.style.padding = "10px";
  div.innerText = e.message;
  document.body.appendChild(div);
});

/* --------- util: charge le rôle depuis profiles --------- */
async function fetchRole(userId) {
  if (!userId) return null;
  const { data, error } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", userId)
    .maybeSingle();
  if (error) {
    console.warn("[profiles] role fetch error:", error.message);
    return null;
  }
  return data?.role ?? null;
}

/* --------- AutoHome: route "/" -> redir selon rôle --------- */
function AutoHome() {
  const navigate = useNavigate();
  const [done, setDone] = useState(false);

  useEffect(() => {
    let alive = true;
    (async () => {
      const { data: { session } } = await supabase.auth.getSession();
      const user = session?.user ?? null;
      if (!alive) return;

      if (!user) {
        navigate("/login", { replace: true });
        return;
      }

      const role = await fetchRole(user.id);
      if (!alive) return;

      const home = getHomeRoute(role ?? "capo");
      navigate(home, { replace: true });
    })().finally(() => alive && setDone(true));

    return () => { alive = false; };
  }, [navigate]);

  return done ? null : <div style={{ padding: 24 }}>Redirezionamento…</div>;
}

/* --------- RequireAuth: protège et filtre par rôle --------- */
function RequireAuth({ accept, children }) {
  const navigate = useNavigate();
  const [state, setState] = useState({
    loading: true,
    user: null,
    role: null,
  });

  useEffect(() => {
    let alive = true;

    async function prime() {
      const { data: { session } } = await supabase.auth.getSession();
      const user = session?.user ?? null;
      const role = user ? await fetchRole(user.id) : null;
      if (!alive) return;
      setState({ loading: false, user, role });
    }

    // écoute les changements d’auth et recalcule le rôle
    const { data: sub } = supabase.auth.onAuthStateChange(async (_evt, sess) => {
      const user = sess?.user ?? null;
      const role = user ? await fetchRole(user.id) : null;
      if (!alive) return;
      setState({ loading: false, user, role });
    });

    prime();

    return () => {
      alive = false;
      sub?.subscription?.unsubscribe?.();
    };
  }, []);

  // états UI
  if (state.loading) return <div style={{ padding: 24 }}>Caricamento…</div>;
  if (!state.user) return <Navigate to="/login" replace />;

  if (accept && accept.length) {
    const role = state.role ?? "capo"; // défaut sûr
    if (!accept.includes(role)) {
      // redirige élégamment vers sa home
      return <Navigate to={getHomeRoute(role)} replace />;
    }
  }

  return children;
}

/* --------- Boot Router --------- */
createRoot(document.getElementById("root")).render(
  <HashRouter>
    <Routes>
      <Route element={<AppShell />}>
        <Route index element={<AutoHome />} />
        <Route path="/login" element={<Login />} />
        <Route path="/reset" element={<ResetPassword />} />

        <Route
          path="/capo"
          element={
            <RequireAuth accept={["capo", "manager", "direzione"]}>
              <Capo />
            </RequireAuth>
          }
        />
        <Route
          path="/manager"
          element={
            <RequireAuth accept={["manager", "direzione"]}>
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
        <Route
          path="/admin/users"
          element={
            <RequireAuth accept={["direzione"]}>
              <AdminUsers />
            </RequireAuth>
          }
        />

        <Route path="*" element={<Navigate to="/" replace />} />
      </Route>
    </Routes>
  </HashRouter>
);
