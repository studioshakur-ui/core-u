import React from "react";

const items = [
  { t:"Importa PROGRAMMA → Organigramma", d:"Allinea ruoli e squadre dal file, in pochi secondi." },
  { t:"Pianifica la settimana", d:"Capacità, conflitti e copertura – zero sorprese." },
  { t:"Rapportino Capo (≤12h) + allegati", d:"Regole chiare, prove fotografiche e firma in app." },
  { t:"Catalogo versionato", d:"Dry-Run · Diff · Commit · Journal per modifiche tracciate." },
];

export default function Features(){
  return (
    <section id="main" className="py-16 md:py-20">
      <div className="container-core">
        <h2 className="text-3xl font-semibold text-white mb-8">Cosa puoi fare subito</h2>
        <div className="grid gap-5 md:grid-cols-2">
          {items.map((it,i)=>(
            <article key={i} className="card group relative overflow-hidden">
              <div className="absolute -inset-1 rounded-2xl bg-[color:var(--accent)]/0 blur-2xl transition group-hover:bg-[color:var(--accent)]/10" />
              <div className="relative z-10">
                <h3 className="text-white font-semibold text-lg">{it.t}</h3>
                <p className="text-white/70 mt-1">{it.d}</p>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
