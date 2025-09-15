import React,{useMemo,useState}from'react'
import{useCoreStore}from'../store/useCoreStore'
import dayjs from'dayjs'
import clsx from'clsx'
import Drawer from'../components/Drawer.jsx'
export default function ManagerPlan(){
  const {teams,people,activeTeamId,setActiveTeam,schedule,addAssignmentWithServer,createTeam,addPerson, pushToast, weekClipboard} = useCoreStore()
  const [weekStart,setWeekStart]=useState(dayjs().startOf('week').add(1,'day'))
  const activeTeam=teams.find(t=>t.id===activeTeamId)
  const membri=(activeTeam?.membri||[]).map(id=>people.find(p=>p.id===id)).filter(Boolean)
  const days=Array.from({length:7},(_,i)=>weekStart.add(i,'day'))
  const [drawer,setDrawer]=useState({open:false, person:null, date:null})
  const [form,setForm]=useState({start:8,end:10,activityId:'AM-001',impiantoId:'imp-001'})
  const [suggestions,setSuggestions]=useState([])
  const byCell=useMemo(()=>{ const map={}; for(const s of schedule){ const key=`${s.personId}|${s.date}`; map[key]=map[key]||[]; map[key].push(s) } return map },[schedule])
  const computeLoad=useMemo(()=>{ const capacity = activeTeam?.capacita||0; const byDay = {}; for(const d of days){ const key=d.format('YYYY-MM-DD'); const items=schedule.filter(s=> s.teamId===activeTeam?.id && s.date===key); const hours=items.reduce((a,b)=>a+(b.end-b.start),0); byDay[key]={hours} } return { byDay, capacity } },[schedule,activeTeam?.id,activeTeam?.capacita,weekStart])
  const openPlan=(person,date)=>{ setDrawer({open:true, person, date}); setForm(f=>({...f})); const res = useCoreStore.getState().suggestForActivity({ teamId: activeTeam.id, date, start:8, end:10 }); setSuggestions(res) }
  const submit=()=>{ const entry={ personId: drawer.person.id, teamId: activeTeam.id, date: drawer.date, start: form.start, end: form.end, activityId: form.activityId, impiantoId: form.impiantoId }; const res=addAssignmentWithServer(entry); if(res?.error==='conflict'){ pushToast({title:'Conflitto (server)', type:'error', message:'Sovrapposizione oraria rilevata'}) } else if(res?.error==='concurrent_edit'){ pushToast({title:'Versione scaduta', type:'error', message:'Riprova dopo l’aggiornamento'}) } else { pushToast({title:'Assegnato', message:`${drawer.person.nome} ${drawer.date} ${form.start}:00–${form.end}:00`}); setDrawer({open:false}) } }
  const copyWeek=()=>{ const start = weekStart.format('YYYY-MM-DD'); const end = weekStart.add(6,'day').format('YYYY-MM-DD'); const items = schedule.filter(s=> s.teamId===activeTeam.id && s.date>=start && s.date<=end); useCoreStore.setState({ weekClipboard: { base:start, items } }); pushToast({title:'Settimana copiata', message:`${items.length} righe`}) }
  const pasteNextWeek=()=>{ if(!weekClipboard){ pushToast({title:'Nessun modello', message:'Copia prima una settimana'}); return } const base = dayjs(weekClipboard.base); const delta = weekStart.diff(base,'day'); let count=0; for(const it of weekClipboard.items){ const d = dayjs(it.date).add(delta,'day').format('YYYY-MM-DD'); const res = addAssignmentWithServer({...it, date:d, id: undefined }); if(res?.ok) count++ } pushToast({title:'Settimana incollata', message:`${count} righe aggiunte`}) }
  return (<div className="space-y-4">
    <div className="flex flex-wrap items-center gap-2">
      <div className="font-semibold">Squadre</div>
      {teams.map(t=>(<button key={t.id} className={clsx('px-3 py-2 rounded-xl border', activeTeamId===t.id ? 'bg-primary text-white border-primary':'bg-white border-slate-300')} onClick={()=>setActiveTeam(t.id)}>{t.nome}</button>))}
      <div className="ml-auto flex items-center gap-2">
        <button className="btn" onClick={()=>copyWeek()}>Copia settimana</button>
        <button className="btn" onClick={()=>pasteNextWeek()}>Incolla sulla settimana</button>
        <button className="btn" onClick={()=>createTeam({ nome:'Nuova Squadra', capacita:40 })}>Nuova Squadra</button>
        <button className="btn" onClick={()=>addPerson({ nome:'Nuovo Membro', teamId: activeTeamId })}>Nuovo Membro</button>
      </div>
    </div>
    {activeTeam && (<div className="flex gap-2 overflow-x-auto py-1">
      {days.map(d=>{ const key=d.format('YYYY-MM-DD'); const hours = computeLoad.byDay[key]?.hours || 0; const ratio = (computeLoad.capacity? hours/computeLoad.capacity : 0); const tone = ratio>=0.9?'bg-danger':ratio>=0.7?'bg-warning':'bg-success'; return (
        <div key={key} className="border border-slate-200 rounded-xl bg-white p-3 min-w-36">
          <div className="text-xs text-slate-500">{d.format('ddd DD')}</div>
          <div className="font-semibold">{hours}/{computeLoad.capacity||0}h</div>
          <div className="h-2 rounded-full bg-slate-200 mt-2"><div className={`h-2 rounded-full ${tone}`} style={{width:`${Math.min(100,Math.round(ratio*100))}%`}}/></div>
        </div>
      )})}
    </div>)}
    <div className="bg-white border border-slate-200 rounded-2xl p-3" id="main">
      <div className="flex items-center gap-2">
        <button className="btn" onClick={()=>setWeekStart(weekStart.add(-1,'week'))}>‹ Settimana</button>
        <div className="font-semibold">{weekStart.format('DD MMM')} — {weekStart.add(6,'day').format('DD MMM YYYY')}</div>
        <button className="btn" onClick={()=>setWeekStart(weekStart.add(1,'week'))}>Settimana ›</button>
      </div>
      {!activeTeam && <div className="p-4 text-sm text-slate-600">Nessuna squadra. Crea o importa per iniziare.</div>}
      {activeTeam && (<div className="overflow-auto mt-3">
        <table className="table w-full">
          <thead><tr className="bg-white"><th className="col-sticky w-48 bg-white">Membro</th>{days.map(d=>(<th key={d.format('YYYY-MM-DD')}>{d.format('ddd DD')}</th>))}</tr></thead>
          <tbody>{membri.map(m=>(<tr key={m.id}>
            <td className="col-sticky bg-white align-top"><div className="font-medium">{m.nome}</div></td>
            {days.map(d=>{ const key=`${m.id}|${d.format('YYYY-MM-DD')}`; const items=byCell[key]||[]; return (<td key={key} className="align-top">
              <div className="grid gap-1" onClick={()=>openPlan(m, d.format('YYYY-MM-DD'))}>
                {items.map(s=>(<div key={s.id} className="rounded-2xl px-2 py-1 text-xs text-white bg-primary shadow-e1">{s.start}:00–{s.end}:00 • {s.activityId}</div>))}
                {!items.length && <div className="text-xs text-slate-400">+ aggiungi</div>}
              </div>
            </td>)})}
          </tr>))}</tbody>
        </table>
      </div>)}
    </div>
    <Drawer open={drawer.open} title="Pianifica" onClose={()=>setDrawer({open:false})} footer={<div className="flex justify-end gap-2"><button className="btn" onClick={()=>setDrawer({open:false})}>Annulla</button><button className="btn-primary" onClick={submit}>Salva</button></div>}>
      {drawer.person && (<div className="space-y-3">
        <div className="text-sm text-slate-600">{drawer.person.nome} — {drawer.date}</div>
        <div className="grid grid-cols-2 gap-2">
          <label className="text-sm">Inizio<select className='w-full px-3 py-2 rounded-xl border border-slate-300' value={form.start} onChange={e=>setForm(f=>({...f,start:Number(e.target.value)}))}>{Array.from({length:11},(_,i)=>8+i).map(h=><option key={h} value={h}>{h}:00</option>)}</select></label>
          <label className="text-sm">Fine<select className='w-full px-3 py-2 rounded-xl border border-slate-300' value={form.end} onChange={e=>setForm(f=>({...f,end:Number(e.target.value)}))}>{Array.from({length:11},(_,i)=>8+i).map(h=><option key={h} value={h}>{h}:00</option>)}</select></label>
        </div>
        <label className="text-sm">Attività<input className="w-full px-3 py-2 rounded-xl border border-slate-300" value={form.activityId} onChange={e=>setForm(f=>({...f,activityId:e.target.value}))}/></label>
        <label className="text-sm">Impianto<input className="w-full px-3 py-2 rounded-xl border border-slate-300" value={form.impiantoId} onChange={e=>setForm(f=>({...f,impiantoId:e.target.value}))}/></label>
        <div><div className="font-semibold mb-1">Suggerimenti (IA)</div>
          <ul className="space-y-1">{suggestions.map(s=>(<li key={s.id} className="text-sm"><div className="flex items-center justify-between gap-2"><span>{s.nome}</span><span className="text-xs text-slate-500">score {s.score}</span></div><div className="text-xs text-slate-500">{s.reasons.join(' • ')}</div></li>))}
            {!suggestions.length && <li className="text-xs text-slate-500">Nessun suggerimento disponibile</li>}
          </ul>
        </div>
      </div>)}
    </Drawer>
  </div>)
}