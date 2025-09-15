import React, { useEffect, useMemo, useState } from 'react'
import { supabase } from '../lib/supabaseClient'
import { motion } from 'framer-motion'
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, LineChart, Line, PieChart, Pie, Cell } from 'recharts'

const C = { ok:'#00B050', warn:'#F59E0B', bad:'#DC2626', primary:'#7c3aed', indigo:'#5B21B6' }

export default function Direzione(){
  const [kpi,setKpi]=useState({ impianti:0, attivitaOggi:0, squadre:0, conflitti24:0, avanzamento:0, qualita:100 })
  const [sCurve,setSCurve]=useState([])
  const [burndown,setBurndown]=useState([])
  const [heat,setHeat]=useState([]) // [{team, day, hours, capacity}]
  const [spotlight,setSpotlight]=useState([]) // [{id,titolo,progress,risk,delta}]
  const [timeline,setTimeline]=useState([]) // [{ts,label,kind}]

  useEffect(()=>{ (async()=>{
    // Ces requêtes supposent des vues/materialized views (tu peux remplir plus tard).
    // Pour la démo : on garde des fallback si vide.
    const [{ data: v1 }, { data: v2 }, { data: v3 }] = await Promise.all([
      supabase.from('schedule').select('id', { count:'estimated', head:true }),
      supabase.from('teams').select('id', { count:'estimated', head:true }),
      supabase.from('reportino').select('id', { count:'estimated', head:true }),
    ])
    setKpi(s=>({ ...s, squadre: v2?.length || 0, attivitaOggi: v1?.length || 0, impianti: 3, avanzamento: 62, conflitti24: 1 }))
    setSCurve(genSCurve())
    setBurndown(genBurndown())
    setHeat(genHeat())
    setSpotlight(genSpotlight())
    setTimeline(genTimeline())
  })() },[])

  const COLORS=[C.primary, C.indigo, C.ok]

  return (
    <div className="max-w-7xl mx-auto p-4 space-y-4">
      {/* KPIs */}
      <div className="grid md:grid-cols-3 lg:grid-cols-6 gap-3">
        {[
          {label:'Impianti attivi', val:kpi.impianti},
          {label:'Attività oggi', val:kpi.attivitaOggi},
          {label:'Squadre on-site', val:kpi.squadre},
          {label:'Conflitti (24h)', val:kpi.conflitti24, tone:kpi.conflitti24?C.bad:C.ok},
          {label:'Avanzamento medio', val:kpi.avanzamento+'%'},
          {label:'Qualità', val:kpi.qualita+'%'},
        ].map((t,i)=>(
          <motion.div key={i} initial={{opacity:0,y:10}} animate={{opacity:1,y:0}} transition={{delay:i*0.05}} className="bg-white border border-slate-200 rounded-2xl p-4 shadow-e1">
            <div className="text-xs text-slate-500">{t.label}</div>
            <div className="text-2xl font-bold" style={{color:t.tone}}>{t.val}</div>
          </motion.div>
        ))}
      </div>

      {/* Spotlight carousel */}
      <div className="grid md:grid-cols-3 gap-3">
        {spotlight.map((sp,i)=>(
          <motion.div key={sp.id} initial={{opacity:0}} animate={{opacity:1}} className="relative rounded-2xl overflow-hidden shadow-e1 border">
            <img src={`/assets/ship${(i%4)+1}.jpg`} alt="" className="w-full h-40 object-cover"/>
            <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
            <div className="absolute bottom-0 left-0 right-0 p-3 text-white">
              <div className="text-sm opacity-90">Impianto</div>
              <div className="text-lg font-semibold">{sp.titolo}</div>
              <div className="flex items-center gap-3 mt-1">
                <div className="text-sm">Progress <b>{sp.progress}%</b></div>
                <span className={`px-2 py-0.5 text-xs rounded-full ${sp.risk==='rosso'?'bg-red-600':'bg-emerald-600'}`}>{sp.risk}</span>
                <div className="text-xs text-white/80">Δ {sp.delta}%</div>
                <a href="#/manager" className="ml-auto underline">Apri Manager</a>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="grid lg:grid-cols-3 gap-3">
        {/* S-curve */}
        <div className="bg-white border border-slate-200 rounded-2xl p-3 shadow-e1 lg:col-span-2">
          <div className="font-semibold mb-2">S-curve avanzamento (90g)</div>
          <div style={{width:'100%', height:260}}>
            <ResponsiveContainer>
              <AreaChart data={sCurve}>
                <defs>
                  <linearGradient id="g1" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor={C.primary} stopOpacity={0.7}/>
                    <stop offset="95%" stopColor={C.primary} stopOpacity={0.05}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3"/>
                <XAxis dataKey="d"/><YAxis/>
                <Tooltip/>
                <Area type="monotone" dataKey="previsto" stroke={C.indigo} fill="url(#g1)" />
                <Area type="monotone" dataKey="fatto" stroke={C.primary} fillOpacity={0}/>
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Pie conflitti */}
        <div className="bg-white border border-slate-200 rounded-2xl p-3 shadow-e1">
          <div className="font-semibold mb-2">Conflitti per tipo</div>
          <ResponsiveContainer width="100%" height={260}>
            <PieChart>
              <Pie data={[{name:'Overlap', value:7},{name:'Versione',value:3},{name:'RLS',value:1}]}
                   dataKey="value" nameKey="name" outerRadius={90}>
                {COLORS.map((c,i)=>(<Cell key={i} fill={c}/>))}
              </Pie>
              <Tooltip/>
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Heat + Timeline */}
      <div className="grid lg:grid-cols-3 gap-3">
        <div className="bg-white border border-slate-200 rounded-2xl p-3 shadow-e1 lg:col-span-2">
          <div className="font-semibold mb-2">Capacità / carico (sett.)</div>
          <div className="overflow-auto">
            <table className="table w-full">
              <thead><tr><th>Squadra</th>{['Lun','Mar','Mer','Gio','Ven','Sab','Dom'].map(d=><th key={d}>{d}</th>)}</tr></thead>
              <tbody>
                {heat.map(row=>(
                  <tr key={row.team}><td className="font-medium">{row.team}</td>
                    {row.days.map((x,i)=>{
                      const ratio = row.capacity ? x.hours/row.capacity : 0
                      const tone = ratio>=0.9?'bg-red-500':ratio>=0.7?'bg-amber-500':'bg-emerald-500'
                      return <td key={i}><div className="h-2 bg-slate-200 rounded-full"><div className={`h-2 rounded-full ${tone}`} style={{width:`${Math.min(100, Math.round(ratio*100))}%`}}/></div></td>
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
        <div className="bg-white border border-slate-200 rounded-2xl p-3 shadow-e1">
          <div className="font-semibold mb-2">Timeline eventi</div>
          <ul className="space-y-2">
            {timeline.map((e,i)=>(
              <li key={i} className="flex items-start gap-2 text-sm">
                <span className={`mt-1 w-2 h-2 rounded-full ${e.kind==='ok'?'bg-emerald-500':e.kind==='warn'?'bg-amber-500':'bg-red-500'}`}></span>
                <div><div className="font-medium">{e.label}</div><div className="text-slate-500 text-xs">{e.ts}</div></div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  )
}

function genSCurve(){
  const out=[]; let p=10, f=8
  for(let i=0;i<30;i++){ p+=Math.random()*1.5; f+=Math.random()*1.3; out.push({ d:`G${i+1}`, previsto: Math.min(100, Math.round(p)), fatto: Math.min(100, Math.round(f)) }) }
  return out
}
function genBurndown(){ return Array.from({length:14},(_,i)=>({ d:`D${i+1}`, previsto:100 - i*7, fatto:100 - i*5 - Math.random()*5 })) }
function genHeat(){
  const teams=['Team A','Team B','Team C','Team D']
  return teams.map(t=>({ team:t, capacity:40, days:Array.from({length:7},()=>({hours: Math.round(10+Math.random()*30)})) }))
}
function genSpotlight(){
  return [
    {id:'imp-1', titolo:'Motore - Nave A', progress: 58, risk:'ambra', delta:+3},
    {id:'imp-2', titolo:'Quadri - Nave B', progress: 72, risk:'verde', delta:+2},
    {id:'imp-3', titolo:'Cavi - Nave C', progress: 35, risk:'rosso', delta:-1},
  ]
}
function genTimeline(){
  return [
    {ts:'oggi 08:31', label:'Conflitto bloccato (Team B, Mario R.)', kind:'warn'},
    {ts:'ieri 16:44', label:'Allegato passato da quarantena a clean', kind:'ok'},
    {ts:'ieri 11:12', label:'Import Catalogo commit v20250914', kind:'ok'},
    {ts:'ieri 09:02', label:'Correzione audit su Rapportino (hash PDF cambiato)', kind:'warn'},
  ]
}
