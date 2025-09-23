import React, { Suspense } from "react";
import { BrowserRouter, Routes, Route, Link } from "react-router-dom";

// Lazy load des pages
const ManagerImport = React.lazy(() => import("./pages/ManagerImport.jsx"));
const ManagerTeams = React.lazy(() => import("./pages/ManagerTeams.jsx"));
const CapoHome = React.lazy(() => import("./pages/CapoHome.jsx"));

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }
  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }
  componentDidCatch(err, info) {
    console.error(err, info);
  }
  render() {
    if (this.state.hasError) {
      return (
        <div className="p-6 text-red-600 font-semibold">
          Errore UI: {String(this.state.error)}
        </div>
      );
    }
    return this.props.children;
  }
}

export default function App() {
  return (
    <BrowserRouter>
      {/* Header global */}
      <header className="bg-indigo-600 text-white shadow-md">
        <div className="max-w-6xl mx-auto flex justify-between items-center p-4">
          <h1 className="text-xl font-bold">⚡ CORE v11</h1>
          <nav className="flex gap-6">
            <Link to="/" className="hover:underline">Home</Link>
            <Link to="/manager/import" className="hover:underline">Manager Import</Link>
            <Link to="/manager/teams" className="hover:underline">Manager Teams</Link>
            <Link to="/capo" className="hover:underline">Capo</Link>
          </nav>
        </div>
      </header>

      {/* Contenu */}
      <ErrorBoundary>
        <Suspense fallback={<div className="p-6">Caricamento…</div>}>
          <Routes>
            <Route
              path="/"
              element={
                <div className="p-10 text-center space-y-4">
                  <h2 className="text-4xl font-extrabold text-gray-900">
                    🎉 CORE v11 Home WOW
                  </h2>
                  <p className="text-lg text-gray-700">
                    Bienvenue dans la démo — utilisez le menu pour explorer Manager et Capo.
                  </p>
                </div>
              }
            />
            <Route path="/manager/import" element={<ManagerImport />} />
            <Route path="/manager/teams" element={<ManagerTeams />} />
            <Route path="/capo" element={<CapoHome />} />
          </Routes>
        </Suspense>
      </ErrorBoundary>
    </BrowserRouter>
  );
}
