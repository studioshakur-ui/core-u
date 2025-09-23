import React, { Suspense } from "react";
import { BrowserRouter, Routes, Route, Link } from "react-router-dom";

const ManagerImport = React.lazy(() => import("./pages/ManagerImport.jsx"));
const ManagerTeams  = React.lazy(() => import("./pages/ManagerTeams.jsx"));
const CapoHome      = React.lazy(() => import("./pages/CapoHome.jsx"));
const CapoRapportino = React.lazy(() => import("./pages/CapoRapportino.jsx"));

export default function App() {
  return (
    <BrowserRouter>
      <header className="bg-indigo-600 text-white shadow-md">
        <div className="max-w-6xl mx-auto flex justify-between items-center p-4">
          <h1 className="text-xl font-bold">⚡ CORE v11</h1>
          <nav className="flex gap-6">
            <Link to="/" className="hover:underline">Home</Link>
            <Link to="/manager/import" className="hover:underline">Manager Import</Link>
            <Link to="/manager/teams" className="hover:underline">Manager Teams</Link>
            <Link to="/capo" className="hover:underline">Capo</Link>
            <Link to="/capo/rapportino" className="hover:underline">Rapportino</Link>
          </nav>
        </div>
      </header>

      <Suspense fallback={<div className="p-6">Caricamento…</div>}>
        <Routes>
          <Route
            path="/"
            element={
              <div className="p-10 text-center space-y-4">
                <h2 className="text-4xl font-extrabold text-gray-900">🎉 CORE v11 Home WOW</h2>
                <p className="text-lg text-gray-700">Fai vedere il Rapportino Capo a Vincenzo.</p>
              </div>
            }
          />
          <Route path="/manager/import" element={<ManagerImport />} />
          <Route path="/manager/teams" element={<ManagerTeams />} />
          <Route path="/capo" element={<CapoHome />} />
          <Route path="/capo/rapportino" element={<CapoRapportino />} />
        </Routes>
      </Suspense>
    </BrowserRouter>
  );
}
