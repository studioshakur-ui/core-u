import React from "react";

export default function Hero(){
  return (
    <section className="relative min-h-[68vh] md:h-[78vh] overflow-hidden">
      <img src="/assets/hero.jpg" alt="Shipyard" className="absolute inset-0 w-full h-full object-cover" />
      <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/60 to-black/20" />
      <div className="relative container-core h-full flex flex-col items-center justify-center text-center text-white">
        <p className="text-[13px] uppercase tracking-[0.2em] text-white/70 mb-3">Pianificazione · Reporting · Controllo</p>
        <h1 className="text-5xl md:text-6xl font-extrabold tracking-tight">CORE</h1>
        <p className="mt-3 text-lg md:text-2xl tracking-widest text-white/85">CONTROLLA • ORGANIZZA • RIPORTA • ESEGUI</p>
        <div className="mt-8 flex items-center gap-3">
          <a href="#/demo" className="btn btn-primary focus-visible:ring-[--accent]">Inizia la demo</a>
          <a href="#main" className="btn btn-ghost">Scopri</a>
        </div>
      </div>
    </section>
  );
}
