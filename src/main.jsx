import "./index.css";
import React, { useEffect, useState } from "react";
import { createRoot } from "react-dom/client";
import { HashRouter, Routes, Route, Navigate, Outlet, useNavigate } from "react-router-dom";
import { supabase, initError } from "@/lib/supabaseClient";
import AppShell from "@/AppShell.jsx";
import ErrorBoundary from "@/components/ErrorBoundary.jsx";
import AppLoader from "@/components/AppLoader.jsx";
import { swCleanup } from "@/utils/swCleanup.js";

import Login from "@/pages/Login.jsx";
import Capo from "@/pages/Capo.jsx";
import ManagerHub from "@/pages/ManagerHub.jsx";
import Direzione from "@/pages/Direzione.jsx";
import AdminUsers from "@/pages/AdminUsers.jsx";
import Diagnostics from "@/pages/Diagnostics.jsx";

swCleanup();

async function fetchRole(userId){
  try {
    const { data } = await supabase.from("profiles").select("role").eq("id", userId).maybeSingle();
    return data?.role || null;
  } catch { return null; }
}

function RequireAuth({ accept=["capo","manager","direzione"] }){
  const [state, setState] = useState({ loading:true, user:null, role:null });

  useEffect(() => {
    let alive = true;
    (async () => {
      if (initError) { setState({ loading:false, user:null, role:null }); return; }
      try {
        const { data: { session } } = await supabase.auth.getSession();
        const user = session?.user ?? null;
        const role = user ? await fetchRole(user.id) : null;
        if (alive) setState({ loading:false, user, role });
      } catch {
        if (alive) setState({ loading:false, user:null, role:null });
      }
    })();
    const { data: sub } = supabase?.auth?.onAuthStateChange?.(async (_evt, sess) => {
      const user = sess?.user ?? null;
      const role = user ? await fetchRole(user.id) : null;
      setState({ loading:false, user, role });
    }) || { data:null };
    return () => { alive=false; sub?.subscription?.unsubscribe?.(); };
  }, []);

  if (state.loading) return <AppLoader />;
  if (initError) return <Navigate to="/diag" replace />;
  if (!state.user) return <Navigate to="/login" replace />;

  const role = state.role || "capo";
  if (!accept.includes(role)) return <Navigate to="/capo" replace />;

  return <Outlet/>;
}

function AppRoutes(){
  const navigate = useNavigate();
  useEffect(() => { if (location.hash === "#main") navigate("/", { replace:true }); }, [navigate]);
  return (
    <Routes>
      <Route element={<AppShell />}>
        <Route path="/" element={<Navigate to="/capo" replace />} />
        <Route path="/login" element={<Login />} />
        <Route path="/diag" element={<Diagnostics />} />

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
    <ErrorBoundary>
      <HashRouter>
        <AppRoutes />
      </HashRouter>
    </ErrorBoundary>
  </React.StrictMode>
);
