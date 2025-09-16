import React from "react";
import { NavLink } from "react-router-dom";

export default function NavBar({ onLogin, onLogout, session, role }) {
  const link = ({ isActive }) =>
    "px-3 py-2 rounded-xl " +
    (isActive ? "bg-white/10 text-white" : "text-white/80 hover:bg-white/10");

  return (
    <header className="fixed top-0 inset-x-0 z-50 backdrop-blur-xl bg-black/30 border-b border-white/10">
      <div className="max-w-6xl mx-auto h-14 px-4 flex items-center gap-3">
        {/* branding typographique (pas de logo) */}
        <a href="#/" className="text-white font-semibold tracking-wide text-lg">
          CORE
        </a>

        <NavLink to="/demo" className={link}>Demo</NavLink>
        {!!role && <NavLink to="/direzione" className={link}>Direzione</NavLink>}
        {["manager","direzione"].includes(role) && <NavLink to="/manager" className={link}>Manager</NavLink>}
        {["capo","manager","direzione"].includes(role) && <NavLink to="/capo" className={link}>Capo</NavLink>}
        {["manager","direzione"].includes(role) && <NavLink to="/catalog" className={link}>Catalogo</NavLink>}

        <div className="ml-auto flex items-center gap-3">
          {/* chip état connexion */}
          <span className={"inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs " + (session ? "bg-emerald-500/20 text-emerald-300" : "bg-rose-500/20 text-rose-300")}>
            <span className={"w-2 h-2 rounded-full " + (session ? "bg-emerald-400 animate-pulse" : "bg-rose-400")}/>
            {session ? (role ? `Connesso · ${role}` : "Connesso") : "Non connesso"}
          </span>

          {session
            ? <button className="btn btn-ghost" onClick={onLogout}>Logout</button>
            : <button className="btn btn-primary" onClick={onLogin}>Login</button>}
        </div>
      </div>
    </header>
  );
}
