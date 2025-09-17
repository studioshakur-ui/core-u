import React, { useState } from "react";
import { Routes, Route, NavLink } from "react-router-dom";
import { supabase } from "./lib/supabaseClient";
import { useSession } from "./hooks/useSession";
import Protected from "./components/Protected.jsx";
import LoginModal from "./components/LoginModal.jsx";
import HeaderStatus from "./components/HeaderStatus.jsx";
import Hero from "./components/Hero.jsx";
import { ROLES, readRole } from "./auth/roles";

function NavBar({ onLogin }) {
  const { session } = useSession();
  const role = readRole(session);

  const link = ({ isActive }) =>
    "px-3 py-2 rounded-xl transition " +
    (isActive ? "bg-white/10 text-white font-medium" : "text-white/85 hover:bg-white/10");

  return (
    <header className="fixed top-0 inset-x-0 z-50 backdrop-blur-xl bg-[rgba(18,18,28,.55)] border-b border-white/10">
      <div className="container-core h-14 flex items-center gap-3">
        <a href="#/" className="flex items-center gap-2" aria-label="CORE, home">
          <img className="brand-logo" src="/assets/brand/core-logo-dark.svg" alt="Core"
               onError={e=>{e.currentTarget.src="/assets/brand/core-logo-dark.png"}} />
        </a>

        <NavLink to="/demo" className={link}>Demo</NavLink>
        {[ROLES.DIREZIONE, ROLES.MANAGER, ROLES.CAPO].includes(role) &&
          <NavLink to="/direzione" className={link}>Direzione</NavLink>}
        {[ROLES.DIREZIONE, ROLES.MANAGER].includes(role) &&
          <NavLink to="/manager" className={link}>Manager</NavLink>}
        {[ROLES.CAPO, ROLES.MANAGER, ROLES.DIREZIONE].includes(role) &&
          <NavLink to="/capo" className={link}>Capo</NavLink>}

        <div className="ml-auto flex items-center gap-3">
          <HeaderStatus/>
          {session
            ? <button className="btn btn-ghost" onClick={()=>supabase.auth.signOut()}>Logout</button>
            : <button className="btn btn-primary" onClick={onLogin}>Login</button>}
        </div>
      </div>
    </header>
  );
}

function Home({ onLogin }) {
  return (
    <>
      <Hero/>
      <section id="main" className="container-core py-12">
        <div className="grid md:grid-cols-4 gap-6">
          {[
            {t:"Importa PROGRAMMA → Organigramma", k:"+30s", d:"Da Excel al planning in pochi secondi."},
            {t:"Pianifica settimana", k:"-12%", d:"Conflitti e capacità in tempo reale."},
            {t:"Rapportino Capo + Allegati", k:"+98%", d:"Firme, foto e PDF pronti per la stampa."},
            {t:"Catalogo versionato", k:"diff/commit", d:"Dry-run e registro modifiche tecniche."},
          ].map((c,i)=>(
            <article key={i} className="card">
              <h3 className="text-[--fg] font-semibold">{c.t}</h3>
              <p className="text-[--muted] mt-1">{c.d}</p>
              <div className="mt-4 text-[--accent] font-semibold">{c.k}</div>
            </article>
          ))}
        </div>

        <div className="mt-10 flex items-center gap-3">
          <a href="#/demo" className="btn btn-primary">Prova la demo</a>
          <button onClick={onLogin} className="btn btn-ghost">Accedi</button>
        </div>
      </section>
    </>
  );
}

function DemoCenter() { return <div className="container-core py-16">Demo …</div>; }
function Direzione()  { return <div className="container-core py-16">Direzione …</div>; }
function ManagerHub() { return <div className="container-core py-16">Manager …</div>; }
function Capo()       { return <div className="container-core py-16">Capo …</div>; }

export default function App(){
  const [openLogin, setOpenLogin] = useState(false);
  const { session } = useSession();

  return (
    <>
      <NavBar onLogin={()=>setOpenLogin(true)} />
      <main className="pt-14">
        <Routes>
          <Route path="/" element={<Home onLogin={()=>setOpenLogin(true)}/>}/>
          <Route path="/demo" element={<DemoCenter/>}/>
          <Route path="/direzione" element={
            <Protected allow={[ROLES.DIREZIONE, ROLES.MANAGER, ROLES.CAPO]}><Direzione/></Protected>
          }/>
          <Route path="/manager" element={
            <Protected allow={[ROLES.DIREZIONE, ROLES.MANAGER]}><ManagerHub/></Protected>
          }/>
          <Route path="/capo" element={
            <Protected allow={[ROLES.DIREZIONE, ROLES.MANAGER, ROLES.CAPO]}><Capo/></Protected>
          }/>
        </Routes>
      </main>
      <LoginModal open={openLogin} onClose={()=>setOpenLogin(false)}/>
    </>
  );
}
