// src/pages/Manager.jsx
import { useMemo, useState } from "react";
import Papa from "papaparse";

const EXPECTED = ["operatore","ore","descrizione","prodotto","previsto","impianto","note"];

export default function Manager(){
  const [step, setStep] = useState(1);
  const [raw, setRaw] = useState([]);     // righe CSV originali (array di oggetti)
  const [cols, setCols] = useState([]);   // intestazioni nel file
  const [map, setMap] = useState({});     // mapping utente col->campo previsto
  const [rows, setRows] = useState([]);   // righe mappate
  const [issues, setIssues] = useState([]); // anomalie

  // Step 1: carica CSV
  function onFile(e){
    const file = e.target.files?.[0];
    if (!file) return;
    Papa.parse(file, { header: true, skipEmptyLines: true, complete: (res) => {
      const data = res.data;
      setRaw(data);
      setCols(Object.keys(data[0]||{}));
      setStep(2);
    }});
  }

  // Step 2: mapping
  function onAutoMap(){
    const m = {};
    for (const c of cols){
      const lc = c.toLowerCase();
      for (const exp of EXPECTED){
        if (lc.includes(exp)) { m[c] = exp; break; }
      }
    }
    setMap(m);
  }

  // Step 3: preview + dry-run
  function onPreview(){
    const mapped = raw.map(r => {
      const obj = {};
      for (const [src, dest] of Object.entries(map)) {
        if (!dest) continue;
        obj[dest] = r[src];
      }
      return obj;
    });
    // Dry-run: anomalie
    const iss = [];
    mapped.forEach((r, idx) => {
      if (!r.operatore) iss.push({ riga: idx+1, campo: "operatore", problema: "mancante" });
      if (!r.ore || isNaN(parseFloat(r.ore))) iss.push({ riga: idx+1, campo: "ore", problema: "non numerico" });
    });
    setRows(mapped);
    setIssues(iss);
    setStep(3);
  }

  function exportIssues(){
    if (!issues.length) return;
    const header = ["riga","campo","problema"];
    const lines = [header.join(",")].concat(issues.map(i => [i.riga,i.campo,i.problema].join(",")));
    const blob = new Blob([lines.join("\n")], { type:"text/csv;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a"); a.href = url; a.download = "anomalie.csv"; a.click();
    URL.revokeObjectURL(url);
  }

  // UI
  return (
    <div className="container-core space-y-5">
      <h1 className="text-3xl font-semibold">Manager — Import attività</h1>

      {step===1 && (
        <div className="card space-y-4 max-w-2xl">
          <p>Passo 1/3 — Carica un file <b>CSV</b> (intestazioni alla prima riga).</p>
          <input type="file" accept=".csv,text/csv" onChange={onFile} />
          <p className="muted">Campi attesi: {EXPECTED.join(", ")}</p>
        </div>
      )}

      {step===2 && (
        <div className="card space-y-4">
          <div className="flex items-center justify-between">
            <p>Passo 2/3 — Associa le colonne del file ai campi attesi.</p>
            <button className="btn btn-ghost" onClick={onAutoMap}>Auto-mapping</button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {cols.map(c => (
              <div key={c} className="flex items-center gap-3">
                <span className="chip">{c}</span>
                <select
                  className="bg-white/5 border border-white/15 rounded-lg px-3 py-2"
                  value={map[c]||""}
                  onChange={e => setMap(s => ({ ...s, [c]: e.target.value }))}
                >
                  <option value="">— seleziona —</option>
                  {EXPECTED.map(x => <option key={x} value={x}>{x}</option>)}
                </select>
              </div>
            ))}
          </div>
          <div className="flex gap-3">
            <button className="btn btn-ghost" onClick={()=>setStep(1)}>Indietro</button>
            <button className="btn btn-primary" onClick={onPreview}>Continua</button>
          </div>
        </div>
      )}

      {step===3 && (
        <div className="space-y-4">
          <div className="card">
            <div className="flex items-center justify-between mb-2">
              <h2 className="text-xl font-semibold">Passo 3/3 — Anteprima (dry-run)</h2>
              <div className="flex gap-2">
                <button className="btn btn-ghost" onClick={()=>setStep(2)}>Modifica mapping</button>
                {issues.length>0 && <button className="btn btn-ghost" onClick={exportIssues}>Esporta anomalie</button>}
              </div>
            </div>
            <div className="muted mb-2">{rows.length} righe importate — {issues.length} anomalie</div>
            <div className="overflow-auto">
              <table className="w-full text-sm" style={{ borderCollapse:"separate", borderSpacing:"0 6px" }}>
                <thead className="text-left muted">
                  <tr>{EXPECTED.map(h => <th key={h} className="pr-3">{h}</th>)}</tr>
                </thead>
                <tbody>
                  {rows.slice(0,50).map((r,i) => (
                    <tr key={i} className="bg-white/5 rounded-lg">
                      {EXPECTED.map(h => <td key={h} className="p-2">{r[h]||""}</td>)}
                    </tr>
                  ))}
                  {rows.length===0 && <tr><td colSpan={EXPECTED.length} className="p-3 muted">Nessuna riga.</td></tr>}
                </tbody>
              </table>
            </div>
          </div>
          <div className="flex gap-3">
            <button className="btn btn-ghost" onClick={()=>setStep(2)}>Indietro</button>
            <button className="btn btn-primary" onClick={()=>alert("Applicazione dati: da collegare al backend")} >Applica al piano</button>
          </div>
          {issues.length>0 && <p className="muted">Suggerimento: correggi il file sorgente o modifica il mapping e riesegui.</p>}
        </div>
      )}
    </div>
  );
}
