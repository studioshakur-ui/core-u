import React, { useEffect, useState } from 'react'
export default function AssistantFab(){
  const [open,setOpen]=useState(false)
  const [query,setQuery]=useState('')
  const [out,setOut]=useState([])
  useEffect(()=>{
    const onKey=(e)=>{ if((e.ctrlKey||e.metaKey) && e.key.toLowerCase()==='k'){ e.preventDefault(); setOpen(o=>!o) } }
    window.addEventListener('keydown', onKey); return ()=> window.removeEventListener('keydown', onKey)
  },[])
  const ask=()=>{
    const q = query.trim().toLowerCase()
    const tips = []
    if(/conflit|conflitto|over|12h/.test(q)) tips.push('Suggerimento: verifica conflitti in Pianificazione e il limite 12h nel Rapportino.')
    if(/import|excel|programma/.test(q)) tips.push('Suggerimento: importa il PROGRAMMA in Manager → Organigramma.')
    if(/catalog/.test(q)) tips.push('Suggerimento: usa Dry-Run in Catalogo prima del Commit.')
    if(!tips.length) tips.push('Suggerimento: prova "import programma", "limite 12h", "journal catalogo".')
    setOut(tips.map((t,i)=> ({ id:i, text:t, sources:['manuale locale','heuristiche'] })))
  }
  return (<div className="palette">
    <button title="Assistant (Ctrl/Cmd + K)" onClick={()=>setOpen(o=>!o)}>?</button>
    {open && <div className="absolute bottom-20 right-0 bg-white border border-slate-200 rounded-2xl shadow-xl w-[380px] p-3">
      <div className="font-semibold mb-2">Assistant</div>
      <input autoFocus className="w-full px-3 py-2 rounded-xl border border-slate-300" placeholder="Chiedi... (Ctrl/Cmd+K)" value={query} onChange={e=>setQuery(e.target.value)} onKeyDown={e=> e.key==='Enter' && ask() }/>
      <div className="text-right mt-2"><button className="btn-primary" onClick={ask}>Chiedi</button></div>
      <ul className="mt-2 space-y-1">{out.map(o=>(<li key={o.id} className="text-sm text-slate-700">{o.text} <span className="text-xs text-slate-400">[{o.sources.join(', ')}]</span></li>))}</ul>
    </div>}
  </div>)
}