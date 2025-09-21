import React from 'react'
import { Button } from '@/components/Button'
import { Card } from '@/components/Card'
import { Input } from '@/components/Input'
import { Modal } from '@/components/Modal'
import { Avatar } from '@/components/Avatar'
import { useFilters } from '@/lib/store'
import { fetchTeams, fetchPeople, fetchTeamPeople, createTeam, createPerson, addToTeam, removeFromTeam, setRole } from '@/hooks/useManagerData'
type Team = { id:string, name:string }
type Person = { id:string, full_name?:string, role?:string, is_active?: boolean }
type TeamPerson = { team_id:string, person_id:string, role?:string }

function useData(){
  const [teams, setTeams] = React.useState<Team[]>([])
  const [people, setPeople] = React.useState<Person[]>([])
  const [links, setLinks] = React.useState<TeamPerson[]>([])
  const [loading, setLoading] = React.useState(true)
  const load = React.useCallback(async ()=>{ setLoading(true); try{ const [t,p,l] = await Promise.all([fetchTeams(), fetchPeople(), fetchTeamPeople()]); setTeams(t); setPeople(p); setLinks(l) } finally { setLoading(false) } }, [])
  React.useEffect(()=>{ load() }, [load])
  return { teams, people, links, loading, reload: load }
}

function buildRoster(teams: Team[], people: Person[], links: TeamPerson[]){
  const byId = Object.fromEntries(people.map(p=>[p.id,p]))
  const roster: Record<string,{capo:Person[], operai:Person[]}> = Object.fromEntries(teams.map(t=>[t.id,{capo:[],operai:[]}])) as any
  const assigned = new Set<string>()
  for(const l of links){
    const p = byId[l.person_id]; if(!p) continue; assigned.add(p.id)
    const role = (l.role || p.role || 'operaio')
    if(role==='capo') roster[l.team_id]?.capo.push(p); else roster[l.team_id]?.operai.push(p)
  }
  const unassigned = people.filter(p=>!assigned.has(p.id) && p.is_active!==false)
  return { roster, unassigned }
}

