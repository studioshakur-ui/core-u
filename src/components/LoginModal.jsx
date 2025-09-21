import React, { useState } from 'react'
import { supabase } from '../lib/supabase.js'

export default function LoginModal({ open, onClose }){
  const [email,setEmail]=useState('')
  const [password,setPassword]=useState('')
  const [err,setErr]=useState('')
  const [loading,setLoading]=useState(false)
  if(!open) return null
  async function submit(e){
    e.preventDefault()
    setLoading(true); setErr('')
    const { error } = await supabase.auth.signInWithPassword({ email, password })
    setLoading(false)
    if(error) setErr('Credenziali non valide')
    else onClose?.()
  }
  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="card w-full max-w-md p-6">
        <div className="text-lg font-semibold mb-2">Accedi a CORE</div>
        <form onSubmit={submit} className="space-y-3">
          <div><label className="text-sm text-gray-600">Email</label><input className="w-full border rounded-xl px-3 py-2" type="email" required value={email} onChange={e=>setEmail(e.target.value)} /></div>
          <div><label className="text-sm text-gray-600">Password</label><input className="w-full border rounded-xl px-3 py-2" type="password" required value={password} onChange={e=>setPassword(e.target.value)} /></div>
          {err && <div className="text-red-600 text-sm">{err}</div>}
          <button className="btn-primary w-full" disabled={loading}>{loading?'Accesso…':'Accedi'}</button>
        </form>
        <button className="btn w-full mt-2" onClick={onClose}>Annulla</button>
      </div>
    </div>
  )
}
