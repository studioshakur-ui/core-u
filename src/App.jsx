import React, { Suspense, lazy } from "react";
import { Routes, Route, Link } from "react-router-dom";

const ManagerImport = lazy(() => import("@/pages/ManagerImport.jsx"));
const ManagerTeams = lazy(() => import("@/pages/ManagerTeams.jsx"));
const CapoHome = lazy(() => import("@/pages/CapoHome.jsx"));

function App() {
  return (
    <div className="min-h-screen flex flex-col">
      <header className="bg-purple-700 text-white p-4 flex justify-between">
        <h1 className="font-bold">⚓ CORE v12</h1>
        <nav className="space-x-4">
          <Link to="/">Home</Link>
          <Link to="/manager/import">Import</Link>
          <Link to="/manager/teams">Teams</Link>
          <Link to="/capo">Capo</Link>
        </nav>
      </header>
      <main className="flex-1 p-6">
        <Suspense fallback={<div>Loading...</div>}>
          <Routes>
            <Route path="/" element={<div>🏠 Home WOW</div>} />
            <Route path="/manager/import" element={<ManagerImport />} />
            <Route path="/manager/teams" element={<ManagerTeams />} />
            <Route path="/capo" element={<CapoHome />} />
          </Routes>
        </Suspense>
      </main>
    </div>
  );
}

export default App;