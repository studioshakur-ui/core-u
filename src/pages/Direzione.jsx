import React, { useState } from 'react'
import { useCoreStore } from '../store/useCoreStore'
export default function Direzione(){
  const { direzione, importImpianti, setSpotlight } = useCoreStore()
  const [text,setText]=useState('')
  const parse=()=>{
    const rows = text.split('\n').map(l=>l.trim()).filter(Boolean).map((l,i)=>{
      const [id,titolo,stato,progress] = l.split('|').map(s=> (s||'').trim())
      return { id: id||('imp-'+(i+1)), titolo: titolo||'-', stato: stato||'in corso', progress: Number(progress||0) }
    })
    importImpianti(rows)
  }
  const toggleSpot=(id)=>{
    const cur = new Set(direzione.spotlight)
    if(cur.has(id)) cur.delete(id); else cur.add(id)
    setSpotlight([...cur])
  }
  return (<div className="max-w-6xl mx-auto p-4 space-y-3">
    <div className="bg-white border border-slate-200 rounded-2xl p-4">
      <div className="font-semibold mb-2">Importa elenco impianti</div>
      <textarea className="w-full h-28 px-3 py-2 rounded-xl border border-slate-300" placeholder="id|titolo|stato|progress(0-100)" value={text} onChange={e=>setText(e.target.value)}></textarea>
      <div className="text-right mt-2"><button className="btn-primary" onClick={parse}>Importa</button></div>
    </div>
    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-3">
      {direzione.impianti.map(it=>(<div key={it.id} className="bg-white border border-slate-200 rounded-2xl p-3">
        <div className="flex items-center gap-2">
          <div className="font-semibold">{it.titolo}</div>
          <span className="badge border-slate-300 text-slate-700">{it.stato}</span>
          <button className={"ml-auto text-xs "+(direzione.spotlight.includes(it.id)?'text-primary':'text-slate-500')} onClick={()=>toggleSpot(it.id)}>{direzione.spotlight.includes(it.id)?'In Spotlight':'Metti Spotlight'}</button>
        </div>
        <div className="mt-2 h-2 bg-slate-200 rounded-full"><div className="h-2 bg-primary rounded-full" style={{width: `${Math.max(0, Math.min(100, it.progress||0))}%`}}/></div>
      </div>))}
    </div>
  </div>)
}