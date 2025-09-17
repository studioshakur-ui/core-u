import React, { useState } from "react";
import { Routes, Route } from "react-router-dom";

import NavBar from "./components/NavBar.jsx";
import Hero from "./components/Hero.jsx";
import KpiStrip from "./components/KpiStrip.jsx";
import Features from "./components/Features.jsx";
import LoginModal from "./components/LoginModal.jsx";

import { supabase } from "./lib/supabaseClient";
import { useSession } from "./hooks/useSession";
import { readRole } from "./auth/roles";

export default function App(){
  const { session } = useSession?.() || {};
  const role = (()=>{ try{ return readRole?.(session) } catch { return null } })();
  const [loginOpen,setLoginOpen] = useState(false);

  return (
    <>
      <NavBar
        session={session}
        role={role}
        onLogin={()=>setLoginOpen(true)}
        onLogout={()=>supabase.auth.signOut()}
      />

      <main className="pt-14">
        <Hero />
        <KpiStrip />
        <Features />
      </main>

      <Routes>
        <Route path="/demo" element={<div />} />
      </Routes>

      <LoginModal open={loginOpen} onClose={()=>setLoginOpen(false)} />
    </>
  );
}
