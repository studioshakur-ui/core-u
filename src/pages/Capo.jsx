import React, { useEffect, useState } from "react";
import Header from "../components/Header";
import TableEditable from "../components/TableEditable";
import { fetchAssignments, saveAssignment } from "../utils/dataClient";

export default function Capo(){
  const [rows, setRows] = useState([]);
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState(null);
  useEffect(()=>{ fetchAssignments().then(setRows).catch(()=>{}); },[]);
  const columns = [
    { key: "activity", label: "Attività", editable: true },
    { key: "qty", label: "Q.tà", editable: true },
    { key: "note", label: "Note", editable: true },
  ];
  function onChange(rIdx, key, val){
    setRows(prev => prev.map((r,i)=> i===rIdx ? ({ ...r, [key]: key==="qty" ? Number(val) || 0 : val }) : r));
  }
  async function onSave(){
    setSaving(true); setMsg(null);
    try{
      for(const r of rows){
        const res = await saveAssignment(r);
        if (!res.ok) throw new Error(res.error || "Errore salvataggio");
      }
      setMsg({ type:"ok", text: "Salvato" });
    }catch(e){ setMsg({ type:"err", text: e.message }); }finally{ setSaving(false); }
  }
  return (
    <div>
      <Header/>
      <main className="max-w-7xl mx-auto px-4 py-8 space-y-4">
        <h1 className="text-2xl font-semibold">Capo</h1>
        <TableEditable columns={columns} rows={rows} onChange={onChange}/>
        <div className="flex items-center gap-2">
          <button onClick={onSave} disabled={saving} className="px-4 py-2 rounded-md bg-core-violet text-white disabled:opacity-60">
            {saving ? "Salvataggio..." : "Salva"}
          </button>
          {msg && <div className={`text-sm ${msg.type==='ok'?'text-green-600':'text-red-600'}`}>{msg.text}</div>}
        </div>
      </main>
    </div>
  );
}