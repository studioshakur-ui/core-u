// src/pages/Capo.jsx
import { useEffect, useMemo, useState } from "react";
import { useCoreStore } from "../store/useCoreStore";
import { exportCsv } from "../utils/exporters/csv";
import { exportRapportinoPDF } from "../utils/exporters/rapportinoPdf";

export default function Capo() {
  const oggi = new Date().toISOString().slice(0,10);
  const { rapportino, commitRows, setStatus, pushToast, undoOnce, redoOnce } = useCoreStore();

  const [localRows, setLocalRows] = useState(rapportino.rows);

  // autosave LS (già persist a livello store, ma salviamo anche lato componente per UX fluida)
  useEffect(() => { setLocalRows(rapportino.rows); }, [rapportino.rows]);

  const totOre = useMemo(() => {
    return localRows.reduce((acc, r) => acc + (parseFloat(r.ore)||0), 0);
  }, [localRows]);

  function addRow(){
    const next = [...localRows, { operatore:"", ore:"", descrizione:"", prodotto:"", previsto:"", impianto:"", note:"" }];
    setLocalRows(next);
    commitRows(next);
  }

  function updateRow(i, key, val){
    const next = localRows.map((r,idx) => idx===i ? { ...r, [key]: val } : r);
    setLocalRows(next);
    commitRows(next);
  }

  function removeRow(i){
    const next = localRows.filter((_,idx) => idx!==i);
    setLocalRows(next);
    commitRows(next);
  }

  async function onExportCsv(){
    exportCsv(`rapportino_${oggi}.csv`, localRows);
    pushToast({ title:"CSV esportato", message:`${localRows.length} righe` });
  }

  async function onExportPdf(){
    try {
      await exportRapportinoPDF("rapportino-print", `rapportino_${oggi}.pdf`);
      pushToast({ title:"PDF esportato" });
    } catch (e) {
      pushToast({ title:"Errore PDF", message:String(e) });
    }
  }

  function valida(){
    if (!localRows.length) { pushToast({ title:"Nessuna riga", message:"Aggiungi almeno una riga" }); return; }
    setStatus("validato");
    pushToast({ title:"Validato", message:"Il rapportino è in stato 'Validato'." });
  }
  function invia(){
    if (rapportino.status!=="validato") { pushToast({ title:"Non validato", message:"Valida prima di inviare" }); return; }
    setStatus("inviato");
    pushToast({ title:"Inviato", message:"Il rapportino è stato inviato." });
  }
  function sblocca(){
    setStatus("bozza");
    pushToast({ title:"Sbloccato", message:"Tornato in 'Bozza'." });
  }

  const statoLbl = rapportino.status === "bozza" ? "Bozza"
                   : rapportino.status === "validato" ? "Validato"
                   : "Inviato";

  return (
    <div className="container-core space-y-5">
      <h1 className="text-3xl font-semibold">Rapportino — Oggi {oggi}</h1>

      <div className="flex items-center gap-6 text-sm">
        <label className="flex items-center gap-2"><input type="checkbox" /> Forza offline</label>
        <button className="btn btn-ghost" onClick={onExportCsv}>Esporta CSV</button>
        <button className="btn btn-ghost" onClick={onExportPdf}>Esporta PDF</button>
        <span className="chip">Stato: {statoLbl}</span>
        <span className="chip">Tot ore: {totOre.toFixed(2)}</span>
        <div className="flex gap-2">
          <button className="btn btn-ghost" onClick={undoOnce}>Annulla</button>
          <button className="btn btn-ghost" onClick={redoOnce}>Ripeti</button>
        </div>
      </div>

      <div className="card" id="rapportino-print">
        <div className="flex justify-between items-center mb-3">
          <div className="muted">Squadra:</div>
          <div className="flex gap-2">
            <button className="btn btn-ghost" onClick={valida}>Valida</button>
            <button className="btn btn-primary" onClick={invia}>Invia</button>
            <button className="btn btn-ghost" onClick={sblocca}>Sblocca</button>
            <button className="btn btn-primary" onClick={addRow}>Aggiungi riga</button>
          </div>
        </div>

        {/* Tabella */}
        <div className="overflow-auto">
          <table className="w-full text-sm" style={{ borderCollapse:"separate", borderSpacing:"0 8px" }}>
            <thead className="text-left muted">
              <tr>
                <th>Operatore/i</th><th>Ore</th><th>Descrizione</th><th>Prodotto</th><th>Previsto</th><th>Impianto</th><th>Note</th><th></th>
              </tr>
            </thead>
            <tbody>
              {localRows.map((r, i) => (
                <tr key={i} className="bg-white/5 rounded-xl">
                  <td className="p-2"><input className="w-full bg-white/5 rounded-lg px-2 py-1" value={r.operatore||""} onChange={e=>updateRow(i,"operatore",e.target.value)} /></td>
                  <td className="p-2"><input className="w-24 bg-white/5 rounded-lg px-2 py-1" value={r.ore||""} onChange={e=>updateRow(i,"ore",e.target.value)} /></td>
                  <td className="p-2"><input className="w-full bg-white/5 rounded-lg px-2 py-1" value={r.descrizione||""} onChange={e=>updateRow(i,"descrizione",e.target.value)} /></td>
                  <td className="p-2"><input className="w-full bg-white/5 rounded-lg px-2 py-1" value={r.prodotto||""} onChange={e=>updateRow(i,"prodotto",e.target.value)} /></td>
                  <td className="p-2"><input className="w-full bg-white/5 rounded-lg px-2 py-1" value={r.previsto||""} onChange={e=>updateRow(i,"previsto",e.target.value)} /></td>
                  <td className="p-2"><input className="w-full bg-white/5 rounded-lg px-2 py-1" value={r.impianto||""} onChange={e=>updateRow(i,"impianto",e.target.value)} /></td>
                  <td className="p-2"><input className="w-full bg-white/5 rounded-lg px-2 py-1" value={r.note||""} onChange={e=>updateRow(i,"note",e.target.value)} /></td>
                  <td className="p-2 text-right"><button className="btn btn-ghost" onClick={()=>removeRow(i)}>Rimuovi</button></td>
                </tr>
              ))}
              {!localRows.length && (
                <tr><td colSpan="8" className="p-4 muted">Nessuna riga. Clicca “Aggiungi riga”.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
