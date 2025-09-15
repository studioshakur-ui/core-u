import React, { useEffect, useState } from 'react'
import { useCoreStore } from '../store/useCoreStore'
import { sha256File } from '../utils/hash'
import { rowsToCSV, rowsToPDF } from '../export/rapportinoFormatter'

async function compressImage(file, maxW=1600){
  return new Promise((resolve)=>{
    const img = new Image()
    img.onload = ()=>{
      const scale = Math.min(1, maxW / img.width)
      const canvas = document.createElement('canvas')
      canvas.width = img.width * scale; canvas.height = img.height * scale
      const ctx = canvas.getContext('2d'); ctx.drawImage(img, 0, 0, canvas.width, canvas.height)
      canvas.toBlob((blob)=> resolve(new File([blob], file.name.replace(/\.(png|jpg|jpeg)$/i,'.jpg'), { type:'image/jpeg' })), 'image/jpeg', 0.82)
    }
    img.src = URL.createObjectURL(file)
  })
}
function makeSignedURL(blob){
  const url = URL.createObjectURL(blob)
  const expiry = Date.now() + 60*1000
  return { url, expiry }
}
export default function Capo(){
  const { teams, activeTeamId, setActiveTeam, capoReport, prefillFromSchedule, pushToast, setCapoStatus, offlineForced, setOfflineForced, enqueue, queue } = useCoreStore()
  const todayISO = new Date().toISOString().slice(0,10)
  const [rows,setRows]=useState(capoReport.righe||[])
  useEffect(()=>{ if(activeTeamId){ prefillFromSchedule(todayISO, activeTeamId) } }, [activeTeamId])
  useEffect(()=>{ setRows(capoReport.righe||[]) }, [capoReport.righe])
  const totalHoursPerPerson = ()=>{ const map = new Map(); for(const r of rows){ const ore = Number(r.ore)||0; for(const pid of (r.membri||[])){ map.set(pid, (map.get(pid)||0) + ore) } } return map }
  const addRow=()=> setRows(r=>[...r, { id: Math.random().toString(36).slice(2,9), membri:[], descrizione:'', prodotto:'', previsto:'', note:'', ore:0, impiantoId:'', allegati:[] }])
  const update=(id,patch)=> setRows(rs=> rs.map(r=> r.id===id? {...r, ...patch}: r))
  const attach=async (id, files)=>{ const list = []; for(const f of files){ let used = f; if(f.size> 8*1024*1024 && /^image\//.test(f.type)){ used = await compressImage(f); pushToast({title:'Immagine compressa', message:`${f.name} → ${used.name}`}) } const hash = await sha256File(used); const signed = makeSignedURL(used); list.push({ name: used.name, size: used.size, type: used.type, url: signed.url, expiry: signed.expiry, status:'quarantine', hash }) } update(id, { allegati:[...(rows.find(r=>r.id===id).allegati||[]), ...list] }); setTimeout(()=>{ setRows(rs=> rs.map(r=> r.id===id? {...r, allegati: r.allegati.map(a=> ({...a, status: a.status==='quarantine'?'clean':a.status})) }: r )) }, 1200) }
  const openFile=(a)=>{ if(Date.now()>a.expiry){ pushToast({title:'URL scaduto', type:'error', message:'Rigenera link temporaneo'}); return } window.open(a.url, '_blank') }
  const regenLink=(id, name)=>{ setRows(rs=> rs.map(r=> r.id===id? {...r, allegati: r.allegati.map(a=> a.name===name? ({...a, ...makeSignedURL(new Blob()), status:'clean'}) : a ) }: r )) }
  const removeAtt=(id, name)=>{ const r = rows.find(x=>x.id===id); if(!r) return; update(id, { allegati: (r.allegati||[]).filter(a=>a.name!==name) }) }
  const submit=()=>{ const totals = totalHoursPerPerson(); const viol = [...totals.entries()].filter(([pid,h])=> h>12); if(viol.length){ pushToast({title:'Errore', type:'error', message:`Limite 12h superato per ${viol.length} operatore/i`}); return } if(offlineForced || !navigator.onLine){ enqueue({ when: new Date().toISOString(), rows }); pushToast({title:'Offline', message:`Accodato (${rows.length} righe). Sincronizza più tardi.`}); return } setCapoStatus('submitted'); pushToast({title:'Inviato', message:`${rows.length} righe inviate`}) }
  const syncNow=()=>{ if(queue.length===0){ pushToast({title:'Coda vuota'}) ; return } setCapoStatus('submitted'); useCoreStore.setState({ queue: [] }); pushToast({title:'Sincronizzato', message:`${queue.length} pacchetti`}) }
  const exportCSV=()=>{ const data = rows.map(r=> ({ ...r, data: todayISO })); const csv = rowsToCSV(data); const blob = new Blob([csv], {type:'text/csv'}); const url = URL.createObjectURL(blob); const a = document.createElement('a'); a.href=url; a.download='rapportino.csv'; a.click() }
  const exportPDF=()=>{ const data = rows.map(r=> ({ ...r, data: todayISO })); const pdf = rowsToPDF(data); pdf.save('rapportino.pdf') }
  return (<div className="max-w-6xl mx-auto p-4 space-y-3">
    <div className="text-2xl font-bold">Rapportino — Oggi {todayISO}</div>
    <div className="flex items-center gap-2">
      <div className="text-sm text-slate-600">Squadra:</div>
      {teams.map(t=>(<button key={t.id} className={t.id===activeTeamId?'btn-primary':'btn'} onClick={()=>setActiveTeam(t.id)}>{t.nome}</button>))}
      <div className="ml-auto flex items-center gap-2">
        <label className="text-sm flex items-center gap-1"><input type="checkbox" checked={offlineForced} onChange={e=>setOfflineForced(e.target.checked)}/> Forza offline</label>
        <button className="btn" onClick={syncNow}>Sincronizza ({queue.length})</button>
        <button className="btn" onClick={exportCSV}>Esporta CSV</button>
        <button className="btn" onClick={exportPDF}>Esporta PDF</button>
      </div>
    </div>
    <div className="bg-white border border-slate-200 rounded-2xl p-4">
      <div className="flex items-center justify-between">
        <div className="font-semibold">Stato: <span className="badge text-slate-700">{(capoReport.status||'draft')}</span></div>
        <div className="flex gap-2"><button className="btn" onClick={addRow}>Aggiungi riga</button><button className="btn-primary" onClick={submit}>Invia</button></div>
      </div>
      <div className="overflow-auto mt-3">
        <table className="table w-full"><thead><tr><th>Operatore/i</th><th>Ore</th><th>Descrizione</th><th>Prodotto</th><th>Previsto</th><th>Impianto</th><th>Note</th><th>Allegati</th></tr></thead>
          <tbody>{rows.map(r=>(<tr key={r.id}>
            <td className="align-top"><input className="w-full px-2 py-1 rounded border border-slate-300" placeholder="ID membri separati da virgola" value={(r.membri||[]).join(',')} onChange={e=>update(r.id,{membri: e.target.value.split(',').map(s=>s.trim()).filter(Boolean)})}/></td>
            <td className="align-top"><input type="number" min="0" max="12" className="w-20 px-2 py-1 rounded border border-slate-300" value={r.ore||0} onChange={e=>update(r.id,{ore:Number(e.target.value)})}/></td>
            <td className="align-top"><input className="w-full px-2 py-1 rounded border border-slate-300" value={r.descrizione||''} onChange={e=>update(r.id,{descrizione:e.target.value})}/></td>
            <td className="align-top"><input className="w-full px-2 py-1 rounded border border-slate-300" value={r.prodotto||''} onChange={e=>update(r.id,{prodotto:e.target.value})}/></td>
            <td className="align-top"><input className="w-full px-2 py-1 rounded border border-slate-300" value={r.previsto||''} onChange={e=>update(r.id,{previsto:e.target.value})}/></td>
            <td className="align-top"><input className="w-full px-2 py-1 rounded border border-slate-300" value={r.impiantoId||''} onChange={e=>update(r.id,{impiantoId:e.target.value})}/></td>
            <td className="align-top"><input className="w-full px-2 py-1 rounded border border-slate-300" value={r.note||''} onChange={e=>update(r.id,{note:e.target.value})}/></td>
            <td className="align-top">
              <label className="btn inline-block cursor-pointer">Aggiungi<input type="file" multiple className="hidden" onChange={e=>e.target.files&&attach(r.id, e.target.files)} /></label>
              <ul className="mt-1 space-y-1">{(r.allegati||[]).map(a=>(<li key={a.name} className="text-xs text-slate-600 flex items-center gap-2">
                <button className="underline" onClick={()=>openFile(a)}>{a.name}</button>
                <span>{Math.round((a.size||0)/1024)} KB</span>
                <span className="text-slate-400">{(a.hash||'').slice(0,10)}…</span>
                <span className={"badge "+(a.status==='clean'?'border-success text-success':'border-warning text-warning')}>{a.status}</span>
                <button className="text-red-600" onClick={()=>removeAtt(r.id,a.name)}>rimuovi</button>
                <button className="text-slate-600" onClick={()=>regenLink(r.id,a.name)}>rigenera link</button>
              </li>))}</ul>
            </td>
          </tr>))}</tbody>
        </table>
      </div>
    </div>
  </div>)
}