import React from "react";
import { useAppStore } from "../store/useAppStore";
import { T } from "../i18n";
export default function Header(){
  const { lang, role } = useAppStore();
  const t = T[lang];
  return (
    <header className="w-full p-3 flex items-center justify-between bg-core-card/90 backdrop-blur shadow-e2 sticky top-0 z-20">
      <div className="flex items-center gap-2">
        <img src="/assets/brand/logo-mark.svg" alt="CORE" className="w-7 h-7"/>
        <div className="font-bold tracking-wide">CORE</div>
      </div>
      <div className="text-sm opacity-80">
        {role ? <span className="px-2 py-1 rounded bg-core-accent/15 border border-core-accent/40">{role.toUpperCase()}</span> : <span className="px-2 py-1 rounded bg-white/5 border border-white/10">—</span>}
      </div>
    </header>
  );
}
