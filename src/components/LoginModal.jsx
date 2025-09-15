import React, { useState } from 'react'
import { supabase } from '../lib/supabaseClient'
import { ROLES } from '../auth/roles'

export default function LoginModal({open,onClose}){
  const [email,setEmail]=useState('')
  const [password,setPassword]=useState('')
  const [loading,setLoading]=useState(false)
  const [error,setError]=useState('')

  if(!open) return null

  const doLogin=async ()=>{
    setLoading(true); setError('')
    const { data, error } = await supabase.auth.signInWithPassword({ email, password })
    setLoading(false)
    if(error){ setError(error.message); return }
    onClose()
  }

  const quick=async (role)=>{
    // comptes de démo si tu en crées (facultatif) :
    // direzione@…, manager@…, capo@…
    setEmail(`${role}@example.com`); setPassword('demo1234')
  }

  return (<div className="modal" role="dialog" aria-modal="true" aria-label="Login">
    <div>
      <div className="text-lg font-semibold mb-2">Accedi</div>
      <div className="grid grid-cols-3 gap-2 mb-3">
        <button className="btn" onClick={()=>quick(ROLES.DIREZIONE)}>Direzione</button>
        <button className="btn" onClick={()=>quick(ROLES.MANAGER)}>Manager</button>
        <button className="btn" onClick={()=>quick(ROLES.CAPO)}>Capo</button>
      </div>
      <label className="block text-sm mb-2">Email
        <input className="w-full px-3 py-2 rounded-xl border border-slate-300" value={email} onChange={e=>setEmail(e.target.value)}/>
      </label>
      <label className="block text-sm mb-2">Password
        <input type="password" className="w-full px-3 py-2 rounded-xl border border-slate-300" value={password} onChange={e=>setPassword(e.target.value)}/>
      </label>
      {error && <div className="text-red-600 text-sm mb-2">{error}</div>}
      <div className="text-right">
        <button className="btn" onClick={onClose} disabled={loading}>Chiudi</button>
        <button className="btn-primary ml-2" onClick={doLogin} disabled={loading}>{loading?'…':'Entra'}</button>
      </div>
    </div>
  </div>)
}
