// src/pages/Direzione.jsx
import { useMemo } from "react";
import { useCoreStore } from "../store/useCoreStore";

export default function Direzione(){
  const rows = useCoreStore(s => s.rapportino.rows);
  const totOre = useMemo(()=> rows.reduce((a,r)=>a+(parseFloat(r.ore)||0),0), [rows]);
  const costo = useMemo(()=> totOre * 22, [totOre]); // €/h ipotesi
  const assegnate = rows.length;
  const nonAssegnate = Math.max(0, 50 - assegnate); // placeholder
  const copertura = Math.min(100, Math.round((assegnate / 50) * 100));

  return (
    <div className="container-core space-y-5">
      <h1 className="text-3xl font-semibold">Direzione</h1>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Kpi title="Ore oggi" value={totOre.toFixed(2)} suffix="h" />
        <Kpi title="Costo stimato" value={costo.toFixed(2)} suffix="€" />
        <Kpi title="Attività assegnate" value={assegnate} />
        <Kpi title="Copertura piano" value={copertura + "%"} />
      </div>

      <div className="card">
        <h2 className="text-xl font-semibold mb-2">Azioni consigliate</h2>
        <ul className="list-disc pl-6 space-y-1">
          <li>Verifica le ore fuori soglia (>12h/giorno).</li>
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
