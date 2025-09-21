export default function DirezionePage() {
  return (
    <div className="space-y-4">
      <div className="bg-white rounded-2xl shadow-e1 p-4">
        <div className="text-sm text-neutral-500">Direzione — KPI & stato settimana</div>
        <ul className="list-disc ml-5 text-sm mt-2 space-y-1">
          <li>KPI: capacità / assegnate / non-assegnate / copertura / costo stimato / Δ vs S-1</li>
          <li>Badge “Settimana bloccata”, costi (€/h predef 22), allerta superamento</li>
          <li>HSE toggle OFF di default</li>
        </ul>
      </div>
    </div>
  );
}
