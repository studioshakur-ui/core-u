import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase, getMyProfile } from '../lib/supabase'

export default function Login(){
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const nav = useNavigate()

  useEffect(() => {
    // si déjà loggé → route par rôle
    (async () => {
      const { data: { session } } = await supabase.auth.getSession()
      if (!session) return
      const p = await getMyProfile()
      if (p?.role === 'capo') nav('/capo', { replace: true })
      else nav('/', { replace: true })
    })()
  }, [nav])

  async function onSubmit(e){
    e.preventDefault()
    setLoading(true)
    try {
      const { error } = await supabase.auth.signInWithPassword({ email, password })
      if (error) {
        alert(error.message)
      } else {
        const p = await getMyProfile()
        if (p?.role === 'capo') nav('/capo', { replace: true })
        else nav('/', { replace: true })
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="max-w-md mx-auto p-6">
      <h1 className="text-xl font-semibold mb-4">Login</h1>
      <form onSubmit={onSubmit} className="space-y-3">
        <label className="block text-sm">
          <span className="text-slate-600">Email</span>
          <input
            className="mt-1 w-full border rounded px-3 py-2"
            type="email"
            required
            value={email}
            onChange={e=>setEmail(e.target.value)}
            placeholder="vous@exemple.com"
          />
        </label>
        <label className="block text-sm">
          <span className="text-slate-600">Mot de passe</span>
          <input
            className="mt-1 w-full border rounded px-3 py-2"
            type="password"
            required
            value={password}
            onChange={e=>setPassword(e.target.value)}
            placeholder="••••••••"
          />
        </label>
        <button
          disabled={loading}
          className="px-4 py-2 rounded bg-slate-900
