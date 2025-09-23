import { BrowserRouter, Routes, Route, Link } from "react-router-dom";
import ManagerImport from "@/pages/ManagerImport.jsx";
import ManagerTeams from "@/pages/ManagerTeams.jsx";
import CapoHome from "@/pages/CapoHome.jsx";

export default function App() {
  return (
    <BrowserRouter>
      <div className="p-3 border-b flex gap-3 bg-white">
        <Link to="/">Home</Link>
        <Link to="/manager/import">Manager Import</Link>
        <Link to="/manager/teams">Manager Teams</Link>
        <Link to="/capo">Capo</Link>
      </div>
      <Routes>
        <Route path="/" element={<div className="p-6">CORE v11 Home WOW</div>} />
        <Route path="/manager/import" element={<ManagerImport />} />
        <Route path="/manager/teams" element={<ManagerTeams />} />
        <Route path="/capo" element={<CapoHome />} />
      </Routes>
    </BrowserRouter>
  );
}
