import React from "react";
import { NavLink } from "react-router-dom";
import { ROLES } from "../auth/roles";

export default function NavBar({ onLogin, onLogout, session, role }){
  const link = ({ isActive }) =>
    "px-3 py-2 rounded-xl " + (isActive ? "bg-white/10 text-white font-medium" : "text-white/80 hover:bg-white/10");

  return (
    <header className="fixed top-0 inset-x-0 z-50 backdrop-blur-xl bg-black/30 border-b border-white/10">
      <div className="container-core h-14 flex items-center gap-3">
        <a href="#/" className="text-white font-semibold tracking-wide text-lg">CORE</a>

        <NavLink to="/demo" className={link}>Demo</NavLink>

        {/* Admin */}
        {!!role && <span className="text-white/30 mx-2">·</span>}
        {!!role && <NavLink to="/direzione" className={link}>Direzione</NavLink>}
        {[ROLES.MANAGER,ROLES.DIREZIONE].includes(role) && <NavLink to="/manager" className={link}>Manager</NavLink>}
        {[ROLES.MANAGER,ROLES.DIREZIONE].includes(role) && <NavLink to="/catalog" className={link}>Catalogo</NavLink>}

        {/* Esecuzione */}
        {[ROLES.CAPO,ROLES.MANAGER,ROLES.DIREZIONE].includes(role) && <>
          <span className="text-white/30 mx-2">·</span>
          <NavLink to="/capo" className={link}>Capo</NavLink>
        </>}

        <div className="ml-auto flex items-center gap-3">
          <span className={"chip " + (session ? "text-emerald-300" : "text-rose-300")}>
            <span className={"w-2 h-2 rounded-full " + (session ? "bg-emerald-400 animate-pulse" : "bg-rose-400")} />
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
