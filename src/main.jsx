// src/main.jsx
import React from "react";
import { createRoot } from "react-dom/client";
import { HashRouter, Routes, Route, Navigate, Outlet, useLocation } from "react-router-dom";
import AppShell from "@/AppShell.jsx";

import Capo from "@/pages/Capo.jsx";
import Manager from "@/pages/Manager.jsx";
import Direzione from "@/pages/Direzione.jsx";
import Login from "@/pages/Login.jsx";

import { getSession } from "@/auth/session";

// Garde générique : doit être connecté
function RequireAuth() {
  const session = getSession();
  const location = useLocation();
  if (!session) {
    return <Navigate to="/login" replace state={{ from: location.pathname }} />;
  }
  return <Outlet />;
}

// Garde par rôle (capo/manager/direzione)
function RequireRole({ role }) {
  const session = getSession();
  const location = useLocation();
  if (!session) {
    return <Navigate to="/login" replace state={{ from: location.pathname }} />;
  }
  if (session.role !== role) {
    // Si mauvais rôle, redirige vers sa home de rôle
    if (session.role === "direzione") return <Navigate to="/direzione" replace />;
    if (session.role === "manager") return <Navigate to="/manager" replace />;
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

        {/* routes protégées */}
        <Route element={<RequireAuth />}>
          <Route element={<RequireRole role="capo" />}>
            <Route path="/capo" element={<Capo />} />
          </Route>
          <Route element={<RequireRole role="manager" />}>
            <Route path="/manager" element={<Manager />} />
          </Route>
          <Route element={<RequireRole role="direzione" />}>
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
