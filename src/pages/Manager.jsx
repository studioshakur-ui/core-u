import React, { useState } from "react";
import GuardedRoute from "../components/GuardedRoute";
import HeaderStatus from "../components/HeaderStatus";
import Papa from "papaparse";
import HeaderPage from "../components/HeaderPage";
import Toast from "../components/Toast";
function ManagerInner(){
  const [step,setStep]=useState(1); const [rawCsv,setRawCsv]=useState(null); const [preview,setPreview]=useState([]);
  const [mapping,setMapping]=useState({name:'Name',role:'Role',team:'Team'}); const [errors,setErrors]=useState([]);
  const onFile=e=>{ const file=e.target.files?.[0]; if(!file) return; Papa.parse(file,{header:true,skipEmptyLines:true,complete:(res)=>{ setRawCsv(res.data); setPreview(res.data.slice(0,10)); setStep(2); }}); };
  const runDry=()=>{ const errs=[]; (rawCsv||[]).forEach((r,i)=>{ if(!r[mapping.name]) errs.push({row:i+1,msg:'Name mancante'}); if(!r[mapping.role]) errs.push({row:i+1,msg:'Role mancante'}); }); setErrors(errs); setStep(3); };
  return (<div><HeaderStatus/><main className='p-6 space-y-4'>
    <HeaderPage title='Manager — Import Wizard' subtitle='Fichier → Mapping → Dry-run' image='/assets/ships/ship-ambient.jpg'/>
    <div className='card p-4'>
      <div className='flex gap-2 mb-4 text-sm'>
        <div className={`px-2 py-1 rounded ${step>=1?'bg-core-accent text-black':'bg-white/5'}`}>1. Fichier</div>
        <div className={`px-2 py-1 rounded ${step>=2?'bg-core-accent text-black':'bg-white/5'}`}>2. Mapping</div>
        <div className={`px-2 py-1 rounded ${step>=3?'bg-core-accent text-black':'bg-white/5'}`}>3. Dry-run</div>
      </div>
      {step===1 && (<div className='space-y-3'><input type='file' accept='.csv' onChange={onFile}/><p className='opacity-80 text-sm'>Accepte: CSV (Excel → Enregistrer sous → CSV UTF-8)</p></div>)}
      {step===2 && (<div className='space-y-3'>
        <div className='grid grid-cols-3 gap-3'>{['name','role','team'].map(k=>(<label key={k} className='text-sm'><div className='opacity-80 mb-1'>Champ {k}</div><input className='input' value={mapping[k]} onChange={e=>setMapping(s=>({...s,[k]:e.target.value}))}/></label>))}</div>
        <div className='mt-3'><div className='text-sm opacity-80 mb-1'>Prévisualisation (10 lignes)</div>
          <div className='max-h-64 overflow-auto border border-white/10 rounded'><table className='w-full text-sm'>
            <thead className='opacity-70'><tr>{preview[0] && Object.keys(preview[0]).map(h=><th key={h} className='p-2 text-left'>{h}</th>)}</tr></thead>
            <tbody>{preview.map((r,i)=>(<tr key={i} className='border-t border-white/5'>{Object.values(r).map((v,j)=><td key={j} className='p-2'>{String(v)}</td>)}</tr>))}</tbody>
          </table></div></div>
        </div>)}
      {step===3 && (<div className='space-y-3'><div className='text-sm opacity-80'>Résultats du dry-run</div>{errors.length===0?<Toast kind='success'>Aucune erreur détectée. Prêt pour l'import.</Toast>:(<div className='p-3 rounded bg-red-600/20 border border-red-600/30'><div className='mb-2 font-semibold'>{errors.length} erreurs</div><ul className='list-disc pl-5'>{errors.map((e,i)=><li key={i}>Ligne {e.row}: {e.msg}</li>)}</ul></div>)}</div>)}
    </div>
  </main></div>);}
export default function Manager(){ return (<GuardedRoute allow={['manager','direzione']}><ManagerInner/></GuardedRoute>); }
