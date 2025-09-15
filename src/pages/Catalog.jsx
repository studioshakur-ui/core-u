import React, { useState } from 'react'
import Papa from 'papaparse'
import { useCoreStore } from '../store/useCoreStore'
import { diffEntities, toCSV } from '../lib/imports'
export default function Catalog(){
  const { catalogVersions, catalogActiveVersionId } = useCoreStore()
  const [rows,setRows]=useState([])
  const [journal,setJournal]=useState(null)
  const importCSV=async (file)=>{ const text = await file.text(); const parsed = Papa.parse(text, { header:true }); setRows(parsed.data.filter(Boolean)) }
  const exportCSV=()=>{ const csv = Papa.unparse(rows); const blob = new Blob([csv], {type:'text/csv'}); const url = URL.createObjectURL(blob); const a = document.createElement('a'); a.href=url; a.download='catalog.csv'; a.click() }
  const dryRun=()=>{
    const current = (catalogVersions.find(v=>v.id===catalogActiveVersionId)?.rows)||[]
    const diff = diffEntities(current, rows, 'code')
    setJournal(diff)
  }
  const commit=()=>{
    const id = 'v'+Date.now()
    useCoreStore.setState(s=>({ catalogVersions:[...s.catalogVersions, { id, effective_from: new Date().toISOString(), effective_to:null, rows } ], catalogActiveVersionId:id }))
    setJournal(null)
  }
  const downloadJournal=(fmt)=>{
    if(!journal) return
    const data = fmt==='json'? JSON.stringify(journal,null,2) : toCSV([
      { type:'add', count: journal.adds.length },
      { type:'update', count: journal.updates.length },
      { type:'remove', count: journal.removes.length },
    ])
    const blob = new Blob([data], {type: fmt==='json'? 'application/json':'text/csv'})
    const url = URL.createObjectURL(blob); const a = document.createElement('a'); a.href=url; a.download= 'journal.'+fmt; a.click()
  }
  return (<div className="max-w-6xl mx-auto p-4 space-y-3">
    <div className="flex items-center gap-2">
      <label className="btn cursor-pointer">Importa CSV<input type="file" accept=".csv" className="hidden" onChange={e=>e.target.files&&importCSV(e.target.files[0])}/></label>
      <button className="btn" onClick={exportCSV}>Esporta CSV</button>
      <button className="btn" onClick={dryRun}>Dry-Run</button>
      <button className="btn-primary" onClick={commit}>Commit nuova versione</button>
      {journal && <><button className="btn" onClick={()=>downloadJournal('csv')}>Scarica Journal CSV</button><button className="btn" onClick={()=>downloadJournal('json')}>Scarica Journal JSON</button></>}
    </div>
    <div className="bg-white border border-slate-200 rounded-2xl p-3 overflow-auto">
      <table className="table w-full"><thead><tr><th>code</th><th>descrizione</th><th>unità</th><th>produttività</th></tr></thead>
        <tbody>{rows.map((r,i)=>(<tr key={i}>
          <td><input className="px-2 py-1 rounded border border-slate-300" value={r.code||''} onChange={e=>{const x=[...rows]; x[i].code=e.target.value; setRows(x)}}/></td>
          <td><input className="px-2 py-1 rounded border border-slate-300" value={r.descrizione||''} onChange={e=>{const x=[...rows]; x[i].descrizione=e.target.value; setRows(x)}}/></td>
          <td><input className="px-2 py-1 rounded border border-slate-300" value={r.unita||''} onChange={e=>{const x=[...rows]; x[i].unita=e.target.value; setRows(x)}}/></td>
          <td><input type="number" className="px-2 py-1 rounded border border-slate-300" value={r.produttivita||0} onChange={e=>{const x=[...rows]; x[i].produttivita=Number(e.target.value||0); setRows(x)}}/></td>
        </tr>))}</tbody>
      </table>
    </div>
    {journal && <div className="bg-white border border-slate-200 rounded-2xl p-3">
      <div className="font-semibold mb-1">Journal (Dry-Run)</div>
      <pre className="text-xs whitespace-pre-wrap">{JSON.stringify(journal,null,2)}</pre>
    </div>}
  </div>)
}