export const Manager: React.FC = ()=>{
  const { q, setQ, role, setRole, showUnassigned, setUnassigned } = useFilters()
  const { teams, people, links, reload } = useData()
  const { roster, unassigned } = React.useMemo(()=>buildRoster(teams, people, links), [teams, people, links])
  const [openTeam, setOpenTeam] = React.useState(false)
  const [openPerson, setOpenPerson] = React.useState(false)
  const [teamName, setTeamName] = React.useState('')
  const [personName, setPersonName] = React.useState('')
  const [personRole, setPersonRole] = React.useState<'capo'|'operaio'>('operaio')

  async function handleCreateTeam(){ if(!teamName.trim()) return; try{ await createTeam(teamName.trim()); (window as any).toast?.push('Squadra creata.'); setOpenTeam(false); setTeamName(''); await reload() } catch { (window as any).toast?.push('Errore di rete. Riprova.') } }
  async function handleCreatePerson(){ if(!personName.trim()) return; try{ await createPerson(personName.trim(), personRole); (window as any).toast?.push('Persona creata.'); setOpenPerson(false); setPersonName(''); setPersonRole('operaio'); await reload() } catch { (window as any).toast?.push('Errore di rete. Riprova.') } }
  function filterPeople(list: Person[]){ let r = list; if(q) r = r.filter(p=> (p.full_name||'').toLowerCase().includes(q.toLowerCase())); if(role!=='all') r = r.filter(p=> (p.role||'operaio')===role); return r }

  async function onDrop(ev: React.DragEvent, teamId: string){
    const id = ev.dataTransfer.getData('text/plain')
    if(!id.startsWith('person:')) return
    const pid = id.split(':')[1]
    try{ await addToTeam(teamId, pid); (window as any).toast?.push('Aggiunta alla squadra.'); await reload() } catch { (window as any).toast?.push('Azione non autorizzata.') }
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center gap-3">
        <div className="flex gap-2">
          <button className="btn btn-primary" onClick={()=>setOpenTeam(true)}>Nuova squadra</button>
          <button className="btn btn-ghost" onClick={()=>setOpenPerson(true)}>Nuova persona</button>
        </div>
        <div className="flex-1" />
        <div className="flex gap-2 w-full md:w-auto">
          <Input placeholder="Cerca persone o squadre…" value={q} onChange={e=>setQ(e.target.value)} />
          <select className="input" value={role} onChange={e=>setRole(e.target.value as any)}>
            <option value="all">Ruolo</option><option value="capo">Capo</option><option value="operaio">Operaio</option>
          </select>
          <label className="flex items-center gap-2 text-sm text-[var(--subtle)]">
            <input type="checkbox" checked={showUnassigned} onChange={e=>setUnassigned(e.target.checked)} /> Non assegnati
          </label>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="p-4 min-h-[320px]">
          <div className="mb-3">
            <div className="section-title">Non assegnati</div>
            <Input placeholder="Cerca persona…" value={q} onChange={e=>setQ(e.target.value)} />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {filterPeople(unassigned).map(p=>(
              <div key={p.id} className="card p-3 cursor-grab active:cursor-grabbing" draggable onDragStart={(e)=>e.dataTransfer.setData('text/plain', `person:${p.id}`)}>
                <div className="flex items-center gap-3">
                  <Avatar name={p.full_name||'·'} />
                  <div className="min-w-0">
                    <div className="font-medium truncate">{p.full_name||'—'}</div>
                    <div className="text-xs text-[var(--subtle)]">{(p.role||'operaio').toUpperCase()}</div>
                  </div>
                </div>
              </div>
            ))}
            {unassigned.length===0 && <div className="text-sm text-[var(--subtle)]">Tutto assegnato. Aggiungi una persona con “Nuova persona”.</div>}
          </div>
        </Card>

        <div className="lg:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-6">
          {teams.filter(t=>!q || t.name.toLowerCase().includes(q.toLowerCase())).map(t=>(
            <div key={t.id} className="card p-4" onDragOver={(e)=>e.preventDefault()} onDrop={(e)=>onDrop(e,t.id)}>
              <div className="flex items-center justify-between mb-2"><div className="text-lg font-semibold">{t.name}</div></div>
              <div className="section-title">Capo</div>
              <div className="space-y-2 mb-4">
                {(roster[t.id]?.capo||[]).map(p=>(<PersonRow key={p.id} teamId={t.id} p={p} reload={reload} />))}
                {(roster[t.id]?.capo||[]).length===0 && <div className="text-sm text-[var(--subtle)]">Nessun Capo</div>}
              </div>
              <div className="section-title">Operai</div>
              <div className="space-y-2">
                {(roster[t.id]?.operai||[]).map(p=>(<PersonRow key={p.id} teamId={t.id} p={p} reload={reload} />))}
                {(roster[t.id]?.operai||[]).length===0 && <div className="text-sm text-[var(--subtle)]">Nessun Operaio</div>}
              </div>
            </div>
          ))}
        </div>
      </div>

      <Modal open={openTeam} onClose={()=>setOpenTeam(false)} title="Nuova squadra" footer={<><button className="btn btn-ghost" onClick={()=>setOpenTeam(false)}>Annulla</button><button className="btn btn-primary" onClick={handleCreateTeam}>Crea</button></>}>
        <label className="text-sm">Nome squadra</label>
        <Input placeholder="Es. Squadra A" value={teamName} onChange={e=>setTeamName(e.target.value)} />
      </Modal>

      <Modal open={openPerson} onClose={()=>setOpenPerson(false)} title="Nuova persona" footer={<><button className="btn btn-ghost" onClick={()=>setOpenPerson(false)}>Annulla</button><button className="btn btn-primary" onClick={handleCreatePerson}>Crea</button></>}>
        <label className="text-sm">Nome e cognome</label>
        <Input placeholder="Es. Mario Rossi" value={personName} onChange={e=>setPersonName(e.target.value)} />
        <label className="text-sm">Ruolo</label>
        <select className="input" value={personRole} onChange={e=>setPersonRole(e.target.value as any)}>
          <option value="operaio">Operaio</option><option value="capo">Capo</option>
        </select>
      </Modal>
    </div>
  )
}

const PersonRow: React.FC<{teamId:string, p: Person, reload: ()=>Promise<void>}> = ({teamId, p, reload})=>{
  async function promote(){ try{ await setRole(p.id!, 'capo'); (window as any).toast?.push('Ruolo aggiornato.'); await reload() }catch{ (window as any).toast?.push('Azione non autorizzata.') } }
  async function demote(){ try{ await setRole(p.id!, 'operaio'); (window as any).toast?.push('Ruolo aggiornato.'); await reload() }catch{ (window as any).toast?.push('Azione non autorizzata.') } }
  async function remove(){ try{ await removeFromTeam(teamId, p.id!); (window as any).toast?.push('Rimossa dalla squadra.'); await reload() }catch{ (window as any).toast?.push('Azione non autorizzata.') } }
  return (
    <div className="flex items-center justify-between p-2 rounded-lg hover:bg-white/5">
      <div className="flex items-center gap-3">
        <div><Avatar name={p.full_name||'·'} size={28} /></div>
        <div className="text-sm">{p.full_name||'—'}</div>
      </div>
      <details className="relative">
        <summary className="list-none cursor-pointer px-2 py-1 rounded hover:bg-white/10">⋯</summary>
        <div className="absolute right-0 mt-2 w-44 card p-1">
          <button className="w-full text-left px-3 py-2 rounded hover:bg-white/10" onClick={promote}>Promuovi Capo</button>
          <button className="w-full text-left px-3 py-2 rounded hover:bg-white/10" onClick={demote}>Rendi Operaio</button>
          <div className="h-px bg-white/10 my-1" />
          <button className="w-full text-left px-3 py-2 rounded hover:bg-white/10" onClick={remove}>Rimuovi dalla squadra</button>
        </div>
      </details>
    </div>
  )
}