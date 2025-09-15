import React,{useState,useRef} from 'react'
import { previewProgrammaNamesOnly } from '../utils/parseProgrammaExcel'
import { useCoreStore } from '../store/useCoreStore'
import html2canvas from 'html2canvas'
import jsPDF from 'jspdf'
export default function ManagerOrganigramma(){
  const { importPeople, importTeams, people, teams, assignToTeam, setActiveTeam, pushToast } = useCoreStore()
  const [preview,setPreview]=useState(null)
  const [edit,setEdit]=useState({})
  const gridRef = useRef(null)
  const onFile = async (f)=>{ try{ setPreview(await previewProgrammaNamesOnly(f)) } catch(e){ pushToast({title:'Errore', type:'error', message:String(e)}) } }
  const onEdit = (key, val)=> setEdit(e=>({ ...e, [key]:val }))
  const confirmImport=()=>{
    if(!preview) return
    const peopleRows=[], teamRows=[]
    for(const g of preview){
      const capo = edit['capo-'+g.col] || g.capo
      const members = (g.members||[]).map((m,i)=> edit[`m-${g.col}-${i}`] || m)
      peopleRows.push({ nome: capo, isCapo:true })
      for(const m of members) peopleRows.push({ nome:m })
      teamRows.push({ nome:`Team – ${capo}`, capoNome:capo, membri: members })
    }
    importPeople(peopleRows); importTeams(teamRows); setPreview(null); setEdit({})
    useCoreStore.getState().pushToast({title:'Import riuscito', message:'Organigramma creato/aggiornato'})
  }
  const byCapo = (teams||[]).map(t=>{
    const capo = (people||[]).find(p=>p.id===t.capoId) || {}
    const members = (t.membri||[]).map(id=> (people||[]).find(p=>p.id===id) || { id, nome:id })
    return { t, capo, members }
  })
  const onDragStart=(e, pid)=>{ e.dataTransfer.setData('text/plain', pid) }
  const onDrop=(e, teamId)=>{ const pid = e.dataTransfer.getData('text/plain'); if(pid){ assignToTeam(pid, teamId) } }
  const onExportPNG=async ()=>{ const canvas = await html2canvas(gridRef.current); const a = document.createElement('a'); a.href = canvas.toDataURL('image/png'); a.download='organigramma.png'; a.click() }
  const onExportPDF=async ()=>{ const canvas = await html2canvas(gridRef.current); const imgData = canvas.toDataURL('image/png'); const pdf = new jsPDF('p','mm','a4'); const pageWidth = pdf.internal.pageSize.getWidth(); const imgWidth = pageWidth - 20; const imgHeight = canvas.height * (imgWidth / canvas.width); if(imgHeight < pdf.internal.pageSize.getHeight()-20){ pdf.addImage(imgData,'PNG',10,10,imgWidth,imgHeight) }else{ let slice = 0, step = canvas.height * ((pdf.internal.pageSize.getHeight()-20) / imgHeight); while(slice < canvas.height){ const c = document.createElement('canvas'); c.width = canvas.width; c.height = Math.min(step, canvas.height - slice); const ctx = c.getContext('2d'); ctx.drawImage(canvas, 0, slice, canvas.width, c.height, 0, 0, canvas.width, c.height); const part = c.toDataURL('image/png'); pdf.addImage(part,'PNG',10,10,imgWidth,(c.height*(imgWidth/canvas.width))); slice += step; if(slice < canvas.height) pdf.addPage() } } pdf.save('organigramma.pdf') }
  return (<div className="space-y-4">
    <div className="flex items-center gap-2">
      <label className="btn-primary cursor-pointer">
        Carica Excel PROGRAMMA
        <input type="file" accept=".xlsx,.xls" className="hidden" onChange={e=>e.target.files&&onFile(e.target.files[0])}/>
      </label>
      {!!byCapo.length && <button className="btn" onClick={onExportPNG}>Esporta PNG</button>}
      {!!byCapo.length && <button className="btn" onClick={onExportPDF}>Esporta PDF</button>}
      {preview && <a className="btn" href={"data:text/csv;charset=utf-8,"+encodeURIComponent(['capo,membro',...preview.flatMap(g=> g.members.map(m=>`"${g.capo}","${m}"`))].join('\n'))} download="capo-membri.csv">Esporta CSV capo–membri</a>}
    </div>
    {preview && (<div className="bg-white border border-slate-200 rounded-2xl p-3">
      <div className="font-semibold mb-2">Anteprima import (nomi puliti)</div>
      <table className="table w-full"><thead><tr><th>Colonna</th><th>Capo</th><th>Membri</th></tr></thead>
        <tbody>{preview.map((g,idx)=>(<tr key={idx}>
          <td>{g.col}</td>
          <td><input className="px-2 py-1 rounded border border-slate-300 w-64" defaultValue={g.capo} onChange={(e)=>onEdit('capo-'+g.col, e.target.value)}/></td>
          <td>{g.members.map((m,i)=>(<div key={i} className="mb-1"><input className="px-2 py-1 rounded border border-slate-300 w-64" defaultValue={m} onChange={(e)=>onEdit(`m-${g.col}-${i}`, e.target.value)}/></div>))}</td>
        </tr>))}</tbody>
      </table>
      <div className="text-right mt-2"><button className="btn-primary" onClick={confirmImport}>Conferma</button></div>
    </div>)}
    {!preview && !byCapo.length && <div className="bg-white border border-slate-200 rounded-2xl p-6 text-slate-600">Carica il file per costruire l’organigramma (Capo = primo nome pulito della colonna; gli altri = membri).</div>}
    {!!byCapo.length && (<div ref={gridRef} className="grid md:grid-cols-2 lg:grid-cols-3 gap-3">
      {byCapo.map(({t,capo,members})=>(<div key={t.id} className="rounded-2xl border border-slate-200 shadow-e1 overflow-hidden bg-white" onDragOver={e=>e.preventDefault()} onDrop={e=>onDrop(e,t.id)}>
        <div className="px-3 py-2 text-white" style={{background:'#00B050'}}>
          <div className="text-xs opacity-90">Capo</div><div className="font-semibold truncate">{capo.nome||'—'}</div>
        </div>
        <ul className="p-2 space-y-1 max-h-[44vh] overflow-auto">
          {members.map(m=>(<li key={m.id} className="flex items-center justify-between gap-2 px-2 py-1 rounded-xl hover:bg-slate-50" draggable onDragStart={e=>onDragStart(e,m.id)}>
            <span className="truncate">{m.nome}</span>
            <button className="px-2 py-1 text-xs rounded-lg border border-slate-300" onClick={()=>{ setActiveTeam(t.id); window.location.hash='#/manager'; }}>Pianifica</button>
          </li>))}
        </ul>
      </div>))}
    </div>)}
  </div>)
}