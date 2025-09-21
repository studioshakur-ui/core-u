import React, { useRef, useState } from "react";
import Header from "../components/Header";
import { useAppStore } from "../store/useAppStore";
import { T } from "../i18n";
import * as XLSX from "xlsx";
import Papa from "papaparse";

export default function Manager(){
  const { lang } = useAppStore(); const t=T[lang].manager;
  const [raw,setRaw] = useState([]);
  const [mapping,setMapping] = useState({date:"date", team:"team", capo_email:"capo_email", activity:"activity", hours:"hours", note:"note"});
  const [errors,setErrors]=useState([]); const [valid,setValid]=useState([]);
  const fileRef = useRef(null);

  const onFile = (f)=>{
    if(!f) return;
    const name = f.name.toLowerCase();
    if(name.endsWith(".csv")) {
      Papa.parse(f,{header:true,skipEmptyLines:true,complete:(res)=>setRaw(res.data)});
    } else {
      const fr = new FileReader();
      fr.onload = (e)=>{
        const wb = XLSX.read(new Uint8Array(e.target.result), {type:"array"});
        const ws = wb.Sheets[wb.SheetNames[0]];
        setRaw(XLSX.utils.sheet_to_json(ws, {defval:""}));
      };
      fr.readAsArrayBuffer(f);
    }
  };

  const onPaste = (e)=>{
    const text = e.clipboardData.getData("text");
    const rows = Papa.parse(text, {header:true}).data;
    if(rows?.length) setRaw(rows);
  };

  const dryRun = ()=>{
    const errs=[]; const val=[];
    raw.forEach((r,i)=>{
      const rowNo=i+2;
      const line={
        date: r[mapping.date], team: r[mapping.team], capo_email: r[mapping.capo_email],
        activity: r[mapping.activity], hours: parseFloat(String(r[mapping.hours]).replace(',','.')), note: r[mapping.note]||""
      };
      if(!line.activity) errs.push({row:rowNo,field:"activity",msg:"attività vuota"});
      if(isNaN(line.hours) || line.hours<0 || line.hours>12) errs.push({row:rowNo,field:"hours",msg:"ore 0–12"});
      if(!line.team) errs.push({row:rowNo,field:"team",msg:"team mancante"});
      if(!line.capo_email || !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(line.capo_email)) errs.push({row:rowNo,field:"capo_email",msg:"email capo non valida"});
      if(line.date && isNaN(Date.parse(line.date))) errs.push({row:rowNo,field:"date",msg:"data non valida"});
      if(!errs.find(e=>e.row===rowNo)) val.push(line);
    });
    setErrors(errs); setValid(val);
  };

  const downloadCsv=(filename, rows)=>{
    const headers = Object.keys(rows[0] || { row:"", field:"", msg:"" });
    const csv = [headers.join(",")].concat(rows.map(r => headers.map(h => `"${String(r[h]??'').replace(/"/g,'""')}"`).join(","))).join("\n");
    const blob = new Blob([csv], {type:"text/csv;charset=utf-8;"});
    const url = URL.createObjectURL(blob); const a=document.createElement("a");
    a.href=url; a.download=filename; a.click(); URL.revokeObjectURL(url);
  };

  return (<div onPaste={onPaste} className="bg-white text-core-text min-h-screen">
    <Header/>
    <main className="container section grid gap-4">
      <div className="bg-white border border-core-border rounded-lg p-6">
        <div className="flex items-center justify-between mb-3">
          <h1 className="text-xl font-semibold">{t.title}</h1>
          <div className="flex items-center gap-2">
            <input ref={fileRef} type="file" className="hidden" accept=".csv,.xlsx,.xls" onChange={e=>onFile(e.target.files?.[0])}/>
            <button className="btn-outline" onClick={()=>fileRef.current?.click()}>{t.import}</button>
            <button className="btn-primary" onClick={dryRun}>Dry-run</button>
          </div>
        </div>
        <div className="grid md:grid-cols-3 gap-3 mb-3">
          {Object.keys(mapping).map(k=>(
            <label key={k} className="text-sm">
              <div className="opacity-80 mb-1">Map “{k}”</div>
              <input className="input" value={mapping[k]} onChange={e=>setMapping(s=>({...s,[k]:e.target.value}))}/>
            </label>
          ))}
        </div>
        <div className="text-sm text-core-muted mb-2">{t.pasteHint}</div>
        <div className="max-h-64 overflow-auto border border-core-border rounded-lg">
          <table className="table">
            <thead><tr>{raw[0] && Object.keys(raw[0]).map(h=><th key={h} className="text-left">{h}</th>)}</tr></thead>
            <tbody>
              {raw.slice(0,20).map((r,i)=>(<tr key={i}>{Object.values(r).map((v,j)=><td key={j}>{String(v)}</td>)}</tr>))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="grid md:grid-cols-3 gap-4">
        <div className="kpi">
          <div className="font-semibold mb-2">{t.anomalies}</div>
          <div className="text-sm mb-2">Errors: <b>{errors.length}</b></div>
          <div className="flex gap-2">
            <button className="btn-outline" onClick={()=>errors.length && downloadCsv("import-errors.csv", errors)} disabled={!errors.length}>{T[lang].common.export}</button>
          </div>
          <div className="mt-3 max-h-48 overflow-auto">
            <ul className="list-disc pl-5 text-sm">{errors.map((e,i)=><li key={i}>riga {e.row} • {e.field}: {e.msg}</li>)}</ul>
          </div>
        </div>
        <div className="kpi">
          <div className="font-semibold mb-2">Valid</div>
          <div className="text-sm">Rows: <b>{valid.length}</b></div>
          <div className="text-sm">Ore totali: <b>{valid.reduce((a,b)=>a+(b.hours||0),0)}</b></div>
        </div>
        <div className="kpi">
          <div className="font-semibold mb-2">{t.capacity}</div>
          <div className="text-sm text-core-muted">Setup capacità settimana (placeholder).</div>
        </div>
      </div>
    </main>
  </div>);
}
