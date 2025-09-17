// src/pages/Direzione.jsx
// Utilise les images existantes dans /assets : ship1/2/3/4.(avif|jpg)
import { useMemo } from "react";
import { useCoreStore } from "../store/useCoreStore";

export default function Direzione() {
  const rows = useCoreStore(s => s.rapportino.rows);
  const totOre = useMemo(()=> rows.reduce((a,r)=>a+(parseFloat(r.ore)||0),0), [rows]);
  const costo = useMemo(()=> totOre * 22, [totOre]); // €/h

  return (
    <div className="container-core space-y-5">
      {/* Hero avec fallback AVIF/JPG depuis /assets */}
      <div className="rounded-2xl overflow-hidden border border-white/10">
        <picture>
          <source type="image/avif" srcSet="/assets/ship1.avif" />
          <img
            src="/assets/ship1.jpg"
            alt="Panoramica Direzione"
            style={{ width:"100%", height:"auto", display:"block" }}
            loading="eager"
            decoding="async"
          />
        </picture>
      </div>

      <h1 className="text-3xl font-semibold">Direzione</h1>

      {/* KPI */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Kpi title="Ore oggi" value={totOre.toFixed(2)} suffix="h" />
        <Kpi title="Costo stimato" value={costo.toFixed(2)} suffix="€" />
        <Kpi title="Attività registrate" value={rows.length} />
      </div>

      {/* Petite galerie 3 colonnes avec tes images /assets */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {[1,2,3].map(i => (
          <div key={i} className="rounded-2xl overflow-hidden border border-white/10">
            <picture>
              <source type="image/avif" srcSet={`/assets/ship${i}.avif`} />
              <img
                src={`/assets/ship${i}.jpg`}
                alt={`Immagine ${i}`}
                style={{ width:"100%", height:"auto", display:"block" }}
                loading="lazy"
                decoding="async"
              />
            </picture>
          </div>
        ))}
      </div>

      <div className="card">
        <h2 className="text-xl font-semibold mb-2">Azioni consigliate</h2>
        <ul className="list-disc pl-6 space-y-1">
          <li>Verifica le ore fuori soglia (&gt;12h/giorno).</li>
          <li>Completa il piano con le attività non assegnate.</li>
          <li>Controlla allegati e firme prima dell’invio settimanale.</li>
        </ul>
      </div>
    </div>
  );
}

function Kpi({ title, value, suffix }){
  return (
    <div className="card">
      <div className="muted text-sm">{title}</div>
      <div className="text-3xl font-semibold">{value}{suffix ? " "+suffix : ""}</div>
    </div>
  );
}
