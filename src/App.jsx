import React, { useState } from "react";
import { Routes, Route } from "react-router-dom";
import { supabase } from "./lib/supabaseClient";
import { useSession } from "./hooks/useSession";
import { readRole, ROLES } from "./auth/roles";

import NavBar from "./components/NavBar.jsx";
import Hero from "./components/Hero.jsx";
import KpiStrip from "./components/KpiStrip.jsx";
import Features from "./components/Features.jsx";
import LoginModal from "./components/LoginModal.jsx";
import Protected from "./components/Protected.jsx";

import DemoCenter from "./pages/DemoCenter.jsx";
import Direzione from "./pages/Direzione.jsx";
import ManagerHub from "./pages/ManagerHub.jsx";
import Capo from "./pages/Capo.jsx";
import Catalog from "./pages/Catalog.jsx";

function Home(){
  return (
    <>
      <Hero/>
      <KpiStrip/>
      <Features/>
    </>
  );
}

export default function App(){
  const [openLogin, setOpenLogin] = useState(false);
  const { session, profile } = useSession();
  const role = readRole(session, profile);

  return (
    <>
      <NavBar
        session={session}
        role={role}
        onLogin={()=>setOpenLogin(true)}
        onLogout={()=>supabase.auth.signOut()}
      />
      <div className="pt-14" /> {/* spacer sous navbar */}
      <Routes>
        <Route path="/" element={<Home/>} />
        <Route path="/demo" element={<DemoCenter/>} />
        <Route path="/direzione" element={<Protected allow={[ROLES.DIREZIONE,ROLES.MANAGER,ROLES.CAPO]}><Direzione/></Protected>} />
        <Route path="/manager" element={<Protected allow={[ROLES.MANAGER,ROLES.DIREZIONE]}><ManagerHub/></Protected>} />
        <Route path="/capo" element={<Protected allow={[ROLES.CAPO,ROLES.MANAGER,ROLES.DIREZIONE]}><Capo/></Protected>} />
        <Route path="/catalog" element={<Protected allow={[ROLES.MANAGER,ROLES.DIREZIONE]}><Catalog/></Protected>} />
      </Routes>
      <LoginModal open={openLogin} onClose={()=>setOpenLogin(false)} />
    </>
  );
}
