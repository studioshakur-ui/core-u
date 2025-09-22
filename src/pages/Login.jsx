import React, { useState } from 'react'
import { createClient } from '@supabase/supabase-js'
import { useNavigate } from 'react-router-dom'

const supabase = (import.meta.env.VITE_SUPABASE_URL && import.meta.env.VITE_SUPABASE_ANON_KEY)
  ? createClient(import.meta.env.VITE_SUPABASE_URL, import.meta.env.VITE_SUPABASE_ANON_KEY)
  : null

export default function Login(){
  const [email, setEmail] = useState('')
  const [pwd, setPwd] = useState('')
  const [err, setErr] = useState('')
  const nav = useNavigate()

  async function onLogin(e){
    e.preventDefault()
    setErr('')
    if(!supabase){ nav('/capo'); return }
    const { data, error } = await supabase.auth.signInWithPassword({ email, password: pwd })
    if(error){ setErr(error.message); return }
    nav('/capo')
  }

  return (
    <main className="max-w-md mx-auto p-6">
      <form onSubmit={onLogin} className="bg-white border rounded-2xl p-6 space-y-3">
        <h1 className="text-xl font-semibold">Login Supabase</h1>
        {err && <div className="text-red-600 text-sm">{err}</div>}
        <label className="text-sm block">
          <div className="text-slate-600 mb-1">Email</div>
          <input className="w-full border rounded px-3 py-2" value={email} onChange={e=>setEmail(e.target.value)} />
        </label>
        <label className="text-sm block">
          <div className="text-slate-600 mb-1">Mot de passe</div>
          <input type="password" className="w-full border rounded px-3 py-2" value={pwd} onChange={e=>setPwd(e.target.value)} />
        </label>
        <button className="w-full py-2 rounded bg-slate-900 text-white">Se connecter</button>
      </form>
    </main>
  )
}
