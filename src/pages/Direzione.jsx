// src/pages/Direzione.jsx
import ResponsiveImage from "../components/media/ResponsiveImage";
import { useMemo } from "react";
import { useCoreStore } from "../store/useCoreStore";

export default function Direzione() {
  const rows = useCoreStore(s => s.rapportino.rows);
  const totOre = useMemo(()=> rows.reduce((a,r)=>a+(parseFloat(r.ore)||0),0), [rows]);
  const costo = useMemo(()=> totOre * 22, [totOre]);

  return (
    <div className="container-core space-y-5">
      {/* HERO brand avec image 8K responsive */}
      <div className="rounded-2xl overflow-hidden border border-white/10">
        <ResponsiveImage base="/media/hero" alt="Panoramica Direzione" priority />
      </div>

      <h1 className="text-3xl font-semibold">Direzione</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Kpi title="Ore oggi" value={totOre.toFixed(2)} suffix="h" />
        <Kpi title="Costo stimato" value={costo.toFixed(2)} suffix="€" />
        <Kpi title="Attività registrate" value={rows.length} />
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
