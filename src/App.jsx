import { Routes, Route, Link, Navigate } from "react-router-dom";
import ProtectedRoute from "./components/ProtectedRoute.jsx";
import Dashboard from "./pages/Dashboard.jsx";
import ImportPage from "./pages/Import.jsx";
import ManagerPage from "./pages/Manager.jsx";
import CapoPage from "./pages/Capo.jsx";
import DirezionePage from "./pages/Direzione.jsx";
import LoginPage from "./pages/Login.jsx";
import { useAuthStore } from "./store/authStore.js";

function StatusBadges() {
  // Mock flags; in futuro collegate a store/dati reali
  const settimana = "Aperta"; // "Bloccata"
  const hse = "OFF"; // "ON"
  return (
    <div className="hidden md:flex items-center gap-2 text-xs">
      <span className="px-2 py-1 rounded-full bg-neutral-100 text-neutral-700 border">Settimana: {settimana}</span>
      <span className={"px-2 py-1 rounded-full border " + (hse === "ON" ? "bg-green-100 text-green-700 border-green-200" : "bg-neutral-100 text-neutral-700")}>
        HSE: {hse}
      </span>
    </div>
  );
}

function Shell({ children, title }) {
  const { profile } = useAuthStore();
  return (
    <div className="min-h-screen bg-core-bg">
      <header className="sticky top-0 bg-white shadow-sm z-10">
        <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between gap-4">
          <div className="font-semibold flex items-center gap-2">
            <span className="inline-flex items-center justify-center w-7 h-7 rounded bg-black text-white text-xs">C</span>
            <span>CORE v8.2.1</span>
          </div>
          <nav className="flex-1 flex items-center justify-center gap-4 text-sm">
            <Link to="/">Dashboard</Link>
            <Link to="/import">Import</Link>
            <Link to="/manager">Manager</Link>
            <Link to="/capo">Capo</Link>
            <Link to="/direzione">Direzione</Link>
          </nav>
          <div className="flex items-center gap-3">
            <StatusBadges />
            <Link to="/login" className="text-sm">{profile ? "Profilo" : "Login"}</Link>
          </div>
        </div>
      </header>
      <main className="max-w-6xl mx-auto px-4 py-6">
        {title && <h1 className="text-xl font-semibold mb-4">{title}</h1>}
        {children}
      </main>
    </div>
  );
}

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Shell title="Dashboard"><Dashboard /></Shell>} />
      <Route
        path="/import"
        element={
          <ProtectedRoute allow={["manager","direzione"]}>
            <Shell title="Import Excel"><ImportPage /></Shell>
          </ProtectedRoute>
        }
      />
      <Route
        path="/manager"
        element={
          <ProtectedRoute allow={["manager","direzione"]}>
            <Shell title="Manager"><ManagerPage /></Shell>
          </ProtectedRoute>
        }
      />
      <Route
        path="/capo"
        element={
          <ProtectedRoute allow={["capo","manager","direzione"]}>
            <Shell title="Capo"><CapoPage /></Shell>
          </ProtectedRoute>
        }
      />
      <Route
        path="/direzione"
        element={
          <ProtectedRoute allow={["direzione"]}>
            <Shell title="Direzione"><DirezionePage /></Shell>
          </ProtectedRoute>
        }
      />
      <Route path="/login" element={<Shell title="Login"><LoginPage /></Shell>} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
