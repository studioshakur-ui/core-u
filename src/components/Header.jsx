import React from "react";
import { useAppStore } from "../store/useAppStore";

export default function Header(){
  const { role } = useAppStore();
  return (
    <header className="header">
      <div className="container py-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <img src="/assets/brand/logo-mark.svg" alt="CORE" className="w-8 h-8"/>
          <div className="text-xl font-semibold tracking-wide">CORE</div>
        </div>
        <nav className="hidden md:flex items-center gap-6">
          <a className="nav-link" href="/">Prodotti</a>
          <a className="nav-link" href="/">Soluzioni</a>
          <a className="nav-link" href="/">Risorse</a>
          <a className="nav-link" href="/">Clienti</a>
          <a className="nav-link" href="/">Partner</a>
        </nav>
        <div className="flex items-center gap-3">
          <button className="btn-outline">Contatti</button>
          <span className="text-xs border border-core-border rounded px-2 py-1">{role ? role.toUpperCase() : "—"}</span>
        </div>
      </div>
    </header>
  );
}
