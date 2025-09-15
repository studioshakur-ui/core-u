import React, { useEffect, useState } from 'react'
import { supabase } from '../lib/supabaseClient'

export default function HeaderStatus(){
  const [state,setState]=useState({ ok:false, auth:false, latency:null, ts:null })
  async function ping(){
    const t0 = performance.now()
    const { data, error } = await supabase.rpc('db_ping')
    const t1 = performance.now()
    setState({ ok: !error, auth: !!(await supabase.auth.getSession()).data.session, latency: Math.round(t1-t0), ts: data||null })
  }
  useEffect(()=>{ ping(); const id=setInterval(ping, 45000); return ()=>clearInterval(id) },[])
  const color = !state.auth || !state.ok ? 'bg-red-500' : 'bg-emerald-500'
  const label = !state.auth ? 'Non connesso' : state.ok ? 'Connesso' : 'Auth OK, DB KO'
  return (
    <div className="flex items-center gap-2 text-sm">
      <span className={`inline-block w-2.5 h-2.5 rounded-full ${color}`} aria-hidden="true"></span>
      <span title={state.latency ? `~${state.latency}ms` : ''}>{label}</span>
    </div>
  )
}
