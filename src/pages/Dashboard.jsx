import { useMemo } from "react";
import { computeKpis, delta } from "../services/kpis.js";
import { Link } from "react-router-dom";

export default function Dashboard() {
  // Demo data (sostituire con dati reali quando disponibili)
  const membersCount = 12;
  const assignments = [{ hours: 56 }, { hours: 20 }, { hours: 12 }];
  const kpi = useMemo(() => computeKpis({ membersCount, assignments }), [membersCount, assignments]);
  const prev = { capacity: 96, assigned: 70, unassigned: 26, coverage: 70/96, cost: 70*22 };
  const d = delta(kpi, prev);

  const pct = (v) => (v*100).toFixed(0) + "%";

  // Flags di stato (mock)
  const settimanaBloccata = false;
  const hseOn = false;

  return (
    <div className="space-y-6">
      {/* Bandeau stato */}
      {(!hseOn) && (
        <div className="rounded-2xl border bg-neutral-50 p-3 text-sm text-neutral-700">
          HSE disattivato (solo avvisi). <Link to="/direzione" className="underline">Gestisci</Link>
        </div>
      )}
      {settimanaBloccata && (
        <div className="rounded-2xl border border-yellow-300 bg-yellow-50 p-3 text-sm text-yellow-800">
          Settimana bloccata – modifiche non consentite.
        </div>
      )}

      {/* Bloc KPI + actions */}
      <section className="bg-white rounded-2xl shadow-e1 p-4">
        <div className="flex items-start justify-between gap-4 flex-wrap">
          <div>
            <h2 className="text-lg font-semibold">Indicatori principali</h2>
            <p className="text-xs text-neutral-500 mt-1">Ultimo aggiornamento: adesso · Sito: Trieste</p>
          </div>
          <div className="flex items-center gap-2">
            <Link to="/import" className="px-3 py-2 rounded bg-black text-white text-sm">Importa dati</Link>
            <button disabled className="px-3 py-2 rounded bg-neutral-200 text-sm">Esporta Executive PDF</button>
          </div>
        </div>

        <div className="grid gap-3 mt-4 sm:grid-cols-2 lg:grid-cols-3">
          <Kpi title="Capacità" value={kpi.capacity + " h"} delta={d.capacity} />
          <Kpi title="Assegnate" value={kpi.assigned + " h"} delta={d.assigned} />
          <Kpi title="Non assegnate" value={kpi.unassigned + " h"} delta={d.unassigned} />
          <Kpi title="Copertura" value={pct(kpi.coverage)} delta={(kpi.coverage - prev.coverage)*100} isPercent />
          <Kpi title="Costo stimato" value={kpi.cost.toFixed(0) + " €"} delta={d.cost} />
          <div className="bg-neutral-50 rounded-xl border p-4">
            <div className="text-sm text-neutral-500">Note</div>
            <div className="text-xs mt-1">Valori demo. Popolati con i dati importati.</div>
          </div>
        </div>
      </section>

      {/* Prossime azioni */}
      <section className="grid gap-4 lg:grid-cols-3">
        <Card title="Anomalie" desc="12 anomalie da risolvere" to="/import">Apri elenco</Card>
        <Card title="Copertura bassa" desc="Team Alfa &lt; 70%" to="/manager">Apri Manager</Card>
        <Card title="HSE" desc="3 attività con documenti mancanti" to="/direzione">Apri Direzione</Card>
      </section>

      {/* Accesso rapido ruoli */}
      <section className="grid gap-4 lg:grid-cols-3">
        <Quick title="Capo" desc="Report giornaliero, note, PDF" to="/capo" />
        <Quick title="Manager" desc="Drag &amp; drop, assegnazioni massive" to="/manager" />
        <Quick title="Direzione" desc="KPIs, rischi, export esecutivo" to="/direzione" />
      </section>
    </div>
  );
}

function Kpi({ title, value, delta:dd, isPercent }) {
  const up = Number(dd) >= 0;
  return (
    <div className="bg-white rounded-xl border p-4">
      <div className="text-sm text-neutral-500">{title}</div>
      <div className="text-2xl font-semibold mt-1">{value}</div>
      <div className={"text-xs mt-1 " + (up ? "text-green-600" : "text-red-600")}>
        {up ? "▲" : "▼"} {isPercent ? Math.abs(dd).toFixed(0) + "%" : Math.abs(dd).toFixed(0)}
      </div>
    </div>
  );
}

function Card({ title, desc, to, children }) {
  return (
    <div className="bg-white rounded-2xl shadow-e1 p-4">
      <div className="text-sm text-neutral-500">{title}</div>
      <div className="text-sm mt-1">{desc}</div>
      <Link to={to} className="inline-block mt-2 text-sm underline">{children}</Link>
    </div>
  );
}

function Quick({ title, desc, to }) {
  return (
    <div className="bg-white rounded-2xl shadow-e1 p-4">
      <div className="text-sm font-medium">{title}</div>
      <div className="text-sm text-neutral-600">{desc}</div>
      <Link to={to} className="inline-block mt-2 px-3 py-1 rounded border text-sm">Apri</Link>
    </div>
  );
}
