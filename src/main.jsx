// src/main.jsx
import React from "react";
import { createRoot } from "react-dom/client";
import { HashRouter, Routes, Route, Navigate } from "react-router-dom";
import AppShell from "@/AppShell.jsx";

import Capo from "@/pages/Capo.jsx";
import Manager from "@/pages/Manager.jsx";
import Direzione from "@/pages/Direzione.jsx";

function AppRoutes() {
  return (
    <Routes>
      <Route element={<AppShell />}>
        <Route path="/" element={<Navigate to="/capo" replace />} />
        <Route path="/capo" element={<Capo />} />
        <Route path="/manager" element={<Manager />} />
        <Route path="/direzione" element={<Direzione />} />
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
