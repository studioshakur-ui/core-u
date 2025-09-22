export default function Hero() {
  return (
    <section className="relative overflow-hidden bg-[url('/images/hero-blur.png')] bg-cover bg-center">
      <div className="absolute inset-0 bg-gradient-to-b from-core-violet/20 via-transparent to-transparent pointer-events-none" />
      <div className="mx-auto max-w-6xl px-4 py-16 grid md:grid-cols-2 gap-8 items-center">
        <div>
          <h1 className="text-4xl md:text-5xl font-bold leading-tight">
            CORE v10 — <span className="text-core-violet">Ops</span> navali intelligenti
          </h1>
          <p className="mt-4 text-white/70">
            Accedi, assegna squadre, compila rapportini, e monitora KPI settimanali.
            UI premium violet/grigio chiaro, performance e accessibilità AA.
          </p>
          <div className="mt-6 flex gap-3">
            <a href="/login" className="rounded-xl2 bg-core-violet px-4 py-2 font-medium hover:opacity-90">Accedi</a>
            <a href="#moduli" className="rounded-xl2 bg-white/10 px-4 py-2 hover:bg-white/15">Scopri i moduli</a>
          </div>
        </div>
        <div className="rounded-2xl bg-core-card p-6 shadow-soft">
          <div className="text-sm text-white/70">Direzione — KPI settimanali (S vs S-1)</div>
          <div className="mt-4 aspect-video rounded-xl bg-black/30 grid place-items-center text-white/60">Graph Placeholder</div>
        </div>
      </div>
    </section>
  )
}
