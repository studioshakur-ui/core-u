import Hero from '../components/Hero.jsx'

export default function Home() {
  return (
    <main>
      <Hero />
      <section id="moduli" className="mx-auto max-w-6xl px-4 py-12 grid md:grid-cols-3 gap-6">
        {[
          { title: 'Capo', desc: 'Rapportino giornaliero — inline edit, suggerimenti, controllo ore.'},
          { title: 'Manager', desc: 'Organigramma, assegnazioni, nuvola operai con ricerca & mass edit.'},
          { title: 'Direzione', desc: 'KPI settimanali, S vs S-1, export executive PDF.'},
        ].map((c,i)=>(
          <div key={i} className="rounded-2xl bg-core-card p-6 shadow-soft">
            <div className="text-core-violet text-sm mb-2">Modulo</div>
            <div className="text-xl font-semibold">{c.title}</div>
            <p className="mt-2 text-white/70 text-sm">{c.desc}</p>
          </div>
        ))}
      </section>
    </main>
  )
}
