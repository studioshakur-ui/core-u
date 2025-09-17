// src/pages/Direzione.jsx
import { useMemo } from "react";
import { useCoreStore } from "../store/useCoreStore";
import BoatGallery from "../components/BoatGallery";

export default function Direzione() {
  const rows = useCoreStore((s) => s.rapportino.rows);
  const totOre = useMemo(() => rows.reduce((a, r) => a + (parseFloat(r.ore) || 0), 0), [rows]);
  const costo = useMemo(() => totOre * 22, [totOre]); // €/h

  return (
    <div className="container-core space-y-6">
      <h1 className="text-3xl font-semibold">Direzione</h1>

      {/* Galerie d'images depuis /public/assets */}
      <BoatGallery />

      {/* KPI d'exemple (conserve si utile) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Kpi title="Ore oggi" value={totOre.toFixed(2)} suffix="h" />
        <Kpi title="Costo stimato" value={costo.toFixed(2)} suffix="€" />
        <Kpi title="Attività registrate" value={rows.length} />
      </div>
    </div>
  );
}

function Kpi({ title, value, suffix }) {
  return (
    <div className="card">
      <div className="muted text-sm">{title}</div>
      <div className="text-3xl font-semibold">
        {value}
        {suffix ? " " + suffix : ""}
      </div>
    </div>
  );
}
