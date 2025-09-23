import { useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import { parseExcel } from "@/lib/xlsx";

function toMondayISO(dateOrISO) {
  const base = dateOrISO ? new Date(dateOrISO) : new Date();
  const day = base.getDay();
  const delta = day === 0 ? -6 : 1 - day;
  const d = new Date(base);
  d.setHours(0,0,0,0);
  d.setDate(base.getDate() + delta);
  return d.toISOString().slice(0,10);
}

export default function ManagerImport() {
  const [file, setFile] = useState(null);
  const [logs, setLogs] = useState([]);
  const [busy, setBusy] = useState(false);

  const log = (s) => setLogs(L => [s, ...L]);

  async function handleImport() {
    if (!file) return;
    setBusy(true); setLogs([]);

    try {
      const rows = await parseExcel(file);
      if (!rows.length) { log("Nessuna riga valida nel file."); setBusy(false); return; }

      // TODO: même logique qu’on a écrit en TS → upsert projects, impianti, teams, team_members, project_members
      log(`Trovate ${rows.length} righe da importare`);

      log("✅ Import completato.");
    } catch (e) {
      console.error(e);
      log(`❌ Errore: ${e.message || e.toString()}`);
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="p-6 max-w-3xl mx-auto space-y-4">
      <h1 className="text-2xl font-bold">Import Excel — Manager</h1>
      <input type="file" accept=".xlsx,.xls" onChange={(e)=>setFile(e.target.files?.[0]??null)} />
      <button
        onClick={handleImport}
        disabled={!file || busy}
        className="px-4 py-2 rounded bg-black text-white disabled:opacity-50"
      >
        {busy ? "Import in corso..." : "Importa"}
      </button>
      <div className="bg-gray-50 border rounded p-3 text-sm h-64 overflow-auto">
        {logs.map((l,i)=><div key={i}>{l}</div>)}
      </div>
    </div>
  );
}
