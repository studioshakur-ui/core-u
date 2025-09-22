import { useState } from 'react'
const initial=[{id:1,name:'Operaio A',role:'Elettricista',hse:'OK'},{id:2,name:'Operaio B',role:'Montatore',hse:'KO'},{id:3,name:'Operaio C',role:'Cucito',hse:'OK'}]
export default function Manager(){
  const [q,setQ]=useState(''); const list=initial.filter(x=>x.name.toLowerCase().includes(q.toLowerCase()))
  return (<main className="mx-auto max-w-6xl px-4 py-8">
    <div className="flex items-end justify-between gap-4"><div><h2 className="text-2xl font-semibold">Nuvola Operai</h2><p className="text-white/60 text-sm">Ricerca, badge HSE, selezione multipla (à venir).</p></div><div className="text-sm text-white/60">Capacità: {list.length}/20</div></div>
    <div className="mt-4 flex gap-3"><input value={q} onChange={e=>setQ(e.target.value)} placeholder="Cerca operaio…" className="flex-1 bg-core-card rounded-lg px-3 py-2"/><button className="rounded-lg bg-white/10 px-3 py-2 hover:bg-white/15 text-sm">Assign (mass)</button></div>
    <div className="mt-6 grid sm:grid-cols-2 lg:grid-cols-3 gap-4">{list.map(x=>(<div key={x.id} className="rounded-2xl bg-core-card p-4 shadow-soft"><div className="font-medium">{x.name}</div><div className="text-sm text-white/70">{x.role}</div><div className={"mt-2 inline-flex items-center gap-2 text-xs px-2 py-1 rounded "+(x.hse==='OK'?'bg-core-success/20':'bg-core-danger/20')}>HSE: {x.hse}</div></div>))}</div>
  </main>)
}
