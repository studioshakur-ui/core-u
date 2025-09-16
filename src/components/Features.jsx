import React from "react";
import { Cpu, CalendarCheck2, FileText, GitBranch } from "lucide-react";

const items = [
  {
    icon: Cpu,
    title: "Importa PROGRAMMA → Organigramma",
    desc: "Allinea ruoli e squadre dal file, in pochi secondi.",
  },
  {
    icon: CalendarCheck2,
    title: "Pianificazione settimanale",
    desc: "Capacità, conflitti e copertura: chi fa cosa, quando.",
  },
  {
    icon: FileText,
    title: "Rapportino Capo (≤12h) + allegati",
    desc: "Regole chiare, prove fotografiche e firma in app.",
  },
  {
    icon: GitBranch,
    title: "Catalogo versionato",
    desc: "Dry-Run · Diff · Commit · Journal per modifiche tracciate.",
  },
];

export default function Features() {
  return (
    <section id="main" className="py-16">
      <div className="max-w-6xl mx-auto px-4">
        <h2 className="text-3xl font-semibold text-white mb-8">Cosa puoi fare subito</h2>
        <div className="grid gap-5 md:grid-cols-2">
          {items.map(({ icon: Icon, title, desc }, i) => (
            <article
              key={i}
              className="card group relative overflow-hidden"
            >
              <div className="absolute -inset-1 rounded-2xl bg-[--core-accent]/0 blur-2xl transition group-hover:bg-[--core-accent]/10" />
              <div className="relative z-10 flex gap-4">
                <div className="shrink-0 grid place-items-center w-12 h-12 rounded-xl bg-white/10 border border-white/15">
                  <Icon className="w-6 h-6 text-[--core-accent]" />
                </div>
                <div>
                  <h3 className="text-white font-semibold text-lg">{title}</h3>
                  <p className="text-white/70 mt-1">{desc}</p>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
