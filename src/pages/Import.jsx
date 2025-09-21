import { useState } from "react";
import * as XLSX from "xlsx";
import Papa from "papaparse";
import { parseRows } from "../services/parser.js";

export default function ImportPage() {
  const [step, setStep] = useState(1);
  const [rows, setRows] = useState([]);
  const [report, setReport] = useState(null);

  const handleFile = async (file) => {
    const ext = file.name.split('.').pop().toLowerCase();
    if (ext === "csv") {
      Papa.parse(file, {
        header: true,
        complete: (res) => setRows(res.data || []),
      });
    } else {
      const data = await file.arrayBuffer();
      const wb = XLSX.read(data, { type: "array" });
      const ws = wb.Sheets[wb.SheetNames[0]];
      const json = XLSX.utils.sheet_to_json(ws, { defval: "" });
      setRows(json);
    }
    setStep(2);
  };

  const runDry = () => {
    const out = parseRows(rows);
    setReport(out);
    setStep(3);
  };

  return (
    <div className="space-y-6">
      <ol className="list-decimal ml-6 space-y-2">
        <li className={step >= 1 ? "font-semibold" : ""}>Carica file</li>
        <li className={step >= 2 ? "font-semibold" : ""}>Mapping colonne</li>
        <li className={step >= 3 ? "font-semibold" : ""}>Dry‑run / Anomalie</li>
      </ol>

      {step === 1 && (
        <div className="bg-white rounded-2xl shadow-e1 p-4">
          <input type="file" accept=".xlsx,.xls,.csv" onChange={(e)=>e.target.files[0] && handleFile(e.target.files[0])} />
          <p className="text-sm text-neutral-600 mt-2">Supporto: XLSX/XLS/CSV. Preview 10 righe alla tappa 2.</p>
        </div>
      )}

      {step === 2 && (
        <div className="bg-white rounded-2xl shadow-e1 p-4">
          <div className="text-sm text-neutral-500 mb-2">Preview (prime 10 righe)</div>
          <div className="overflow-auto max-h-72 border rounded">
            <table className="w-full text-sm">
              <thead className="bg-neutral-100 sticky top-0">
                <tr>
                  {Object.keys(rows[0] || {}).map((k)=>(<th key={k} className="text-left px-2 py-1">{k}</th>))}
                </tr>
              </thead>
              <tbody>
                {(rows.slice(0,10)).map((r,i)=>(
                  <tr key={i} className="border-t">
                    {Object.keys(rows[0] || {}).map((k)=>(<td key={k} className="px-2 py-1">{String(r[k])}</td>))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="mt-4 flex gap-2">
            <button className="px-3 py-2 rounded bg-neutral-200" onClick={()=>setStep(1)}>Indietro</button>
            <button className="px-3 py-2 rounded bg-black text-white" onClick={runDry}>Esegui Dry‑run</button>
          </div>
        </div>
      )}

      {step === 3 && report && (
        <div className="grid gap-4 lg:grid-cols-2">
          <div className="bg-white rounded-2xl shadow-e1 p-4">
            <div className="text-sm text-neutral-500 mb-2">Anomalie ({report.anomalies.length})</div>
            <ul className="space-y-1 text-sm max-h-80 overflow-auto">
              {report.anomalies.map((a, idx)=>(
                <li key={idx} className="border rounded px-2 py-1">
                  <b>{a.type}</b> — {a.message} {a.row ? `(riga ${a.row})` : ""}
                </li>
              ))}
            </ul>
          </div>
          <div className="bg-white rounded-2xl shadow-e1 p-4">
            <div className="text-sm text-neutral-500 mb-2">Team & membri</div>
            <ul className="space-y-1 text-sm max-h-80 overflow-auto">
              {Object.entries(report.teams).map(([name,t])=> (
                <li key={name} className="border rounded px-2 py-1">
                  <div className="font-medium">{name}</div>
                  <div className="text-xs text-neutral-600">Capo: {t.capo || "-"}</div>
                  <div className="text-xs">Operai: {t.members?.join(", ") || "-"}</div>
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </div>
  );
}
