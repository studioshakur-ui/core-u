import { useState } from 'react'
import dayjs from 'dayjs'
function Row({ item, onChange }){
  return (<tr className="border-b border-white/10">
    <td className="p-2">{item.name}</td>
    <td className="p-2"><input value={item.activity} onChange={e=>onChange({...item,activity:e.target.value})} className="bg-black/30 rounded px-2 py-1 text-sm w-full"/></td>
    <td className="p-2 w-32"><input type="number" min="0" max="12" value={item.hours} onChange={e=>onChange({...item,hours:Number(e.target.value)})} className="bg-black/30 rounded px-2 py-1 text-sm w-full"/></td>
    <td className="p-2"><input value={item.note} onChange={e=>onChange({...item,note:e.target.value})} className="bg-black/30 rounded px-2 py-1 text-sm w-full"/></td>
  </tr>)
}
export default function Capo(){
  const [date]=useState(dayjs().format('YYYY-MM-DD'))
  const [rows,setRows]=useState([{id:1,name:'Operaio A',activity:'Cavi',hours:8,note:''},{id:2,name:'Operaio B',activity:'Lampade',hours:7,note:''}])
  function updateRow(n){ setRows(p=>p.map(r=>r.id===n.id?n:r)) }
  const total=rows.reduce((a,b)=>a+(b.hours||0),0)
  return (<main className="mx-auto max-w-6xl px-4 py-8">
    <div className="flex items-end justify-between gap-4"><div><h2 className="text-2xl font-semibold">Rapportino — {date}</h2><p className="text-white/60 text-sm">Inline edit, totaux en direct, contrôle doux des heures.</p></div><button className="rounded-lg bg-core-violet px-3 py-2 text-sm">Exporter PDF (bientôt)</button></div>
    <div className="mt-6 overflow-x-auto rounded-2xl bg-core-card shadow-soft"><table className="w-full text-sm"><thead><tr className="text-left border-b border-white/10"><th className="p-2">Operaio</th><th className="p-2">Attività</th><th className="p-2">Ore</th><th className="p-2">Note</th></tr></thead><tbody>{rows.map(r=><Row key={r.id} item={r} onChange={updateRow}/>)}</tbody></table></div>
    <div className="mt-4 text-sm text-white/70">Totale ore: {total}</div>
  </main>)
}
