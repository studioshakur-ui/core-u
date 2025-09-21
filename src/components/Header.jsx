import React from "react";
export default function Header({right}){
  return (
    <header className="w-full header-blur sticky top-0 z-20 border-b border-core-border">
      <div className="container py-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <img src="/assets/brand/logo-mark.svg" alt="CORE" className="w-8 h-8"/>
          <div className="text-xl font-semibold tracking-wide">CORE</div>
        </div>
        <nav className="hidden md:flex items-center gap-6">
          <a className="hover:underline" href="/capo">Capo</a>
          <a className="hover:underline" href="/manager">Manager</a>
          <a className="hover:underline" href="/direzione">Direzione</a>
        </nav>
        <div className="flex items-center gap-3">{right}</div>
      </div>
    </header>
  );
}
