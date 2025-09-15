import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { validateAndCommit } from '../lib/server.js'
function uid(){ return Math.random().toString(36).slice(2,9) }
function uniq(arr){ return Array.from(new Set(arr)) }
export const useCoreStore = create(persist((set,get)=>({
  toasts:[], pushToast:(t)=> set(s=>({ toasts:[...s.toasts,{ id:uid(), ...t }] })),
  removeToast:(id)=> set(s=>({ toasts: s.toasts.filter(x=>x.id!==id) })),
  people: [], teams: [], activeTeamId: null, schedule: [],
  scheduleVersionMap: {},
  catalogVersions: [], catalogActiveVersionId: null,
  offlineForced:false, setOfflineForced:(v)=> set({ offlineForced:v }),
  queue:[], enqueue:(item)=> set(s=>({ queue:[...s.queue,item] })), clearQueue:()=> set({ queue:[] }),
  undoStack:[], redoStack:[],
  weekClipboard:null,
  pushHistory:() => set(s=>({ undoStack:[{ schedule:s.schedule } , ...s.undoStack].slice(0,50), redoStack:[] })),
  undo:()=> set(s=>{ const prev = s.undoStack[0]; if(!prev) return {}; return { schedule: prev.schedule, undoStack: s.undoStack.slice(1), redoStack:[{ schedule:s.schedule }, ...s.redoStack].slice(0,50) } }),
  redo:()=> set(s=>{ const next = s.redoStack[0]; if(!next) return {}; return { schedule: next.schedule, redoStack: s.redoStack.slice(1), undoStack:[{ schedule:s.schedule }, ...s.undoStack].slice(0,50) } }),
  importPeople:(rows)=> set(s=>{
    const byKey = new Map(s.people.map(p=>[p.id || p.email || p.nome, p]))
    for(const r of rows){
      const key = r.id || r.email || r.nome
      const cur = byKey.get(key) || { id: r.id || uid() }
      byKey.set(key, { ...cur, email: r.email || cur.email, nome: r.nome || r.name || cur.nome || key, isCapo: r.isCapo === true || String(r.isCapo||'').toLowerCase()==='true' })
    }
    return { people: Array.from(byKey.values()) }
  }),
  importTeams:(rows)=> set(s=>{
    const people = s.people
    const byId = new Map(s.teams.map(t=>[t.id, t]))
    for(const r of rows){
      let existing = [...byId.values()].find(t=> t.nome===r.nome) || null
      const id = existing?.id || r.id || uid()
      const capo = people.find(p=> p.nome===r.capoNome)
      const membri = uniq([...(existing?.membri||[]), ...(r.membri||[]).map(n=> (people.find(p=>p.nome===n)||{}).id ).filter(Boolean)])
      const cur = byId.get(id) || existing || { id }
      byId.set(id, { ...cur, nome: r.nome || cur.nome || ('Squadra '+id), capacita: Number(r.capacita||cur.capacita||40), capoId: capo?.id || cur.capoId, membri })
    }
    return { teams: Array.from(byId.values()) }
  }),
  createTeam: ({ nome, capacita=40 }) => set(s=>{ const id = uid(); return { teams:[...s.teams, { id, nome, capacita, membri:[] }], activeTeamId: id } }),
  addPerson: ({ nome, teamId=null }) => set(s=>{
    const id = uid(); const p = { id, nome }
    const next = { people:[...s.people, p] }
    if (teamId) { const t = s.teams.find(t=>t.id===teamId); if (t) { t.membri = uniq([...(t.membri||[]), id]) ; return { ...next, teams:[...s.teams] } } }
    return next
  }),
  assignToTeam:(personId, teamId)=> set(s=>{
    const out = s.teams.map(t=> ({...t, membri: t.id===teamId ? uniq([...(t.membri||[]), personId]) : (t.membri||[]).filter(id=>id!==personId) }))
    return { teams: out }
  }),
  setCapo:(teamId, personId)=> set(s=>{
    const t = s.teams.find(x=>x.id===teamId); if(!t) return {}
    t.capoId = personId; if (!t.membri?.includes(personId)) t.membri = uniq([...(t.membri||[]), personId])
    return { teams:[...s.teams] }
  }),
  setActiveTeam:(id)=> set({ activeTeamId:id }),
  conflictsFor:(personId, date, start, end)=>{
    const sameDay = get().schedule.filter(s=> s.personId===personId && s.date===date)
    return sameDay.filter(s=> Math.max(s.start,start) < Math.min(s.end,end))
  },
  teamCapacity:(teamId)=> get().teams.find(t=>t.id===teamId)?.capacita || 0,
  dayCapacityLoad:(teamId, date)=>{
    const items = get().schedule.filter(s=> s.teamId===teamId && s.date===date)
    const hours = items.reduce((sum, s)=> sum + (s.end - s.start), 0)
    const capacity = get().teamCapacity(teamId)
    return { hours, capacity }
  },
  bumpVersion:(personId,date)=> set(s=>{
    const key = `${personId}|${date}`
    const v = (s.scheduleVersionMap[key]||0)+1
    return { scheduleVersionMap: { ...s.scheduleVersionMap, [key]: v } }
  }),
  getVersion:(personId,date)=> get().scheduleVersionMap[`${personId}|${date}`]||0,
  addAssignmentWithServer:(entry)=>{
    const v = get().getVersion(entry.personId, entry.date)
    const res = validateAndCommit({ schedule:get().schedule, entry:{...entry, version:v}, versionMap: new Map(Object.entries(get().scheduleVersionMap).map(([k,val])=>[k,val])) })
    if(!res.ok){ return { error: res.error, details: res.details } }
    set(s=>({ schedule:[...s.schedule, { id:uid(), ...entry }] }))
    get().bumpVersion(entry.personId, entry.date)
    return { ok:true }
  },
  suggestForActivity: ({ teamId, date, start, end }) => {
    const team = get().teams.find(t=>t.id===teamId); if(!team) return []
    const people = get().people.filter(p=> team.membri?.includes(p.id))
    const dur = (end - start) || 1
    const res = people.map(p=>{ const conflicts = get().conflictsFor(p.id, date, start, end).length; const { hours, capacity } = get().dayCapacityLoad(teamId, date); const free = Math.max(0, capacity - hours); let score = 0; if (!conflicts) score += 2; if (free >= dur) score += 1; const reasons = []; reasons.push(conflicts? 'Conflitti presenti' : 'Nessun conflitto'); reasons.push(`Carico squadra: ${hours}/${capacity}h`); reasons.push(`Libero: ${free}h`); return { id:p.id, nome:p.nome, score, reasons, sources:['piano','capacità'] } })
    return res.sort((a,b)=> b.score - a.score).slice(0,5)
  },
  capoReport:{ data: new Date().toISOString().slice(0,10), righe:[], status:'draft', catalogVersionId:null },
  setCapoStatus:(status)=> set(s=>({ capoReport:{ ...s.capoReport, status } })),
  prefillFromSchedule:(date, teamId)=>{
    const lines = get().schedule.filter(s=> s.teamId===teamId && s.date===date).map(s=> ({
      id: uid(), membri:[s.personId], ore: (s.end - s.start), descrizione: s.activityId, prodotto:'', previsto:'', note:'', impiantoId: s.impiantoId, allegati:[]
    }))
    const ver = get().catalogActiveVersionId
    set(s=>({ capoReport:{ ...s.capoReport, data: date, righe: lines, status:'draft', catalogVersionId: ver } }))
  },
  direzione: { spotlight: [], impianti: [] },
  importImpianti:(rows)=> set(s=>({ direzione: { ...s.direzione, impianti:[...rows] } })),
  setSpotlight:(ids)=> set(s=>({ direzione: { ...s.direzione, spotlight: ids } })),
}), { name:'core-v5-ultimate' }))