import React, { useState } from 'react'
import jsPDF from 'jspdf'
import html2canvas from 'html2canvas'
import catalog from '../data/catalogo_apparato_motore.json'

export default function Capo(){
  const [rows,setRows]=useState([
    {op:'Maiga Hamidou', ore:'8:00', att:'CAPO SQUADRA', prod:'', prev:'0,2', note:'Assist'},
    {op:'Hossain Mohammad', ore:'8:00', att:'STESURA DIRETTIVA IMPLM', prod:'884,1 mt', prev:'350,00', note:''},
  ])
  const [date,setDate]=useState(new Date().toISOString().slice(0,10))

  function addFromCatalog(item){
    setRows(r=>[...r, {op:'', ore:'8:00', att:item.descrizione, prod:'', prev:String(item.previsto??''), note:''}])
  }
  async function exportPDF(){
    const el = document.getElementById('rapportino')
    const canvas = await html2canvas(el, { scale:2 })
    const img = canvas.toDataURL('image/png')
    const pdf = new jsPDF('p','mm','a4')
    const pageW = 210, pageH = 297
    const imgW = pageW-20
    const imgH = canvas.height * imgW / canvas.width
    pdf.text('RAPPORTINO GIORNALIERO — APPARATO MOTORE', 10, 10)
    pdf.addImage(img,'PNG',10,20,imgW,Math.min(imgH, pageH-30))
    pdf.save(`Rapportino_${date}.pdf`)
  }
  return (
    <section className="p-6">
      <header className="mb-4 flex items-end justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Rapportino Giornaliero — Apparato Motore</h2>
          <p className="text-gray-600">Compila utilizzando il catalogo attività pre-caricato (drag & drop).</p>
        </div>
        <div className="flex items-center gap-2">
          <label className="text-sm text-gray-600">Data</label>
          <input type="date" value={date} onChange={e=>setDate(e.target.value)} className="border rounded px-2 py-1"/>
          <button className="btn-ghost" onClick={()=>setRows([])}>Nuovo</button>
          <button className="btn-primary" onClick={exportPDF}>Valida & PDF</button>
        </div>
      </header>
      <div className="grid md:grid-cols-4 gap-4">
        <aside className="md:col-span-1 card p-4">
          <div className="font-semibold mb-2">Catalogo Attività</div>
          <div className="space-y-2 max-h-96 overflow-auto pr-1">
            {catalog.map((it,i)=>(
              <button key={i} onClick={()=>addFromCatalog(it)} className="w-full text-left px-3 py-2 rounded border hover:bg-gray-50">
                <div className="text-xs text-gray-500">{it.categoria}</div>
                <div className="font-medium">{it.descrizione}</div>
                <div className="text-xs text-gray-500">Previsto: {it.previsto ?? '-'}</div>
              </button>
            ))}
          </div>
        </aside>
        <div className="md:col-span-3 card p-4 overflow-auto">
          <div id="rapportino">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-gray-500">
                  <th className="py-2">Operatore</th>
                  <th>Tempo impiegato</th>
                  <th>Descrizione attività</th>
                  <th>Prodotto</th>
                  <th>Previsto a persona</th>
                  <th>Note</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {rows.map((r,idx)=>(
                  <tr key={idx}>
                    <td className="py-2 pr-2"><input className="w-full border rounded px-2 py-1" value={r.op} onChange={e=>setRows(upd(rows,idx,{...r,op:e.target.value}))}/></td>
                    <td className="pr-2"><input className="w-full border rounded px-2 py-1" value={r.ore} onChange={e=>setRows(upd(rows,idx,{...r,ore:e.target.value}))}/></td>
                    <td className="pr-2"><input className="w-full border rounded px-2 py-1" value={r.att} onChange={e=>setRows(upd(rows,idx,{...r,att:e.target.value}))}/></td>
                    <td className="pr-2"><input className="w-full border rounded px-2 py-1" value={r.prod} onChange={e=>setRows(upd(rows,idx,{...r,prod:e.target.value}))}/></td>
                    <td className="pr-2"><input className="w-full border rounded px-2 py-1" value={r.prev} onChange={e=>setRows(upd(rows,idx,{...r,prev:e.target.value}))}/></td>
                    <td className="pr-2"><input className="w-full border rounded px-2 py-1" value={r.note} onChange={e=>setRows(upd(rows,idx,{...r,note:e.target.value}))}/></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="mt-4 flex gap-2">
            <button className="btn-ghost" onClick={()=>setRows(r=>[...r,{op:'',ore:'8:00',att:'',prod:'',prev:'',note:''}])}>Aggiungi riga</button>
            <button className="btn-ghost" onClick={()=>setRows(r=>r.slice(0,-1))}>Rimuovi ultima</button>
          </div>
        </div>
      </div>
    </section>
  )
}

function upd(arr, idx, next){
  const copy = [...arr]; copy[idx]=next; return copy
}
