import React from "react";

export default function Hero(){
  return (
    <section className="relative min-h-[68vh] md:h-[78vh] overflow-hidden">
      <img src="/assets/ship1.jpg" alt="" fetchpriority="high"
           className="absolute inset-0 w-full h-full object-cover opacity-[.22]" />
      <div className="absolute inset-0 bg-[radial-gradient(1200px_600px_at_50%_-10%,rgba(139,92,246,.22),transparent_60%)]" />
      <div className="absolute inset-0 bg-gradient-to-t from-[rgba(8,9,14,.85)] via-[rgba(8,9,14,.55)] to-transparent" />

      <div className="relative container-core h-full flex flex-col items-center justify-center text-center">
        <img src="/assets/brand/core-logo-dark.svg" alt="Core" className="brand-logo md:h-14" />
        <h1 className="sr-only">CORE — Pianificazione • Reporting • Controllo</h1>

        <p className="mt-6 text-3xl md:text-5xl font-extrabold tracking-tight text-white">
          Controlla • Organizza • Riporta • Esegui
        </p>

        <p className="mt-4 text-lg md:text-xl text-white/80 max-w-3xl">
          Pianificazione turni e cantieri con conflitti in tempo reale, rapportini capi e versionamento tecnico.
        </p>

        <div className="mt-8 flex items-center gap-3">
          <a href="#/demo" className="btn btn-primary">Inizia la demo</a>
          <a href="#main" className="btn btn-ghost">Scopri</a>
        </div>

        <div className="absolute bottom-6 left-0 right-0 flex justify-center">
          <span className="kbd">Premi <b>J</b> per scorrere</span>
        </div>
      </div>
    </section>
  );
}
