import React, { Suspense } from "react";
import { BrowserRouter, Routes, Route, Link } from "react-router-dom";

// Lazy imports pour éviter de charger les pages (et leurs dépendances) au démarrage
const ManagerImport = React.lazy(() => import("./pages/ManagerImport.jsx"));
const ManagerTeams  = React.lazy(() => import("./pages/ManagerTeams.jsx"));
const CapoHome      = React.lazy(() => import("./pages/CapoHome.jsx"));

class ErrorBoundary extends React.Component {
  constructor(props){ super(props); this.state = { hasError:false, error:null }; }
  static getDerivedStateFromError(error){ return { hasError:true, error }; }
  componentDidCatch(err, info){ console.error(err, info); }
  render(){
    if (this.state.hasError) {
      return <div style={{padding:16,color:"#b91c1c"}}>
        Errore UI: {String(this.state.error)}
      </div>;
    }
    return this.props.children;
  }
}

export default function App() {
  return (
    <BrowserRouter>
      <div className="p-3 border-b flex gap-3 bg-white">
        <Link to="/">Home</Link>
        <Link to="/manager/import">Manager Import</Link>
        <Link to="/manager/teams">Manager Teams</Link>
        <Link to="/capo">Capo</Link>
      </div>

      <ErrorBoundary>
        <Suspense fallback={<div className="p-6">Caricamento…</div>}>
          <Routes>
            <Route path="/" element={<div className="p-6">CORE v11 Home WOW</div>} />
            <Route path="/manager/import" element={<ManagerImport />} />
            <Route path="/manager/teams" element={<ManagerTeams />} />
            <Route path="/capo" element={<CapoHome />} />
          </Routes>
        </Suspense>
      </ErrorBoundary>
    </BrowserRouter>
  );
}
