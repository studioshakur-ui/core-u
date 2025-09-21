import React, { useRef, useState } from "react";
import Header from "../components/Header";
import { useAppStore } from "../store/useAppStore";
import Papa from "papaparse";
import * as XLSX from "xlsx";
import ExcelJS from "exceljs";

function parseColor(argb){ if(!argb) return null; const a=parseInt(argb.slice(0,2),16)/255; const r=parseInt(argb.slice(2,4),16), g=parseInt(argb.slice(4,6),16), b=parseInt(argb.slice(6,8),16); return {a,r,g,b}; }
function isGreen(c){ if(!c) return false; return c.g>c.r && c.g>c.b && c.g>128; }

export default function Manager(){
  const { week, days, activeDay, setActiveDay, cloud, teams, dropToTeam, resetPlanning, loadFromImport } = useAppStore();
  const [step,setStep]=useState(1);
  const [raw,setRaw]=useState([]);
  const fileRef = useRef(null);

  const onFile = async (f)=>{
    if(!f) return;
    resetPlanning();
    const name=f.name.toLowerCase();
    if(name.endsWith(".csv")){
      Papa.parse(f,{header:true,skipEmptyLines:false,complete:(res)=>{
        const rows=res.data.map((r,i)=>({...r,__row:i+2}));
        setRaw(rows); hydrateFromRows(rows, false);
      }});
    } else {
      const wb = new ExcelJS.Workbook();
      const buf = await f.arrayBuffer();
      await wb.xlsx.load(buf);
      const ws = wb.worksheets[0];
      const rows=[];
      ws.eachRow((row,rn)=>{
        const c1=row.getCell(1);
        const val=(c1?.value&&c1.value.richText)?c1.value.richText.map(t=>t.text).join(""): (c1?.value?.toString?.()||c1?.text||"");
        const fill=c1?.fill?.fgColor?.argb || c1?.fill?.bgColor?.argb || null;
        rows.push({ name: (val||"").trim(), __row: rn, __argb: fill });
      });
      setRaw(rows); hydrateFromRows(rows, true);
    }
    setStep(3);
  };

  const hydrateFromRows=(rows, tryColor)=>{
    const cloud=[], anomalies=[]; const teamsObj={}; let lastCapo=null;
    rows.forEach((r,idx)=>{
      const name = (r.name || r["Nome"] || r["Name"] || r["Operaio"] || r["Cognome"] || "").toString().trim();
      const isEmpty = !name;
      const c = tryColor && r.__argb ? parseColor(r.__argb) : null;
      const capoDetected = tryColor && isGreen(c);
      if(capoDetected){
        const id="capo_"+idx;
        lastCapo = { id, name: name || ("Capo "+idx) };
        teamsObj[lastCapo.id] = { capo: lastCapo, members: [] };
      } else if(!isEmpty){
        const op={ id:"op_"+idx, name };
        if(lastCapo) teamsObj[lastCapo.id].members.push(op); else cloud.push(op);
      }
    });
    loadFromImport({ cloud, teams: teamsObj, anomalies, validCount: rows.length, totalHours: 0 });
  };

  const chooseFile=()=>fileRef.current?.click();

  return (
    <div className="bg-white text-core-text min-h-screen">
      <Header right={<div className="segmented">{days.map((d,i)=>(<button key={d} aria-pressed={i===activeDay} onClick={()=>setActiveDay(i)}>{d}</button>))}</div>}/>
      <main className="container section grid gap-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-semibold">Planning — Semaine W{week}</h1>
          <div className="flex items-center gap-2">
            <button className="btn-outline" onClick={chooseFile}>Importer</button>
            <input ref={fileRef} type="file" className="hidden" accept=".csv,.xlsx,.xls" onChange={e=>onFile(e.target.files?.[0])}/>
            <button className="btn-primary">Exporter</button>
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          <section className="card">
            <div className="p-4 border-b border-core-border flex items-center justify-between">
              <div className="font-semibold">Nuage Opérai</div>
              <input className="search" placeholder="Rechercher…"/>
            </div>
            <div className="p-4 grid grid-cols-1 gap-2 max-h-[480px] overflow-auto">
              {cloud.map(p=>(
                <div key={p.id} className="operaio flex items-center justify-between">
                  <div className="flex items-center gap-2"><span>👷</span><span>{p.name}</span></div>
                </div>
              ))}
              {!cloud.length && <div className="text-core-muted text-sm">Aucun operaio non assigné.</div>}
            </div>
          </section>

          <section className="md:col-span-2 grid sm:grid-cols-2 gap-6">
            {Object.values(teams).map(t=>(
              <div key={t.capo.id} className="capo">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div className="h-9 w-9 rounded-full bg-core-surface border border-core-border grid place-items-center">👨‍✈️</div>
                    <div>
                      <div className="font-semibold">{t.capo.name}</div>
                      <div className="text-xs text-core-muted">CAPO • {t.members.length} operai</div>
                    </div>
                  </div>
                  <div className="badge">Capacité: {t.members.length}/—</div>
                </div>
                <div className="grid gap-2 min-h-[80px]">
                  {t.members.map(m=>(
                    <div key={m.id} className="operaio flex items-center justify-between">
                      <div className="flex items-center gap-2"><span>👷</span><span>{m.name}</span></div>
                      <div className="text-xs text-core-muted">— h</div>
                    </div>
                  ))}
                  {!t.members.length && <div className="text-core-muted text-sm">Glissez des operai ici…</div>}
                </div>
              </div>
            ))}
            {!Object.values(teams).length && <div className="text-core-muted text-sm">Aucun Capo détecté. Importez un XLSX avec lignes Capo en vert, ou ajoutez des équipes.</div>}
          </section>
        </div>
      </main>
    </div>
  );
}
